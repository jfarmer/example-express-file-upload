let process = require('process');

let dotenv = require('dotenv');
dotenv.config();

let REQUIRED_ENV_VARS = [
  'NODE_ENV',
  'S3_BUCKET_NAME',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
];

let requiredEnvVars = {};

for (let envVar of REQUIRED_ENV_VARS) {
  requiredEnvVars[envVar] = process.env[envVar];
}

console.log('Values of the required environment variables:');
console.log(`  ${REQUIRED_ENV_VARS.join(', ')}`);
console.log();

console.table(requiredEnvVars);
