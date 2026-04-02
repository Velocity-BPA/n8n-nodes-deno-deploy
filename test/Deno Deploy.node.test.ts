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
describe('Project Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.deno.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should list projects successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('listProjects');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([
      { id: 'project1', name: 'Test Project' }
    ]);

    const result = await executeProjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: [{ id: 'project1', name: 'Test Project' }],
      pairedItem: { item: 0 }
    }]);
  });

  it('should create project successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createProject')
      .mockReturnValueOnce('My Project')
      .mockReturnValueOnce('git');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'new-project-id',
      name: 'My Project',
      type: 'git'
    });

    const result = await executeProjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { id: 'new-project-id', name: 'My Project', type: 'git' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should get project successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getProject')
      .mockReturnValueOnce('project123');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'project123',
      name: 'Test Project'
    });

    const result = await executeProjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { id: 'project123', name: 'Test Project' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should update project successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateProject')
      .mockReturnValueOnce('project123')
      .mockReturnValueOnce('Updated Project')
      .mockReturnValueOnce('main');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'project123',
      name: 'Updated Project',
      productionBranch: 'main'
    });

    const result = await executeProjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { id: 'project123', name: 'Updated Project', productionBranch: 'main' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should delete project successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteProject')
      .mockReturnValueOnce('project123');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

    const result = await executeProjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { success: true },
      pairedItem: { item: 0 }
    }]);
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('listProjects');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeProjectOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { error: 'API Error' },
      pairedItem: { item: 0 }
    }]);
  });
});

describe('Deployment Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        bearerToken: 'test-token',
        baseUrl: 'https://api.deno.com/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  test('should list deployments successfully', async () => {
    const mockResponse = { deployments: [{ id: 'dep1', name: 'Test Deployment' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listDeployments')
      .mockReturnValueOnce('project-123')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(20);

    const result = await executeDeploymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.deno.com/v1/projects/project-123/deployments?page=1&limit=20',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      json: true
    });
  });

  test('should handle list deployments error', async () => {
    const errorMessage = 'API Error';
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error(errorMessage));
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listDeployments')
      .mockReturnValueOnce('project-123');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeDeploymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe(errorMessage);
  });

  test('should create deployment successfully', async () => {
    const mockResponse = { id: 'dep-123', status: 'created' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createDeployment')
      .mockReturnValueOnce('project-123')
      .mockReturnValueOnce('https://example.com/main.ts')
      .mockReturnValueOnce({ envVar: [{ name: 'NODE_ENV', value: 'production' }] })
      .mockReturnValueOnce('{"target": "es2020"}');

    const result = await executeDeploymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.deno.com/v1/projects/project-123/deployments',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      body: {
        entryPointUrl: 'https://example.com/main.ts',
        envVars: { NODE_ENV: 'production' },
        compilerOptions: { target: 'es2020' }
      },
      json: true
    });
  });

  test('should get deployment successfully', async () => {
    const mockResponse = { id: 'dep-123', status: 'running' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getDeployment')
      .mockReturnValueOnce('dep-123');

    const result = await executeDeploymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.deno.com/v1/deployments/dep-123',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      json: true
    });
  });

  test('should delete deployment successfully', async () => {
    const mockResponse = { success: true };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteDeployment')
      .mockReturnValueOnce('dep-123');

    const result = await executeDeploymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://api.deno.com/v1/deployments/dep-123',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      json: true
    });
  });

  test('should redeploy deployment successfully', async () => {
    const mockResponse = { id: 'dep-124', status: 'deploying' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('redeployDeployment')
      .mockReturnValueOnce('dep-123');

    const result = await executeDeploymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.deno.com/v1/deployments/dep-123/redeploy',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      json: true
    });
  });
});

describe('Domain Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				bearerToken: 'test-token',
				baseUrl: 'https://api.deno.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should list domains successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('listDomains')
			.mockReturnValueOnce('project123');
		
		const mockResponse = [{ id: 'domain1', name: 'example.com' }];
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeDomainOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.deno.com/v1/projects/project123/domains',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should create domain successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createDomain')
			.mockReturnValueOnce('project123')
			.mockReturnValueOnce('example.com');

		const mockResponse = { id: 'domain1', name: 'example.com' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeDomainOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.deno.com/v1/projects/project123/domains',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			body: {
				domain: 'example.com',
			},
			json: true,
		});
	});

	it('should get domain successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getDomain')
			.mockReturnValueOnce('domain123');

		const mockResponse = { id: 'domain123', name: 'example.com' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeDomainOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.deno.com/v1/domains/domain123',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should handle errors when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listDomains');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeDomainOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result[0].json.error).toBe('API Error');
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listDomains');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(
			executeDomainOperations.call(mockExecuteFunctions, [{ json: {} }]),
		).rejects.toThrow('API Error');
	});
});

