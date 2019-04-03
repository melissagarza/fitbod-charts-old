const width = 800;
const height = 400;
const parseDate = d3.timeParse('%Y-%m-%d');

let fitbod = (workoutData) => {

  getDates(workoutData);

  const svg = d3.select('.container-fitbod').append('svg')
    .attr('width', '100%')
    .attr('height', '100%');

  const group = svg.append('g').attr('transform', 'translate(0, 0)');

  const scaleY = d3.scaleLinear()
    .domain([1, 50])
    .range([height, 0]);
  // const scaleX = d3.scaleTime()
  //   .domain(d3.extent())
  //   .range([0, width]);

  const generatorArea = d3.area()
    .x((d, i) => {
      return i * 3;
    })
    .y0(height)
    .y1((d, i) => {
      return scaleY(d.reps);
    });

  group.append('path').attr('class', 'graph-1').attr('d', generatorArea(workoutData));
};

let getDates = (workoutData) => {
  console.log('getDates()');
};
