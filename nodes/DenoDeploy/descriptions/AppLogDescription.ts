/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const appLogOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['appLog'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get application runtime logs',
				action: 'Get application logs',
			},
			{
				name: 'Query',
				value: 'query',
				description: 'Query logs with filters',
				action: 'Query application logs',
			},
		],
		default: 'get',
	},
];

export const appLogFields: INodeProperties[] = [
	// Project ID
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['appLog'],
			},
		},
		default: '',
		description: 'The ID of the project',
	},
	// Deployment ID (optional for get, required for query)
	{
		displayName: 'Deployment ID',
		name: 'deploymentId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['appLog'],
			},
		},
		default: '',
		description: 'Filter logs by deployment ID',
	},
	// Query fields
	{
		displayName: 'Since',
		name: 'since',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['appLog'],
				operation: ['query'],
			},
		},
		default: '',
		description: 'Start time for log retrieval',
	},
	{
		displayName: 'Until',
		name: 'until',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['appLog'],
				operation: ['query'],
			},
		},
		default: '',
		description: 'End time for log retrieval',
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
				resource: ['appLog'],
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
];
