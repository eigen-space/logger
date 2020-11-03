module.exports = {
    clearMocks: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/index.ts'
    ],
    coveragePathIgnorePatterns: [
        '.*\\.d\\.ts'
    ],
    testMatch: [
        '<rootDir>/src/**/*.spec.(ts|tsx)'
    ],
    setupFiles: [
        '<rootDir>/config/jest/setup/console.setup.ts'
    ],
    setupFilesAfterEnv: [
        '<rootDir>/config/jest/env-setup/check-assertions-number.ts'
    ],
    testURL: 'http://localhost',
    transform: {
        '^(?!.*\\.(js|ts|tsx|css|json)$)': '<rootDir>/config/jest/transform/file.transform.ts',
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleFileExtensions: [
        'web.ts',
        'ts',
        'tsx',
        'web.js',
        'js',
        'json',
        'node'
    ],
    globals: {
        'ts-jest': { tsConfig: 'tsconfig.spec.json' }
    },
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    }
};
