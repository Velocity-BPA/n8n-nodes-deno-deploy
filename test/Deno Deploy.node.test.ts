/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { DenoDeploy } from '../nodes/Deno Deploy/Deno Deploy.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('DenoDeploy Node', () => {
  let node: DenoDeploy;

  beforeAll(() => {
    node = new DenoDeploy();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Deno Deploy');
      expect(node.description.name).toBe('denodeploy');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Organizations Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        bearerToken: 'test-bearer-token',
        baseUrl: 'https://api.deno.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listOrganizations', () => {
    it('should list organizations successfully', async () => {
      const mockResponse = [
        { id: 'org-1', name: 'Organization 1' },
        { id: 'org-2', name: 'Organization 2' },
      ];

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'listOrganizations';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeOrganizationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.deno.com/v1/organizations',
        headers: {
          'Authorization': 'Bearer test-bearer-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'listOrganizations';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const items = [{ json: {} }];

      await expect(executeOrganizationsOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('API Error');
    });
  });

  describe('getOrganization', () => {
    it('should get organization details successfully', async () => {
      const mockResponse = { id: 'org-1', name: 'Test Organization', description: 'Test Description' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getOrganization';
        if (paramName === 'orgId') return 'org-1';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeOrganizationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.deno.com/v1/organizations/org-1',
        headers: {
          'Authorization': 'Bearer test-bearer-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should throw error when orgId is missing', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getOrganization';
        if (paramName === 'orgId') return '';
        return '';
      });

      const items = [{ json: {} }];

      await expect(executeOrganizationsOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('Organization ID is required');
    });
  });

  describe('updateOrganization', () => {
    it('should update organization successfully', async () => {
      const mockResponse = { id: 'org-1', name: 'Updated Organization', description: 'Updated Description' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'updateOrganization';
        if (paramName === 'orgId') return 'org-1';
        if (paramName === 'name') return 'Updated Organization';
        if (paramName === 'description') return 'Updated Description';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeOrganizationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PATCH',
        url: 'https://api.deno.com/v1/organizations/org-1',
        headers: {
          'Authorization': 'Bearer test-bearer-token',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'Updated Organization',
          description: 'Updated Description',
        },
        json: true,
      });
    });

    it('should throw error when no update fields provided', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'updateOrganization';
        if (paramName === 'orgId') return 'org-1';
        return '';
      });

      const items = [{ json: {} }];

      await expect(executeOrganizationsOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('At least one field (name or description) must be provided for update');
    });

    it('should throw error when orgId is missing', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'updateOrganization';
        if (paramName === 'orgId') return '';
        if (paramName === 'name') return 'Updated Name';
        return '';
      });

      const items = [{ json: {} }];

      await expect(executeOrganizationsOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('Organization ID is required');
    });
  });
});

describe('Projects Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        token: 'test-api-key',
        baseUrl: 'https://api.deno.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should list projects successfully', async () => {
    const mockProjects = [
      { id: 'project1', name: 'Test Project 1', type: 'static' },
      { id: 'project2', name: 'Test Project 2', type: 'playground' },
    ];

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'listProjects';
        case 'orgId': return 'org123';
        default: return undefined;
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockProjects);

    const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.deno.com/v1/organizations/org123/projects',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockProjects, pairedItem: { item: 0 } }]);
  });

  test('should create project successfully', async () => {
    const mockProject = { id: 'project123', name: 'New Project', type: 'static' };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createProject';
        case 'orgId': return 'org123';
        case 'name': return 'New Project';
        case 'type': return 'static';
        default: return undefined;
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockProject);

    const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.deno.com/v1/organizations/org123/projects',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        name: 'New Project',
        type: 'static',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockProject, pairedItem: { item: 0 } }]);
  });

  test('should get project successfully', async () => {
    const mockProject = { id: 'project123', name: 'Test Project', type: 'static' };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getProject';
        case 'projectId': return 'project123';
        default: return undefined;
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockProject);

    const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.deno.com/v1/projects/project123',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockProject, pairedItem: { item: 0 } }]);
  });

  test('should update project successfully', async () => {
    const mockProject = { id: 'project123', name: 'Updated Project', description: 'Updated description' };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'updateProject';
        case 'projectId': return 'project123';
        case 'name': return 'Updated Project';
        case 'description': return 'Updated description';
        default: return undefined;
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockProject);

    const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PATCH',
      url: 'https://api.deno.com/v1/projects/project123',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        name: 'Updated Project',
        description: 'Updated description',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockProject, pairedItem: { item: 0 } }]);
  });

  test('should delete project successfully', async () => {
    const mockResponse = { success: true };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'deleteProject';
        case 'projectId': return 'project123';
        default: return undefined;
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://api.deno.com/v1/projects/project123',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getProject';
        case 'projectId': return 'invalid-project';
        default: return undefined;
      }
    });
    
    const apiError = new Error('Project not found');
    (apiError as any).httpCode = 404;
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    await expect(executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
  });

  test('should continue on fail when enabled', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getProject';
        case 'projectId': return 'invalid-project';
        default: return undefined;
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Project not found'));

    const result = await executeProjectsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'Project not found' }, pairedItem: { item: 0 } }]);
  });
});

