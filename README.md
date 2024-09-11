
# Deploy the CDK Code for the Backend

## Initial Setup

1. Go to the console home for the account you want to deploy the application inside, and in the top right, next to the bell icon, open a new cloudshell.

2. Clone the repository:
   ```
   git clone https://github.com/ASUCICREPO/NewJerseyChatCDK
   ```
   The repo can be found here for separate use: https://github.com/ASUCICREPO/NewJerseyChatCDK 

3. Move into the cdk code project directory:
   ```
   cd nj-cdk-app
   ```

4. Initialize the account for cdk deployments:
   ```
   cdk bootstrap
   ```

5. Create and activate the .venv environment:
   ```
   python3 -m venv .venv
   source .venv/bin/activate
   ```
   You'll know it worked if a "(.venv)" appears at the start of the command line.

6. Install project dependencies:
   ```
   pip install -r requirements.txt
   ```

## Configure Constants

1. Move to the directory where the main code and config are stored:
   ```
   cd nj_cdk_app
   ```

2. Open the config file:
   ```
   nano config.py
   ```

3. Fill in the following constants:
   - `vpc_id`: Find this by searching for VPC in the console home
   - `vpc_subnet_id`: Find this in the Subnets section
   - `account`: Your AWS account number (found in the top right profile section)
   - `region`: Default is "us-east-1" (change only if needed)

4. Save and exit the text editor:
   - Press `Ctrl+X`
   - Confirm with `Y`
   - Press `Enter` to keep the filename as config.py

## Final Deploy

1. Move back to the main directory:
   ```
   cd ..
   ```

2. Deploy the CDK stack:
   ```
   cdk deploy
   ```

3. Review the plan template and confirm the deploy with `y`.

4. The deployment will take approximately 5-10 minutes.

5. Once finished, save the two URLs from the "Outputs:" section for use in the frontend deployment.

**NOTE:** Prior to this deployment, ensure that 3 VPC endpoints are created and attached to the VPC and subnet used. They should be for S3, the bedrock-runtime, and bedrock.
