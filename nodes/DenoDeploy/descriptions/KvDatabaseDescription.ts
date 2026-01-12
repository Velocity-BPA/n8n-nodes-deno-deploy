/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const kvDatabaseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['kvDatabase'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new KV database',
				action: 'Create a KV database',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a KV database',
				action: 'Delete a KV database',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a KV database by ID',
				action: 'Get a KV database',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all KV databases in the organization',
				action: 'List all KV databases',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a KV database',
				action: 'Update a KV database',
			},
		],
		default: 'list',
	},
];

export const kvDatabaseFields: INodeProperties[] = [
	// Database ID (used by get, update, delete)
	{
		displayName: 'Database ID',
		name: 'databaseId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['kvDatabase'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the KV database',
	},
	// Create: Description
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['kvDatabase'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'A description for the KV database',
	},
	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['kvDatabase'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New description for the KV database',
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
				resource: ['kvDatabase'],
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
				resource: ['kvDatabase'],
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
