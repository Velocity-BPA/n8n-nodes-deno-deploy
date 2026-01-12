/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const organizationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['organization'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get organization details',
				action: 'Get organization details',
			},
			{
				name: 'Get Analytics',
				value: 'getAnalytics',
				description: 'Get organization analytics',
				action: 'Get organization analytics',
			},
			{
				name: 'List Domains',
				value: 'listDomains',
				description: 'List all domains in the organization',
				action: 'List domains in organization',
			},
		],
		default: 'get',
	},
];

export const organizationFields: INodeProperties[] = [
	// Get Analytics fields
	{
		displayName: 'Since',
		name: 'since',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['getAnalytics'],
			},
		},
		default: '',
		description: 'Start of the analytics period (ISO 8601 format)',
	},
	{
		displayName: 'Until',
		name: 'until',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['getAnalytics'],
			},
		},
		default: '',
		description: 'End of the analytics period (ISO 8601 format)',
	},
	// List Domains options
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['listDomains'],
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
				resource: ['organization'],
				operation: ['listDomains'],
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
