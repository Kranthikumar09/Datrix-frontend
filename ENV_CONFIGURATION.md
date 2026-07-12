# Environment configuration

The Datrix frontend reads service URLs from Create React App environment variables.

## Required variables

| Variable | Purpose | Example (placeholder only) |
|---|---|---|
| `REACT_APP_API_BASE_URL` | Backend API root | `https://api.example.com/backend/api` |
| `REACT_APP_ASSET_BASE_URL` | Uploads / media root | `https://assets.example.com` |
| `REACT_APP_PUBLIC_SITE_URL` | Public frontend origin for canonical / OG URLs | `https://www.example.com` |

## Local setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with the **operational** API, asset, and site hosts for your environment.
Do not commit `.env.local` or credentials.

When a required variable is missing, the app logs a development warning and will not fall back to a guessed domain.

## Deployment

Configure the same three variables in your hosting provider’s environment settings before building.
CRA embeds `REACT_APP_*` values at **build time**.
