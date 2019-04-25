const width = 800;
const height = 400;
const parseDate = d3.timeParse('%Y-%m-%d');

let fitbod = (data) => {

  let dataWorkout = formatData(data);
  let exercises = _.keys(dataWorkout);

  _.each(exercises, (exercise, i) => {
    let dataExercise = dataWorkout[exercise];

    const svg = d3.select('.fitbod-container').append('svg')
      .attr('class', 'fitbod-svg svg-' + i)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('preserveAspectRatio', 'none');

    const group = svg.append('g')
      .attr('class', 'fitbod-group group-' + i);

    let dates = _.keys(dataExercise);
    const scaleX = d3.scaleTime()
      .domain(d3.extent(dates, (date) => {return parseDate(date)}))
      .range([0, width]);

    let recordWithMaxVolume = _.max(dataExercise, (recordsByDate) => {
      let volume = _.reduce(recordsByDate, (memo, record) => {
        return memo + record.volume;
      }, 0);
      return volume;
    });
    let maxVolume = _.reduce(recordWithMaxVolume, (memo, record) => {
      return memo + record.volume;
    }, 0);
    const scaleY = d3.scaleLinear()
    .domain([0, maxVolume])
    .range([height, 0]);

    const generatorArea = d3.area()
      .x((d) => {
        return scaleX(parseDate(d));
      })
      .y0(height)
      .y1((d) => {
        let volume = _.reduce(dataExercise[d], (memo, record) => {
          return memo + record.volume;
        }, 0);
        return scaleY(volume);
      });

    group.append('path')
      .attr('class', 'fitbod-graph graph-' + i)
      .attr('d', generatorArea(dates));

    group.selectAll('circle.fitbod-point')
      .data(dates)
      .enter()
      .append('circle')
      .attr('class', 'fitbod-point')
      .attr('cx', (d) => {
        return scaleX(parseDate(d));
      })
      .attr('cy', (d) => {
        let volume = _.reduce(dataExercise[d], (memo, record) => {
          return memo + record.volume;
        }, 0);
        return scaleY(volume);
      })
      .attr('r', '3');
  });
};

let formatData = (data) => {
  let dataFormatted = _.groupBy(data, (record) => { return record.exercise; });

  _.each(dataFormatted, (records, exercise) => {
    let cleanedRecords = _.map(records, (record) => {
      let cleanedRecord = {
        exercise: record.exercise,
        date: record.date,
        sets: parseInt(record.sets),
        reps: parseInt(record.reps),
        weight: parseInt(record.weight),
        volume: 0,
        isWarmup: record.iswarmup === 'true' ? true : false,
        notes: record.note
      };
      if (cleanedRecord.reps > 0 && cleanedRecord.weight > 0) {
        cleanedRecord.volume = cleanedRecord.reps * cleanedRecord.weight;
      }
      return cleanedRecord;
    });
    let groupedByDate = _.groupBy(cleanedRecords, (record) => { return record.date; });
    dataFormatted[exercise] = groupedByDate;
  });

  return dataFormatted;
};