describe('Deployments Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.deno.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listDeployments', () => {
    it('should list deployments successfully', async () => {
      const mockResponse = {
        deployments: [
          { id: 'dep1', status: 'success', createdAt: '2023-01-01' },
          { id: 'dep2', status: 'pending', createdAt: '2023-01-02' }
        ],
        total: 2
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'listDeployments';
          case 'projectId': return 'proj123';
          case 'page': return 1;
          case 'limit': return 20;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDeploymentsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } },
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.deno.com/v1/projects/proj123/deployments?page=1&limit=20',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('createDeployment', () => {
    it('should create deployment successfully', async () => {
      const mockResponse = {
        id: 'dep123',
        status: 'pending',
        entryPointUrl: 'https://example.com/main.ts'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createDeployment';
          case 'projectId': return 'proj123';
          case 'entryPointUrl': return 'https://example.com/main.ts';
          case 'envVars': return { property: [{ name: 'NODE_ENV', value: 'production' }] };
          case 'importMapUrl': return 'https://example.com/import-map.json';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDeploymentsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } },
      ]);
    });
  });

  describe('getDeployment', () => {
    it('should get deployment successfully', async () => {
      const mockResponse = {
        id: 'dep123',
        status: 'success',
        entryPointUrl: 'https://example.com/main.ts',
        createdAt: '2023-01-01T00:00:00Z'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getDeployment';
          case 'deploymentId': return 'dep123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDeploymentsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } },
      ]);
    });
  });

  describe('deleteDeployment', () => {
    it('should delete deployment successfully', async () => {
      const mockResponse = { success: true };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'deleteDeployment';
          case 'deploymentId': return 'dep123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDeploymentsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } },
      ]);
    });
  });

  describe('getDeploymentLogs', () => {
    it('should get deployment logs successfully', async () => {
      const mockResponse = {
        logs: [
          { timestamp: '2023-01-01T00:00:00Z', message: 'Starting deployment' },
          { timestamp: '2023-01-01T00:01:00Z', message: 'Deployment completed' }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getDeploymentLogs';
          case 'deploymentId': return 'dep123';
          case 'since': return '2023-01-01T00:00:00Z';
          case 'until': return '2023-01-01T23:59:59Z';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDeploymentsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } },
      ]);
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getDeployment';
          case 'deploymentId': return 'invalid-id';
          default: return undefined;
        }
      });

      const error = new Error('Deployment not found');
      (error as any).httpCode = '404';
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(
        executeDeploymentsOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow();
    });

    it('should continue on fail when enabled', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getDeployment';
          case 'deploymentId': return 'invalid-id';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('Network error'),
      );

      const result = await executeDeploymentsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([
        { json: { error: 'Network error' }, pairedItem: { item: 0 } },
      ]);
    });
  });
});

