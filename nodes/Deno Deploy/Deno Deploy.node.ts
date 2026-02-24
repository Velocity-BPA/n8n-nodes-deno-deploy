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
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Organizations',
            value: 'organizations',
          },
          {
            name: 'Projects',
            value: 'projects',
          },
          {
            name: 'Deployments',
            value: 'deployments',
          },
          {
            name: 'Domains',
            value: 'domains',
          },
          {
            name: 'KvDatabases',
            value: 'kvDatabases',
          },
          {
            name: 'EnvironmentVariables',
            value: 'environmentVariables',
          }
        ],
        default: 'organizations',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['organizations'],
    },
  },
  options: [
    {
      name: 'List Organizations',
      value: 'listOrganizations',
      description: 'List all organizations user has access to',
      action: 'List organizations',
    },
    {
      name: 'Get Organization',
      value: 'getOrganization',
      description: 'Get organization details',
      action: 'Get organization',
    },
    {
      name: 'Update Organization',
      value: 'updateOrganization',
      description: 'Update organization settings',
      action: 'Update organization',
    },
  ],
  default: 'listOrganizations',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['projects'],
    },
  },
  options: [
    {
      name: 'List Projects',
      value: 'listProjects',
      description: 'List all projects in an organization',
      action: 'List projects',
    },
    {
      name: 'Create Project',
      value: 'createProject',
      description: 'Create a new project in an organization',
      action: 'Create project',
    },
    {
      name: 'Get Project',
      value: 'getProject',
      description: 'Get project details by ID',
      action: 'Get project',
    },
    {
      name: 'Update Project',
      value: 'updateProject',
      description: 'Update project settings',
      action: 'Update project',
    },
    {
      name: 'Delete Project',
      value: 'deleteProject',
      description: 'Delete a project',
      action: 'Delete project',
    },
  ],
  default: 'listProjects',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['deployments'],
    },
  },
  options: [
    {
      name: 'List Deployments',
      value: 'listDeployments',
      description: 'List deployments for a project',
      action: 'List deployments',
    },
    {
      name: 'Create Deployment',
      value: 'createDeployment',
      description: 'Create a new deployment',
      action: 'Create deployment',
    },
    {
      name: 'Get Deployment',
      value: 'getDeployment',
      description: 'Get deployment details',
      action: 'Get deployment',
    },
    {
      name: 'Delete Deployment',
      value: 'deleteDeployment',
      description: 'Delete a deployment',
      action: 'Delete deployment',
    },
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
      resource: ['domains'],
    },
  },
  options: [
    {
      name: 'List Domains',
      value: 'listDomains',
      description: 'List domains for project',
      action: 'List domains',
    },
    {
      name: 'Add Domain',
      value: 'addDomain',
      description: 'Add custom domain to project',
      action: 'Add domain',
    },
    {
      name: 'Get Domain',
      value: 'getDomain',
      description: 'Get domain details and status',
      action: 'Get domain',
    },
    {
      name: 'Update Domain',
      value: 'updateDomain',
      description: 'Update domain settings',
      action: 'Update domain',
    },
    {
      name: 'Delete Domain',
      value: 'deleteDomain',
      description: 'Remove domain from project',
      action: 'Delete domain',
    },
    {
      name: 'Verify Domain',
      value: 'verifyDomain',
      description: 'Verify domain ownership',
      action: 'Verify domain',
    },
  ],
  default: 'listDomains',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['kvDatabases'],
    },
  },
  options: [
    {
      name: 'List Databases',
      value: 'listDatabases',
      description: 'List KV databases in organization',
      action: 'List KV databases',
    },
    {
      name: 'Create Database',
      value: 'createDatabase',
      description: 'Create new KV database',
      action: 'Create KV database',
    },
    {
      name: 'Get Database',
      value: 'getDatabase',
      description: 'Get KV database details',
      action: 'Get KV database',
    },
    {
      name: 'Delete Database',
      value: 'deleteDatabase',
      description: 'Delete KV database',
      action: 'Delete KV database',
    },
    {
      name: 'Create Snapshot',
      value: 'createSnapshot',
      description: 'Create database snapshot',
      action: 'Create database snapshot',
    },
  ],
  default: 'listDatabases',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['environmentVariables'],
    },
  },
  options: [
    {
      name: 'List Environment Variables',
      value: 'listEnvironmentVariables',
      description: 'List environment variables for project',
      action: 'List environment variables',
    },
    {
      name: 'Create Environment Variable',
      value: 'createEnvironmentVariable',
      description: 'Add environment variable',
      action: 'Create environment variable',
    },
    {
      name: 'Get Environment Variable',
      value: 'getEnvironmentVariable',
      description: 'Get specific environment variable',
      action: 'Get environment variable',
    },
    {
      name: 'Update Environment Variable',
      value: 'updateEnvironmentVariable',
      description: 'Update environment variable value',
      action: 'Update environment variable',
    },
    {
      name: 'Delete Environment Variable',
      value: 'deleteEnvironmentVariable',
      description: 'Delete environment variable',
      action: 'Delete environment variable',
    },
  ],
  default: 'listEnvironmentVariables',
},
      // Parameter definitions
{
  displayName: 'Organization ID',
  name: 'orgId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['getOrganization', 'updateOrganization'],
    },
  },
  default: '',
  description: 'The organization ID',
},
{
  displayName: 'Organization Name',
  name: 'name',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['updateOrganization'],
    },
  },
  default: '',
  description: 'The new name for the organization',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['organizations'],
      operation: ['updateOrganization'],
    },
  },
  default: '',
  description: 'The new description for the organization',
},
{
  displayName: 'Organization ID',
  name: 'orgId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['listProjects', 'createProject'],
    },
  },
  default: '',
  description: 'The organization ID',
},
{
  displayName: 'Project Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['createProject'],
    },
  },
  default: '',
  description: 'The name of the project to create',
},
{
  displayName: 'Project Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['createProject'],
    },
  },
  options: [
    {
      name: 'Static',
      value: 'static',
    },
    {
      name: 'Playground',
      value: 'playground',
    },
  ],
  default: 'static',
  description: 'The type of project to create',
},
{
  displayName: 'Project ID',
  name: 'projectId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['getProject', 'updateProject', 'deleteProject'],
    },
  },
  default: '',
  description: 'The project ID',
},
{
  displayName: 'Project Name',
  name: 'name',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['updateProject'],
    },
  },
  default: '',
  description: 'The new name for the project',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['projects'],
      operation: ['updateProject'],
    },
  },
  default: '',
  description: 'The project description',
},
{
  displayName: 'Project ID',
  name: 'projectId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['deployments'],
      operation: ['listDeployments', 'createDeployment'],
    },
  },
  default: '',
  description: 'The ID of the project',
},
{
  displayName: 'Page',
  name: 'page',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['deployments'],
      operation: ['listDeployments'],
    },
  },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['deployments'],
      operation: ['listDeployments'],
    },
  },
  default: 20,
  description: 'Number of deployments to return per page',
},
{
  displayName: 'Entry Point URL',
  name: 'entryPointUrl',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['deployments'],
      operation: ['createDeployment'],
    },
  },
  default: '',
  description: 'The URL of the entry point for the deployment',
},
{
  displayName: 'Environment Variables',
  name: 'envVars',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,
  },
  displayOptions: {
    show: {
      resource: ['deployments'],
      operation: ['createDeployment'],
    },
  },
  default: {},
  options: [
    {
      name: 'property',
      displayName: 'Property',
      values: [
        {
          displayName: 'Name',
          name: 'name',
          type: 'string',
          default: '',
        },
        {
          displayName: 'Value',
          name: 'value',
          type: 'string',
          default: '',
        },
      ],
    },
  ],
  description: 'Environment variables for the deployment',
},
{
  displayName: 'Import Map URL',
  name: 'importMapUrl',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['deployments'],
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
  displayOptions: {
    show: {
      resource: ['deployments'],
      operation: ['getDeployment', 'deleteDeployment', 'getDeploymentLogs'],
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
      resource: ['deployments'],
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
      resource: ['deployments'],
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
      resource: ['domains'],
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
      resource: ['domains'],
      operation: ['addDomain'],
    },
  },
  default: '',
  description: 'The custom domain to add',
},
{
  displayName: 'Domain ID',
  name: 'domainId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['domains'],
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
      resource: ['domains'],
      operation: ['updateDomain'],
    },
  },
  default: 'automatic',
  description: 'The certificate type for the domain',
},
{
  displayName: 'Organization ID',
  name: 'orgId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['kvDatabases'],
      operation: ['listDatabases', 'createDatabase'],
    },
  },
  default: '',
  description: 'The organization ID to manage databases for',
},
{
  displayName: 'Database ID',
  name: 'databaseId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['kvDatabases'],
      operation: ['getDatabase', 'deleteDatabase', 'createSnapshot'],
    },
  },
  default: '',
  description: 'The KV database ID',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['kvDatabases'],
      operation: ['createDatabase'],
    },
  },
  default: '',
  description: 'Description for the new KV database',
},
{
  displayName: 'Project ID',
  name: 'projectId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['environmentVariables'],
      operation: ['listEnvironmentVariables', 'createEnvironmentVariable', 'getEnvironmentVariable', 'updateEnvironmentVariable', 'deleteEnvironmentVariable'],
    },
  },
  default: '',
  description: 'The project ID',
},
{
  displayName: 'Environment Variable Key',
  name: 'key',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['environmentVariables'],
      operation: ['createEnvironmentVariable', 'getEnvironmentVariable', 'updateEnvironmentVariable', 'deleteEnvironmentVariable'],
    },
  },
  default: '',
  description: 'The environment variable key name',
},
{
  displayName: 'Environment Variable Value',
  name: 'value',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['environmentVariables'],
      operation: ['createEnvironmentVariable', 'updateEnvironmentVariable'],
    },
  },
  default: '',
  description: 'The environment variable value',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'organizations':
        return [await executeOrganizationsOperations.call(this, items)];
      case 'projects':
        return [await executeProjectsOperations.call(this, items)];
      case 'deployments':
        return [await executeDeploymentsOperations.call(this, items)];
      case 'domains':
        return [await executeDomainsOperations.call(this, items)];
      case 'kvDatabases':
        return [await executeKvDatabasesOperations.call(this, items)];
      case 'environmentVariables':
        return [await executeEnvironmentVariablesOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeOrganizationsOperations(
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
              'Authorization': `Bearer ${credentials.bearerToken}`,
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
              'Authorization': `Bearer ${credentials.bearerToken}`,
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
              'Authorization': `Bearer ${credentials.bearerToken}`,
              'Content-Type': 'application/json',
            },
            body,
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

async function executeProjectsOperations(
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
          const orgId = this.getNodeParameter('orgId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/organizations/${orgId}/projects`,
            headers: {
              'Authorization': `Bearer ${credentials.token}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createProject': {
          const orgId = this.getNodeParameter('orgId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/organizations/${orgId}/projects`,
            headers: {
              'Authorization': `Bearer ${credentials.token}`,
              'Content-Type': 'application/json',
            },
            body: {
              name,
              type,
            },
            json: true,
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
              'Authorization': `Bearer ${credentials.token}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'updateProject': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          
          const body: any = {};
          if (name) body.name = name;
          if (description) body.description = description;
          
          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/projects/${projectId}`,
            headers: {
              'Authorization': `Bearer ${credentials.token}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
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
              'Authorization': `Bearer ${credentials.token}`,
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

async function executeDeploymentsOperations(
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
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createDeployment': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const entryPointUrl = this.getNodeParameter('entryPointUrl', i) as string;
          const envVarsCollection = this.getNodeParameter('envVars', i, {}) as any;
          const importMapUrl = this.getNodeParameter('importMapUrl', i, '') as string;

          const envVars: any = {};
          if (envVarsCollection.property) {
            for (const prop of envVarsCollection.property) {
              envVars[prop.name] = prop.value;
            }
          }

          const body: any = {
            entryPointUrl,
            envVars,
          };

          if (importMapUrl) {
            body.importMapUrl = importMapUrl;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/projects/${projectId}/deployments`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
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
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
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
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
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
              'Authorization': `Bearer ${credentials.apiKey}`,
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
            `The operation "${operation}" is not known!`,
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
        continue;
      }
      
      if (error.httpCode) {
        throw new NodeApiError(this.getNode(), error);
      }
      throw new NodeOperationError(this.getNode(), error.message);
    }
  }

  return returnData;
}

async function executeDomainsOperations(
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
              Authorization: `Bearer ${credentials.apiKey}`,
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
              Authorization: `Bearer ${credentials.apiKey}`,
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
              Authorization: `Bearer ${credentials.apiKey}`,
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
          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/domains/${domainId}`,
            headers: {
              Authorization: `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              certificateType,
            },
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
              Authorization: `Bearer ${credentials.apiKey}`,
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
              Authorization: `Bearer ${credentials.apiKey}`,
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

async function executeKvDatabasesOperations(
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
        case 'listDatabases': {
          const orgId = this.getNodeParameter('orgId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/organizations/${orgId}/databases`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createDatabase': {
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
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getDatabase': {
          const databaseId = this.getNodeParameter('databaseId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/databases/${databaseId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'deleteDatabase': {
          const databaseId = this.getNodeParameter('databaseId', i) as string;
          
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/databases/${databaseId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
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
              'Authorization': `Bearer ${credentials.apiKey}`,
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
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }
  
  return returnData;
}

async function executeEnvironmentVariablesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('denodeployApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const projectId = this.getNodeParameter('projectId', i) as string;

      switch (operation) {
        case 'listEnvironmentVariables': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/projects/${projectId}/env`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createEnvironmentVariable': {
          const key = this.getNodeParameter('key', i) as string;
          const value = this.getNodeParameter('value', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/projects/${projectId}/env`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
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
          const key = this.getNodeParameter('key', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/projects/${projectId}/env/${key}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateEnvironmentVariable': {
          const key = this.getNodeParameter('key', i) as string;
          const value = this.getNodeParameter('value', i) as string;
          
          const options: any = {
            method: 'PATCH',
            url: `${credentials.baseUrl}/projects/${projectId}/env/${key}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
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
          const key = this.getNodeParameter('key', i) as string;
          
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/projects/${projectId}/env/${key}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
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
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}
