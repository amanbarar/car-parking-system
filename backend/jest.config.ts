export default {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'test',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
    },
    collectCoverageFrom: ['../src/**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node'
};
