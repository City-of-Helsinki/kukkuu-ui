module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: [
    // '/node_modules/',
    'node_modules/(?!(@city-of-helsinki/react-helsinki-headless-cms))/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '/__mocks__/'],
  collectCoverageFrom: ['src/**/*.{js,jsx,tsx}'],
  testTimeout: 20000,
};
