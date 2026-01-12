/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DenoDeployApi implements ICredentialType {
	name = 'denoDeployApi';
	displayName = 'Deno Deploy API';
	documentationUrl = 'https://docs.deno.com/deploy/api/';
	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Access token from Deno Deploy Dashboard (Account Settings > Access Tokens)',
		},
		{
			displayName: 'Organization ID',
			name: 'organizationId',
			type: 'string',
			default: '',
			required: true,
			description: 'Organization ID visible in the dashboard URL (e.g., dash.deno.com/orgs/{organizationId})',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.deno.com/v1',
			url: '=/organizations/{{$credentials.organizationId}}',
			method: 'GET',
		},
	};
}
