let Router = require('express-promise-router');
let db = require('./database');

let router = new Router();

router.get('/', async(request, response) => {
  response.send('Hello!');
});

module.exports = router;
