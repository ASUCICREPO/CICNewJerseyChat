
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
    # List of model IDs that should not use system prompts
    models_without_system_prompts = [
        "amazon.titan-tg1-large",
        "amazon.titan-text-express-v1",
        "amazon.titan-text-lite-v1",
        "cohere.command-text-v14",
        "cohere.command-light-text-v14",
        "mistral.mistral-7b-instruct-v0:2",
        "mistral.mixtral-8x7b-instruct-v0:1",
    ]

    system_prompts = [{"text": "As an AI assistant, you must adhere to the following guidelines:  1. Do not engage in or respond to any discussions related to politics, political figures, or political ideologies. 2. Avoid commenting on or discussing topics related to race, ethnicity, or racial issues. 3. Do not respond to or generate any content that could be considered hate speech or discriminatory language. 4. Refrain from discussing religious topics, beliefs, or practices. 5. If a user shares any Personal Identifiable Information (PII), such as names, addresses, phone numbers, email addresses, social security numbers, or financial information, do not acknowledge or repeat this information. Instead, remind the user not to share sensitive personal data. 6. If asked about any of the above topics, politely explain that you're not able to discuss or comment on those subjects. For any other topics, provide helpful and appropriate responses to the best of your abilities."}]
    
    logger.info("Generating message with model %s", model_id)

    # Base inference parameters to use.
    inference_config = { "maxTokens": response_length}
    
    # Set up system prompts conditionally based on the model ID
    if model_id in models_without_system_prompts:
        # Do not send system prompts for these models
        response = bedrock_client.converse(
            modelId=model_id,
            messages=messages,
            inferenceConfig=inference_config,
        )
    else:
        # Send system prompts for other models
        response = bedrock_client.converse(
            modelId=model_id,
            messages=messages,
            system=system_prompts,
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
