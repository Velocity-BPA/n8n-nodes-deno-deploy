# n8n-nodes-deno-deploy

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node enables seamless integration with Deno Deploy, providing access to 6 core resources including Organizations, Projects, Deployments, Domains, KV Databases, and Environment Variables. Automate your serverless JavaScript and TypeScript deployments, manage infrastructure, and streamline your edge computing workflows directly from n8n.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Deno Deploy](https://img.shields.io/badge/Deno%20Deploy-API-00599C)
![Edge Computing](https://img.shields.io/badge/Edge-Computing-green)
![Serverless](https://img.shields.io/badge/Serverless-Ready-orange)

## Features

- **Project Management** - Create, update, and manage Deno Deploy projects with full lifecycle control
- **Deployment Automation** - Deploy code from GitHub repositories or direct uploads with automated triggers
- **Domain Configuration** - Manage custom domains, SSL certificates, and DNS settings for your applications
- **Organization Control** - Handle team members, permissions, and organizational settings across projects
- **KV Database Operations** - Interact with Deno KV databases for edge-native data storage and retrieval
- **Environment Variables** - Securely manage configuration and secrets across different deployment environments
- **Real-time Monitoring** - Track deployment status, logs, and performance metrics
- **Edge Network Management** - Configure and optimize global edge deployment settings

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-deno-deploy`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-deno-deploy
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-deno-deploy.git
cd n8n-nodes-deno-deploy
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-deno-deploy
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Token | Deno Deploy API access token from your account settings | Yes |
| Base URL | API base URL (defaults to https://dash.deno.com/api) | No |

## Resources & Operations

### 1. Organizations

| Operation | Description |
|-----------|-------------|
| Get | Retrieve organization details and settings |
| List | List all organizations accessible to your account |
| Update | Modify organization settings and configuration |
| List Members | Get all members within an organization |
| Invite Member | Send invitation to new organization member |
| Remove Member | Remove member from organization |

### 2. Projects

| Operation | Description |
|-----------|-------------|
| Create | Create a new Deno Deploy project |
| Get | Retrieve project details and configuration |
| List | List all projects in organization |
| Update | Modify project settings and metadata |
| Delete | Remove project and all associated resources |
| Get Analytics | Retrieve project usage and performance analytics |

### 3. Deployments

| Operation | Description |
|-----------|-------------|
| Create | Deploy code from GitHub or upload source |
| Get | Retrieve deployment details and status |
| List | List all deployments for a project |
| Delete | Remove specific deployment |
| Get Logs | Fetch deployment logs and error messages |
| Redeploy | Trigger redeployment of existing version |

### 4. Domains

| Operation | Description |
|-----------|-------------|
| Add | Associate custom domain with project |
| Get | Retrieve domain configuration and status |
| List | List all domains for a project |
| Update | Modify domain settings and SSL configuration |
| Remove | Remove domain association from project |
| Verify | Verify domain ownership and DNS configuration |

### 5. KvDatabases

| Operation | Description |
|-----------|-------------|
| Create | Create new KV database instance |
| Get | Retrieve KV database details and connection info |
| List | List all KV databases in organization |
| Delete | Remove KV database and all data |
| Get Entry | Retrieve specific key-value entry |
| Set Entry | Create or update key-value entry |
| Delete Entry | Remove specific key-value entry |
| List Entries | List all entries with optional filtering |

### 6. EnvironmentVariables

| Operation | Description |
|-----------|-------------|
| Create | Add new environment variable to project |
| Get | Retrieve environment variable value |
| List | List all environment variables for project |
| Update | Modify existing environment variable |
| Delete | Remove environment variable from project |
| Bulk Update | Update multiple environment variables at once |

## Usage Examples

```javascript
// Deploy a new project from GitHub
{
  "name": "my-api-project",
  "type": "git",
  "repository": {
    "url": "https://github.com/username/deno-api",
    "branch": "main",
    "entrypoint": "main.ts"
  },
  "envVars": {
    "DATABASE_URL": "postgresql://...",
    "API_KEY": "secret-key"
  }
}
```

```javascript
// Create KV database entry
{
  "database": "user-sessions",
  "key": "session:abc123",
  "value": {
    "userId": "user-456",
    "expires": "2024-12-31T23:59:59Z",
    "permissions": ["read", "write"]
  },
  "ttl": 86400
}
```

```javascript
// Configure custom domain
{
  "domain": "api.mycompany.com",
  "project": "my-api-project",
  "ssl": {
    "enabled": true,
    "certificateType": "letsencrypt"
  },
  "redirects": {
    "www": true,
    "apex": false
  }
}
```

```javascript
// Update project environment variables
{
  "project": "my-api-project",
  "variables": {
    "NODE_ENV": "production",
    "LOG_LEVEL": "info",
    "CACHE_TTL": "3600"
  },
  "encrypted": ["API_SECRET", "DATABASE_PASSWORD"]
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or expired API token | Verify API token in credentials and regenerate if needed |
| 403 Forbidden | Insufficient permissions for operation | Check organization membership and project permissions |
| 404 Not Found | Project, deployment, or resource doesn't exist | Verify resource IDs and existence before operations |
| 422 Validation Error | Invalid input data or configuration | Review request parameters against API documentation |
| 429 Rate Limited | Too many requests to API | Implement retry logic with exponential backoff |
| 500 Internal Error | Deno Deploy service error | Check Deno Deploy status page and retry after delay |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-deno-deploy/issues)
- **Deno Deploy Docs**: [https://docs.deno.com/deploy/](https://docs.deno.com/deploy/)
- **Deno Deploy API**: [https://docs.deno.com/deploy/api/](https://docs.deno.com/deploy/api/)