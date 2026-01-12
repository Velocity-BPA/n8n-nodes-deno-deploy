/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	parseEnvVars,
	parseAssets,
	parseDatabaseBindings,
	validateDateTime,
	formatDateTime,
} from '../../nodes/DenoDeploy/GenericFunctions';
import type { IDataObject } from 'n8n-workflow';

describe('GenericFunctions', () => {
	describe('parseEnvVars', () => {
		it('should parse environment variables correctly', () => {
			const envVars: IDataObject[] = [
				{ key: 'API_KEY', value: 'secret123' },
				{ key: 'DEBUG', value: 'true' },
			];

			const result = parseEnvVars(envVars);

			expect(result).toEqual({
				API_KEY: 'secret123',
				DEBUG: 'true',
			});
		});

		it('should handle empty array', () => {
			const result = parseEnvVars([]);
			expect(result).toEqual({});
		});

		it('should handle missing values', () => {
			const envVars: IDataObject[] = [{ key: 'EMPTY_VAR' }];

			const result = parseEnvVars(envVars);

			expect(result).toEqual({
				EMPTY_VAR: '',
			});
		});

		it('should skip entries without keys', () => {
			const envVars: IDataObject[] = [
				{ value: 'orphan_value' },
				{ key: 'VALID_KEY', value: 'valid_value' },
			];

			const result = parseEnvVars(envVars);

			expect(result).toEqual({
				VALID_KEY: 'valid_value',
			});
		});
	});

	describe('parseAssets', () => {
		it('should parse assets correctly', () => {
			const assets = [
				{ path: 'main.ts', content: 'console.log("hello");', encoding: 'utf-8' },
				{ path: 'utils/helper.ts', content: 'export const helper = () => {};' },
			];

			const result = parseAssets(assets);

			expect(result).toEqual({
				'main.ts': { kind: 'file', content: 'console.log("hello");', encoding: 'utf-8' },
				'utils/helper.ts': { kind: 'file', content: 'export const helper = () => {};', encoding: 'utf-8' },
			});
		});

		it('should default encoding to utf-8', () => {
			const assets = [{ path: 'index.ts', content: 'export default {};' }];

			const result = parseAssets(assets);

			expect(result['index.ts'].encoding).toBe('utf-8');
		});

		it('should handle empty array', () => {
			const result = parseAssets([]);
			expect(result).toEqual({});
		});
	});

	describe('parseDatabaseBindings', () => {
		it('should parse database bindings correctly', () => {
			const bindings = [
				{ name: 'primaryDb', databaseId: 'db_123' },
				{ name: 'cacheDb', databaseId: 'db_456' },
			];

			const result = parseDatabaseBindings(bindings);

			expect(result).toEqual({
				primaryDb: 'db_123',
				cacheDb: 'db_456',
			});
		});

		it('should skip incomplete bindings', () => {
			const bindings = [
				{ name: 'valid', databaseId: 'db_123' },
				{ name: '', databaseId: 'db_456' },
				{ name: 'noId', databaseId: '' },
			];

			const result = parseDatabaseBindings(bindings);

			expect(result).toEqual({
				valid: 'db_123',
			});
		});

		it('should handle empty array', () => {
			const result = parseDatabaseBindings([]);
			expect(result).toEqual({});
		});
	});

	describe('validateDateTime', () => {
		it('should return true for valid ISO 8601 dates', () => {
			expect(validateDateTime('2024-01-15T10:30:00Z')).toBe(true);
			expect(validateDateTime('2024-01-15T10:30:00.000Z')).toBe(true);
			expect(validateDateTime('2024-01-15')).toBe(true);
		});

		it('should return false for invalid dates', () => {
			expect(validateDateTime('invalid-date')).toBe(false);
			expect(validateDateTime('not a date')).toBe(false);
		});
	});

	describe('formatDateTime', () => {
		it('should format date strings to ISO 8601', () => {
			const result = formatDateTime('2024-01-15');
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
		});

		it('should format Date objects to ISO 8601', () => {
			const date = new Date('2024-01-15T10:30:00Z');
			const result = formatDateTime(date);
			expect(result).toBe('2024-01-15T10:30:00.000Z');
		});
	});
});

