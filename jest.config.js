module.exports = {
    clearMocks: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        'libs/**/*.{ts,tsx}'
    ],
    coveragePathIgnorePatterns: [
        '.*\\.d\\.ts'
    ],
    testMatch: [
        '<rootDir>/src/**/*.spec.(ts|tsx)',
        '<rootDir>/libs/**/*.spec.(ts|tsx)'
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
    }
};
