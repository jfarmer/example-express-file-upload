let process = require('process');
let dotenv = require('dotenv');
dotenv.config();

let AWS = require('aws-sdk');
async function main() {
  let awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
  let awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  let s3 = new AWS.S3();

  console.log('+-----------------------+')
  console.log('| S3 Bucket Information |');
  console.log('+-----------------------+')
  console.log();
  console.log(`AWS_ACCESS_KEY_ID:     "${awsAccessKeyId}"`);
  console.log(`AWS_SECRET_ACCESS_KEY: "${awsSecretAccessKey}"`);
  console.log();

  try {
    let allBuckets = await s3.listBuckets().promise();

    console.table(allBuckets.Buckets);
  } catch (err) {
    console.error('Error! Failed to fetch list of S3 buckets.');
    console.error();
    console.error('Received the following message from AWS:');
    console.error(`  ${err.name}: ${err.message}`);
  }
}

main();
