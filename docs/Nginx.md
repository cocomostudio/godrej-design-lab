We have applied the following config to the CMS instance:

```bash
cat <<'EOF' | sudo tee /etc/nginx/conf.d/cms.conf
server {
  listen 80;
  server_name _;
  client_max_body_size 50M;
  client_body_timeout 600s;
  keepalive_timeout  600s;
  send_timeout       600s;

  location / {
    proxy_pass http://localhost:1337/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
EOF
```