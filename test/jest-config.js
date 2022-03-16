const path = require('path');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../src',
  moduleNameMapper: {
    'src/(.*)': path.join(__dirname, '../src/$1'),
  },
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: path.join(__dirname, 'coverage'),
};
