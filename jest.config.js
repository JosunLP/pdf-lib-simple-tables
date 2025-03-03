module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/test/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  // Performance-Verbesserungen
  maxWorkers: '50%',
  cache: true,
  // Code-Coverage-Anforderungen
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  // Verbesserte Reporting-Optionen
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  // Timeout für Tests erhöhen (falls nötig)
  testTimeout: 10000,
};
