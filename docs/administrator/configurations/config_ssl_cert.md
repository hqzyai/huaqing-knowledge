---
sidebar_position: 1
title: Configure SSL Certificates
sidebar_label: Configure SSL Certificates
slug: /config_ssl_cert
sidebar_custom_props: {
  categoryIcon: LucideCog
}
---
# Configure SSL Certificates

Use the Caddy HTTPS configuration when you have a certificate and private key for your RAGFlow domain. Keep the files on the host and mount them read-only so they persist across container updates.

Set the domain and mount the certificate, key and Caddyfile on the application service:

```yaml
services:
  ragflow-cpu:
    environment:
      RAGFLOW_TLS_DOMAIN: your-ragflow-domain.com
    volumes:
      - ./caddy/Caddyfile.https.example:/etc/caddy/Caddyfile:ro
      - ./certificates/fullchain.pem:/etc/caddy/ssl/fullchain.pem:ro
      - ./certificates/privkey.pem:/etc/caddy/ssl/privkey.pem:ro
```

Publish container ports 80 and 443. Recreate the application container with `docker compose up -d --force-recreate ragflow-cpu`. The HTTP listener redirects requests to HTTPS. Recreate the container after replacing the certificate files.
