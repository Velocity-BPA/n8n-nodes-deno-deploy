module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/test'],
	testMatch: ['**/*.test.ts'],
	moduleFileExtensions: ['ts', 'js', 'json'],
	collectCoverageFrom: [
		'nodes/**/*.ts',
		'credentials/**/*.ts',
		'!**/*.d.ts',
		'!**/node_modules/**',
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 50,
			lines: 50,
			statements: 50,
		},
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
	},
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				tsconfig: {
					strict: true,
					module: 'commonjs',
					moduleResolution: 'node',
					target: 'ES2020',
					lib: ['ES2020'],
					esModuleInterop: true,
					skipLibCheck: true,
				},
			},
		],
	},
	verbose: true,
};
