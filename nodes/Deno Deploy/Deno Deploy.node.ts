/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-denodeploy/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class DenoDeploy implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Deno Deploy',
    name: 'denodeploy',
    icon: 'file:denodeploy.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Deno Deploy API',
    defaults: {
      name: 'Deno Deploy',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'denodeployApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Project',
            value: 'project',
          },
          {
            name: 'Deployment',
            value: 'deployment',
          },
          {
            name: 'Domain',
            value: 'domain',
          },
          {
            name: 'KV Database',
            value: 'kvDatabase',
          },
          {
            name: 'Environment Variable',
            value: 'environmentVariable',
          },
          {
            name: 'Organization',
            value: 'organization',
          }
        ],
        default: 'project',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['project'] } },
  options: [
    { name: 'List Projects', value: 'listProjects', description: 'List all projects for the authenticated user', action: 'List all projects' },
    { name: 'Create Project', value: 'createProject', description: 'Create a new project', action: 'Create a project' },
    { name: 'Get Project', value: 'getProject', description: 'Get details of a specific project', action: 'Get a project' },
    { name: 'Update Project', value: 'updateProject', description: 'Update project settings', action: 'Update a project' },
    { name: 'Delete Project', value: 'deleteProject', description: 'Delete a project', action: 'Delete a project' }
  ],
  default: 'listProjects',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['deployment'] } },
  options: [
    { name: 'List Deployments', value: 'listDeployments', description: 'List all deployments for a project', action: 'List deployments' },
    { name: 'Create Deployment', value: 'createDeployment', description: 'Create a new deployment', action: 'Create deployment' },
    { name: 'Get Deployment', value: 'getDeployment', description: 'Get details of a specific deployment', action: 'Get deployment' },
    { name: 'Delete Deployment', value: 'deleteDeployment', description: 'Delete a deployment', action: 'Delete deployment' },
    { name: 'Redeploy Deployment', value: 'redeployDeployment', description: 'Redeploy an existing deployment', action: 'Redeploy deployment' },
    {
      name: 'Get Deployment Logs',
      value: 'getDeploymentLogs',
      description: 'Get deployment logs',
      action: 'Get deployment logs',
    },
  ],
  default: 'listDeployments',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['domain'],
		},
	},
	options: [
		{
			name: 'List Domains',
			value: 'listDomains',
			description: 'List all domains for a project',
			action: 'List all domains for a project',
		},
		{
			name: 'Add Domain',
			value: 'addDomain',
			description: 'Add a custom domain to a project',
			action: 'Add a custom domain to a project',
		},
		{
			name: 'Get Domain',
			value: 'getDomain',
			description: 'Get details of a specific domain',
			action: 'Get details of a specific domain',
		},
		{
			name: 'Update Domain',
			value: 'updateDomain',
			description: 'Update domain configuration',
			action: 'Update domain configuration',
		},
		{
			name: 'Delete Domain',
			value: 'deleteDomain',
			description: 'Remove a domain from a project',
			action: 'Remove a domain from a project',
		},
		{
			name: 'Verify Domain',
			value: 'verifyDomain',
			description: 'Verify domain ownership',
			action: 'Verify domain ownership',
		},
	],
	default: 'listDomains',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['kvDatabase'] } },
  options: [
    { name: 'List KV Databases', value: 'listKvDatabases', description: 'List all KV databases for an organization', action: 'List KV databases' },
    { name: 'Create KV Database', value: 'createKvDatabase', description: 'Create a new KV database', action: 'Create KV database' },
    { name: 'Get KV Database', value: 'getKvDatabase', description: 'Get details of a specific KV database', action: 'Get KV database' },
    { name: 'Update KV Database', value: 'updateKvDatabase', description: 'Update KV database settings', action: 'Update KV database' },
    { name: 'Delete KV Database', value: 'deleteKvDatabase', description: 'Delete a KV database', action: 'Delete KV database' },
    {
      name: 'Create Snapshot',
      value: 'createSnapshot',
      description: 'Create database snapshot',
      action: 'Create database snapshot',
    },
  ],
  default: 'listKvDatabases',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['environmentVariable'],
		},
	},
	options: [
		{
			name: 'List Environment Variables',
			value: 'listEnvironmentVariables',
			description: 'List all environment variables for a project',
			action: 'List environment variables',
		},
		{
			name: 'Create Environment Variable',
			value: 'createEnvironmentVariable',
			description: 'Create a new environment variable',
			action: 'Create environment variable',
		},
		{
			name: 'Get Environment Variable',
			value: 'getEnvironmentVariable',
			description: 'Get a specific environment variable',
			action: 'Get environment variable',
		},
		{
			name: 'Update Environment Variable',
			value: 'updateEnvironmentVariable',
			description: 'Update an environment variable',
			action: 'Update environment variable',
		},
		{
			name: 'Delete Environment Variable',
			value: 'deleteEnvironmentVariable',
			description: 'Delete an environment variable',
			action: 'Delete environment variable',
		},
	],
	default: 'listEnvironmentVariables',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['organization'],
		},
	},
	options: [
		{
			name: 'List Organizations',
			value: 'listOrganizations',
			description: 'List all organizations for the authenticated user',
			action: 'List organizations',
		},
		{
			name: 'Get Organization',
			value: 'getOrganization',
			description: 'Get details of a specific organization',
			action: 'Get organization',
		},
		{
			name: 'Update Organization',
			value: 'updateOrganization',
			description: 'Update organization settings',
			action: 'Update organization',
		},
		{
			name: 'List Members',
			value: 'listMembers',
			description: 'List all members of an organization',
			action: 'List members',
		},
		{
			name: 'Invite Member',
			value: 'inviteMember',
			description: 'Invite a new member to the organization',
			action: 'Invite member',
		},
	],
	default: 'listOrganizations',
},
{
  displayName: 'Project Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['project'],
      operation: ['createProject']
    }
  },
  default: '',
  description: 'The name of the project'
},
{
  displayName: 'Project Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['project'],
      operation: ['createProject']
    }
  },
  options: [
    { name: 'Playground', value: 'playground' },
    { name: 'Git', value: 'git' }
  ],
  default: 'git',
  description: 'The type of project to create'
},
{
  displayName: 'Project ID',
  name: 'projectId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['project'],
      operation: ['getProject', 'updateProject', 'deleteProject']
    }
  },
  default: '',
  description: 'The ID of the project'
},
{
  displayName: 'Project Name',
  name: 'name',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['project'],
      operation: ['updateProject']
    }
  },
  default: '',
  description: 'The new name of the project'
},
{
  displayName: 'Production Branch',
  name: 'productionBranch',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['project'],
      operation: ['updateProject']
    }
  },
  default: '',
  description: 'The production branch for the project'
},
{
  displayName: 'Project ID',
  name: 'projectId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['deployment'], operation: ['listDeployments'] } },
  default: '',
  description: 'The ID of the project to list deployments for'
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['deployment'], operation: ['listDeployments'] } },
  default: 1,
  description: 'Page number for pagination'
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['deployment'], operation: ['listDeployments'] } },
  default: 20,
  description: 'Number of deployments to return per page'
},
{
  displayName: 'Project ID',
  name: 'projectId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['deployment'], operation: ['createDeployment'] } },
  default: '',
  description: 'The ID of the project to create deployment in'
},
{
  displayName: 'Entry Point URL',
  name: 'entryPointUrl',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['deployment'], operation: ['createDeployment'] } },
  default: '',
  description: 'The URL of the entry point for the deployment'
},
{
  displayName: 'Environment Variables',
  name: 'envVars',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true
  },
  required: false,
  displayOptions: { show: { resource: ['deployment'], operation: ['createDeployment'] } },
  default: {},
  options: [
    {
      name: 'envVar',
      displayName: 'Environment Variable',
      values: [
        {
          displayName: 'Name',
          name: 'name',
          type: 'string',
          default: ''
        },
        {
          displayName: 'Value',
          name: 'value',
          type: 'string',
          default: ''
        }
      ]
    }
  ],
  description: 'Environment variables for the deployment'
},
{
  displayName: 'Compiler Options',
  name: 'compilerOptions',
  type: 'json',
  required: false,
  displayOptions: { show: { resource: ['deployment'], operation: ['createDeployment'] } },
  default: '{}',
  description: 'Compiler options for the deployment (JSON format)'
},
{
  displayName: 'Import Map URL',
  name: 'importMapUrl',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['deployment'],
      operation: ['createDeployment'],
    },
  },
  default: '',
  description: 'The URL of the import map for the deployment',
},
{
  displayName: 'Deployment ID',
  name: 'deploymentId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['deployment'], operation: ['getDeployment'] } },
  default: '',
  description: 'The ID of the deployment to retrieve'
},
{
  displayName: 'Deployment ID',
  name: 'deploymentId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['deployment'], operation: ['deleteDeployment'] } },
  default: '',
  description: 'The ID of the deployment to delete'
},
{
  displayName: 'Deployment ID',
  name: 'deploymentId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['deployment'], operation: ['redeployDeployment'] } },
  default: '',
  description: 'The ID of the deployment to redeploy'
},
{
  displayName: 'Deployment ID',
  name: 'deploymentId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['deployment'],
      operation: ['getDeploymentLogs'],
    },
  },
  default: '',
  description: 'The ID of the deployment',
},
{
  displayName: 'Since',
  name: 'since',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['deployment'],
      operation: ['getDeploymentLogs'],
    },
  },
  default: '',
  description: 'Get logs since this timestamp',
},
{
  displayName: 'Until',
  name: 'until',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['deployment'],
      operation: ['getDeploymentLogs'],
    },
  },
  default: '',
  description: 'Get logs until this timestamp',
},
{
	displayName: 'Project ID',
	name: 'projectId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['domain'],
			operation: ['listDomains', 'addDomain'],
		},
	},
	default: '',
	description: 'The ID of the project',
},
{
	displayName: 'Domain',
	name: 'domain',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['domain'],
			operation: ['addDomain'],
		},
	},
	default: '',
	description: 'The custom domain name to add',
},
{
	displayName: 'Domain ID',
	name: 'domainId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['domain'],
			operation: ['getDomain', 'updateDomain', 'deleteDomain', 'verifyDomain'],
		},
	},
	default: '',
	description: 'The ID of the domain',
},
{
  displayName: 'Certificate Type',
  name: 'certificateType',
  type: 'options',
  options: [
    {
      name: 'Automatic',
      value: 'automatic',
    },
    {
      name: 'Manual',
      value: 'manual',
    },
  ],
  displayOptions: {
    show: {
      resource: ['domain'],
      operation: ['updateDomain'],
    },
  },
  default: 'automatic',
  description: 'The certificate type for the domain',
},
{
	displayName: 'Certificate Chain ID',
	name: 'certificateChainId',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['domain'],
			operation: ['updateDomain'],
		},
	},
	default: '',
	description: 'The ID of the certificate chain to use',
},
{
  displayName: 'Organization ID',
  name: 'orgId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['kvDatabase'],
      operation: ['listKvDatabases', 'createKvDatabase']
    }
  },
  default: '',
  description: 'The ID of the organization'
},
{
  displayName: 'Database ID',
  name: 'databaseId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['kvDatabase'],
      operation: ['getKvDatabase', 'updateKvDatabase', 'deleteKvDatabase', 'createSnapshot']
    }
  },
  default: '',
  description: 'The ID of the KV database'
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['kvDatabase'],
      operation: ['createKvDatabase']
    }
  },
  default: '',
  description: 'Description for the new KV database'
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['kvDatabase'],
      operation: ['updateKvDatabase']
    }
  },
  default: '',
  description: 'Updated description for the KV database'
},
{
	displayName: 'Project ID',
	name: 'projectId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['environmentVariable'],
			operation: ['listEnvironmentVariables', 'createEnvironmentVariable', 'getEnvironmentVariable', 'updateEnvironmentVariable', 'deleteEnvironmentVariable'],
		},
	},
	default: '',
	description: 'The ID of the project',
},
{
	displayName: 'Key',
	name: 'key',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['environmentVariable'],
			operation: ['createEnvironmentVariable', 'getEnvironmentVariable', 'updateEnvironmentVariable', 'deleteEnvironmentVariable'],
		},
	},
	default: '',
	description: 'The environment variable key/name',
},
{
	displayName: 'Value',
	name: 'value',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['environmentVariable'],
			operation: ['createEnvironmentVariable', 'updateEnvironmentVariable'],
		},
	},
	default: '',
	description: 'The environment variable value',
},
{
	displayName: 'Organization ID',
	name: 'orgId',
	type: 'string',
	required: true,
	default: '',
	description: 'The ID of the organization',
	displayOptions: {
		show: {
			resource: ['organization'],
			operation: ['getOrganization', 'updateOrganization', 'listMembers', 'inviteMember'],
		},
	},
},
{
	displayName: 'Organization Name',
	name: 'name',
	type: 'string',
	required: true,
	default: '',
	description: 'The new name for the organization',
	displayOptions: {
		show: {
			resource: ['organization'],
			operation: ['updateOrganization'],
		},
	},
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['organization'],
      operation: ['updateOrganization'],
    },
  },
  default: '',
  description: 'The new description for the organization',
},
{
	displayName: 'Email',
	name: 'email',
	type: 'string',
	required: true,
	default: '',
	description: 'Email address of the user to invite',
	displayOptions: {
		show: {
			resource: ['organization'],
			operation: ['inviteMember'],
		},
	},
},
{
	displayName: 'Role',
	name: 'role',
	type: 'options',
	required: true,
	default: 'member',
	description: 'Role to assign to the invited member',
	options: [
		{
			name: 'Member',
			value: 'member',
		},
		{
			name: 'Admin',
			value: 'admin',
		},
		{
			name: 'Owner',
			value: 'owner',
		},
	],
	displayOptions: {
		show: {
			resource: ['organization'],
			operation: ['inviteMember'],
		},
	},
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'project':
        return [await executeProjectOperations.call(this, items)];
      case 'deployment':
        return [await executeDeploymentOperations.call(this, items)];
      case 'domain':
        return [await executeDomainOperations.call(this, items)];
      case 'kvDatabase':
        return [await executeKvDatabaseOperations.call(this, items)];
      case 'environmentVariable':
        return [await executeEnvironmentVariableOperations.call(this, items)];
      case 'organization':
        return [await executeOrganizationOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeProjectOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('denodeployApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listProjects': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/projects`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createProject': {
          const name = this.getNodeParameter('name', i) as string;
          const type = this.getNodeParameter('type', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/projects`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: {
              name,
              type
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProject': {
          const projectId = this.getNodeParameter('projectId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/projects/${projectId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateProject': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const productionBranch = this.getNodeParameter('productionBranch', i) as string;

          const body: any = {};
          if (name) body.name = name;
          if (productionBranch) body.productionBranch = productionBranch;

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/projects/${projectId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            body,
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteProject': {
          const projectId = this.getNodeParameter('projectId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/projects/${projectId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeDeploymentOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('denodeployApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listDeployments': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const page = this.getNodeParameter('page', i, 1) as number;
          const limit = this.getNodeParameter('limit', i, 20) as number;

          const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/projects/${projectId}/deployments?${queryParams}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createDeployment': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const entryPointUrl = this.getNodeParameter('entryPointUrl', i) as string;
          const envVarsCollection = this.getNodeParameter('envVars', i, {}) as any;
          const compilerOptions = this.getNodeParameter('compilerOptions', i, '{}') as string;
          const importMapUrl = this.getNodeParameter('importMapUrl', i, '') as string;

          const envVars: any = {};
          if (envVarsCollection.envVar) {
            for (const prop of envVarsCollection.envVar) {
              envVars[prop.name] = prop.value;
            }
          }

          let compilerOptionsObj: any = {};
          try {
            compilerOptionsObj = JSON.parse(compilerOptions);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON in compiler options');
          }

          const body: any = {
            entryPointUrl,
            envVars,
            compilerOptions: compilerOptionsObj
          };

          if (importMapUrl) {
            body.importMapUrl = importMapUrl;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/projects/${projectId}/deployments`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true,
            body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDeployment': {
          const deploymentId = this.getNodeParameter('deploymentId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/deployments/${deploymentId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteDeployment': {
          const deploymentId = this.getNodeParameter('deploymentId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/deployments/${deploymentId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'redeployDeployment': {
          const deploymentId = this.getNodeParameter('deploymentId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/deployments/${deploymentId}/redeploy`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDeploymentLogs': {
          const deploymentId = this.getNodeParameter('deploymentId', i) as string;
          const since = this.getNodeParameter('since', i, '') as string;
          const until = this.getNodeParameter('until', i, '') as string;

          const queryParams = new URLSearchParams();
          if (since) queryParams.append('since', since);
          if (until) queryParams.append('until', until);

          const queryString = queryParams.toString();
          const url = queryString 
            ? `${credentials.baseUrl}/deployments/${deploymentId}/logs?${queryString}`
            : `${credentials.baseUrl}/deployments/${deploymentId}/logs`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeDomainOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('denodeployApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
        case 'listDomains': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/projects/${projectId}/domains`,
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'addDomain': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const domain = this.getNodeParameter('domain', i) as string;
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/projects/${projectId}/domains`,
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: {
              domain,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDomain': {
          const domainId = this.getNodeParameter('domainId', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/domains/${domainId}`,
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateDomain': {
          const domainId = this.getNodeParameter('domainId', i) as string;
          const certificateType = this.getNodeParameter('certificateType', i) as string;
          const certificateChainId = this.getNodeParameter('certificateChainId', i) as string;
          
          const body: any = {};
          if (certificateType) {
            body.certificateType = certificateType;
          }
          if (certificateChainId) {
            body.certificateChainId = certificateChainId;
          }
          
          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/domains/${domainId}`,
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteDomain': {
          const domainId = this.getNodeParameter('domainId', i) as string;
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/domains/${domainId}`,
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'verifyDomain': {
          const domainId = this.getNodeParameter('domainId', i) as string;
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/domains/${domainId}/verify`,
            headers: {
              Authorization: `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

			returnData.push({
				json: result,
				pairedItem: {
					item: i,
				},
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: {
						item: i,
					},
				});
			} else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
			}
		}
	}

	return returnData;
}

async function executeKvDatabaseOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('denodeployApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listKvDatabases': {
          const orgId = this.getNodeParameter('orgId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/organizations/${orgId}/databases`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createKvDatabase': {
          const orgId = this.getNodeParameter('orgId', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          
          const body: any = {};
          if (description) {
            body.description = description;
          }
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/organizations/${orgId}/databases`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getKvDatabase': {
          const databaseId = this.getNodeParameter('databaseId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/databases/${databaseId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'updateKvDatabase': {
          const databaseId = this.getNodeParameter('databaseId', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/databases/${databaseId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: {
              description
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteKvDatabase': {
          const databaseId = this.getNodeParameter('databaseId', i) as string;
          
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/databases/${databaseId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createSnapshot': {
          const databaseId = this.getNodeParameter('databaseId', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/databases/${databaseId}/snapshot`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeEnvironmentVariableOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('denodeployApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
        case 'listEnvironmentVariables': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/projects/${projectId}/env`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createEnvironmentVariable': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const key = this.getNodeParameter('key', i) as string;
          const value = this.getNodeParameter('value', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/projects/${projectId}/env`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: {
              key: key,
              value: value,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEnvironmentVariable': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const key = this.getNodeParameter('key', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/projects/${projectId}/env/${key}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateEnvironmentVariable': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const key = this.getNodeParameter('key', i) as string;
          const value = this.getNodeParameter('value', i) as string;
          
          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/projects/${projectId}/env/${key}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: {
              value: value,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteEnvironmentVariable': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const key = this.getNodeParameter('key', i) as string;
          
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/projects/${projectId}/env/${key}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
			}
		}
	}

	return returnData;
}

async function executeOrganizationOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('denodeployApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
        case 'listOrganizations': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/organizations`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOrganization': {
          const orgId = this.getNodeParameter('orgId', i) as string;
          
          if (!orgId) {
            throw new NodeOperationError(this.getNode(), 'Organization ID is required');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/organizations/${orgId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateOrganization': {
          const orgId = this.getNodeParameter('orgId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const description = this.getNodeParameter('description', i) as string;

          if (!orgId) {
            throw new NodeOperationError(this.getNode(), 'Organization ID is required');
          }

          const body: any = {};
          if (name) {
            body.name = name;
          }
          if (description) {
            body.description = description;
          }

          if (Object.keys(body).length === 0) {
            throw new NodeOperationError(this.getNode(), 'At least one field (name or description) must be provided for update');
          }

          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/organizations/${orgId}`,
            headers: {
              'Authorization': `Bearer ${credentials.accessToken}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

				case 'listMembers': {
					const orgId = this.getNodeParameter('orgId', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/organizations/${orgId}/members`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'inviteMember': {
					const orgId = this.getNodeParameter('orgId', i) as string;
					const email = this.getNodeParameter('email', i) as string;
					const role = this.getNodeParameter('role', i) as string;
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/organizations/${orgId}/invites`,
						headers: {
							'Authorization': `Bearer ${credentials.accessToken}`,
							'Content-Type': 'application/json',
						},
						body: {
							email,
							role,
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
			}
		}
	}

	return returnData;
}