var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
  console.info('Enter index:'+req.url);
  next();
});
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',content : 'lalaLand' });
});

module.exports = router;
