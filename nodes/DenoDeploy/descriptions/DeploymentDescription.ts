/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const deploymentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deployment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new deployment',
				action: 'Create a deployment',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a deployment',
				action: 'Delete a deployment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a deployment by ID',
				action: 'Get a deployment',
			},
			{
				name: 'Get App Logs',
				value: 'getAppLogs',
				description: 'Get application logs for a deployment',
				action: 'Get application logs',
			},
			{
				name: 'Get Build Logs',
				value: 'getBuildLogs',
				description: 'Get build logs for a deployment',
				action: 'Get build logs',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all deployments for a project',
				action: 'List all deployments',
			},
			{
				name: 'Redeploy',
				value: 'redeploy',
				description: 'Create a new deployment from an existing one',
				action: 'Redeploy an existing deployment',
			},
		],
		default: 'list',
	},
];

export const deploymentFields: INodeProperties[] = [
	// Project ID (used by all operations)
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['deployment'],
			},
		},
		default: '',
		description: 'The ID of the project',
	},
	// Deployment ID (used by get, delete, redeploy, getBuildLogs, getAppLogs)
	{
		displayName: 'Deployment ID',
		name: 'deploymentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['deployment'],
				operation: ['get', 'delete', 'redeploy', 'getBuildLogs', 'getAppLogs'],
			},
		},
		default: '',
		description: 'The ID of the deployment',
	},
	// Create: Code input method
	{
		displayName: 'Code Input Method',
		name: 'codeInputMethod',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['deployment'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Inline Code',
				value: 'inline',
				description: 'Enter the code directly',
			},
			{
				name: 'URL',
				value: 'url',
				description: 'Provide a URL to the entry point',
			},
		],
		default: 'inline',
		description: 'How to provide the deployment code',
	},
	// Create: Inline code
	{
		displayName: 'Code',
		name: 'code',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['deployment'],
				operation: ['create'],
				codeInputMethod: ['inline'],
			},
		},
		default: 'Deno.serve((req) => new Response("Hello from Deno Deploy!"));',
		description: 'The JavaScript/TypeScript code for the deployment',
	},
	// Create: Entry point URL
	{
		displayName: 'Entry Point URL',
		name: 'entryPointUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['deployment'],
				operation: ['create'],
				codeInputMethod: ['url'],
			},
		},
		default: '',
		placeholder: 'https://example.com/main.ts',
		description: 'URL to the entry point file',
	},
	// Create: Additional options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['deployment'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the deployment',
			},
			{
				displayName: 'Environment Variables',
				name: 'envVars',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'envVar',
						displayName: 'Environment Variable',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'Name of the environment variable',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value of the environment variable',
							},
						],
					},
				],
				description: 'Environment variables for the deployment',
			},
			{
				displayName: 'Database Bindings',
				name: 'databases',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'binding',
						displayName: 'Database Binding',
						values: [
							{
								displayName: 'Binding Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Name to use for the database binding in code',
							},
							{
								displayName: 'Database ID',
								name: 'databaseId',
								type: 'string',
								default: '',
								description: 'ID of the KV database to bind',
							},
						],
					},
				],
				description: 'KV database bindings for the deployment',
			},
			{
				displayName: 'Compiler Options',
				name: 'compilerOptions',
				type: 'collection',
				placeholder: 'Add Compiler Option',
				default: {},
				options: [
					{
						displayName: 'JSX',
						name: 'jsx',
						type: 'options',
						options: [
							{ name: 'JSX', value: 'jsx' },
							{ name: 'React JSX', value: 'react-jsx' },
							{ name: 'React JSXDev', value: 'react-jsxdev' },
							{ name: 'Precompile', value: 'precompile' },
						],
						default: 'react-jsx',
						description: 'JSX transform mode',
					},
					{
						displayName: 'JSX Factory',
						name: 'jsxFactory',
						type: 'string',
						default: '',
						description: 'JSX factory function (e.g., React.createElement)',
					},
					{
						displayName: 'JSX Fragment Factory',
						name: 'jsxFragmentFactory',
						type: 'string',
						default: '',
						description: 'JSX fragment factory function (e.g., React.Fragment)',
					},
					{
						displayName: 'JSX Import Source',
						name: 'jsxImportSource',
						type: 'string',
						default: '',
						description: 'Module specifier for JSX imports (e.g., react)',
					},
				],
				description: 'TypeScript compiler options',
			},
		],
	},
	// Create: Additional assets
	{
		displayName: 'Additional Assets',
		name: 'assets',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['deployment'],
				operation: ['create'],
				codeInputMethod: ['inline'],
			},
		},
		default: {},
		options: [
			{
				name: 'asset',
				displayName: 'Asset',
				values: [
					{
						displayName: 'File Path',
						name: 'path',
						type: 'string',
						default: '',
						placeholder: 'utils/helper.ts',
						description: 'Path for the file in the deployment',
					},
					{
						displayName: 'Content',
						name: 'content',
						type: 'string',
						typeOptions: {
							rows: 5,
						},
						default: '',
						description: 'Content of the file',
					},
					{
						displayName: 'Encoding',
						name: 'encoding',
						type: 'options',
						options: [
							{ name: 'UTF-8', value: 'utf-8' },
							{ name: 'Base64', value: 'base64' },
						],
						default: 'utf-8',
						description: 'Encoding of the content',
					},
				],
			},
		],
		description: 'Additional files to include in the deployment',
	},
	// Redeploy options
	{
		displayName: 'Redeploy Options',
		name: 'redeployOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['deployment'],
				operation: ['redeploy'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New description for the redeployment',
			},
		],
	},
	// Get Build Logs options
	{
		displayName: 'Options',
		name: 'buildLogOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['deployment'],
				operation: ['getBuildLogs'],
			},
		},
		options: [
			{
				displayName: 'Level',
				name: 'level',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Debug', value: 'debug' },
					{ name: 'Info', value: 'info' },
					{ name: 'Warning', value: 'warning' },
					{ name: 'Error', value: 'error' },
				],
				default: '',
				description: 'Filter logs by level',
			},
			{
				displayName: 'Cursor',
				name: 'cursor',
				type: 'string',
				default: '',
				description: 'Pagination cursor for fetching more logs',
			},
		],
	},
	// Get App Logs options
	{
		displayName: 'Options',
		name: 'appLogOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['deployment'],
				operation: ['getAppLogs'],
			},
		},
		options: [
			{
				displayName: 'Since',
				name: 'since',
				type: 'dateTime',
				default: '',
				description: 'Start time for log retrieval',
			},
			{
				displayName: 'Until',
				name: 'until',
				type: 'dateTime',
				default: '',
				description: 'End time for log retrieval',
			},
			{
				displayName: 'Level',
				name: 'level',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Debug', value: 'debug' },
					{ name: 'Info', value: 'info' },
					{ name: 'Warning', value: 'warning' },
					{ name: 'Error', value: 'error' },
				],
				default: '',
				description: 'Filter logs by level',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				default: '',
				description: 'Filter logs by region',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				default: 100,
				description: 'Maximum number of logs to return',
			},
			{
				displayName: 'Cursor',
				name: 'cursor',
				type: 'string',
				default: '',
				description: 'Pagination cursor for fetching more logs',
			},
		],
	},
	// List options
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['deployment'],
				operation: ['list'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['deployment'],
				operation: ['list'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
];
