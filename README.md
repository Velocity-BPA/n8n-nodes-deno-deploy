# n8n-nodes-deno-deploy

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Deno Deploy, the globally distributed serverless JavaScript/TypeScript hosting platform. This node enables workflow automation for managing organizations, projects, deployments, domains, KV databases, and analytics through Deno Deploy's Subhosting REST API.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

## Features

- **12 Resource Categories** - Complete coverage of the Deno Deploy API
- **50+ Operations** - Full CRUD operations for all resources
- **Deployment Automation** - Create deployments with inline code or URL references
- **Domain Management** - Add custom domains with automatic TLS certificate provisioning
- **KV Database Support** - Manage Deno KV databases and bindings
- **Analytics & Logging** - Retrieve organization, project, and deployment analytics
- **Polling Trigger** - Monitor deployment status changes in real-time
- **Environment Variables** - Securely manage project environment variables

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-deno-deploy`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-deno-deploy
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-deno-deploy.git
cd n8n-nodes-deno-deploy

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-deno-deploy

# Restart n8n
n8n start
```

## Credentials Setup

### Getting Your Access Token

1. Log into [Deno Deploy Dashboard](https://dash.deno.com)
2. Navigate to **Account Settings**
3. Under **Access Tokens**, click **New Access Token**
4. Provide a description and select permissions (read, write, admin)
5. Click **Generate Token**
6. Copy the token (shown only once)

### Getting Your Organization ID

Your organization ID is visible in the dashboard URL:
```
https://dash.deno.com/orgs/{organizationId}
```

### Configuring in n8n

| Field | Description |
|-------|-------------|
| Access Token | Your Deno Deploy API access token |
| Organization ID | Your organization ID from the dashboard URL |

## Resources & Operations

### Organization
| Operation | Description |
|-----------|-------------|
| Get | Get organization details |
| Get Analytics | Get organization-wide analytics |
| List Domains | List all domains in the organization |

### Project
| Operation | Description |
|-----------|-------------|
| List | List all projects |
| Create | Create a new project |
| Get | Get project details |
| Update | Update project configuration |
| Delete | Delete a project |
| Get Analytics | Get project analytics |

### Deployment
| Operation | Description |
|-----------|-------------|
| List | List all deployments |
| Create | Create a new deployment with inline code or URL |
| Get | Get deployment details |
| Delete | Delete a deployment |
| Redeploy | Create new deployment from existing |
| Get Build Logs | Get build logs |
| Get App Logs | Get application runtime logs |

### Domain
| Operation | Description |
|-----------|-------------|
| List | List all domains |
| Add | Add a custom domain |
| Get | Get domain details |
| Delete | Remove a domain |
| Verify | Verify domain ownership |
| Get Certificates | Get TLS certificates |
| Provision Certificate | Provision TLS certificate |

### KV Database
| Operation | Description |
|-----------|-------------|
| List | List all KV databases |
| Create | Create a new KV database |
| Get | Get database details |
| Update | Update database configuration |
| Delete | Delete a database |

### Build Log
| Operation | Description |
|-----------|-------------|
| Get | Get build logs for a deployment |

### App Log
| Operation | Description |
|-----------|-------------|
| Get | Get application runtime logs |
| Query | Query logs with filters |

### Environment Variable
| Operation | Description |
|-----------|-------------|
| List | List all environment variables |
| Set | Set environment variables |
| Delete | Delete an environment variable |

### Analytics
| Operation | Description |
|-----------|-------------|
| Get Organization | Get organization-level analytics |
| Get Project | Get project-level analytics |
| Get Deployment | Get deployment-level analytics |

### Certificate
| Operation | Description |
|-----------|-------------|
| List | List certificates for a domain |
| Provision | Provision a new certificate |
| Get | Get certificate details |

### Region
| Operation | Description |
|-----------|-------------|
| List | List available deployment regions |

### Playground
| Operation | Description |
|-----------|-------------|
| Create | Create a playground deployment |
| Get | Get playground details |
| Delete | Delete a playground |

## Trigger Node

The **Deno Deploy Trigger** monitors deployment events using polling:

| Event | Description |
|-------|-------------|
| Deployment Created | Triggers when a new deployment is created |
| Deployment Success | Triggers when a deployment succeeds |
| Deployment Failed | Triggers when a deployment fails |
| Any Deployment Event | Triggers on any deployment status change |

## Usage Examples

### Create a Simple Deployment

```javascript
// Deployment code
Deno.serve((req) => new Response("Hello from n8n!"));
```

1. Add a **Deno Deploy** node
2. Select **Deployment** > **Create**
3. Enter your Project ID
4. Choose **Inline Code** and paste your code
5. Execute the node

### Deploy with Environment Variables

1. Add a **Deno Deploy** node
2. Select **Deployment** > **Create**
3. Expand **Options**
4. Add environment variables under **Environment Variables**
5. Execute the node

### Monitor Deployments

1. Add a **Deno Deploy Trigger** node
2. Enter your Project ID
3. Select the event type to monitor
4. Connect to your workflow actions

## Deno Deploy Concepts

### Projects
Projects are the top-level containers for your deployments. Each project can have multiple deployments, custom domains, and environment variables.

### Deployments
Deployments are immutable snapshots of your code. When you create a deployment, Deno Deploy builds and distributes your code globally.

### KV Databases
Deno KV is a globally distributed key-value store. You can create databases and bind them to your deployments for persistent storage.

### Regions
Deno Deploy automatically distributes your code to multiple regions worldwide for low-latency access. Available regions include:
- `gcp-us-east1`
- `gcp-us-west1`
- `gcp-europe-west4`
- `gcp-asia-southeast1`
- And more...

## Error Handling

The node provides detailed error messages for common issues:

| Error Code | Description |
|------------|-------------|
| 400 | Invalid parameters |
| 401 | Invalid or missing access token |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Resource conflict |
| 422 | Validation error |
| 429 | Rate limit exceeded |

## Security Best Practices

1. **Token Permissions**: Use the minimum required permissions for your access token
2. **Environment Variables**: Store sensitive values in project environment variables, not in code
3. **Token Rotation**: Regularly rotate your access tokens
4. **Organization Access**: Limit access to your organization to trusted team members

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
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

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure your pull requests:

1. Follow the existing code style
2. Include tests for new functionality
3. Update documentation as needed
4. Pass all linting and test checks

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-deno-deploy/issues)
- **Documentation**: [Deno Deploy Docs](https://docs.deno.com/deploy/)
- **API Reference**: [Deno Deploy API](https://api.deno.com/v1/openapi.json)

## Acknowledgments

- [Deno](https://deno.land/) for the amazing runtime and platform
- [n8n](https://n8n.io/) for the powerful workflow automation platform
- The open-source community for inspiration and support
