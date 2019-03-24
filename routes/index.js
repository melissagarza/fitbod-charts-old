let express = require('express');
let router = express.Router();
let path = require('path');
let fs = require('fs');
let csvParse = require('csv-parse');

router.get('/', function(req, res) {
  let data = processData();
  res.render('index', {
    title: 'Fitbod Charts',
    data: JSON.stringify(data)
  });
});

function processData() {
  let fitbodData = [];
  let csvParser = csvParse({
    delimiter: ',',
    columns: function headersToLowerCase(headers) {
      let lowercaseHeaders = headers.map(header => {
        return header.toLowerCase();
      });
      console.log(lowercaseHeaders);
      return lowercaseHeaders;
    }
  });

  csvParser.on('readable', () => {
    let record
    while (record = csvParser.read()) {
      fitbodData.push(record)
    }
  })

  csvParser.on('error', error => {
    console.error(err.message)
  })

  csvParser.on('end', function() {
    console.log('end');
    console.log(fitbodData);
  })

  fs.createReadStream(path.join(__dirname, '../public/data/fitbod_workout.csv')).pipe(csvParser);

  return fitbodData;
}

module.exports = router;
