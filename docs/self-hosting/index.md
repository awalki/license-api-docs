---
prev:
  text: 'Integration'
  link: '/docs/integration'
next:
  text: 'Connectors'
  link: '/docs/integration/connectors/rust'
---

# Self-hosting

You can host License API on your own

## Dependencies:
- uv
- python 3.13

### First you have to clone repository
```bash
git clone https://github.com/awalki/license_api.git
```

### Then you have to create `.env` file and provide a secret
```bash
SECRET_KEY="YOUR_SUPER_SECRET_KEY"
```

::: tip
To get a secret run
```bash
openssl rand -hex 32
```
:::

### Finally run a project
```bash
uv run fastapi [run | dev] --port [YOUR_PORT]
```
