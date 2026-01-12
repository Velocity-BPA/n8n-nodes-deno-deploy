/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const analyticsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['analytics'],
			},
		},
		options: [
			{
				name: 'Get Deployment Analytics',
				value: 'getDeployment',
				description: 'Get analytics for a specific deployment',
				action: 'Get deployment analytics',
			},
			{
				name: 'Get Organization Analytics',
				value: 'getOrganization',
				description: 'Get organization-level analytics',
				action: 'Get organization analytics',
			},
			{
				name: 'Get Project Analytics',
				value: 'getProject',
				description: 'Get project-level analytics',
				action: 'Get project analytics',
			},
		],
		default: 'getOrganization',
	},
];

export const analyticsFields: INodeProperties[] = [
	// Project ID (for project and deployment analytics)
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getProject', 'getDeployment'],
			},
		},
		default: '',
		description: 'The ID of the project',
	},
	// Deployment ID (for deployment analytics)
	{
		displayName: 'Deployment ID',
		name: 'deploymentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getDeployment'],
			},
		},
		default: '',
		description: 'The ID of the deployment',
	},
	// Since (required for all)
	{
		displayName: 'Since',
		name: 'since',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['analytics'],
			},
		},
		default: '',
		description: 'Start of the analytics period (ISO 8601 format)',
	},
	// Until (required for all)
	{
		displayName: 'Until',
		name: 'until',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['analytics'],
			},
		},
		default: '',
		description: 'End of the analytics period (ISO 8601 format)',
	},
];
