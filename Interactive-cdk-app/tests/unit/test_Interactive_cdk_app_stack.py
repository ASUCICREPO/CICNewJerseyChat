import aws_cdk as core
import aws_cdk.assertions as assertions

from Interactive_cdk_app.Interactive_cdk_app_stack import InteractiveCdkAppStack

# example tests. To run these tests, uncomment this file along with the example
# resource in nj_cdk_app/nj_cdk_app_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = InteractiveCdkAppStack(app, "Interactive-cdk-app")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
