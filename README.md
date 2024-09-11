Deploy the CDK Code for the backend
Initial Setup
Go to the console home for the account you want to deploy the application inside, and in the top right, next to the bell icon, open a new cloudshell.
Next run the command “git clone https://github.com/ASUCICREPO/NewJerseyChatCDK” The repo can be found here for separate use: https://github.com/ASUCICREPO/NewJerseyChatCDK 
Once the repo has been cloned, run “cd nj-cdk-app” to move into the cdk code project directory. (As opposed to the frontend)
Next we’ll initialize the account for cdk deployments, run the command “cdk bootstrap”
Next we’ll create the .venv files for the cdk code to utilize, run the commands:
 “python3 -m venv .venv”,
“source .venv/bin/activate”
These create, and activate the .venv environment for the python code, you’ll know it worked if a “(.venv)” appears at the start of the command line.
Lastly we’ll ensure all the dependencies for the project are installed in the environment, run the command “pip install -r requirements.txt”, this will install all the pre-configured packages specified in the requirements.txt file
Next we need to configure some constants
Inputs
Run the command “cd nj_cdk_app” to move to the directory where the main code (and config) are stored.
Next run the command “nano config.py”, this will open a basic text editor you can navigate with the arrow keys, move to each constant and fill them in.
Four constants are needed, the vpc_id, the vpc_subnet_id, the account number, and the region.
The vpc_id can be found by searching for vpc in the searchbar from the console home (In a different tab to not disturb the commands), then look for your previously created vpc and copy it’s Id
The vpc_subnet_id is similar, but instead of navigating to the vpc, move to the subnets, and copy the correct Id you want.
The account number can be found in the top right, by opening the profile section, move it into the account variable.
Lastly the region should be “us-east-1” by default, only change this if you want a new region
Lastly to exit the text editor click “ctrl+x” which will prompt you to save the changes, click “y” to confirm, and if it asks for the file name, click “enter” to keep the config.py name the same
All that is left is the final deploy



Final Deploy
Move to the correct folder with the command “cd ..”, this moves you from the code directory, to the main one where the deploy can occur from.
Run the command “cdk deploy” this will generate a plan template which you can look over, when you’re finished confirm the deploy with a “y”
This will begin to deploy the resources, and lasts ~5-10 minutes
When it is finished, you will see “Outputs:” followed by two urls, save these somewhere as they’ll be used for the deployment of the frontend next.
NOTE: Prior to this deployment ensure that 3 vpc endpoints are created and attached to the vpc and subnet used. They should be for S3, the bedrock-runtime, and bedrock
