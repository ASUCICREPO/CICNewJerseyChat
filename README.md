# Interactive Chat Application Deployment Guide

This guide provides instructions for deploying the backend CDK code and the frontend React application for the Interactive Chat project.

## Backend Deployment (CDK)

### Initial Setup

1. Open AWS CloudShell in your target account.
2. Clone the repository:
   ```
   git clone https://github.com/ASUCICREPO/CICInteractiveChat
   ```
3. Navigate to the project directory:
   ```
   cd InteractiveChatCDK/Interactive-cdk-app
   ```
4. Set up the Python virtual environment:
   ```
   python3 -m venv .venv
   source .venv/bin/activate
   ```
5. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

### Configure Constants

1. Navigate to the code directory:
   ```
   cd Interactive_cdk_app
   ```
2. Edit the config file:
   ```
   nano config.py
   ```
3. Update the following constants:
   - `vpc_id`
   - `vpc_subnet_id`
   - `account` (your AWS account number)
   - `region` (default is "us-east-1")
4. Save and exit (Ctrl+X, then Y, then Enter)

### Deploy

1. Return to the main directory:
   ```
   cd ..
   ```
2. Bootstrap the CDK (if not done before):
   ```
   cdk bootstrap
   ```
3. Deploy the stack:
   ```
   cdk deploy
   ```
4. Confirm the deployment when prompted.
5. Save the output URLs for frontend deployment.

**Note:** Ensure that 3 VPC endpoints (S3, bedrock-runtime, and bedrock) are created and attached to the VPC and subnet used before deployment.

## Frontend Deployment

### Prerequisites

1. Install Node.js and npm from [https://nodejs.org](https://nodejs.org)
2. Verify installation:
   ```
   node -v
   npm -v
   ```

### Setup and Build

1. Download the frontend zipped folder from the provided Presigned URL.
2. Open the folder in VS Code and open a terminal.
3. Install dependencies:
   ```
   npm install
   ```
4. Update the `.env` file with the correct URLs:
   - `REACT_APP_MODEL_INFORMATIONS`: List models functional URL
   - `REACT_APP_CONVERSE_API`: Converse bedrock functional URL
5. Test the app locally:
   ```
   npm start
   ```
6. Build the app:
   ```
   npm run build
   ```
7. Install Amplify CLI:
   ```
   npm install -g @aws-amplify/cli
   ```

### Package for Deployment

1. Navigate to the build folder:
   ```
   cd build
   ```
2. Zip the contents:
   ```
   zip -r Interactive-ai-app-build.zip ./*
   ```

### Deploy with AWS Amplify

1. Open the AWS Amplify Console.
2. Click "Create new app" > "Deploy without Git" > Next.
3. Name your application.
4. Drag and drop the `Interactive-ai-app-build.zip` file.
5. Click "Deploy".
6. Monitor the deployment process.
7. Use the provided URL to access your hosted React app.
