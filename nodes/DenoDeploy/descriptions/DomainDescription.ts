/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const domainOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['domain'],
			},
		},
		options: [
			{
				name: 'Add',
				value: 'add',
				description: 'Add a custom domain to a project',
				action: 'Add a domain',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove a domain from a project',
				action: 'Delete a domain',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get domain details',
				action: 'Get a domain',
			},
			{
				name: 'Get Certificates',
				value: 'getCertificates',
				description: 'Get TLS certificates for a domain',
				action: 'Get domain certificates',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all domains for a project',
				action: 'List all domains',
			},
			{
				name: 'Provision Certificate',
				value: 'provisionCertificate',
				description: 'Provision a TLS certificate for a domain',
				action: 'Provision TLS certificate',
			},
			{
				name: 'Verify',
				value: 'verify',
				description: 'Verify domain ownership',
				action: 'Verify a domain',
			},
		],
		default: 'list',
	},
];

export const domainFields: INodeProperties[] = [
	// Project ID (used by all operations)
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['domain'],
			},
		},
		default: '',
		description: 'The ID of the project',
	},
	// Domain ID (used by get, delete, verify, getCertificates, provisionCertificate)
	{
		displayName: 'Domain ID',
		name: 'domainId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['domain'],
				operation: ['get', 'delete', 'verify', 'getCertificates', 'provisionCertificate'],
			},
		},
		default: '',
		description: 'The ID of the domain',
	},
	// Add: Domain name
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['domain'],
				operation: ['add'],
			},
		},
		default: '',
		placeholder: 'app.example.com',
		description: 'The domain name to add (e.g., app.example.com)',
	},
	// List options
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['domain'],
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
				resource: ['domain'],
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
