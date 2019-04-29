const width = 800;
const height = 400;
const parseDate = d3.timeParse('%Y-%m-%d');
const chartPadding = {
  top: 50,
  right: 50,
  bottom: 20,
  left: 40
};

let fitbod = (data) => {

  let dataWorkout = formatData(data);
  let exercises = _.keys(dataWorkout);

  _.each(exercises, (exercise, i) => {
    let dataExercise = dataWorkout[exercise];

    let dates = _.keys(dataExercise);
    const scaleX = d3.scaleTime()
      .domain(d3.extent(dates, (date) => {return parseDate(date)}))
      .range([0, width]);

    const axisX = d3.axisBottom(scaleX)
      .tickFormat(d3.timeFormat('%y-%m-%d'))
      .ticks(d3.timeMonth.every(1));

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
    .domain([0, maxVolume + (maxVolume * 0.1)])
    .range([height, 0]);

    const axisY = d3.axisLeft(scaleY)
      .ticks(10);

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

      const generatorLine = d3.area()
        .x((d) => {
          return scaleX(parseDate(d));
        })
        .y((d) => {
          let volume = _.reduce(dataExercise[d], (memo, record) => {
            return memo + record.volume;
          }, 0);
          return scaleY(volume);
        });

    const fitbodSvgWrapper = d3.select('.fitbod-container')
      .append('div')
      .attr('class', 'fitbod-svg-wrapper');

    fitbodSvgWrapper.append('h3')
      .attr('class', 'fitbod-title')
      .text(exercise);

    const fitbodSvg = fitbodSvgWrapper.append('svg')
      .attr('class', 'fitbod-svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('preserveAspectRatio', 'none');

    const groupMain = fitbodSvg.append('g')
      .attr('class', 'fitbod-group-main');

    const groupChart = groupMain.append('g')
      .attr('class', 'fitbod-group-chart')
      .attr('transform', 'translate(' + chartPadding.left + ', 0)scale(0.95)');

    const groupAxisX = groupMain.append('g')
      .attr('class', 'fitbod-group-axis-x')
      .attr('transform', 'translate(' + chartPadding.left + ', ' + (height - chartPadding.bottom) + ')');

    const groupAxisY = groupMain.append('g')
      .attr('class', 'fitbod-group-axis-y')
      .attr('transform', 'translate(' + chartPadding.left + ', -' + chartPadding.bottom + ')');

    groupChart.append('path')
      .attr('class', 'fitbod-area')
      .attr('d', generatorArea(dates));

    groupChart.append('path')
      .attr('class', 'fitbod-line')
      .attr('d', generatorLine(dates));

    groupChart.selectAll('circle.fitbod-point')
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

    groupAxisX.append('g')
      .call(axisX);
  
    groupAxisY.append('g')
      .call(axisY);
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
