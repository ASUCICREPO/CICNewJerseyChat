import json
import boto3
import os

s3 = boto3.client('s3')
bedrock = boto3.client(service_name='bedrock')
    
    
# Specify your S3 bucket and file name
if os.environ['BUCKET_NAME']:
    bucket_name = os.environ['BUCKET_NAME']
    print("Bucket Name")
    print(bucket_name)
else:
    bucket_name = "Hardcoded default for testing outside cdk deployment"
    
file_name = 'models.json'

def lambda_handler(event, context):
    # Determine if the user is an admin or an employee
    user=event['queryStringParameters']['user_type']

    if user == "employee":
        return get_models_s3()
        
    elif user == "admin":
        return get_models_bedrock()
        
    elif user == "admin_update":
        models = json.loads(event['body'])
        return update_models_s3(models)
    
    else:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid user type'})
        }
        
def get_models_s3():
    try:
        # Retrieve the JSON file from S3
        s3_response = s3.get_object(Bucket=bucket_name, Key=file_name)
        file_content = s3_response['Body'].read().decode('utf-8')
        
        # Parse the JSON content
        models = json.loads(file_content)
        
        return {
            'statusCode': 200,
            'body': json.dumps(models)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
        
def get_models_bedrock():
    try:
        result = bedrock.list_foundation_models(byOutputModality='TEXT', byInferenceType="ON_DEMAND")
        models = result['modelSummaries']
        active_models = [model for model in models if model.get('modelLifecycle', {}).get('status') != 'LEGACY']
        
        return {
            'statusCode': 200,
            'body': json.dumps(active_models)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def update_models_s3(models):
    try:
        # Overwrite the JSON data in S3 with the new data
        s3.put_object(Bucket=bucket_name, Key=file_name, Body=json.dumps(models, indent=2))
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'JSON file updated successfully'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }