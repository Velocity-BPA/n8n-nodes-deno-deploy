/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const environmentVariableOperations: INodeProperties[] = [
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
				name: 'Delete',
				value: 'delete',
				description: 'Delete an environment variable',
				action: 'Delete an environment variable',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all environment variables for a project',
				action: 'List all environment variables',
			},
			{
				name: 'Set',
				value: 'set',
				description: 'Set environment variables',
				action: 'Set environment variables',
			},
		],
		default: 'list',
	},
];

export const environmentVariableFields: INodeProperties[] = [
	// Project ID
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['environmentVariable'],
			},
		},
		default: '',
		description: 'The ID of the project',
	},
	// Delete: Key
	{
		displayName: 'Key',
		name: 'key',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['environmentVariable'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'The name of the environment variable to delete',
	},
	// Set: Environment variables
	{
		displayName: 'Environment Variables',
		name: 'envVars',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['environmentVariable'],
				operation: ['set'],
			},
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
		description: 'Environment variables to set',
	},
];
