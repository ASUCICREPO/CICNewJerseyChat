from aws_cdk import (
    Stack,
    aws_s3 as s3,
    aws_lambda as _lambda,
    aws_iam as iam,
    CfnOutput,
    aws_s3_deployment as s3deploy,
    aws_ec2 as ec2,
    Environment,
    Duration
)
import aws_cdk as cdk
from constructs import Construct
import os
import zipfile
from nj_cdk_app.config import vpc_id, vpc_subnet_id

class NjCdkAppStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:

        super().__init__(scope, construct_id, **kwargs)

        # S3 bucket

        # Create an S3 bucket to store the models.json file
        model_list_bucket = s3.Bucket(
            self, 
            "model-list-bucket", 
            removal_policy=cdk.RemovalPolicy.DESTROY, # Enable full bucket deletion for "cdk destroy"
            auto_delete_objects=True
        )

        # Zip the models.json file and upload it to the S3 bucket
        s3_folder_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "S3")
        zip_file_path = os.path.join(s3_folder_path, "models.zip")
        json_file_path = os.path.join(s3_folder_path, "models.json")
        with zipfile.ZipFile(zip_file_path, 'w') as zipf:
            zipf.write(json_file_path, arcname="models.json")

        # Deploy the zip file to the S3 bucket
        upload_model_list_bucket = s3deploy.BucketDeployment(
            self, 
            "upload_model_list_bucket",
            sources=[s3deploy.Source.asset("./S3/models.zip")],
            destination_bucket = model_list_bucket
        )

        # Lambda functions

        #vpc for lambda

        vpc = ec2.Vpc.from_lookup(self, "VPC", vpc_id=vpc_id)
        subnet = ec2.Subnet.from_subnet_id(self, "subnet", subnet_id=vpc_subnet_id)

        # Create a lambda function to list the models
        list_models = _lambda.Function(
            self,
            "list_models",
            runtime = _lambda.Runtime.PYTHON_3_12 ,
            code = _lambda.Code.from_asset("./lambdas"),
            handler = "list_models.lambda_handler", # Points to the 'bedrock_client' file in the lambda directory
            timeout = Duration.minutes(2),
            environment={
                "BUCKET_NAME": model_list_bucket.bucket_name
            },
            vpc = vpc,
            vpc_subnets=ec2.SubnetSelection(subnets=[subnet])
            
        )

        # Attach the necessary policies to the lambda function
        list_models.role.attach_inline_policy(iam.Policy(self, "bedrock-access-policy",
            statements=[
                iam.PolicyStatement(
                    sid="VisualEditor0",
                    effect=iam.Effect.ALLOW,
                    actions=["bedrock:GetFoundationModelAvailability", "bedrock:GetFoundationModel", "bedrock:ListFoundationModels"],
                    resources=["*"]
                )
            ]
        ))
        list_models.role.attach_inline_policy(iam.Policy(self, "S3-access-policy",
            statements=[
                iam.PolicyStatement(
                    sid="VisualEditor0",
                    effect=iam.Effect.ALLOW,
                    actions=["s3:*"],
                    resources=["*"]
                )
            ]
        ))
        list_models.role.attach_inline_policy(iam.Policy(self, "vpc-access-policy-list-models-deny",
            statements=[
                iam.PolicyStatement(
                    effect = iam.Effect.DENY,
                    actions = [
                        "ec2:CreateNetworkInterface",
                        "ec2:DeleteNetworkInterface",
                        "ec2:DescribeNetworkInterfaces",
                        "ec2:DetachNetworkInterface",
                        "ec2:AssignPrivateIpAddresses",
                        "ec2:UnassignPrivateIpAddresses",
                        ],
                    resources=["*"],
                    conditions={
                        "ArnEquals": {
                            "lambda:SourceFunctionArn": list_models.function_arn
                        }
                    }
                )
            ]
        ))
        list_models.role.add_managed_policy(iam.ManagedPolicy.from_aws_managed_policy_name("service-role/AWSLambdaVPCAccessExecutionRole"))


        # Create a URL for the lambda function and output it
        list_models_url = list_models.add_function_url(
            auth_type = _lambda.FunctionUrlAuthType.NONE,
            cors = _lambda.FunctionUrlCorsOptions(
                allowed_origins = ["*"],
                allow_credentials = False,
                allowed_headers=["content-type", "authorization"]
            )
        )
        CfnOutput(self, "list-models-url",
            value = list_models_url.url
        )


        # Create a lambda function to converse with the model
        converse = _lambda.Function(
            self,
            "converse",
            runtime = _lambda.Runtime.PYTHON_3_12 ,
            code = _lambda.Code.from_asset("./lambdas"),
            handler = "converse.lambda_handler", # Points to the 'converse' file in the lambda directory
            timeout = Duration.minutes(2),
            environment={},
            vpc = vpc,
            vpc_subnets=ec2.SubnetSelection(subnets=[subnet])
        )

        # Attach the necessary policies to the lambda function
        converse.role.attach_inline_policy(iam.Policy(self, "invoke-conversation",
            statements=[
                iam.PolicyStatement(
                    sid="VisualEditor0",
                    effect=iam.Effect.ALLOW,
                    actions=["bedrock:InvokeAgent", "bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"],
                    resources=["*"]
                )
            ]
        ))
        converse.role.attach_inline_policy(iam.Policy(self, "logging-events",
            statements=[
                iam.PolicyStatement(
                    sid="VisualEditor0",
                    effect=iam.Effect.ALLOW,
                    actions=["cloudwatch:*"],
                    resources=["*"]
                )
            ]
        ))
        converse.role.attach_inline_policy(iam.Policy(self, "vpc-access-policy-converse-deny",
            statements=[
                iam.PolicyStatement(
                    effect = iam.Effect.DENY,
                    actions = [
                        "ec2:CreateNetworkInterface",
                        "ec2:DeleteNetworkInterface",
                        "ec2:DescribeNetworkInterfaces",
                        "ec2:DetachNetworkInterface",
                        "ec2:AssignPrivateIpAddresses",
                        "ec2:UnassignPrivateIpAddresses",
                        ],
                    resources=["*"],
                    conditions={
                        "ArnEquals": {
                            "lambda:SourceFunctionArn": converse.function_arn
                        }
                    }
                )
            ]
        ))
        converse.role.add_managed_policy(iam.ManagedPolicy.from_aws_managed_policy_name("service-role/AWSLambdaVPCAccessExecutionRole"))

        # Create a URL for the lambda function and output it
        converse_url = converse.add_function_url(
            auth_type = _lambda.FunctionUrlAuthType.NONE,
            cors = _lambda.FunctionUrlCorsOptions(
                allowed_origins = ["*"],
                allow_credentials = False,
                allowed_headers=["content-type", "authorization"]
            )
        )
        CfnOutput(self, "converse-url",
            value = converse_url.url
        )



        
