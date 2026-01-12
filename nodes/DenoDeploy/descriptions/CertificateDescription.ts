/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const certificateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['certificate'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get certificate details',
				action: 'Get certificate details',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List certificates for a domain',
				action: 'List certificates',
			},
			{
				name: 'Provision',
				value: 'provision',
				description: 'Provision a new TLS certificate',
				action: 'Provision certificate',
			},
		],
		default: 'list',
	},
];

export const certificateFields: INodeProperties[] = [
	// Project ID
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['certificate'],
			},
		},
		default: '',
		description: 'The ID of the project',
	},
	// Domain ID
	{
		displayName: 'Domain ID',
		name: 'domainId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['certificate'],
			},
		},
		default: '',
		description: 'The ID of the domain',
	},
	// Certificate ID (for get)
	{
		displayName: 'Certificate ID',
		name: 'certificateId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The ID of the certificate',
	},
];
