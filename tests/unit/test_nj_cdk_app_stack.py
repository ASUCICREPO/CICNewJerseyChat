import aws_cdk as core
import aws_cdk.assertions as assertions

from nj_cdk_app.nj_cdk_app_stack import NjCdkAppStack

# example tests. To run these tests, uncomment this file along with the example
# resource in nj_cdk_app/nj_cdk_app_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = NjCdkAppStack(app, "nj-cdk-app")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
