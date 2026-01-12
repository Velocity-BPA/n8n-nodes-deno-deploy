/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IPollFunctions,
	IHttpRequestMethods,
	IRequestOptions,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import type { IDenoDeployCredentials } from './types/DenoDeployTypes';

const API_BASE_URL = 'https://api.deno.com/v1';

/**
 * Logs the Velocity BPA licensing notice once per node load
 */
let licensingNoticeLogged = false;
export function logLicensingNotice(context: IExecuteFunctions | IPollFunctions): void {
	if (!licensingNoticeLogged) {
		context.logger.warn(
			'[Velocity BPA Licensing Notice] This n8n node is licensed under the Business Source License 1.1 (BSL 1.1). ' +
			'Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA. ' +
			'For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.'
		);
		licensingNoticeLogged = true;
	}
}

/**
 * Makes an authenticated request to the Deno Deploy API
 */
export async function denoDeployApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('denoDeployApi') as IDenoDeployCredentials;

	const options: IRequestOptions = {
		method,
		uri: `${API_BASE_URL}${endpoint}`,
		headers: {
			'Authorization': `Bearer ${credentials.accessToken}`,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	if (query && Object.keys(query).length > 0) {
		options.qs = query;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject | IDataObject[];
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: getErrorMessage(error),
		});
	}
}

/**
 * Makes a paginated request to the Deno Deploy API and returns all items
 */
export async function denoDeployApiRequestAllItems(
	this: IExecuteFunctions | IHookFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let page = 1;
	const limit = 100;
	let hasMore = true;

	while (hasMore) {
		const qs: IDataObject = { ...query, page, limit };
		const response = await denoDeployApiRequest.call(this, method, endpoint, body, qs);

		if (Array.isArray(response)) {
			returnData.push(...response);
			hasMore = response.length >= limit;
		} else if (response && typeof response === 'object') {
			// Handle responses with data key
			const dataKey = findDataKey(response);
			if (dataKey && Array.isArray(response[dataKey])) {
				const items = response[dataKey] as IDataObject[];
				returnData.push(...items);
				hasMore = items.length >= limit;
			} else {
				// Single item response
				returnData.push(response);
				hasMore = false;
			}
		} else {
			hasMore = false;
		}

		page++;
	}

	return returnData;
}

/**
 * Makes a cursor-based paginated request to the Deno Deploy API
 */
export async function denoDeployApiRequestWithCursor(
	this: IExecuteFunctions | IHookFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
	limit = 100,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let cursor: string | undefined;

	do {
		const qs: IDataObject = { ...query, limit };
		if (cursor) {
			qs.cursor = cursor;
		}

		const response = await denoDeployApiRequest.call(this, method, endpoint, body, qs) as IDataObject;

		if (Array.isArray(response)) {
			returnData.push(...response);
			break;
		}

		const dataKey = findDataKey(response);
		if (dataKey && Array.isArray(response[dataKey])) {
			const items = response[dataKey] as IDataObject[];
			returnData.push(...items);
		}

		cursor = response.nextCursor as string | undefined;
	} while (cursor);

	return returnData;
}

/**
 * Finds the data key in a paginated response
 */
function findDataKey(response: IDataObject): string | undefined {
	const possibleKeys = ['data', 'items', 'results', 'deployments', 'projects', 'domains', 'databases', 'logs', 'certificates', 'regions'];
	for (const key of possibleKeys) {
		if (Array.isArray(response[key])) {
			return key;
		}
	}
	return undefined;
}

/**
 * Extracts a meaningful error message from the API error response
 */
function getErrorMessage(error: unknown): string {
	if (error && typeof error === 'object') {
		const err = error as Record<string, unknown>;
		if (err.message && typeof err.message === 'string') {
			return err.message;
		}
		if (err.error && typeof err.error === 'object') {
			const innerError = err.error as Record<string, unknown>;
			if (innerError.message && typeof innerError.message === 'string') {
				return innerError.message;
			}
		}
		if (err.code && typeof err.code === 'string') {
			return `API Error: ${err.code}`;
		}
	}
	return 'An unknown error occurred';
}

/**
 * Gets the organization ID from credentials
 */
export async function getOrganizationId(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IPollFunctions,
): Promise<string> {
	const credentials = await this.getCredentials('denoDeployApi') as IDenoDeployCredentials;
	return credentials.organizationId;
}

/**
 * Validates an ISO 8601 datetime string
 */
export function validateDateTime(value: string): boolean {
	const date = new Date(value);
	return !isNaN(date.getTime());
}

/**
 * Formats a datetime string to ISO 8601
 */
export function formatDateTime(value: string | Date): string {
	const date = typeof value === 'string' ? new Date(value) : value;
	return date.toISOString();
}

/**
 * Parses environment variables from n8n format to API format
 */
export function parseEnvVars(envVars: IDataObject[]): Record<string, string> {
	const result: Record<string, string> = {};
	for (const envVar of envVars) {
		if (envVar.key && typeof envVar.key === 'string') {
			result[envVar.key] = String(envVar.value || '');
		}
	}
	return result;
}

/**
 * Parses asset files for deployment
 */
export function parseAssets(
	assets: Array<{ path: string; content: string; encoding?: string }>,
): Record<string, { kind: string; content: string; encoding: string }> {
	const result: Record<string, { kind: string; content: string; encoding: string }> = {};
	for (const asset of assets) {
		result[asset.path] = {
			kind: 'file',
			content: asset.content,
			encoding: asset.encoding || 'utf-8',
		};
	}
	return result;
}

/**
 * Parses database bindings for deployment
 */
export function parseDatabaseBindings(
	bindings: Array<{ name: string; databaseId: string }>,
): Record<string, string> {
	const result: Record<string, string> = {};
	for (const binding of bindings) {
		if (binding.name && binding.databaseId) {
			result[binding.name] = binding.databaseId;
		}
	}
	return result;
}

/**
 * Sleep utility for rate limiting
 */
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Implements exponential backoff for rate limit handling
 */
export async function withRetry<T>(
	fn: () => Promise<T>,
	maxRetries = 5,
	baseDelay = 1000,
): Promise<T> {
	let lastError: Error | undefined;

	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error as Error;
			const errorObj = error as { statusCode?: number; response?: { headers?: Record<string, string> } };

			if (errorObj.statusCode === 429) {
				const retryAfter = errorObj.response?.headers?.['retry-after'];
				const delay = retryAfter
					? parseInt(retryAfter, 10) * 1000
					: Math.min(baseDelay * Math.pow(2, attempt), 60000);
				await sleep(delay);
			} else {
				throw error;
			}
		}
	}

	throw lastError;
}
