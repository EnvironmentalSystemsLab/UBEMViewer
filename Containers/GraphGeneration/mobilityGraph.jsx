   // For generating the mobility summary
     // !!!!!need to delete unnecessary code!!!!!
   export const generateMobilitySummaryBarGraph = (sAreas, mapRef) => {

    const map = mapRef.current;

    if (!map) {
      // Map is not available yet, return or handle the error
      return;
    }

    const graphContainer = d3.select('#graph-container-mobility-summary');

  // Clear previous graph content
  graphContainer.html('');

  // Get the data from selected area

  const selectedAreasData = [];
  const features = map.queryRenderedFeatures({ layers: ['mobility-Street-Detailed', 'mobility-Block-Detailed'] });
  
  features.forEach((feature) => {
    const areaId = feature.properties.object_id;
    if (sAreas.current.has(areaId)) {
      selectedAreasData.push({
        type: 'Feature',
        geometry: feature.geometry,
        properties: feature.properties,
      });
    }
  });
  

  // empty data holder
  let data = [
    { timePeriod: 'Morning', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Breakfast', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Lunch', walk: 0, bike: 0, car: 0, publicTransit: 0},
    { timePeriod: 'Afternoon', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Dinner', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Night', walk: 0, bike: 0, car: 0, publicTransit: 0 },
  ];

  let weekendData = [
    { timePeriod: 'Morning', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Breakfast', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Lunch', walk: 0, bike: 0, car: 0, publicTransit: 0},
    { timePeriod: 'Afternoon', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Dinner', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Night', walk: 0, bike: 0, car: 0, publicTransit: 0 },
  ];

  const weekdayOverallData = [
    { timePeriod: 'Early Morning', walk: 225.31, bike: 44.53, car: 1766.11, publicTransit: 1508.7 },
    { timePeriod: 'Morning', walk: 3207.24, bike: 378.92, car: 20038.77, publicTransit: 6659.61 },
    { timePeriod: 'Lunch', walk: 2306.27, bike: 316.9, car: 13787.66, publicTransit: 7026.34 },
    { timePeriod: 'Afternoon', walk: 1359.1, bike: 186.25, car: 9242.15, publicTransit: 6118.57 },
    { timePeriod: 'Evening', walk: 1685.12, bike: 331.32, car: 12511.29, publicTransit: 10306.86 },
    { timePeriod: 'Night', walk: 263.57, bike: 51.43, car: 2276.55, publicTransit: 2076.8 },
  ];

  if (sAreas.current.size === 0) {
      data = [...weekdayOverallData];
    }


  // will be simpler in the futre
  if (selectedAreasData.length > 0) {
    selectedAreasData.forEach((feature) => {
      Object.keys(feature.properties).forEach((key) => {
        const [season, weekday, mode, time, fromActivity, toActivity] = key.split('_');

        if (mode === '0' && weekday ==='1' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '-1') {
            data[0].walk += Number(feature.properties[key]);
          } else if (time === '1') {
            data[1].walk += Number(feature.properties[key]);
          } else if (time === '2') {
            data[2].walk += Number(feature.properties[key]);
          } else if (time === '3') {
            data[3].walk += Number(feature.properties[key]);
          } else if (time === '4') {
            data[4].walk += Number(feature.properties[key]);
          } else if (time === '5') {
            data[5].walk += Number(feature.properties[key]);
          }
        } else if (mode === '1' && weekday ==='1' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '0') {
            data[0].bike += Number(feature.properties[key]);
          } else if (time === '1') {
            data[1].bike += Number(feature.properties[key]);
          } else if (time === '2') {
            data[2].bike += Number(feature.properties[key]);
          } else if (time === '3') {
            data[3].bike += Number(feature.properties[key]);
          } else if (time === '4') {
            data[4].bike += Number(feature.properties[key]);
          } else if (time === '5') {
            data[5].bike += Number(feature.properties[key]);
          }
        } else if (mode === '2' && weekday ==='1' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '0') {
            data[0].car += Number(feature.properties[key]);
          } else if (time === '1') {
            data[1].car += Number(feature.properties[key]);
          } else if (time === '2') {
            data[2].car += Number(feature.properties[key]);
          } else if (time === '3') {
            data[3].car += Number(feature.properties[key]);
          } else if (time === '4') {
            data[4].car += Number(feature.properties[key]);
          } else if (time === '5') {
            data[5].car += Number(feature.properties[key]);
          }
        } else if (mode === '3' && weekday ==='1' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '0') {
            data[0].publicTransit += Number(feature.properties[key]);
          } else if (time === '1') {
            data[1].publicTransit += Number(feature.properties[key]);
          } else if (time === '2') {
            data[2].publicTransit += Number(feature.properties[key]);
          } else if (time === '3') {
            data[3].publicTransit += Number(feature.properties[key]);
          } else if (time === '4') {
            data[4].publicTransit += Number(feature.properties[key]);
          } else if (time === '5') {
            data[5].publicTransit += Number(feature.properties[key]);
          }
        }
      });
    });
  }

  if (selectedAreasData.length > 0) {
    selectedAreasData.forEach((feature) => {
      Object.keys(feature.properties).forEach((key) => {
        const [season, weekday, mode, time, fromActivity, toActivity] = key.split('_');

        if (mode === '0' && weekday ==='0' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '-1') {
            weekendData[0].walk += Number(feature.properties[key]);
          } else if (time === '1') {
            weekendData[1].walk += Number(feature.properties[key]);
          } else if (time === '2') {
            weekendData[2].walk += Number(feature.properties[key]);
          } else if (time === '3') {
            weekendData[3].walk += Number(feature.properties[key]);
          } else if (time === '4') {
            weekendData[4].walk += Number(feature.properties[key]);
          } else if (time === '5') {
            weekendData[5].walk += Number(feature.properties[key]);
          }
        } else if (mode === '1' && weekday ==='0' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '0') {
            weekendData[0].bike += Number(feature.properties[key]);
          } else if (time === '1') {
            weekendData[1].bike += Number(feature.properties[key]);
          } else if (time === '2') {
            weekendData[2].bike += Number(feature.properties[key]);
          } else if (time === '3') {
            weekendData[3].bike += Number(feature.properties[key]);
          } else if (time === '4') {
            weekendData[4].bike += Number(feature.properties[key]);
          } else if (time === '5') {
            weekendData[5].bike += Number(feature.properties[key]);
          }
        } else if (mode === '2' && weekday ==='0' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '0') {
            weekendData[0].car += Number(feature.properties[key]);
          } else if (time === '1') {
            weekendData[1].car += Number(feature.properties[key]);
          } else if (time === '2') {
            weekendData[2].car += Number(feature.properties[key]);
          } else if (time === '3') {
            weekendData[3].car += Number(feature.properties[key]);
          } else if (time === '4') {
            weekendData[4].car += Number(feature.properties[key]);
          } else if (time === '5') {
            weekendData[5].car += Number(feature.properties[key]);
          }
        } else if (mode === '3' && weekday ==='0' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '0') {
            weekendData[0].publicTransit += Number(feature.properties[key]);
          } else if (time === '1') {
            weekendData[1].publicTransit += Number(feature.properties[key]);
          } else if (time === '2') {
            weekendData[2].publicTransit += Number(feature.properties[key]);
          } else if (time === '3') {
            weekendData[3].publicTransit += Number(feature.properties[key]);
          } else if (time === '4') {
            weekendData[4].publicTransit += Number(feature.properties[key]);
          } else if (time === '5') {
            weekendData[5].publicTransit += Number(feature.properties[key]);
          }
        }
      });
    });
  }

  const sumWalk = parseInt(data.reduce((acc, d) => acc + d.walk, 0)) + parseInt(weekendData.reduce((acc, d) => acc + d.walk, 0));
  const sumBike = parseInt(data.reduce((acc, d) => acc + d.bike, 0)) + parseInt(weekendData.reduce((acc, d) => acc + d.bike, 0));
  const sumCar = parseInt(data.reduce((acc, d) => acc + d.car, 0)) + parseInt(weekendData.reduce((acc, d) => acc + d.car, 0)) ;
  const sumPublicTransit = parseInt(data.reduce((acc, d) => acc + d.publicTransit, 0)) + parseInt(weekendData.reduce((acc, d) => acc + d.publicTransit, 0));

  // Prepare the data
  const keys = ['walk', 'bike', 'car', 'publicTransit'];
  const stack = d3.stack().keys(keys);
  const stackedData = stack(data);

  // Define the SVG container dimensions
  const svgWidth = 340; // Updated width
  const svgHeight = 70;

  // Define the margins for the graph
  const margin = { top: 130, right: 40, bottom: 40, left: 80 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  // Create the SVG container
  const svg = graphContainer.append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);


