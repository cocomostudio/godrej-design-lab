#!/bin/bash
set -xe

APP_NAME=$(cat /etc/gdl-app-name)

if [ "$APP_NAME" == "cms" ]; then
  echo "Deploying CMS"
  /bin/bash scripts/deploy-cms.sh
elif [ "$APP_NAME" == "frontend" ]; then
  echo "Deploying Frontend"
  /bin/bash scripts/deploy-frontend-website.sh
else
  echo "ERROR: Unknown application name: $APP_NAME"
  exit 1
fi
