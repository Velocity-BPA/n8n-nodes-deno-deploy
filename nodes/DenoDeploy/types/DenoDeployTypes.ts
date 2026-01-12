/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject } from 'n8n-workflow';

export interface IDenoDeployCredentials {
	accessToken: string;
	organizationId: string;
}

export interface IOrganization {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface IProject {
	id: string;
	name: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
	productionDeployment?: IDeployment;
	hasProductionDeployment: boolean;
	organizationId: string;
}

export interface IDeployment {
	id: string;
	projectId: string;
	description?: string;
	status: 'pending' | 'building' | 'success' | 'failed' | 'cancelled';
	domains: string[];
	databases: IDataObject;
	createdAt: string;
	updatedAt: string;
}

export interface IDeploymentAsset {
	kind: 'file' | 'symlink';
	content?: string;
	encoding?: 'utf-8' | 'base64';
	target?: string;
	gitSha1?: string;
}

export interface IDeploymentCreateBody {
	entryPointUrl: string;
	assets: Record<string, IDeploymentAsset>;
	envVars?: Record<string, string>;
	description?: string;
	databases?: Record<string, string>;
	compilerOptions?: ICompilerOptions;
}

export interface ICompilerOptions {
	jsx?: 'jsx' | 'react-jsx' | 'react-jsxdev' | 'precompile';
	jsxFactory?: string;
	jsxFragmentFactory?: string;
	jsxImportSource?: string;
}

export interface IDomain {
	id: string;
	domain: string;
	token?: string;
	isValidated: boolean;
	certificates: ICertificate[];
	projectId: string;
	organizationId: string;
	createdAt: string;
	updatedAt: string;
	provisioningStatus?: {
		success: boolean;
		message?: string;
	};
	dnsRecords?: IDnsRecord[];
}

export interface IDnsRecord {
	type: string;
	name: string;
	content: string;
}

export interface ICertificate {
	id: string;
	cipher: string;
	expiresAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface IKvDatabase {
	id: string;
	organizationId: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
}

export interface IBuildLog {
	level: 'debug' | 'info' | 'warning' | 'error';
	message: string;
	timestamp: string;
}

export interface IAppLog {
	deploymentId: string;
	isolateId: string;
	level: 'debug' | 'info' | 'warning' | 'error';
	message: string;
	region: string;
	timestamp: string;
}

export interface IEnvironmentVariable {
	key: string;
	value: string;
}

export interface IAnalytics {
	requestCount: number;
	bandwidth: number;
	cpuTime: number;
	egress: number;
}

export interface IAnalyticsQuery {
	since: string;
	until: string;
}

export interface IRegion {
	regionCode: string;
	description: string;
}

export interface IPlayground {
	id: string;
	url: string;
	code: string;
	createdAt: string;
}

export interface IPaginatedResponse<T> {
	data: T[];
	page: number;
	limit: number;
	total?: number;
	hasMore?: boolean;
	cursor?: string;
	nextCursor?: string;
}

export interface IDenoDeployApiError {
	code: string;
	message: string;
	status?: number;
}

export type DenoDeployResource =
	| 'organization'
	| 'project'
	| 'deployment'
	| 'domain'
	| 'kvDatabase'
	| 'buildLog'
	| 'appLog'
	| 'environmentVariable'
	| 'analytics'
	| 'certificate'
	| 'region'
	| 'playground';

export type OrganizationOperation = 'get' | 'getAnalytics' | 'listDomains';
export type ProjectOperation = 'list' | 'create' | 'get' | 'update' | 'delete' | 'getAnalytics';
export type DeploymentOperation = 'list' | 'create' | 'get' | 'delete' | 'redeploy' | 'getBuildLogs' | 'getAppLogs';
export type DomainOperation = 'list' | 'add' | 'get' | 'delete' | 'verify' | 'getCertificates' | 'provisionCertificate';
export type KvDatabaseOperation = 'list' | 'create' | 'get' | 'update' | 'delete';
export type BuildLogOperation = 'get';
export type AppLogOperation = 'get' | 'query';
export type EnvironmentVariableOperation = 'list' | 'set' | 'delete';
export type AnalyticsOperation = 'getOrganization' | 'getProject' | 'getDeployment';
export type CertificateOperation = 'list' | 'provision' | 'get';
export type RegionOperation = 'list';
export type PlaygroundOperation = 'create' | 'get' | 'delete';
