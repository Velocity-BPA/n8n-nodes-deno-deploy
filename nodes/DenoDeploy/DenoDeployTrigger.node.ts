/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IPollFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

import {
	denoDeployApiRequest,
	getOrganizationId,
	logLicensingNotice,
} from './GenericFunctions';

export class DenoDeployTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Deno Deploy Trigger',
		name: 'denoDeployTrigger',
		icon: 'file:denoDeploy.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Triggers when deployment events occur in Deno Deploy',
		defaults: {
			name: 'Deno Deploy Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'denoDeployApi',
				required: true,
			},
		],
		polling: true,
		properties: [
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the project to monitor',
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'deployment.created',
				options: [
					{
						name: 'Deployment Created',
						value: 'deployment.created',
						description: 'Triggers when a new deployment is created',
					},
					{
						name: 'Deployment Failed',
						value: 'deployment.failed',
						description: 'Triggers when a deployment fails',
					},
					{
						name: 'Deployment Success',
						value: 'deployment.success',
						description: 'Triggers when a deployment succeeds',
					},
					{
						name: 'Any Deployment Event',
						value: 'deployment.any',
						description: 'Triggers on any deployment event',
					},
				],
				description: 'The event to listen for',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		logLicensingNotice(this);

		const projectId = this.getNodeParameter('projectId') as string;
		const event = this.getNodeParameter('event') as string;
		const staticData = this.getWorkflowStaticData('node');

		try {
			const organizationId = await getOrganizationId.call(this);

			// Get recent deployments
			const deployments = (await denoDeployApiRequest.call(
				this,
				'GET',
				`/projects/${projectId}/deployments`,
				undefined,
				{ limit: 10 },
			)) as IDataObject[];

			const lastDeploymentId = staticData.lastDeploymentId as string | undefined;
			const lastDeploymentStatuses = (staticData.lastDeploymentStatuses || {}) as Record<
				string,
				string
			>;

			const events: INodeExecutionData[] = [];
			const currentStatuses: Record<string, string> = {};

			// Process deployments from oldest to newest
			const deploymentsToProcess = [...deployments].reverse();

			for (const deployment of deploymentsToProcess) {
				const deploymentId = deployment.id as string;
				const status = deployment.status as string;
				const previousStatus = lastDeploymentStatuses[deploymentId];

				currentStatuses[deploymentId] = status;

				// Skip if this is the first poll (initialization)
				if (lastDeploymentId === undefined) {
					continue;
				}

				// Check for new deployment
				if (!previousStatus && !lastDeploymentStatuses[deploymentId]) {
					if (event === 'deployment.created' || event === 'deployment.any') {
						events.push({
							json: {
								event: 'deployment.created',
								deployment,
								organizationId,
								projectId,
								timestamp: deployment.createdAt || new Date().toISOString(),
							},
						});
					}
				}

				// Check for status changes
				if (previousStatus && previousStatus !== status) {
					const eventType = `deployment.${status}`;

					if (
						event === 'deployment.any' ||
						(event === 'deployment.success' && status === 'success') ||
						(event === 'deployment.failed' && status === 'failed')
					) {
						events.push({
							json: {
								event: eventType,
								previousStatus,
								deployment,
								organizationId,
								projectId,
								timestamp: deployment.updatedAt || new Date().toISOString(),
							},
						});
					}
				}
			}

			// Update static data
			if (deployments.length > 0) {
				staticData.lastDeploymentId = deployments[0].id;
			}
			staticData.lastDeploymentStatuses = currentStatuses;

			if (events.length > 0) {
				return [events];
			}

			return null;
		} catch (error) {
			// Log error but don't fail - return null to continue polling
			this.logger.error(`Deno Deploy Trigger error: ${(error as Error).message}`);
			return null;
		}
	}
}
