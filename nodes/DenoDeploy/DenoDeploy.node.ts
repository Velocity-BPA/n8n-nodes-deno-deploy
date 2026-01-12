/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

import {
	denoDeployApiRequest,
	denoDeployApiRequestAllItems,
	getOrganizationId,
	parseEnvVars,
	parseAssets,
	parseDatabaseBindings,
	logLicensingNotice,
} from './GenericFunctions';

import {
	organizationOperations,
	organizationFields,
	projectOperations,
	projectFields,
	deploymentOperations,
	deploymentFields,
	domainOperations,
	domainFields,
	kvDatabaseOperations,
	kvDatabaseFields,
	buildLogOperations,
	buildLogFields,
	appLogOperations,
	appLogFields,
	environmentVariableOperations,
	environmentVariableFields,
	analyticsOperations,
	analyticsFields,
	certificateOperations,
	certificateFields,
	regionOperations,
	regionFields,
	playgroundOperations,
	playgroundFields,
} from './descriptions';

export class DenoDeploy implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Deno Deploy',
		name: 'denoDeploy',
		icon: 'file:denoDeploy.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Deno Deploy API',
		defaults: {
			name: 'Deno Deploy',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'denoDeployApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Analytics',
						value: 'analytics',
					},
					{
						name: 'App Log',
						value: 'appLog',
					},
					{
						name: 'Build Log',
						value: 'buildLog',
					},
					{
						name: 'Certificate',
						value: 'certificate',
					},
					{
						name: 'Deployment',
						value: 'deployment',
					},
					{
						name: 'Domain',
						value: 'domain',
					},
					{
						name: 'Environment Variable',
						value: 'environmentVariable',
					},
					{
						name: 'KV Database',
						value: 'kvDatabase',
					},
					{
						name: 'Organization',
						value: 'organization',
					},
					{
						name: 'Playground',
						value: 'playground',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Region',
						value: 'region',
					},
				],
				default: 'project',
			},
			// Organization
			...organizationOperations,
			...organizationFields,
			// Project
			...projectOperations,
			...projectFields,
			// Deployment
			...deploymentOperations,
			...deploymentFields,
			// Domain
			...domainOperations,
			...domainFields,
			// KV Database
			...kvDatabaseOperations,
			...kvDatabaseFields,
			// Build Log
			...buildLogOperations,
			...buildLogFields,
			// App Log
			...appLogOperations,
			...appLogFields,
			// Environment Variable
			...environmentVariableOperations,
			...environmentVariableFields,
			// Analytics
			...analyticsOperations,
			...analyticsFields,
			// Certificate
			...certificateOperations,
			...certificateFields,
			// Region
			...regionOperations,
			...regionFields,
			// Playground
			...playgroundOperations,
			...playgroundFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		logLicensingNotice(this);

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];
				const organizationId = await getOrganizationId.call(this);

				// Organization operations
				if (resource === 'organization') {
					if (operation === 'get') {
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/organizations/${organizationId}`,
						);
					} else if (operation === 'getAnalytics') {
						const since = this.getNodeParameter('since', i) as string;
						const until = this.getNodeParameter('until', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/organizations/${organizationId}/analytics`,
							undefined,
							{ since, until },
						);
					} else if (operation === 'listDomains') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							responseData = await denoDeployApiRequestAllItems.call(
								this,
								'GET',
								`/organizations/${organizationId}/domains`,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await denoDeployApiRequest.call(
								this,
								'GET',
								`/organizations/${organizationId}/domains`,
								undefined,
								{ limit },
							);
						}
					}
				}

				// Project operations
				if (resource === 'project') {
					if (operation === 'list') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							responseData = await denoDeployApiRequestAllItems.call(
								this,
								'GET',
								`/organizations/${organizationId}/projects`,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await denoDeployApiRequest.call(
								this,
								'GET',
								`/organizations/${organizationId}/projects`,
								undefined,
								{ limit },
							);
						}
					} else if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const body: IDataObject = { name };
						if (additionalFields.description) {
							body.description = additionalFields.description;
						}
						responseData = await denoDeployApiRequest.call(
							this,
							'POST',
							`/organizations/${organizationId}/projects`,
							body,
						);
					} else if (operation === 'get') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/projects/${projectId}`,
						);
					} else if (operation === 'update') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await denoDeployApiRequest.call(
							this,
							'PATCH',
							`/projects/${projectId}`,
							updateFields,
						);
					} else if (operation === 'delete') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'DELETE',
							`/projects/${projectId}`,
						);
					} else if (operation === 'getAnalytics') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						const since = this.getNodeParameter('since', i) as string;
						const until = this.getNodeParameter('until', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/projects/${projectId}/analytics`,
							undefined,
							{ since, until },
						);
					}
				}

				// Deployment operations
				if (resource === 'deployment') {
					const projectId = this.getNodeParameter('projectId', i) as string;

					if (operation === 'list') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							responseData = await denoDeployApiRequestAllItems.call(
								this,
								'GET',
								`/projects/${projectId}/deployments`,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await denoDeployApiRequest.call(
								this,
								'GET',
								`/projects/${projectId}/deployments`,
								undefined,
								{ limit },
							);
						}
					} else if (operation === 'create') {
						const codeInputMethod = this.getNodeParameter('codeInputMethod', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						let entryPointUrl: string;
						const assets: Record<string, IDataObject> = {};

						if (codeInputMethod === 'inline') {
							const code = this.getNodeParameter('code', i) as string;
							entryPointUrl = 'main.ts';
							assets['main.ts'] = {
								kind: 'file',
								content: code,
								encoding: 'utf-8',
							};

							// Add additional assets
							const additionalAssets = this.getNodeParameter('assets', i) as IDataObject;
							if (additionalAssets.asset) {
								const assetList = additionalAssets.asset as Array<{
									path: string;
									content: string;
									encoding?: string;
								}>;
								const parsedAssets = parseAssets(assetList);
								Object.assign(assets, parsedAssets);
							}
						} else {
							entryPointUrl = this.getNodeParameter('entryPointUrl', i) as string;
						}

						const body: IDataObject = {
							entryPointUrl,
							assets,
						};

						if (options.description) {
							body.description = options.description;
						}

						if (options.envVars) {
							const envVarsData = options.envVars as IDataObject;
							if (envVarsData.envVar) {
								body.envVars = parseEnvVars(envVarsData.envVar as IDataObject[]);
							}
						}

						if (options.databases) {
							const databasesData = options.databases as IDataObject;
							if (databasesData.binding) {
								body.databases = parseDatabaseBindings(
									databasesData.binding as Array<{ name: string; databaseId: string }>,
								);
							}
						}

						if (options.compilerOptions) {
							body.compilerOptions = options.compilerOptions;
						}

						responseData = await denoDeployApiRequest.call(
							this,
							'POST',
							`/projects/${projectId}/deployments`,
							body,
						);
					} else if (operation === 'get') {
						const deploymentId = this.getNodeParameter('deploymentId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/deployments/${deploymentId}`,
						);
					} else if (operation === 'delete') {
						const deploymentId = this.getNodeParameter('deploymentId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'DELETE',
							`/deployments/${deploymentId}`,
						);
					} else if (operation === 'redeploy') {
						const deploymentId = this.getNodeParameter('deploymentId', i) as string;
						const redeployOptions = this.getNodeParameter('redeployOptions', i) as IDataObject;
						const body: IDataObject = {};
						if (redeployOptions.description) {
							body.description = redeployOptions.description;
						}
						responseData = await denoDeployApiRequest.call(
							this,
							'POST',
							`/deployments/${deploymentId}/redeploy`,
							body,
						);
					} else if (operation === 'getBuildLogs') {
						const deploymentId = this.getNodeParameter('deploymentId', i) as string;
						const buildLogOptions = this.getNodeParameter('buildLogOptions', i) as IDataObject;
						const query: IDataObject = {};
						if (buildLogOptions.level) {
							query.level = buildLogOptions.level;
						}
						if (buildLogOptions.cursor) {
							query.cursor = buildLogOptions.cursor;
						}
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/deployments/${deploymentId}/build_logs`,
							undefined,
							query,
						);
					} else if (operation === 'getAppLogs') {
						const deploymentId = this.getNodeParameter('deploymentId', i) as string;
						const appLogOptions = this.getNodeParameter('appLogOptions', i) as IDataObject;
						const query: IDataObject = {};
						if (appLogOptions.since) {
							query.since = appLogOptions.since;
						}
						if (appLogOptions.until) {
							query.until = appLogOptions.until;
						}
						if (appLogOptions.level) {
							query.level = appLogOptions.level;
						}
						if (appLogOptions.region) {
							query.region = appLogOptions.region;
						}
						if (appLogOptions.limit) {
							query.limit = appLogOptions.limit;
						}
						if (appLogOptions.cursor) {
							query.cursor = appLogOptions.cursor;
						}
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/deployments/${deploymentId}/app_logs`,
							undefined,
							query,
						);
					}
				}

				// Domain operations
				if (resource === 'domain') {
					const projectId = this.getNodeParameter('projectId', i) as string;

					if (operation === 'list') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							responseData = await denoDeployApiRequestAllItems.call(
								this,
								'GET',
								`/projects/${projectId}/domains`,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await denoDeployApiRequest.call(
								this,
								'GET',
								`/projects/${projectId}/domains`,
								undefined,
								{ limit },
							);
						}
					} else if (operation === 'add') {
						const domain = this.getNodeParameter('domain', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'POST',
							`/projects/${projectId}/domains`,
							{ domain },
						);
					} else if (operation === 'get') {
						const domainId = this.getNodeParameter('domainId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/domains/${domainId}`,
						);
					} else if (operation === 'delete') {
						const domainId = this.getNodeParameter('domainId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'DELETE',
							`/domains/${domainId}`,
						);
					} else if (operation === 'verify') {
						const domainId = this.getNodeParameter('domainId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'POST',
							`/domains/${domainId}/verify`,
						);
					} else if (operation === 'getCertificates') {
						const domainId = this.getNodeParameter('domainId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/domains/${domainId}/certificates`,
						);
					} else if (operation === 'provisionCertificate') {
						const domainId = this.getNodeParameter('domainId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'POST',
							`/domains/${domainId}/certificates`,
						);
					}
				}

				// KV Database operations
				if (resource === 'kvDatabase') {
					if (operation === 'list') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						if (returnAll) {
							responseData = await denoDeployApiRequestAllItems.call(
								this,
								'GET',
								`/organizations/${organizationId}/databases`,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await denoDeployApiRequest.call(
								this,
								'GET',
								`/organizations/${organizationId}/databases`,
								undefined,
								{ limit },
							);
						}
					} else if (operation === 'create') {
						const description = this.getNodeParameter('description', i, '') as string;
						const body: IDataObject = {};
						if (description) {
							body.description = description;
						}
						responseData = await denoDeployApiRequest.call(
							this,
							'POST',
							`/organizations/${organizationId}/databases`,
							body,
						);
					} else if (operation === 'get') {
						const databaseId = this.getNodeParameter('databaseId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/databases/${databaseId}`,
						);
					} else if (operation === 'update') {
						const databaseId = this.getNodeParameter('databaseId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await denoDeployApiRequest.call(
							this,
							'PATCH',
							`/databases/${databaseId}`,
							updateFields,
						);
					} else if (operation === 'delete') {
						const databaseId = this.getNodeParameter('databaseId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'DELETE',
							`/databases/${databaseId}`,
						);
					}
				}

				// Build Log operations
				if (resource === 'buildLog') {
					if (operation === 'get') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						const deploymentId = this.getNodeParameter('deploymentId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const query: IDataObject = {};
						if (options.level) {
							query.level = options.level;
						}
						if (options.cursor) {
							query.cursor = options.cursor;
						}
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/deployments/${deploymentId}/build_logs`,
							undefined,
							query,
						);
						// Add projectId to context
						if (typeof responseData === 'object' && !Array.isArray(responseData)) {
							(responseData as IDataObject).projectId = projectId;
						}
					}
				}

				// App Log operations
				if (resource === 'appLog') {
					const projectId = this.getNodeParameter('projectId', i) as string;
					const deploymentId = this.getNodeParameter('deploymentId', i, '') as string;
					const options = this.getNodeParameter('options', i) as IDataObject;

					const query: IDataObject = {};
					if (deploymentId) {
						query.deployment_id = deploymentId;
					}
					if (options.level) {
						query.level = options.level;
					}
					if (options.region) {
						query.region = options.region;
					}
					if (options.limit) {
						query.limit = options.limit;
					}
					if (options.cursor) {
						query.cursor = options.cursor;
					}

					if (operation === 'query') {
						const since = this.getNodeParameter('since', i, '') as string;
						const until = this.getNodeParameter('until', i, '') as string;
						if (since) {
							query.since = since;
						}
						if (until) {
							query.until = until;
						}
					}

					responseData = await denoDeployApiRequest.call(
						this,
						'GET',
						`/projects/${projectId}/logs`,
						undefined,
						query,
					);
				}

				// Environment Variable operations
				if (resource === 'environmentVariable') {
					const projectId = this.getNodeParameter('projectId', i) as string;

					if (operation === 'list') {
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/projects/${projectId}/env`,
						);
					} else if (operation === 'set') {
						const envVarsData = this.getNodeParameter('envVars', i) as IDataObject;
						const envVars = parseEnvVars(envVarsData.envVar as IDataObject[]);
						responseData = await denoDeployApiRequest.call(
							this,
							'PATCH',
							`/projects/${projectId}/env`,
							envVars,
						);
					} else if (operation === 'delete') {
						const key = this.getNodeParameter('key', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'DELETE',
							`/projects/${projectId}/env/${key}`,
						);
					}
				}

				// Analytics operations
				if (resource === 'analytics') {
					const since = this.getNodeParameter('since', i) as string;
					const until = this.getNodeParameter('until', i) as string;

					if (operation === 'getOrganization') {
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/organizations/${organizationId}/analytics`,
							undefined,
							{ since, until },
						);
					} else if (operation === 'getProject') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/projects/${projectId}/analytics`,
							undefined,
							{ since, until },
						);
					} else if (operation === 'getDeployment') {
						const deploymentId = this.getNodeParameter('deploymentId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/deployments/${deploymentId}/analytics`,
							undefined,
							{ since, until },
						);
					}
				}

				// Certificate operations
				if (resource === 'certificate') {
					const domainId = this.getNodeParameter('domainId', i) as string;

					if (operation === 'list') {
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/domains/${domainId}/certificates`,
						);
					} else if (operation === 'provision') {
						responseData = await denoDeployApiRequest.call(
							this,
							'POST',
							`/domains/${domainId}/certificates`,
						);
					} else if (operation === 'get') {
						const certificateId = this.getNodeParameter('certificateId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/certificates/${certificateId}`,
						);
					}
				}

				// Region operations
				if (resource === 'region') {
					if (operation === 'list') {
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							'/regions',
						);
					}
				}

				// Playground operations
				if (resource === 'playground') {
					if (operation === 'create') {
						const code = this.getNodeParameter('code', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						const body: IDataObject = {
							code,
							entryPoint: options.entryPoint || 'main.ts',
						};

						if (options.envVars) {
							const envVarsData = options.envVars as IDataObject;
							if (envVarsData.envVar) {
								body.envVars = parseEnvVars(envVarsData.envVar as IDataObject[]);
							}
						}

						responseData = await denoDeployApiRequest.call(
							this,
							'POST',
							`/organizations/${organizationId}/playgrounds`,
							body,
						);
					} else if (operation === 'get') {
						const playgroundId = this.getNodeParameter('playgroundId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'GET',
							`/playgrounds/${playgroundId}`,
						);
					} else if (operation === 'delete') {
						const playgroundId = this.getNodeParameter('playgroundId', i) as string;
						responseData = await denoDeployApiRequest.call(
							this,
							'DELETE',
							`/playgrounds/${playgroundId}`,
						);
					}
				}

				// Handle response
				responseData = responseData!;
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
