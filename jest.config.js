module.exports = {
  verbose: true,
  testEnvironment: 'node',
  bail: true,
  collectCoverage: true,
  coverageDirectory: './coverage/',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/config/',
  ],
  coverageReporters: [
    'json',
    'text',
    'html',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/config/',
  ],
  setupTestFrameworkScriptFile: './src/config/test.config.js',
};
