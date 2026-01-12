/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const regionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['region'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List all available deployment regions',
				action: 'List all regions',
			},
		],
		default: 'list',
	},
];

export const regionFields: INodeProperties[] = [
	// No additional fields needed for listing regions
];
