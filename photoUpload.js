let crypto = require('crypto');
let AWS = require('aws-sdk');
let multer = require('multer');
let multerS3 = require('multer-s3');

// Generate a random name for the file on S3
// that doesn't depend on the original filename,
// but preserves the file extension
function generateObjectKey(fileName) {
  let uniq = crypto.randomBytes(4).toString('hex');
  let extension = fileName.match(/[^.]+$/)[0];
  let timestamp = Date.now().toString();

  return `${timestamp}_${uniq}.${extension}`.toLowerCase();
}

// The AWS module automatically reads authentication
// information from the AWS_ACCESS_KEY_ID and
// AWS_SECRET_ACCESS_KEY environment variables
let s3 = new AWS.S3();

let photoUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (request, file, next) => {
      next(null, generateObjectKey(file.originalname));
    },
  }),
});

module.exports = photoUpload;
