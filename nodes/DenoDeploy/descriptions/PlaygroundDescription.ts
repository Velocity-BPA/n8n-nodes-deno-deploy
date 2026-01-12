/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const playgroundOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['playground'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a playground deployment',
				action: 'Create a playground',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a playground',
				action: 'Delete a playground',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get playground details',
				action: 'Get playground details',
			},
		],
		default: 'create',
	},
];

export const playgroundFields: INodeProperties[] = [
	// Playground ID (for get and delete)
	{
		displayName: 'Playground ID',
		name: 'playgroundId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['playground'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the playground',
	},
	// Create: Code
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
				resource: ['playground'],
				operation: ['create'],
			},
		},
		default: 'Deno.serve((req) => new Response("Hello from Deno Playground!"));',
		description: 'The JavaScript/TypeScript code to execute',
	},
	// Create: Options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['playground'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Entry Point',
				name: 'entryPoint',
				type: 'string',
				default: 'main.ts',
				description: 'Entry point file path',
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
				description: 'Environment variables for the playground',
			},
		],
	},
];
