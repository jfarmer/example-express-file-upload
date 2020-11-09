let Router = require('express-promise-router');
let db = require('./database');
let photoUpload = require('./photoUpload');

let router = new Router();

router.get('/', async(request, response) => {
  let photos = await db('photos').select('*').orderBy('created_at', 'DESC');

  response.render('index', { photos });
});

router.post('/upload', photoUpload.single('photo'), async(request, response) => {
  // There's no error-handling here. If upload failed
  // for any reason, this is where we'd handle it.
  // For the sake of the example, assme everything worked.
  let photo = request.file;

  await db('photos').insert({
    key: photo.key,
    filename: photo.originalname,
    location: photo.location,
    content_type: photo.contentType,
  });

  response.redirect('/');
});

module.exports = router;
