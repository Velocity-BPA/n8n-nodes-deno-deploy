# n8n-nodes-deno-deploy

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for Deno Deploy, providing comprehensive integration with 6 core resources. Automate deployment workflows, manage serverless projects, configure domains and KV databases, and control environment variables programmatically through Deno's edge computing platform.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Deno Deploy](https://img.shields.io/badge/Deno-Deploy-00ADD8)
![Edge Computing](https://img.shields.io/badge/Edge-Computing-green)
![Serverless](https://img.shields.io/badge/Serverless-Functions-purple)

## Features

- **Project Management** - Create, update, delete, and monitor Deno Deploy projects with full lifecycle control
- **Deployment Operations** - Trigger deployments, check status, rollback versions, and manage deployment history
- **Domain Configuration** - Add custom domains, manage SSL certificates, and configure DNS settings
- **KV Database Integration** - Create and manage distributed key-value databases with edge storage capabilities
- **Environment Variables** - Set, update, and delete environment variables across projects and deployments
- **Organization Control** - Manage organization settings, members, and project permissions
- **Real-time Monitoring** - Track deployment status, performance metrics, and error logs
- **Edge Network Management** - Configure global distribution and regional deployment settings

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
| API Key | Your Deno Deploy API access token from dashboard settings | Yes |

## Resources & Operations

### 1. Project

| Operation | Description |
|-----------|-------------|
| Create | Create a new Deno Deploy project |
| Get | Retrieve project details and configuration |
| Update | Modify project settings and metadata |
| Delete | Remove a project and all associated resources |
| List | Get all projects in the organization |

### 2. Deployment

| Operation | Description |
|-----------|-------------|
| Create | Deploy code to a project |
| Get | Retrieve deployment details and status |
| List | Get deployment history for a project |
| Delete | Remove a specific deployment |
| Rollback | Revert to a previous deployment version |

### 3. Domain

| Operation | Description |
|-----------|-------------|
| Add | Associate a custom domain with a project |
| Get | Retrieve domain configuration and SSL status |
| Update | Modify domain settings and certificates |
| Delete | Remove a domain from a project |
| List | Get all domains for a project |
| Verify | Check domain verification status |

### 4. KV Database

| Operation | Description |
|-----------|-------------|
| Create | Create a new KV database instance |
| Get | Retrieve KV database details and connection info |
| Update | Modify KV database configuration |
| Delete | Remove a KV database |
| List | Get all KV databases in the organization |

### 5. Environment Variable

| Operation | Description |
|-----------|-------------|
| Set | Create or update an environment variable |
| Get | Retrieve environment variable value |
| Delete | Remove an environment variable |
| List | Get all environment variables for a project |
| Bulk Update | Set multiple environment variables at once |

### 6. Organization

| Operation | Description |
|-----------|-------------|
| Get | Retrieve organization details and settings |
| Update | Modify organization configuration |
| List Members | Get organization members and roles |
| Invite Member | Send invitation to join organization |
| Remove Member | Remove a member from organization |

## Usage Examples

```javascript
// Create a new Deno Deploy project
{
  "name": "my-api-project",
  "description": "REST API for mobile app",
  "envVars": {
    "DATABASE_URL": "postgres://...",
    "API_KEY": "secret123"
  }
}
```

```javascript
// Deploy code to a project
{
  "projectId": "proj_abc123",
  "entrypoint": "main.ts",
  "files": {
    "main.ts": "import { serve } from 'https://deno.land/std/http/server.ts';\n\nserve(() => new Response('Hello World!'));",
    "deno.json": "{\"tasks\": {\"start\": \"deno run --allow-net main.ts\"}}"
  },
  "envVars": {
    "ENVIRONMENT": "production"
  }
}
```

```javascript
// Add custom domain to project
{
  "projectId": "proj_abc123",
  "domain": "api.myapp.com",
  "certificateType": "automatic",
  "redirectWWW": false
}
```

```javascript
// Create KV database and set values
{
  "name": "user-sessions",
  "description": "Store user session data",
  "region": "us-east-1"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or expired API key | Verify API key in Deno Deploy dashboard |
| 403 Forbidden | Insufficient permissions | Check organization role and project access |
| 404 Not Found | Project or resource doesn't exist | Verify resource IDs and organization |
| 409 Conflict | Resource already exists or name taken | Use unique names or update existing resource |
| 429 Rate Limited | Too many API requests | Implement delays between operations |
| 500 Internal Error | Deno Deploy service issue | Check Deno Deploy status page and retry |

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
- **Deno Deploy API**: [Official API Documentation](https://docs.deno.com/deploy/api)
- **Deno Deploy Docs**: [Platform Documentation](https://docs.deno.com/deploy)