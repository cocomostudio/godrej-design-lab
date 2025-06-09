#!/bin/bash
set -xe

echo "--- Running deploy.sh ---"
echo "Current directory: $(pwd)"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "Script location: $SCRIPT_DIR"

APP_NAME=$(cat /etc/gdl-app-name)
echo "APP_NAME: $APP_NAME"

if [ "$APP_NAME" == "cms" ]; then
  echo "Deploying CMS"
  echo "Executing: /bin/bash $SCRIPT_DIR/deploy-cms.sh"
  /bin/bash "$SCRIPT_DIR/deploy-cms.sh"
elif [ "$APP_NAME" == "frontend" ]; then
  echo "Deploying Frontend"
  echo "Executing: /bin/bash $SCRIPT_DIR/deploy-frontend-website.sh"
  /bin/bash "$SCRIPT_DIR/deploy-frontend-website.sh"
else
  echo "ERROR: Unknown application name: $APP_NAME"
  exit 1
fi

echo "--- Finished deploy.sh ---"
