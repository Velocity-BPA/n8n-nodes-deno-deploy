/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Integration tests for Deno Deploy n8n node
 *
 * These tests require a valid Deno Deploy API token and organization ID.
 * Set the following environment variables before running:
 *
 * - DENO_DEPLOY_ACCESS_TOKEN: Your Deno Deploy access token
 * - DENO_DEPLOY_ORGANIZATION_ID: Your organization ID
 *
 * Run with: DENO_DEPLOY_ACCESS_TOKEN=xxx DENO_DEPLOY_ORGANIZATION_ID=xxx npm run test:integration
 */

const hasCredentials = !!(
	process.env.DENO_DEPLOY_ACCESS_TOKEN && process.env.DENO_DEPLOY_ORGANIZATION_ID
);

// Check if we can reach the API (for CI/CD environments with network restrictions)
let networkAvailable = false;

// Helper for conditional test execution
const itIf = (condition: boolean) => (condition ? it : it.skip);

describe('Deno Deploy Integration Tests', () => {
	beforeAll(async () => {
		if (!hasCredentials) {
			console.log(
				'⚠️  Skipping integration tests: DENO_DEPLOY_ACCESS_TOKEN and DENO_DEPLOY_ORGANIZATION_ID required',
			);
		}

		// Check network availability
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5000);
			await fetch('https://api.deno.com/v1/regions', {
				signal: controller.signal,
				headers: { Authorization: 'Bearer test' },
			});
			clearTimeout(timeoutId);
			networkAvailable = true;
		} catch (error) {
			console.log('⚠️  Network not available, skipping network-dependent tests');
			networkAvailable = false;
		}
	});

	describe('API Connection', () => {
		it('should connect to Deno Deploy API', async () => {
			if (!hasCredentials || !networkAvailable) {
				console.log('Skipping: No credentials or network');
				return;
			}

			const response = await fetch(
				`https://api.deno.com/v1/organizations/${process.env.DENO_DEPLOY_ORGANIZATION_ID}`,
				{
					headers: {
						Authorization: `Bearer ${process.env.DENO_DEPLOY_ACCESS_TOKEN}`,
					},
				},
			);

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.id).toBe(process.env.DENO_DEPLOY_ORGANIZATION_ID);
		});

		it('should list projects', async () => {
			if (!hasCredentials || !networkAvailable) {
				console.log('Skipping: No credentials or network');
				return;
			}

			const response = await fetch(
				`https://api.deno.com/v1/organizations/${process.env.DENO_DEPLOY_ORGANIZATION_ID}/projects`,
				{
					headers: {
						Authorization: `Bearer ${process.env.DENO_DEPLOY_ACCESS_TOKEN}`,
					},
				},
			);

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(Array.isArray(data)).toBe(true);
		});

		it('should list regions', async () => {
			if (!hasCredentials || !networkAvailable) {
				console.log('Skipping: No credentials or network');
				return;
			}

			const response = await fetch('https://api.deno.com/v1/regions', {
				headers: {
					Authorization: `Bearer ${process.env.DENO_DEPLOY_ACCESS_TOKEN}`,
				},
			});

			expect(response.status).toBe(200);
			const data = await response.json();
			expect(Array.isArray(data)).toBe(true);
		});
	});

	describe('Error Handling', () => {
		it('should return 401 for invalid token', async () => {
			if (!networkAvailable) {
				console.log('Skipping: Network not available');
				return;
			}

			const response = await fetch('https://api.deno.com/v1/organizations/invalid-org', {
				headers: {
					Authorization: 'Bearer invalid-token',
				},
			});

			expect(response.status).toBe(401);
		});

		it('should return 404 for non-existent resource', async () => {
			if (!hasCredentials || !networkAvailable) {
				console.log('Skipping: No credentials or network');
				return;
			}

			const response = await fetch(
				'https://api.deno.com/v1/projects/non-existent-project-id-12345',
				{
					headers: {
						Authorization: `Bearer ${process.env.DENO_DEPLOY_ACCESS_TOKEN}`,
					},
				},
			);

			expect(response.status).toBe(404);
		});
	});
});
