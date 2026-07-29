# Custom domains

Use public custom hostnames in every client-facing setting. The current API hostname is:

```
https://swiped-back.maximalsecurityservices.com
```

## API domain

1. In the hosting provider, attach `swiped-back.maximalsecurityservices.com` as the service's custom domain and enable TLS.
2. At the DNS provider, create the CNAME or A record required by that hosting provider. Do not expose the provider URL or a Droplet IP in the mobile application.
3. Set `SERVER_URL=https://swiped-back.maximalsecurityservices.com` in the backend's production environment. Approval-email links use this value.
4. Rebuild the mobile app after setting `API_URL=https://swiped-back.maximalsecurityservices.com/graphql` and `SERVER_URL=https://swiped-back.maximalsecurityservices.com/api`.

## Media domain

DigitalOcean Spaces URLs are also client-facing. To keep them behind a normal hostname, configure `assets.maximalsecurityservices.com` as a custom domain/CDN origin for the `swiped-bucket` Space, enable TLS, and set:

```
ASSET_PUBLIC_BASE_URL=https://assets.maximalsecurityservices.com
```

New uploads will then return `https://assets.maximalsecurityservices.com/<key>`. The mobile app sends each file to `POST /api/upload`; the backend uploads it to Spaces and never exposes a presigned upload URL. Existing database records that contain `*.digitaloceanspaces.com` URLs must be migrated to the asset hostname separately.