describe('Domains Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.deno.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listDomains', () => {
    it('should list domains for a project successfully', async () => {
      const mockResponse = {
        domains: [
          {
            id: 'domain-123',
            domain: 'example.com',
            status: 'verified',
            certificateType: 'automatic',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'listDomains';
        if (paramName === 'projectId') return 'project-123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDomainsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.deno.com/v1/projects/project-123/domains',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle errors when listing domains', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'listDomains';
        if (paramName === 'projectId') return 'project-123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeDomainsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('addDomain', () => {
    it('should add a domain to a project successfully', async () => {
      const mockResponse = {
        id: 'domain-123',
        domain: 'example.com',
        status: 'pending',
        certificateType: 'automatic',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'addDomain';
        if (paramName === 'projectId') return 'project-123';
        if (paramName === 'domain') return 'example.com';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDomainsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.deno.com/v1/projects/project-123/domains',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          domain: 'example.com',
        },
        json: true,
      });
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getDomain', () => {
    it('should get domain details successfully', async () => {
      const mockResponse = {
        id: 'domain-123',
        domain: 'example.com',
        status: 'verified',
        certificateType: 'automatic',
        verificationRecords: [],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getDomain';
        if (paramName === 'domainId') return 'domain-123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDomainsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.deno.com/v1/domains/domain-123',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('updateDomain', () => {
    it('should update domain settings successfully', async () => {
      const mockResponse = {
        id: 'domain-123',
        domain: 'example.com',
        status: 'verified',
        certificateType: 'manual',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'updateDomain';
        if (paramName === 'domainId') return 'domain-123';
        if (paramName === 'certificateType') return 'manual';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDomainsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PATCH',
        url: 'https://api.deno.com/v1/domains/domain-123',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          certificateType: 'manual',
        },
        json: true,
      });
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('deleteDomain', () => {
    it('should delete domain successfully', async () => {
      const mockResponse = { success: true };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'deleteDomain';
        if (paramName === 'domainId') return 'domain-123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDomainsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.deno.com/v1/domains/domain-123',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('verifyDomain', () => {
    it('should verify domain ownership successfully', async () => {
      const mockResponse = {
        id: 'domain-123',
        domain: 'example.com',
        status: 'verified',
        verificationResult: 'success',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'verifyDomain';
        if (paramName === 'domainId') return 'domain-123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeDomainsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.deno.com/v1/domains/domain-123/verify',
        headers: {
          Authorization: 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('KvDatabases Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.deno.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listDatabases', () => {
    it('should list KV databases successfully', async () => {
      const mockResponse = {
        databases: [
          { id: 'db1', description: 'Test DB 1' },
          { id: 'db2', description: 'Test DB 2' }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'listDatabases';
        if (paramName === 'orgId') return 'org123';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeKvDatabasesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.deno.com/v1/organizations/org123/databases',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle listDatabases error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'listDatabases';
        if (paramName === 'orgId') return 'org123';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const items = [{ json: {} }];
      
      await expect(
        executeKvDatabasesOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow();
    });
  });

  describe('createDatabase', () => {
    it('should create KV database successfully', async () => {
      const mockResponse = {
        id: 'db123',
        description: 'New test database'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'createDatabase';
        if (paramName === 'orgId') return 'org123';
        if (paramName === 'description') return 'New test database';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeKvDatabasesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.deno.com/v1/organizations/org123/databases',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: { description: 'New test database' },
        json: true,
      });
    });
  });

  describe('getDatabase', () => {
    it('should get KV database successfully', async () => {
      const mockResponse = {
        id: 'db123',
        description: 'Test database',
        createdAt: '2023-01-01T00:00:00Z'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getDatabase';
        if (paramName === 'databaseId') return 'db123';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeKvDatabasesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.deno.com/v1/databases/db123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('deleteDatabase', () => {
    it('should delete KV database successfully', async () => {
      const mockResponse = { success: true };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'deleteDatabase';
        if (paramName === 'databaseId') return 'db123';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeKvDatabasesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.deno.com/v1/databases/db123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('createSnapshot', () => {
    it('should create database snapshot successfully', async () => {
      const mockResponse = {
        snapshotId: 'snap123',
        status: 'created'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'createSnapshot';
        if (paramName === 'databaseId') return 'db123';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeKvDatabasesOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.deno.com/v1/databases/db123/snapshot',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });
});

describe('EnvironmentVariables Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.deno.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listEnvironmentVariables', () => {
    it('should list environment variables successfully', async () => {
      const mockResponse = [
        { key: 'NODE_ENV', value: 'production' },
        { key: 'API_URL', value: 'https://api.example.com' }
      ];

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'listEnvironmentVariables';
        if (paramName === 'projectId') return 'test-project-id';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEnvironmentVariablesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.deno.com/v1/projects/test-project-id/env',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('createEnvironmentVariable', () => {
    it('should create environment variable successfully', async () => {
      const mockResponse = { key: 'NEW_VAR', value: 'new-value', id: '123' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'createEnvironmentVariable';
        if (paramName === 'projectId') return 'test-project-id';
        if (paramName === 'key') return 'NEW_VAR';
        if (paramName === 'value') return 'new-value';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEnvironmentVariablesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.deno.com/v1/projects/test-project-id/env',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          key: 'NEW_VAR',
          value: 'new-value',
        },
        json: true,
      });
    });
  });

  describe('getEnvironmentVariable', () => {
    it('should get environment variable successfully', async () => {
      const mockResponse = { key: 'NODE_ENV', value: 'production' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getEnvironmentVariable';
        if (paramName === 'projectId') return 'test-project-id';
        if (paramName === 'key') return 'NODE_ENV';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEnvironmentVariablesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.deno.com/v1/projects/test-project-id/env/NODE_ENV',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('updateEnvironmentVariable', () => {
    it('should update environment variable successfully', async () => {
      const mockResponse = { key: 'NODE_ENV', value: 'development' };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'updateEnvironmentVariable';
        if (paramName === 'projectId') return 'test-project-id';
        if (paramName === 'key') return 'NODE_ENV';
        if (paramName === 'value') return 'development';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEnvironmentVariablesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PATCH',
        url: 'https://api.deno.com/v1/projects/test-project-id/env/NODE_ENV',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          value: 'development',
        },
        json: true,
      });
    });
  });

  describe('deleteEnvironmentVariable', () => {
    it('should delete environment variable successfully', async () => {
      const mockResponse = { success: true };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'deleteEnvironmentVariable';
        if (paramName === 'projectId') return 'test-project-id';
        if (paramName === 'key') return 'OLD_VAR';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeEnvironmentVariablesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.deno.com/v1/projects/test-project-id/env/OLD_VAR',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'listEnvironmentVariables';
        if (paramName === 'projectId') return 'invalid-project';
        return '';
      });

      const apiError = new Error('Project not found');
      (apiError as any).httpCode = 404;
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      await expect(executeEnvironmentVariablesOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
    });

    it('should continue on fail when enabled', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'listEnvironmentVariables';
        if (paramName === 'projectId') return 'invalid-project';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeEnvironmentVariablesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
});
});
