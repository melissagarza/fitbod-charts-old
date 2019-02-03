var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var data = processData();
  res.render('index', {
    title: 'Fitbod Charts',
    data: JSON.stringify(data)
  });
});

function processData() {
  return {test: 'test'};
}

module.exports = router;
