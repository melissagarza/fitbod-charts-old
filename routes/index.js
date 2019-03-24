let express = require('express');
let router = express.Router();
let path = require('path');
let fs = require('fs');
let csvParse = require('csv-parse');

router.get('/', async function(req, res) {
  let data = await processData();
  res.render('index', {
    title: 'Fitbod Charts',
    data: JSON.stringify(data)
  });
});

function processData() {
  return new Promise((resolve, reject) => {
    let fitbodData = [];
    let csvParser = csvParse({
      delimiter: ',',
      columns: function headersToLowerCase(headers) {
        let lowercaseHeaders = headers.map(header => {
          return header.toLowerCase();
        });
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
      reject(error.message)
    })

    csvParser.on('end', function() {
      return resolve(fitbodData);
    })

    fs.createReadStream(path.join(__dirname, '../public/data/fitbod_workout.csv')).pipe(csvParser);
  });
}

module.exports = router;
