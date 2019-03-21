let express = require('express');
let router = express.Router();
let path = require('path');
let fs = require('fs');
let csvParse = require('csv-parse');

router.get('/', function(req, res) {
  let data = processData(res);
  res.render('index', {
    title: 'Fitbod Charts',
    data: JSON.stringify(data)
  });
});

function processData(res) {
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

  csvParser.write('"Date","Exercise","Sets","Reps","Weight","isWarmup","Note"\n')
  csvParser.write('"2019-01-27","Dumbbell Pullover",1,12,17,"",""')

  csvParser.end()

  return fitbodData;
}

module.exports = router;