//add summary bar

svg.append('rect')
  .attr('x', svgWidth / 10)
  .attr('y', margin.top - 90)
  .attr('width', 55)
  .attr('height', 25)
  .attr('fill', '#f24726')
  .attr('rx', 5) // Horizontal radius for chamfered corners
  .attr('ry', 5) // Vertical radius for chamfered corners


  svg.append('text')
  .attr('x', svgWidth / 10 + 26) // X position at the center of the rectangle
  .attr('y', margin.top - 73) // Y position at the center of the rectangle
  .attr('text-anchor', 'middle') // Center-align the text
  .attr('font-size', '12px') // Font size
  .attr('fill', 'white') // Text color
  .text(`${sumWalk.toLocaleString()}`);

  svg.append('rect')
  .attr('x', svgWidth / 10 + 80)
  .attr('y', margin.top - 90)
  .attr('width', 55)
  .attr('height', 25)
  .attr('fill', '#fac710')
  .attr('rx', 5) // Horizontal radius for chamfered corners
  .attr('ry', 5) // Vertical radius for chamfered corners

  svg.append('text')
  .attr('x', svgWidth / 10 + 106) // X position at the center of the rectangle
  .attr('y', margin.top - 73) // Y position at the center of the rectangle
  .attr('text-anchor', 'middle') // Center-align the text
  .attr('font-size', '12px') // Font size
  .attr('fill', 'white') // Text color
  .text(`${sumBike.toLocaleString()}`);


  svg.append('rect')
  .attr('x', svgWidth / 10 + 160)
  .attr('y', margin.top - 90)
  .attr('width', 55)
  .attr('height', 25)
  .attr('fill', '#2d9bf0')
  .attr('rx', 5) // Horizontal radius for chamfered corners
  .attr('ry', 5) // Vertical radius for chamfered corners

  svg.append('text')
  .attr('x', svgWidth / 10 + 186) // X position at the center of the rectangle
  .attr('y', margin.top - 73) // Y position at the center of the rectangle
  .attr('text-anchor', 'middle') // Center-align the text
  .attr('font-size', '12px') // Font size
  .attr('fill', 'white') // Text color
  .text(`${sumCar.toLocaleString()}`);


  svg.append('rect')
  .attr('x', svgWidth / 10 + 240)
  .attr('y', margin.top - 90)
  .attr('width', 55)
  .attr('height', 25)
  .attr('fill', '#0263b9')
  .attr('rx', 5) // Horizontal radius for chamfered corners
  .attr('ry', 5) // Vertical radius for chamfered corners

  
  svg.append('text')
  .attr('x', svgWidth / 10 + 266) // X position at the center of the rectangle
  .attr('y', margin.top - 73) // Y position at the center of the rectangle
  .attr('text-anchor', 'middle') // Center-align the text
  .attr('font-size', '12px') // Font size
  .attr('fill', 'white') // Text color
  .text(`${sumPublicTransit.toLocaleString()}`);

  // Log the data in the console
  //console.log('Bar Chart Data:', data);
      

    };
  
    // For generating the sum of 4 trip value into 6 time period bars(weekend)
      // !!!!!need to delete unnecessary code!!!!!
    export const generateMobilitySenarioBarGraph = (sAreas, mapRef) => {

      const map = mapRef.current;
  
      if (!map) {
          // Map is not available yet, return or handle the error
          return;
      }
  
      const graphContainer = d3.select('#graph-container-mobility-senario');

      if (!graphContainer.node()) {
        console.error("Container element not found.");
        return;
    }

  
      // Clear previous graph content
      graphContainer.html('');
  
      // Get the data from selected area
      const selectedAreasData = [];
      const features = map.queryRenderedFeatures({ layers: ['mobility-Street-Detailed', 'mobility-Block-Detailed'] });
  
      features.forEach((feature) => {
          const areaId = feature.properties.object_id;
          if (sAreas.current.has(areaId)) {
              selectedAreasData.push({
                  type: 'Feature',
                  geometry: feature.geometry,
                  properties: feature.properties,
              });
          }
      });
  
      // empty data holder
      let data = [
          { timePeriod: 'Base Case', walk: 0, bike: 0, car: 0, publicTransit: 0 },
          { timePeriod: 'Senario 1', walk: 0, bike: 0, car: 0, publicTransit: 0 },
          { timePeriod: 'Senario 2', walk: 0, bike: 0, car: 0, publicTransit: 0 },
          { timePeriod: 'Senario 3', walk: 0, bike: 0, car: 0, publicTransit: 0 },
   
      ];
  
      const weekendOverallData = [
          { timePeriod: 'Base Case', walk: 196.42, bike: 44.66, car: 1591.73, publicTransit: 1473.78 },
          { timePeriod: 'Senario 1', walk: 3069.64, bike: 394.12, car: 20284.15, publicTransit: 6109.5 },
          { timePeriod: 'Senario 2', walk: 3000.93, bike: 416.66, car: 13787.66, publicTransit: 9402.27 },
          { timePeriod: 'Senario 3', walk: 1331.69, bike: 196.68, car: 19540.22, publicTransit: 6137.72 },

      ];
  
      if (sAreas.current.size === 0) {
          data = [...weekendOverallData];
      }
  
  
      // will be simpler in the future
      if (selectedAreasData.length > 0) {
          selectedAreasData.forEach((feature) => {
              Object.keys(feature.properties).forEach((key) => {
                  const [season, weekday, mode, time, fromActivity, toActivity] = key.split('_');
  
                  if (mode === '0' && weekday === '0' && fromActivity === '-1' && toActivity === '-1') {
                      // Add the value to the corresponding time period
                      if (time === '-1') {
                          data[0].walk += Number(feature.properties[key]);
                      } else if (time === '1') {
                          data[1].walk += Number(feature.properties[key]);
                      } else if (time === '2') {
                          data[2].walk += Number(feature.properties[key]);
                      } else if (time === '3') {
                          data[3].walk += Number(feature.properties[key]);
                      }
                  } else if (mode === '1' && weekday === '0' && fromActivity === '-1' && toActivity === '-1') {
                      // Add the value to the corresponding time period
                      if (time === '0') {
                          data[0].bike += Number(feature.properties[key]);
                      } else if (time === '1') {
                          data[1].bike += Number(feature.properties[key]);
                      } else if (time === '2') {
                          data[2].bike += Number(feature.properties[key]);
                      } else if (time === '3') {
                          data[3].bike += Number(feature.properties[key]);
                      } 
                  } else if (mode === '2' && weekday === '0' && fromActivity === '-1' && toActivity === '-1') {
                      // Add the value to the corresponding time period
                      if (time === '0') {
                          data[0].car += Number(feature.properties[key]);
                      } else if (time === '1') {
                          data[1].car += Number(feature.properties[key]);
                      } else if (time === '2') {
                          data[2].car += Number(feature.properties[key]);
                      } else if (time === '3') {
                          data[3].car += Number(feature.properties[key]);
                      } 
                  } else if (mode === '3' && weekday === '0' && fromActivity === '-1' && toActivity === '-1') {
                      // Add the value to the corresponding time period
                      if (time === '0') {
                          data[0].publicTransit += Number(feature.properties[key]);
                      } else if (time === '1') {
                          data[1].publicTransit += Number(feature.properties[key]);
                      } else if (time === '2') {
                          data[2].publicTransit += Number(feature.properties[key]);
                      } else if (time === '3') {
                          data[3].publicTransit += Number(feature.properties[key]);
                      } 
                  }
              });
          });
      }
  
  
      // Prepare the data
      const keys = ['walk', 'bike', 'car', 'publicTransit'];
      const stack = d3.stack().keys(keys);
      const stackedData = stack(data);
  
      // Define the SVG container dimensions
      const margin ={ top: 10, right: 40, bottom: 40, left: 70 };
      const width = 240;
      const height = 100;
      const svgHeight = 180;
  
      // Create SVG element
      const svg = graphContainer.append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);
  
      // Define scales
      const x = d3.scaleBand()
          .domain(data.map((d) => d.timePeriod))
          .range([0, width])
          .padding(0.1);
  
      const y = d3.scaleLinear()
          .domain([0, d3.max(stackedData[stackedData.length - 1], (d) => d[1])])
          .nice()
          .range([height, 0]);
  
      // Define colors
      const color = d3.scaleOrdinal()
          .domain(keys)
          .range(['#f24726', '#fac710', '#2d9bf0', '#0263b9']);
  
      // Add bars
      svg.append('g')
          .selectAll('g')
          .data(stackedData)
          .join('g')
          .attr('fill', (d) => color(d.key))
          .selectAll('rect')
          .data((d) => d)
          .join('rect')
          .attr('x', (d, i) => x(data[i].timePeriod))
          .attr('y', (d) => y(d[1]))
          .attr('height', (d) => y(d[0]) - y(d[1]))
          .attr('width', x.bandwidth());
  
      // Add x-axis
      svg.append('g')
          .attr('transform', `translate(0,${height})`)
          .call(d3.axisBottom(x));
  
      // Add y-axis
      svg.append('g')
          .call(d3.axisLeft(y).ticks(null, 's'));

          const legend = svg.append('g')
          .attr('class', 'legend')
          .attr('transform', `translate(${margin.left}, ${svgHeight - margin.bottom + 30})`);
        
          const legendItems = legend.selectAll('.legend-item')
            .data(keys)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(${i * 60}, 0)`)
            .attr('stroke', 'none');
        
          legendItems.append('rect')
            .attr('x', -80)
            .attr('y',-20)
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', d => color(d));
            
        
          legendItems.append('text')
            .attr('x', -65)
            .attr('y', -10)
            .text(d => d)
            .attr('font-size', '10px');
  
  };
  

  
  // For generating the sum of 4 trip value into 6 time period bars(weekday)
  export const generateWeekdayBarGraph = (sAreas, mapRef) => {

    const map = mapRef.current;

    if (!map) {
      // Map is not available yet, return or handle the error
      return;
    }

    const graphContainer = d3.select('#graph-container-weekday');

  // Clear previous graph content
  graphContainer.html('');

  // Get the data from selected area

  const selectedAreasData = [];
  const features = map.queryRenderedFeatures({ layers: ['mobility-Street-Detailed', 'mobility-Block-Detailed'] });
  
  features.forEach((feature) => {
    const areaId = feature.properties.object_id;
    if (sAreas.current.has(areaId)) {
      selectedAreasData.push({
        type: 'Feature',
        geometry: feature.geometry,
        properties: feature.properties,
      });
    }
  });
  

  // empty data holder
  let data = [
    { timePeriod: 'Morning', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Breakfast', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Lunch', walk: 0, bike: 0, car: 0, publicTransit: 0},
    { timePeriod: 'Afternoon', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Dinner', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Night', walk: 0, bike: 0, car: 0, publicTransit: 0 },
  ];

  let weekendData = [
    { timePeriod: 'Morning', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Breakfast', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Lunch', walk: 0, bike: 0, car: 0, publicTransit: 0},
    { timePeriod: 'Afternoon', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Dinner', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Night', walk: 0, bike: 0, car: 0, publicTransit: 0 },
  ];

  const weekdayOverallData = [
    { timePeriod: 'Early Morning', walk: 225.31, bike: 44.53, car: 1766.11, publicTransit: 1508.7 },
    { timePeriod: 'Morning', walk: 3207.24, bike: 378.92, car: 20038.77, publicTransit: 6659.61 },
    { timePeriod: 'Lunch', walk: 2306.27, bike: 316.9, car: 13787.66, publicTransit: 7026.34 },
    { timePeriod: 'Afternoon', walk: 1359.1, bike: 186.25, car: 9242.15, publicTransit: 6118.57 },
    { timePeriod: 'Evening', walk: 1685.12, bike: 331.32, car: 12511.29, publicTransit: 10306.86 },
    { timePeriod: 'Night', walk: 263.57, bike: 51.43, car: 2276.55, publicTransit: 2076.8 },
  ];

  if (sAreas.current.size === 0) {
      data = [...weekdayOverallData];
    }


  // will be simpler in the futre
  if (selectedAreasData.length > 0) {
    selectedAreasData.forEach((feature) => {
      Object.keys(feature.properties).forEach((key) => {
        const [season, weekday, mode, time, fromActivity, toActivity] = key.split('_');

        if (mode === '0' && weekday ==='1' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '-1') {
            data[0].walk += Number(feature.properties[key]);
          } else if (time === '1') {
            data[1].walk += Number(feature.properties[key]);
          } else if (time === '2') {
            data[2].walk += Number(feature.properties[key]);
          } else if (time === '3') {
            data[3].walk += Number(feature.properties[key]);
          } else if (time === '4') {
            data[4].walk += Number(feature.properties[key]);
          } else if (time === '5') {
            data[5].walk += Number(feature.properties[key]);
          }
        } else if (mode === '1' && weekday ==='1' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '0') {
            data[0].bike += Number(feature.properties[key]);
          } else if (time === '1') {
            data[1].bike += Number(feature.properties[key]);
          } else if (time === '2') {
            data[2].bike += Number(feature.properties[key]);
          } else if (time === '3') {
            data[3].bike += Number(feature.properties[key]);
          } else if (time === '4') {
            data[4].bike += Number(feature.properties[key]);
          } else if (time === '5') {
            data[5].bike += Number(feature.properties[key]);
          }
        } else if (mode === '2' && weekday ==='1' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '0') {
            data[0].car += Number(feature.properties[key]);
          } else if (time === '1') {
            data[1].car += Number(feature.properties[key]);
          } else if (time === '2') {
            data[2].car += Number(feature.properties[key]);
          } else if (time === '3') {
            data[3].car += Number(feature.properties[key]);
          } else if (time === '4') {
            data[4].car += Number(feature.properties[key]);
          } else if (time === '5') {
            data[5].car += Number(feature.properties[key]);
          }
        } else if (mode === '3' && weekday ==='1' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '0') {
            data[0].publicTransit += Number(feature.properties[key]);
          } else if (time === '1') {
            data[1].publicTransit += Number(feature.properties[key]);
          } else if (time === '2') {
            data[2].publicTransit += Number(feature.properties[key]);
          } else if (time === '3') {
            data[3].publicTransit += Number(feature.properties[key]);
          } else if (time === '4') {
            data[4].publicTransit += Number(feature.properties[key]);
          } else if (time === '5') {
            data[5].publicTransit += Number(feature.properties[key]);
          }
        }
      });
    });
  }

  if (selectedAreasData.length > 0) {
    selectedAreasData.forEach((feature) => {
      Object.keys(feature.properties).forEach((key) => {
        const [season, weekday, mode, time, fromActivity, toActivity] = key.split('_');

        if (mode === '0' && weekday ==='0' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '-1') {
            weekendData[0].walk += Number(feature.properties[key]);
          } else if (time === '1') {
            weekendData[1].walk += Number(feature.properties[key]);
          } else if (time === '2') {
            weekendData[2].walk += Number(feature.properties[key]);
          } else if (time === '3') {
            weekendData[3].walk += Number(feature.properties[key]);
          } else if (time === '4') {
            weekendData[4].walk += Number(feature.properties[key]);
          } else if (time === '5') {
            weekendData[5].walk += Number(feature.properties[key]);
          }
        } else if (mode === '1' && weekday ==='0' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '0') {
            weekendData[0].bike += Number(feature.properties[key]);
          } else if (time === '1') {
            weekendData[1].bike += Number(feature.properties[key]);
          } else if (time === '2') {
            weekendData[2].bike += Number(feature.properties[key]);
          } else if (time === '3') {
            weekendData[3].bike += Number(feature.properties[key]);
          } else if (time === '4') {
            weekendData[4].bike += Number(feature.properties[key]);
          } else if (time === '5') {
            weekendData[5].bike += Number(feature.properties[key]);
          }
        } else if (mode === '2' && weekday ==='0' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '0') {
            weekendData[0].car += Number(feature.properties[key]);
          } else if (time === '1') {
            weekendData[1].car += Number(feature.properties[key]);
          } else if (time === '2') {
            weekendData[2].car += Number(feature.properties[key]);
          } else if (time === '3') {
            weekendData[3].car += Number(feature.properties[key]);
          } else if (time === '4') {
            weekendData[4].car += Number(feature.properties[key]);
          } else if (time === '5') {
            weekendData[5].car += Number(feature.properties[key]);
          }
        } else if (mode === '3' && weekday ==='0' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '0') {
            weekendData[0].publicTransit += Number(feature.properties[key]);
          } else if (time === '1') {
            weekendData[1].publicTransit += Number(feature.properties[key]);
          } else if (time === '2') {
            weekendData[2].publicTransit += Number(feature.properties[key]);
          } else if (time === '3') {
            weekendData[3].publicTransit += Number(feature.properties[key]);
          } else if (time === '4') {
            weekendData[4].publicTransit += Number(feature.properties[key]);
          } else if (time === '5') {
            weekendData[5].publicTransit += Number(feature.properties[key]);
          }
        }
      });
    });
  }

  const sumWalk = parseInt(data.reduce((acc, d) => acc + d.walk, 0)) + parseInt(weekendData.reduce((acc, d) => acc + d.walk, 0));
  const sumBike = parseInt(data.reduce((acc, d) => acc + d.bike, 0)) + parseInt(weekendData.reduce((acc, d) => acc + d.bike, 0));
  const sumCar = parseInt(data.reduce((acc, d) => acc + d.car, 0)) + parseInt(weekendData.reduce((acc, d) => acc + d.car, 0)) ;
  const sumPublicTransit = parseInt(data.reduce((acc, d) => acc + d.publicTransit, 0)) + parseInt(weekendData.reduce((acc, d) => acc + d.publicTransit, 0));

  // Prepare the data
  const keys = ['walk', 'bike', 'car', 'publicTransit'];
  const stack = d3.stack().keys(keys);
  const stackedData = stack(data);

  // Define the SVG container dimensions
  const svgWidth = 340; // Updated width
  const svgHeight = 225;

  // Define the margins for the graph
  const margin =  { top: 40, right: 40, bottom: 50, left: 70 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  // Create the SVG container
  const svg = graphContainer.append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

    // Add title
  svg.append('text')
  .attr('class', 'graph-title')
  .attr('x', svgWidth / 2)
  .attr('y', margin.top - 25)
  .attr('font-size', '14px')
  .attr('text-anchor', 'middle')
  .text('Weekday Trip Volume and Mode Split');

    // add unit label of x-axis and y-axis
  svg.append('text')
  .attr('class', 'graph-title')
  .attr('x', 30)
  .attr('y', margin.top, 0)
  .attr('font-size', '9px')
  .attr('text-anchor', 'middle')
  .text('Time Periods');

  svg.append('text')
  .attr('class', 'graph-title')
  .attr('x', graphWidth + 90 )
  .attr('y', graphHeight + 70)
  .attr('font-size', '9px')
  .attr('text-anchor', 'middle')
  .text('Number of Trips');


  // Create the graph container within the SVG
  const graph = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Define the scales for X and Y axes
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
    .range([0, graphWidth]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.timePeriod))
    .range([0, graphHeight])
    .padding(0.3);

  // Create a color scale for the modes
  const colorScale = d3.scaleOrdinal()
    .domain(keys)
    .range(['#f24726', '#fac710', '#2d9bf0', '#0263b9']);

  // Draw the bars
  const bars = graph.selectAll('g')
    .data(stackedData)
    .enter()
    .append('g')
    .attr('fill', d => colorScale(d.key));

  bars.selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('y', d => yScale(d.data.timePeriod))
    .attr('x', d => xScale(d[0]))
    .attr('height', yScale.bandwidth())
    .attr('width', d => xScale(d[1]) - xScale(d[0]));

  // Add Y-axis
  const yAxis = d3.axisLeft(yScale);
  graph.append('g')
    .call(yAxis);

  // Calculate the approximate number of ticks you want on the Y-axis
  const numXTicks = 5; // Change this value according to your preference
  // Add X-axis
  const xAxis = d3.axisBottom(xScale)
  .ticks(numXTicks);

  graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`)
    .call(xAxis);

  // Add X-axis label
  svg.append('text')
    .attr('x', svgWidth / 2)
    .attr('y', svgHeight)
    .attr('text-anchor', 'middle')
    
  // Add Y-axis label
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(svgHeight / 2))
    .attr('y', 10)
    .attr('text-anchor', 'middle')

    const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${margin.left}, ${svgHeight - margin.bottom + 30})`);
  
    const legendItems = legend.selectAll('.legend-item')
      .data(keys)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(${i * 60}, 0)`)
      .attr('stroke', 'none');
  
    legendItems.append('rect')
      .attr('x', 0)
      .attr('y', 10)
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', d => colorScale(d));
      
  
    legendItems.append('text')
      .attr('x', 15)
      .attr('y', 20)
      .text(d => d)
      .attr('font-size', '10px');


  // Log the data in the console
  //console.log('Bar Chart Data:', data);
      

    };
 
  // For generating the sum of 4 trip value into 6 time period bars(weekend)
  export const generateWeekendBarGraph = (sAreas, mapRef) => {

    const map = mapRef.current;

    if (!map) {
      // Map is not available yet, return or handle the error
      return;
    }

    const graphContainer = d3.select('#graph-container-weekend');

  // Clear previous graph content
  graphContainer.html('');

  // Get the data from selected area

  const selectedAreasData = [];
  const features = map.queryRenderedFeatures({ layers: ['mobility-Street-Detailed', 'mobility-Block-Detailed'] });
  
  features.forEach((feature) => {
    const areaId = feature.properties.object_id;
    if (sAreas.current.has(areaId)) {
      selectedAreasData.push({
        type: 'Feature',
        geometry: feature.geometry,
        properties: feature.properties,
      });
    }
  });

  // empty data holder
  let data = [
    { timePeriod: 'Morning', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Breakfast', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Lunch', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Afternoon', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Dinner', walk: 0, bike: 0, car: 0, publicTransit: 0 },
    { timePeriod: 'Night', walk: 0, bike: 0, car: 0, publicTransit: 0 },
  ];

  const weekendOverallData = [
    { timePeriod: 'Early Morning', walk: 196.42, bike: 44.66, car: 1591.73, publicTransit: 1473.78 },
    { timePeriod: 'Morning', walk: 3069.64, bike: 394.12, car: 20284.15, publicTransit: 6109.5 },
    { timePeriod: 'Lunch', walk: 3000.93, bike: 416.66, car: 13787.66, publicTransit: 9402.27 },
    { timePeriod: 'Afternoon', walk: 1331.69, bike: 196.68, car: 19540.22, publicTransit: 6137.72 },
    { timePeriod: 'Evening', walk: 1916.97, bike: 373.59, car: 15200.76, publicTransit: 11944.84 },
    { timePeriod: 'Night', walk: 498.61, bike: 109.18, car: 4576.76, publicTransit: 3883.33 },
  ];

  if (sAreas.current.size === 0) {
      data = [...weekendOverallData];
    }


  // will be simpler in the futre
  if (selectedAreasData.length > 0) {
    selectedAreasData.forEach((feature) => {
      Object.keys(feature.properties).forEach((key) => {
        const [season, weekday, mode, time, fromActivity, toActivity] = key.split('_');
  
        if (mode === '0' && weekday ==='0' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '-1') {
            data[0].walk += Number(feature.properties[key]);
          } else if (time === '1') {
            data[1].walk += Number(feature.properties[key]);
          } else if (time === '2') {
            data[2].walk += Number(feature.properties[key]);
          } else if (time === '3') {
            data[3].walk += Number(feature.properties[key]);
          } else if (time === '4') {
            data[4].walk += Number(feature.properties[key]);
          } else if (time === '5') {
            data[5].walk += Number(feature.properties[key]);
          }
        } else if (mode === '1' && weekday ==='0' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '0') {
            data[0].bike += Number(feature.properties[key]);
          } else if (time === '1') {
            data[1].bike += Number(feature.properties[key]);
          } else if (time === '2') {
            data[2].bike += Number(feature.properties[key]);
          } else if (time === '3') {
            data[3].bike += Number(feature.properties[key]);
          } else if (time === '4') {
            data[4].bike += Number(feature.properties[key]);
          } else if (time === '5') {
            data[5].bike += Number(feature.properties[key]);
          }
        } else if (mode === '2' && weekday ==='0' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '0') {
            data[0].car += Number(feature.properties[key]);
          } else if (time === '1') {
            data[1].car += Number(feature.properties[key]);
          } else if (time === '2') {
            data[2].car += Number(feature.properties[key]);
          } else if (time === '3') {
            data[3].car += Number(feature.properties[key]);
          } else if (time === '4') {
            data[4].car += Number(feature.properties[key]);
          } else if (time === '5') {
            data[5].car += Number(feature.properties[key]);
          }
        } else if (mode === '3' && weekday ==='0' && fromActivity === '-1' && toActivity === '-1') {
          // Add the value to the corresponding time period
          if (time === '0') {
            data[0].publicTransit += Number(feature.properties[key]);
          } else if (time === '1') {
            data[1].publicTransit += Number(feature.properties[key]);
          } else if (time === '2') {
            data[2].publicTransit += Number(feature.properties[key]);
          } else if (time === '3') {
            data[3].publicTransit += Number(feature.properties[key]);
          } else if (time === '4') {
            data[4].publicTransit += Number(feature.properties[key]);
          } else if (time === '5') {
            data[5].publicTransit += Number(feature.properties[key]);
          }
        }
      });
    });
  }


  // Prepare the data
  const keys = ['walk', 'bike', 'car', 'publicTransit'];
  const stack = d3.stack().keys(keys);
  const stackedData = stack(data);

  // Define the SVG container dimensions
  const svgWidth = 340; // Updated width
  const svgHeight = 225;

  // Define the margins for the graph
  const margin = { top: 40, right: 40, bottom: 50, left: 70 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  // Create the SVG container
  const svg = graphContainer.append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

    // Add title
    svg.append('text')
    .attr('class', 'graph-title')
    .attr('x', svgWidth / 2)
    .attr('y', margin.top - 22)
    .attr('font-size', '14px')
    .attr('text-anchor', 'middle')
    .text('Weekend Trip Volume and Mode Split');
  
    svg.append('text')
    .attr('class', 'graph-title')
    .attr('x', 30)
    .attr('y', margin.top, 10)
    .attr('font-size', '9px')
    .attr('text-anchor', 'middle')
    .text('Time Periods');
    
    svg.append('text')
    .attr('class', 'graph-title')
    .attr('x', graphWidth + 90 )
    .attr('y', graphHeight + 70)
    .attr('font-size', '9px')
    .attr('text-anchor', 'middle')
    .text('Number of Trips');
    

  // Create the graph container within the SVG
  const graph = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Define the scales for X and Y axes
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
    .range([0, graphWidth]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.timePeriod))
    .range([0, graphHeight])
    .padding(0.3);


  // Create a color scale for the modes
  const colorScale = d3.scaleOrdinal()
    .domain(keys)
    .range(['#f24726', '#fac710', '#2d9bf0', '#0263b9']);

  // Draw the bars
  const bars = graph.selectAll('g')
    .data(stackedData)
    .enter()
    .append('g')
    .attr('fill', d => colorScale(d.key));

  bars.selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('y', d => yScale(d.data.timePeriod))
    .attr('x', d => xScale(d[0]))
    .attr('height', yScale.bandwidth())
    .attr('width', d => xScale(d[1]) - xScale(d[0]));

  // Add Y-axis
  const yAxis = d3.axisLeft(yScale)
  
  graph.append('g')
    .call(yAxis);


  // Calculate the approximate number of ticks you want on the Y-axis
  const numXTicks = 5; // Change this value according to your preference
  // Add X-axis
  const xAxis = d3.axisBottom(xScale)
  .ticks(numXTicks);


  graph.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${graphHeight})`)
    .call(xAxis);
    

  // Add X-axis label
  svg.append('text')
    .attr('x', svgWidth / 2)
    .attr('y', svgHeight)
    .attr('text-anchor', 'middle')
    
  // Add Y-axis label
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(svgHeight / 2))
    .attr('y', 20)
    .attr('text-anchor', 'middle')



  // Add legend
  const legend = svg.append('g')
  .attr('class', 'legend')
  .attr('transform', `translate(${margin.left}, ${svgHeight - margin.bottom + 30})`);

  const legendItems = legend.selectAll('.legend-item')
    .data(keys)
    .enter()
    .append('g')
    .attr('class', 'legend-item')
    .attr('transform', (d, i) => `translate(${i * 60}, 0)`)
    .attr('stroke', 'none');

  legendItems.append('rect')
    .attr('x', 0)
    .attr('y', 10)
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', d => colorScale(d));
    

  legendItems.append('text')
    .attr('x', 15)
    .attr('y', 20)
    .text(d => d)
    .attr('font-size', '10px');


  // Log the data in the console
  //console.log('Bar Chart Data:', data);
      
  }; 