describe('KV Database Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.deno.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('listKvDatabases', () => {
    it('should list KV databases successfully', async () => {
      const mockResponse = [{ id: 'db1', description: 'Test DB' }];
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listKvDatabases')
        .mockReturnValueOnce('org123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeKvDatabaseOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle errors when listing KV databases', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listKvDatabases')
        .mockReturnValueOnce('org123');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeKvDatabaseOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('createKvDatabase', () => {
    it('should create KV database successfully', async () => {
      const mockResponse = { id: 'db1', description: 'New DB' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createKvDatabase')
        .mockReturnValueOnce('org123')
        .mockReturnValueOnce('New DB');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeKvDatabaseOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getKvDatabase', () => {
    it('should get KV database successfully', async () => {
      const mockResponse = { id: 'db1', description: 'Test DB' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getKvDatabase')
        .mockReturnValueOnce('db1');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeKvDatabaseOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('updateKvDatabase', () => {
    it('should update KV database successfully', async () => {
      const mockResponse = { id: 'db1', description: 'Updated DB' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateKvDatabase')
        .mockReturnValueOnce('db1')
        .mockReturnValueOnce('Updated DB');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeKvDatabaseOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('deleteKvDatabase', () => {
    it('should delete KV database successfully', async () => {
      const mockResponse = { success: true };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteKvDatabase')
        .mockReturnValueOnce('db1');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeKvDatabaseOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('Environment Variable Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				bearerToken: 'test-token',
				baseUrl: 'https://api.deno.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('listEnvironmentVariables', () => {
		it('should list environment variables successfully', async () => {
			const mockResponse = [{ key: 'API_KEY', value: 'secret' }];
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listEnvironmentVariables')
				.mockReturnValueOnce('test-project-id');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEnvironmentVariableOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.deno.com/v1/projects/test-project-id/env',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors when listing environment variables', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listEnvironmentVariables')
				.mockReturnValueOnce('test-project-id');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeEnvironmentVariableOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('createEnvironmentVariable', () => {
		it('should create environment variable successfully', async () => {
			const mockResponse = { key: 'NEW_VAR', value: 'new-value' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createEnvironmentVariable')
				.mockReturnValueOnce('test-project-id')
				.mockReturnValueOnce('NEW_VAR')
				.mockReturnValueOnce('new-value');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEnvironmentVariableOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.deno.com/v1/projects/test-project-id/env',
				headers: {
					Authorization: 'Bearer test-token',
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
			const mockResponse = { key: 'API_KEY', value: 'secret' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEnvironmentVariable')
				.mockReturnValueOnce('test-project-id')
				.mockReturnValueOnce('API_KEY');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEnvironmentVariableOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.deno.com/v1/projects/test-project-id/env/API_KEY',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('updateEnvironmentVariable', () => {
		it('should update environment variable successfully', async () => {
			const mockResponse = { key: 'API_KEY', value: 'updated-secret' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateEnvironmentVariable')
				.mockReturnValueOnce('test-project-id')
				.mockReturnValueOnce('API_KEY')
				.mockReturnValueOnce('updated-secret');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEnvironmentVariableOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PATCH',
				url: 'https://api.deno.com/v1/projects/test-project-id/env/API_KEY',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					value: 'updated-secret',
				},
				json: true,
			});
		});
	});

	describe('deleteEnvironmentVariable', () => {
		it('should delete environment variable successfully', async () => {
			const mockResponse = { success: true };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteEnvironmentVariable')
				.mockReturnValueOnce('test-project-id')
				.mockReturnValueOnce('API_KEY');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeEnvironmentVariableOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.deno.com/v1/projects/test-project-id/env/API_KEY',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});
});

describe('Organization Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				bearerToken: 'test-token',
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

	test('listOrganizations should return organizations list', async () => {
		const mockOrganizations = [
			{ id: 'org1', name: 'Organization 1' },
			{ id: 'org2', name: 'Organization 2' },
		];
		
		mockExecuteFunctions.getNodeParameter.mockReturnValue('listOrganizations');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockOrganizations);

		const result = await executeOrganizationOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toEqual([
			{ json: mockOrganizations, pairedItem: { item: 0 } },
		]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.deno.com/v1/organizations',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	test('getOrganization should return organization details', async () => {
		const mockOrganization = { id: 'org1', name: 'Test Organization' };
		
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getOrganization')
			.mockReturnValueOnce('org1');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockOrganization);

		const result = await executeOrganizationOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toEqual([
			{ json: mockOrganization, pairedItem: { item: 0 } },
		]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.deno.com/v1/organizations/org1',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	test('updateOrganization should update organization', async () => {
		const mockUpdatedOrganization = { id: 'org1', name: 'Updated Organization' };
		
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updateOrganization')
			.mockReturnValueOnce('org1')
			.mockReturnValueOnce('Updated Organization');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockUpdatedOrganization);

		const result = await executeOrganizationOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toEqual([
			{ json: mockUpdatedOrganization, pairedItem: { item: 0 } },
		]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'PATCH',
			url: 'https://api.deno.com/v1/organizations/org1',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			body: {
				name: 'Updated Organization',
			},
			json: true,
		});
	});

	test('listMembers should return organization members', async () => {
		const mockMembers = [
			{ id: 'user1', email: 'user1@example.com', role: 'admin' },
			{ id: 'user2', email: 'user2@example.com', role: 'member' },
		];
		
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('listMembers')
			.mockReturnValueOnce('org1');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockMembers);

		const result = await executeOrganizationOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toEqual([
			{ json: mockMembers, pairedItem: { item: 0 } },
		]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.deno.com/v1/organizations/org1/members',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	test('inviteMember should invite new member', async () => {
		const mockInvite = { id: 'invite1', email: 'newuser@example.com', role: 'member' };
		
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('inviteMember')
			.mockReturnValueOnce('org1')
			.mockReturnValueOnce('newuser@example.com')
			.mockReturnValueOnce('member');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockInvite);

		const result = await executeOrganizationOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toEqual([
			{ json: mockInvite, pairedItem: { item: 0 } },
		]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://api.deno.com/v1/organizations/org1/invites',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			body: {
				email: 'newuser@example.com',
				role: 'member',
			},
			json: true,
		});
	});

	test('should handle errors gracefully', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('listOrganizations');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeOrganizationOperations.call(
			mockExecuteFunctions,
			[{ json: {} }],
		);

		expect(result).toEqual([
			{ json: { error: 'API Error' }, pairedItem: { item: 0 } },
		]);
	});

	test('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

		await expect(
			executeOrganizationOperations.call(mockExecuteFunctions, [{ json: {} }]),
		).rejects.toThrow('Unknown operation: unknownOperation');
	});
});
});
