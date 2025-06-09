#!/bin/bash
set -e

cd /home/ec2-user/repo

# Get CMS private IP from SSM Parameter Store
CMS_PRIVATE_IP=$(aws ssm get-parameter --name "/gdl/dev/cms-private-ip" --query "Parameter.Value" --output text --region ap-south-1)

# Install dependencies
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
pnpm install

# Update frontend environment with CMS IP
sed -i "s|http://localhost:1337|http://${CMS_PRIVATE_IP}:1337|g" apps/frontend-website/env.ts

# Restart frontend (kill old, start new)
pkill -f "pnpm -F few run dev" || true
pnpm -F few run dev > $HOME/few.log 2>&1 &
