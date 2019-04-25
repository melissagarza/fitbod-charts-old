const width = 800;
const height = 400;
const parseDate = d3.timeParse('%Y-%m-%d');

let fitbod = (rawWorkoutData) => {

  let workoutData = parseData(rawWorkoutData);

  const svg = d3.select('.fitbod-container').append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('preserveAspectRatio', 'none');

  const group = svg.append('g');

  const scaleY = d3.scaleLinear()
    .domain(d3.extent(workoutData, (record) => { return record.reps; }))
    .range([height, 0]);
  const scaleX = d3.scaleTime()
    .domain(d3.extent(workoutData, (record) => { return record.date; }))
    .range([0, width]);

  const generatorArea = d3.area()
    .x((d) => { return scaleX(d.date); })
    .y0(height)
    .y1((d) => { return scaleY(d.reps); });

  group.append('path').attr('class', 'graph-1').attr('d', generatorArea(workoutData));
};

let parseData = (rawWorkoutData) => {
  return _.map(rawWorkoutData, (record) => {
    return {
      exercise: record.exercise,
      date: parseDate(record.date),
      sets: parseInt(record.sets),
      reps: parseInt(record.reps),
      weight: parseInt(record.weight),
      isWarmup: record.iswarmup === 'true' ? true : false,
      notes: record.note
    };
  });
};
