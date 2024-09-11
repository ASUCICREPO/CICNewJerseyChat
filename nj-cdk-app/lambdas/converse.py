
"""
Changing models based on the model sent by the user
"""

import logging
import boto3
import json
import os

from botocore.exceptions import ClientError


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def generate_conversation(bedrock_client,
                          model_id,
                          messages,
                          response_length):
    """
    Sends messages to a model.
    Args:
        bedrock_client: The Boto3 Bedrock runtime client.
        model_id (str): The model ID to use.
        system_prompts (JSON) : The system prompts for the model to use.
        messages (JSON) : The messages to send to the model.

    Returns:
        response (JSON): The conversation that the model generated.

    """

    logger.info("Generating message with model %s", model_id)


    # Base inference parameters to use.
    inference_config = { "maxTokens": response_length}

    # Send the message.
    response = bedrock_client.converse(
        modelId=model_id,
        messages=messages,
        # system=system_prompts,
        inferenceConfig=inference_config,
    )

    # Log token usage.
    token_usage = response['usage']
    logger.info("Input tokens: %s", token_usage['inputTokens'])
    logger.info("Output tokens: %s", token_usage['outputTokens'])
    logger.info("Total tokens: %s", token_usage['totalTokens'])
    logger.info("Stop reason: %s", response['stopReason'])

    return response, token_usage['inputTokens'], token_usage['outputTokens']

def lambda_handler(event, context):
    """
    AWS Lambda handler function.
    """
    try:
        body = json.loads(event['body'])
    except (TypeError, json.JSONDecodeError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid JSON payload'})
        }

    # Extract the necessary parameters from the parsed body
    input_message = body.get('user_message', '')
    model_id = body.get('selected_model', '')
    response_length = body.get('response_length', 100)  # Default to 100 if not provided
    history = body.get('message_history',[])
    
    messages = []
    
    # adding information about the history
    for message in history:
        if (message["sentBy"] == "USER" or message["sentBy"] == "BOT") and message["fileStatus"] != "":
            
            if message["fileStatus"] != "File converted and added to message list.":
                continue
            
            elif (message["sentBy"] == "USER") and message["fileStatus"] == "File converted and added to message list.":
                file_message = {
                    "role": "user",
                    "content": [
                        {
                            "text": "Do as the user says to do"
                        },
                        {
                            "document": {
                                "name": message["fileName"],
                                # "name" : "Consent_Form_AD_Customization",
                                "format": "txt",
                                "source": {
                                    "bytes": message["content"].encode('utf-8')
                                }
                            }
                        }
                    ]
                }
                messages.append(file_message)
                
                bot_message = {
                    "role": "assistant",
                    "content": [
                        {
                            "text": "User uploaded a document"
                        }
                    ]
                }
                messages.append(bot_message)
                
            
        else:
            role = "user" if message["sentBy"] == "USER" else "assistant"
            bedrock_message = {
                "role": role,
                "content": [
                    {
                        "text": message["message"]
                    }
                ]
            }
            messages.append(bedrock_message)
    
    # Ensure required parameters are present
    if not input_message or not model_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Missing required parameters'})
        }

    try:
        bedrock_client = boto3.client(service_name='bedrock-runtime')

        # Start the conversation with the 1st message.
        # messages.append(message_1)
        response, input_tokens, output_tokens = generate_conversation(bedrock_client, model_id, messages, response_length)

        # Add the response message to the conversation.
        output_message = response['output']['message']
        messages.append(output_message)


        # Return the complete conversation as the Lambda response
        return {
            'statusCode': 200,
            'body': {
                'messages': output_message,
                'inputTokens':input_tokens,
                'outputTokens': output_tokens,
            }
        }

    except ClientError as err:
        message = err.response['Error']['Message']
        logger.error("A client error occurred: %s", message)
        return {
            'statusCode': 500,
            'body': {
                'error': f"A client error occurred: {message}",
            }
            
        }
