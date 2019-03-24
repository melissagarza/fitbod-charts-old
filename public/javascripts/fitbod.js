const width = 800;
const height = 400;
const parseDate = d3.timeParse('%Y-%m-%d');

let fitbod = function(workoutData) {

  const svg = d3.select('body').append('svg').attr('width', width + 'px').attr('height', height + 'px');

  const scaleY = d3.scaleLinear()
    .domain([1, 50])
    .range([height, 0]);

  const generatorArea = d3.area()
    .x((d, i) => {
      return i * 5;
    })
    .y0(height)
    .y1((d, i) => {
      return scaleY(d.reps);
    });

    svg.append('path').attr('class', 'graph-1').attr('d', generatorArea(workoutData));
};
