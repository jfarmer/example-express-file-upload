let crypto = require('crypto');
let AWS = require('aws-sdk');
let multer = require('multer');
let multerS3 = require('multer-s3');

let Router = require('express-promise-router');
let db = require('./database');

function generateObjectKey(fileName) {
  let uniq = crypto.randomBytes(4).toString('hex');
  let extension = fileName.match(/[^.]+$/)[0];
  let timestamp = Date.now().toString();

  return `${timestamp}_${uniq}.${extension}`.toLowerCase();
}

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

let router = new Router();

router.get('/', async(request, response) => {
  response.render('index');
});

router.post('/upload', photoUpload.single('photo'), async(request, response) => {
  console.log(request.file);

  response.redirect('/');
});

module.exports = router;