describe('Node Definitions', () => {
	describe('DenoDeploy', () => {
		it('should have correct node metadata', async () => {
			const { DenoDeploy } = await import('../../nodes/DenoDeploy/DenoDeploy.node');
			const node = new DenoDeploy();

			expect(node.description.displayName).toBe('Deno Deploy');
			expect(node.description.name).toBe('denoDeploy');
			expect(node.description.group).toContain('transform');
			expect(node.description.version).toBe(1);
		});

		it('should have required credentials', async () => {
			const { DenoDeploy } = await import('../../nodes/DenoDeploy/DenoDeploy.node');
			const node = new DenoDeploy();

			expect(node.description.credentials).toHaveLength(1);
			expect(node.description.credentials![0].name).toBe('denoDeployApi');
			expect(node.description.credentials![0].required).toBe(true);
		});

		it('should have all required resources', async () => {
			const { DenoDeploy } = await import('../../nodes/DenoDeploy/DenoDeploy.node');
			const node = new DenoDeploy();

			const resourceProperty = node.description.properties.find((p) => p.name === 'resource');
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty!.type).toBe('options');

			const resourceOptions = (resourceProperty!.options as Array<{ value: string }>).map(
				(o) => o.value,
			);
			expect(resourceOptions).toContain('organization');
			expect(resourceOptions).toContain('project');
			expect(resourceOptions).toContain('deployment');
			expect(resourceOptions).toContain('domain');
			expect(resourceOptions).toContain('kvDatabase');
			expect(resourceOptions).toContain('buildLog');
			expect(resourceOptions).toContain('appLog');
			expect(resourceOptions).toContain('environmentVariable');
			expect(resourceOptions).toContain('analytics');
			expect(resourceOptions).toContain('certificate');
			expect(resourceOptions).toContain('region');
			expect(resourceOptions).toContain('playground');
		});
	});

	describe('DenoDeployTrigger', () => {
		it('should have correct node metadata', async () => {
			const { DenoDeployTrigger } = await import('../../nodes/DenoDeploy/DenoDeployTrigger.node');
			const node = new DenoDeployTrigger();

			expect(node.description.displayName).toBe('Deno Deploy Trigger');
			expect(node.description.name).toBe('denoDeployTrigger');
			expect(node.description.group).toContain('trigger');
			expect(node.description.polling).toBe(true);
		});

		it('should have required event options', async () => {
			const { DenoDeployTrigger } = await import('../../nodes/DenoDeploy/DenoDeployTrigger.node');
			const node = new DenoDeployTrigger();

			const eventProperty = node.description.properties.find((p) => p.name === 'event');
			expect(eventProperty).toBeDefined();

			const eventOptions = (eventProperty!.options as Array<{ value: string }>).map((o) => o.value);
			expect(eventOptions).toContain('deployment.created');
			expect(eventOptions).toContain('deployment.success');
			expect(eventOptions).toContain('deployment.failed');
			expect(eventOptions).toContain('deployment.any');
		});
	});
});

describe('Credentials', () => {
	describe('DenoDeployApi', () => {
		it('should have correct credential metadata', async () => {
			const { DenoDeployApi } = await import('../../credentials/DenoDeployApi.credentials');
			const credential = new DenoDeployApi();

			expect(credential.name).toBe('denoDeployApi');
			expect(credential.displayName).toBe('Deno Deploy API');
		});

		it('should have required properties', async () => {
			const { DenoDeployApi } = await import('../../credentials/DenoDeployApi.credentials');
			const credential = new DenoDeployApi();

			const propertyNames = credential.properties.map((p) => p.name);
			expect(propertyNames).toContain('accessToken');
			expect(propertyNames).toContain('organizationId');
		});

		it('should have proper authentication setup', async () => {
			const { DenoDeployApi } = await import('../../credentials/DenoDeployApi.credentials');
			const credential = new DenoDeployApi();

			expect(credential.authenticate).toBeDefined();
			expect(credential.authenticate.type).toBe('generic');
		});

		it('should have credential test endpoint', async () => {
			const { DenoDeployApi } = await import('../../credentials/DenoDeployApi.credentials');
			const credential = new DenoDeployApi();

			expect(credential.test).toBeDefined();
			expect(credential.test.request.baseURL).toBe('https://api.deno.com/v1');
		});
	});
});
