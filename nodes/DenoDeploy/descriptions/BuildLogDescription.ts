/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const buildLogOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['buildLog'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get build logs for a deployment',
				action: 'Get build logs',
			},
		],
		default: 'get',
	},
];

export const buildLogFields: INodeProperties[] = [
	// Project ID
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['buildLog'],
			},
		},
		default: '',
		description: 'The ID of the project',
	},
	// Deployment ID
	{
		displayName: 'Deployment ID',
		name: 'deploymentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['buildLog'],
			},
		},
		default: '',
		description: 'The ID of the deployment',
	},
	// Options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['buildLog'],
				operation: ['get'],
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
];
