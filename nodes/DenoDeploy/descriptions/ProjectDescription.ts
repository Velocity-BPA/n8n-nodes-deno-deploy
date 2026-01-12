/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new project',
				action: 'Create a project',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a project',
				action: 'Delete a project',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a project by ID',
				action: 'Get a project',
			},
			{
				name: 'Get Analytics',
				value: 'getAnalytics',
				description: 'Get project analytics',
				action: 'Get project analytics',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all projects in the organization',
				action: 'List all projects',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a project',
				action: 'Update a project',
			},
		],
		default: 'list',
	},
];

export const projectFields: INodeProperties[] = [
	// Project ID field (used by multiple operations)
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['get', 'update', 'delete', 'getAnalytics'],
			},
		},
		default: '',
		description: 'The ID of the project',
	},
	// Create fields
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The name of the project (must be unique within the organization)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the project',
			},
		],
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
				resource: ['project'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the project',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New description for the project',
			},
		],
	},
	// Get Analytics fields
	{
		displayName: 'Since',
		name: 'since',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['project'],
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
				resource: ['project'],
				operation: ['getAnalytics'],
			},
		},
		default: '',
		description: 'End of the analytics period (ISO 8601 format)',
	},
	// List options
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['project'],
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
				resource: ['project'],
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
