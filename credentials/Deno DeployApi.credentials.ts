import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DenoDeployApi implements ICredentialType {
	name = 'denoDeployApi';
	displayName = 'Deno Deploy API';
	documentationUrl = 'https://docs.deno.com/deploy/api';
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
			description: 'The personal access token for Deno Deploy API authentication',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.deno.com/v1',
			required: true,
			description: 'The base URL for the Deno Deploy API',
		},
	];
}