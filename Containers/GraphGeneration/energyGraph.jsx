const geojsonDataPath =
  "../Data/ithaca_siteSummary_energy.geojson"

const buildingCodeToColor = {
  'Heating[KWh_m2][Yr]': '#cf5867',
  'Cooling[KWh_m2][Yr]': '#6faadd',
  'Equipment[KWh_m2][Yr]': '#959595',
  'Lighting[KWh_m2][Yr]': '#f2e75c',
  'HotWater[KWh_m2][Yr]': '#eec176',
  'PV[KWh_m2][Yr]': '#9C27B0',
}; 

function formatTickSpacing(maxSum) {
  let unit = 'K'; // Default to thousands
  let divider = 1e3; // Default divider for thousands

  if (maxSum >= 1e9) {
    unit = 'G';
    divider = 1e9;
  } else if (maxSum >= 1e6) {
    unit = 'M';
    divider = 1e6;
  }

  const tickSpacing = Math.ceil((maxSum / divider) / 5 / 100) * 100;
  return `${tickSpacing}${unit}`;
}

// For generating the end use of selected buildings.
export const generateBuildingSenarioGraph = (sAreas, mapRef, citySumLink) => {
  const map = mapRef.current;
if (!map) {
  // Map is not available yet, return or handle the error
  return;
}

d3.json(citySumLink).then((geojsonData) => {
const graphContainer = d3.select('#graph-container-energybuildingsenario');

// Clear previous graph content
graphContainer.html('');

let totalCo2 = 0;
let totalCost = 0;
let totalArea = 0;
let endUseData = Array.from({ length: 12 }, (_, month) => ({
  Month: month + 1,
  equipment: 0,
  lighting: 0,
  hotWater: 0,
  pv: 0,
  heating: 0,
  cooling: 0,
}));

const gasMonthly = geojsonData.features[0].properties["Gas[kWh][Mth]"];
const electricityMonthly = geojsonData.features[0].properties["Electricity[kWh][Mth]"];
const heatingMonthly = geojsonData.features[0].properties["Heating[KWh][Mth]"];
const coolingMonthly = geojsonData.features[0].properties["Cooling[KWh][Mth]"];
const equipmentMonthly = geojsonData.features[0].properties["Equipment[KWh][Mth]"];
const pvMonthly = geojsonData.features[0].properties["PV[KWh][Mth]"];
const lightingMonthly = geojsonData.features[0].properties["Lighting[KWh][Mth]"];
const hotWaterMonthly = geojsonData.features[0].properties["HotWater[KWh][Mth]"];

// Create the summaryData array
const summaryData = gasMonthly.map((value, index) => ({
    Month: index + 1,
    heating: heatingMonthly[index],
    cooling: coolingMonthly[index],
    equipment: equipmentMonthly[index],
    lighting: lightingMonthly[index],
    hotWater: hotWaterMonthly[index],
    pv: pvMonthly[index],
}));

const totalSumData = summaryData.reduce((accumulator, monthData) => {
  return {
    heating: accumulator.heating + monthData.heating,
    cooling: accumulator.cooling + monthData.cooling,
    equipment: accumulator.equipment + monthData.equipment,
    lighting: accumulator.lighting + monthData.lighting,
    hotWater: accumulator.hotWater + monthData.hotWater,
    pv: accumulator.pv + monthData.pv,
  };
}, {
  heating: 0,
  cooling: 0,
  equipment: 0,
  lighting: 0,
  hotWater: 0,
  pv: 0,
});

const totalCitySum = Object.values(totalSumData).reduce((sum, value) => sum + value, 0);

if (sAreas.current.size === 0) {

  totalArea = parseInt(geojsonData.features[0].properties["Area_SQM_ESL"]);
  totalCost = parseInt(geojsonData.features[0].properties[ "Cost[$][Yr]"]);
  totalCo2 = parseInt(geojsonData.features[0].properties["CO2[kg][Yr]"]);

    endUseData = [...summaryData]
  }

else{
  // Convert sAreas Set to an array
    const sAreasArray = Array.from(sAreas.current);

    // Get the data from selected area
    const selectedAreasData = [];
    const features = map.queryRenderedFeatures({ layers: ['energy-Building'] });

    features.forEach((feature) => {
      const areaId = feature.properties.ID_ESL;
      if (sAreasArray.includes(areaId)) {
        selectedAreasData.push({
          type: 'Feature',
          geometry: feature.geometry,
          properties: feature.properties,
        });
      }
    });

    // Parse the end use data and prepare the data for D3
    selectedAreasData.forEach((feature) => {
      const heatingData = JSON.parse(feature.properties['Heating[KWh][Mth]']);
      const coolingData = JSON.parse(feature.properties['Cooling[KWh][Mth]']);
      const equipmentData = JSON.parse(feature.properties['Equipment[KWh][Mth]']);
      const lightingData = JSON.parse(feature.properties['Lighting[KWh][Mth]']);
      const hotWaterData = JSON.parse(feature.properties['HotWater[KWh][Mth]']);
      const pvData = JSON.parse(feature.properties['PV[KWh][Mth]']);
      const co2Data = JSON.parse(feature.properties['CO2[kg][Yr]']);
      const costData = JSON.parse(feature.properties['Cost[$][Yr]']);
      const areaData = JSON.parse(feature.properties['Area_SQM_ESL']);

      console.log('co2Data:', co2Data);

      heatingData.forEach((heatingValue, index) => {
        const dataIndex = index; // Month index
        endUseData[dataIndex].heating += parseFloat(heatingValue);
        endUseData[dataIndex].cooling += parseFloat(coolingData[index]);
        endUseData[dataIndex].equipment += parseFloat(equipmentData[index]);
        endUseData[dataIndex].lighting += parseFloat(lightingData[index]);
        endUseData[dataIndex].hotWater += parseFloat(hotWaterData[index]);
        endUseData[dataIndex].pv += parseFloat(pvData[index]);
      });

      totalCo2 += parseInt(co2Data);
      totalCost += parseInt(costData);
      totalArea += areaData;

      console.log('totalCo2:', totalCo2);
    });

}

const totalData = endUseData.reduce((accumulator, monthData) => {
return {
  heating: accumulator.heating + monthData.heating,
  cooling: accumulator.cooling + monthData.cooling,
  equipment: accumulator.equipment + monthData.equipment,
  lighting: accumulator.lighting + monthData.lighting,
  hotWater: accumulator.hotWater + monthData.hotWater,
  pv: accumulator.pv + monthData.pv,
};
}, {
heating: 0,
cooling: 0,
equipment: 0,
lighting: 0,
hotWater: 0,
pv: 0,
});

const totalSum = Object.values(totalData).reduce((sum, value) => sum + value, 0);

// Create a stack generator
const stack = d3.stack()
  .keys(['equipment', 'lighting','hotWater', 'PV','cooling','heating'])
  .order(d3.stackOrderNone)
  .offset(d3.stackOffsetNone);

// Generate stacked data
const stackedData = stack(endUseData);

  // Create SVG container dimensions and margins
  const svgWidth = 360;
  const svgHeight = 240;
  const margin = { top: 30, right: 20, bottom: 70, left: 70 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  // Create SVG container
  const svg = graphContainer.append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  // Create a group element for the graph and apply the left and top margin
  const graphGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const maxSum = d3.max(endUseData, d => d3.sum(Object.values(d).slice(1))); // Sum of all properties except Month
  // Create scales
  const xScale = d3.scaleBand()
  .domain(endUseData.map(d => d.Month)) // Use the 'Month' for the domain
  .rangeRound([0, graphWidth])
  .padding(0.1);

const yScale = d3.scaleLinear()
  .domain([0, maxSum]) // The maxSum variable should represent the maximum stack value
  .range([graphHeight, 0]);

  // Create color scale for different elements
  const colorScale = d3.scaleOrdinal()
    .domain(['equipment', 'lighting','hotWater', 'PV', 'cooling', 'heating'])
    .range(['#959595','#f2e75c','#eec176', '#9C27B0', '#6faadd','#cf5867']);


    
  // Append a group for each stack
  const stackGroups = graphGroup.selectAll('.stack')
  .data(stackedData)
  .enter()
  .append('g')
  .attr('class', 'stack')
  .attr('fill', d => colorScale(d.key));

// Append rectangles for each stack element
stackGroups.selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.data.Month)) // Use 'Month' as categorical domain for xScale
    .attr('y', d => yScale(d[1])) // d[1] is the top of the stack segment
    .attr('height', d => yScale(d[0]) - yScale(d[1])) // Height is the difference in yScale values
    .attr('width', xScale.bandwidth()); // Width is determined by the bandwidth of xScale


  // Add legend
  const legend = svg.append('g')
  .attr('class', 'legend')
  .attr('transform', `translate(${margin.left}, ${svgHeight - margin.bottom + 20})`); // Adjust the vertical position

const legendSpacing = 100;

// Loop through the keys and add legend entries
colorScale.domain().forEach((key, index) => {
  const legendEntry = legend.append('g')
    .attr('transform', `translate(${(index % 3) * legendSpacing}, ${Math.floor(index / 3) * 20})`); // Adjust the horizontal and vertical positions

  legendEntry.append('rect')
    .attr('x', 0)
    .attr('y', 20)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', colorScale(key));

  legendEntry.append('text')
    .attr('x', 15)
    .attr('y', 25)
    .attr('dy', '0.35em')
    .style('font-size', '10px')
    .text(key);
});

});

};

  export const generateSummaryUseGraph = (sAreas, mapRef, citySumLink) => {
    const map = mapRef.current;
  if (!map) {
    // Map is not available yet, return or handle the error
    return;
  }

  d3.json(citySumLink).then((geojsonData) => {
  const graphContainer = d3.select('#graph-container-energysummaryuse');

  // Clear previous graph content
  graphContainer.html('');

  let totalCo2 = 0;
  let totalCost = 0;
  let totalArea = 0;
  let endUseData = Array.from({ length: 12 }, (_, month) => ({
    Month: month + 1,
    equipment: 0,
    lighting: 0,
    hotWater: 0,
    pv: 0,
    heating: 0,
    cooling: 0,
  }));

  const gasMonthly = geojsonData.features[0].properties["Gas[kWh][Mth]"];
  const electricityMonthly = geojsonData.features[0].properties["Electricity[kWh][Mth]"];
  const heatingMonthly = geojsonData.features[0].properties["Heating[KWh][Mth]"];
  const coolingMonthly = geojsonData.features[0].properties["Cooling[KWh][Mth]"];
  const equipmentMonthly = geojsonData.features[0].properties["Equipment[KWh][Mth]"];
  const pvMonthly = geojsonData.features[0].properties["PV[KWh][Mth]"];
  const lightingMonthly = geojsonData.features[0].properties["Lighting[KWh][Mth]"];
  const hotWaterMonthly = geojsonData.features[0].properties["HotWater[KWh][Mth]"];

  // Create the summaryData array
  const summaryData = gasMonthly.map((value, index) => ({
      Month: index + 1,
      heating: heatingMonthly[index],
      cooling: coolingMonthly[index],
      equipment: equipmentMonthly[index],
      lighting: lightingMonthly[index],
      hotWater: hotWaterMonthly[index],
      pv: pvMonthly[index],
  }));

  const totalSumData = summaryData.reduce((accumulator, monthData) => {
    return {
      heating: accumulator.heating + monthData.heating,
      cooling: accumulator.cooling + monthData.cooling,
      equipment: accumulator.equipment + monthData.equipment,
      lighting: accumulator.lighting + monthData.lighting,
      hotWater: accumulator.hotWater + monthData.hotWater,
      pv: accumulator.pv + monthData.pv,
    };
  }, {
    heating: 0,
    cooling: 0,
    equipment: 0,
    lighting: 0,
    hotWater: 0,
    pv: 0,
  });

  const totalCitySum = Object.values(totalSumData).reduce((sum, value) => sum + value, 0);

  if (sAreas.current.size === 0) {

    totalArea = parseInt(geojsonData.features[0].properties["Area_SQM_ESL"]);
    totalCost = parseInt(geojsonData.features[0].properties[ "Cost[$][Yr]"]);
    totalCo2 = parseInt(geojsonData.features[0].properties["CO2[kg][Yr]"]);

      endUseData = [...summaryData]
    }

  else{
    // Convert sAreas Set to an array
      const sAreasArray = Array.from(sAreas.current);

      // Get the data from selected area
      const selectedAreasData = [];
      const features = map.queryRenderedFeatures({ layers: ['energy-Building'] });

      features.forEach((feature) => {
        const areaId = feature.properties.ID_ESL;
        if (sAreasArray.includes(areaId)) {
          selectedAreasData.push({
            type: 'Feature',
            geometry: feature.geometry,
            properties: feature.properties,
          });
        }
      });

      // Parse the end use data and prepare the data for D3
      selectedAreasData.forEach((feature) => {
        const heatingData = JSON.parse(feature.properties['Heating[KWh][Mth]']);
        const coolingData = JSON.parse(feature.properties['Cooling[KWh][Mth]']);
        const equipmentData = JSON.parse(feature.properties['Equipment[KWh][Mth]']);
        const lightingData = JSON.parse(feature.properties['Lighting[KWh][Mth]']);
        const hotWaterData = JSON.parse(feature.properties['HotWater[KWh][Mth]']);
        const pvData = JSON.parse(feature.properties['PV[KWh][Mth]']);
        const co2Data = JSON.parse(feature.properties['CO2[kg][Yr]']);
        const costData = JSON.parse(feature.properties['Cost[$][Yr]']);
        const areaData = JSON.parse(feature.properties['Area_SQM_ESL']);

        console.log('co2Data:', co2Data);

        heatingData.forEach((heatingValue, index) => {
          const dataIndex = index; // Month index
          endUseData[dataIndex].heating += parseFloat(heatingValue);
          endUseData[dataIndex].cooling += parseFloat(coolingData[index]);
          endUseData[dataIndex].equipment += parseFloat(equipmentData[index]);
          endUseData[dataIndex].lighting += parseFloat(lightingData[index]);
          endUseData[dataIndex].hotWater += parseFloat(hotWaterData[index]);
          endUseData[dataIndex].pv += parseFloat(pvData[index]);
        });

        totalCo2 += parseInt(co2Data);
        totalCost += parseInt(costData);
        totalArea += areaData;

        console.log('totalCo2:', totalCo2);
      });

  }

  const totalData = endUseData.reduce((accumulator, monthData) => {
  return {
    heating: accumulator.heating + monthData.heating,
    cooling: accumulator.cooling + monthData.cooling,
    equipment: accumulator.equipment + monthData.equipment,
    lighting: accumulator.lighting + monthData.lighting,
    hotWater: accumulator.hotWater + monthData.hotWater,
    pv: accumulator.pv + monthData.pv,
  };
  }, {
  heating: 0,
  cooling: 0,
  equipment: 0,
  lighting: 0,
  hotWater: 0,
  pv: 0,
  });

  const totalSum = Object.values(totalData).reduce((sum, value) => sum + value, 0);

  // Create a stack generator
  const stack = d3.stack()
    .keys(['equipment', 'lighting','hotWater', 'PV','cooling','heating'])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

  // Generate stacked data
  const stackedData = stack(endUseData);

    // Create SVG container dimensions and margins
    const svgWidth = 380;
    const svgHeight = 200;
    const margin = { top: 170, right: 50, bottom: 100, left: 10 };
    const graphWidth = svgWidth - margin.left - margin.right;
    const graphHeight = svgHeight - margin.top - margin.bottom;

    // Create SVG container
    const svg = graphContainer.append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    // Create a group element for the graph and apply the left and top margin
    const graphGroup = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Add summart bar

      var recY = margin.top - 300;
      var recWidth = 100;
      var recHeight =  30;
      var recRx = 5;
      var recRy = 5;

      var rectangleData = [
        { x:0 , y: recY, width: recWidth, height:recHeight, fill: '#89c8a6', rx: recRx, ry: recRy, value: totalCost.toLocaleString() , title:"Cost", unit:"[$/Yr]"},
        { x:  110, y: recY, width: recWidth, height:recHeight, fill: '#d0df5a', rx: recRx, ry: recRy, value: totalSum.toLocaleString(), title:"Total Energy", unit:"[kWh/Yr]" },
        { x:  220, y: recY, width: recWidth, height:recHeight, fill: '#f2e75c', rx: recRx, ry: recRy, value: totalCo2.toLocaleString(), title:"CO2", unit:"[kg/Yr]" },

      ];

      var rectangleDataSecond = [
        { x:  0, y: recY+recHeight+50, width: recWidth, height:recHeight, fill: '#D8E0BB', rx: recRx, ry: recRy, value: ((totalArea).toLocaleString()), title:"Area", unit:"[SQM]" },
        { x:  110, y: recY+recHeight+50, width: recWidth, height:recHeight, fill: '#B6CEC7', rx: recRx, ry: recRy, value:(parseInt(totalSum/totalArea).toLocaleString()), title:"Normalized Energy", unit:"[kWh/SQM/Yr]" },
        { x:  220, y: recY+recHeight+50, width: recWidth, height:recHeight, fill: '#86A3C3', rx: recRx, ry: recRy, value:(totalSum/totalCitySum).toFixed(4), title:"Percentage", unit:"[%]" },
      ];


      // Join the data to the rectangles
      var rectangles = graphGroup.selectAll('.rectangle')
      .data(rectangleData);

      var rectangleSecond = graphGroup.selectAll('.rectangle')
      .data(rectangleDataSecond);

      // Enter phase: Create new rectangles and add text
      var rectangleEnter = rectangles.enter()
      .append('g')
      .attr('class', 'rectangle');

      var rectangleEnterSecond = rectangleSecond.enter()
      .append('g')
      .attr('class', 'rectangle');


      rectangleEnter.append('text')
      .attr('class', 'graph-title')
      .attr('x', graphWidth / 2 )
      .attr('y', margin.top / 2 -240)
      .attr('font-size', '14px')
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Open Sans', 'sans-serif' )
      .text('Energy Use Summary');


      rectangleEnter.append('rect')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .attr('fill', d => d.fill)
      .attr('rx', d => d.rx)
      .attr('ry', d => d.ry);

      rectangleEnter.append('text')
      .attr('x', d => d.x + d.width / 2)
      .attr('y', d => d.y + d.height / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '12px')
      .style('font-weight', 'bold')
      .text(d => d.value);

      rectangleEnter.append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y + d.height + 12)
      .attr('text-anchor', 'left')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '11px')
      .style('font-weight', 'normal')
      .text(d => d.title);

      rectangleEnter.append('text')
      .attr('x', d => d.x )
      .attr('y', d => d.y + d.height + 24) 
      .attr('text-anchor', 'left')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '8px')
      .style('font-weight', 'light')
      .attr('fill', 'gray') 
      .text(d => d.unit);

      rectangleEnterSecond.append('rect')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .attr('fill', d => d.fill)
      .attr('rx', d => d.rx)
      .attr('ry', d => d.ry);

      rectangleEnterSecond.append('text')
      .attr('x', d => d.x + d.width / 2)
      .attr('y', d => d.y + d.height / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '12px')
      .style('font-weight', 'bold')
      .text(d => d.value);

      rectangleEnterSecond.append('text')
      .attr('x', d => d.x )
      .attr('y', d => d.y + d.height + 12)
      .attr('text-anchor', 'left')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '11px')
      .style('font-weight', 'normal')
      .text(d => d.title);

      rectangleEnterSecond.append('text')
      .attr('x', d => d.x )
      .attr('y', d => d.y + d.height + 24) 
      .attr('text-anchor', 'left')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '8px')
      .style('font-weight', 'light')
      .attr('fill', 'gray') 
      .text(d => d.unit);


  });

  };

  export const generateEndUseGraph = (sAreas, mapRef, citySumLink) => {
    const map = mapRef.current;
  if (!map) {
    // Map is not available yet, return or handle the error
    return;
  }

  d3.json(citySumLink).then((geojsonData) => {
  const graphContainer = d3.select('#graph-container-energyenduse');

  // Clear previous graph content
  graphContainer.html('');

  let totalCo2 = 0;
  let totalCost = 0;
  let totalArea = 0;
  let endUseData = Array.from({ length: 12 }, (_, month) => ({
    Month: month + 1,
    equipment: 0,
    lighting: 0,
    hotWater: 0,
    pv: 0,
    heating: 0,
    cooling: 0,
  }));

  const gasMonthly = geojsonData.features[0].properties["Gas[kWh][Mth]"];
  const electricityMonthly = geojsonData.features[0].properties["Electricity[kWh][Mth]"];
  const heatingMonthly = geojsonData.features[0].properties["Heating[KWh][Mth]"];
  const coolingMonthly = geojsonData.features[0].properties["Cooling[KWh][Mth]"];
  const equipmentMonthly = geojsonData.features[0].properties["Equipment[KWh][Mth]"];
  const pvMonthly = geojsonData.features[0].properties["PV[KWh][Mth]"];
  const lightingMonthly = geojsonData.features[0].properties["Lighting[KWh][Mth]"];
  const hotWaterMonthly = geojsonData.features[0].properties["HotWater[KWh][Mth]"];
  
  // Create the summaryData array
  const summaryData = gasMonthly.map((value, index) => ({
      Month: index + 1,
      heating: heatingMonthly[index],
      cooling: coolingMonthly[index],
      equipment: equipmentMonthly[index],
      lighting: lightingMonthly[index],
      hotWater: hotWaterMonthly[index],
      pv: pvMonthly[index],
  }));

  const totalSumData = summaryData.reduce((accumulator, monthData) => {
    return {
      heating: accumulator.heating + monthData.heating,
      cooling: accumulator.cooling + monthData.cooling,
      equipment: accumulator.equipment + monthData.equipment,
      lighting: accumulator.lighting + monthData.lighting,
      hotWater: accumulator.hotWater + monthData.hotWater,
      pv: accumulator.pv + monthData.pv,
    };
  }, {
    heating: 0,
    cooling: 0,
    equipment: 0,
    lighting: 0,
    hotWater: 0,
    pv: 0,
  });
  
  const totalCitySum = Object.values(totalSumData).reduce((sum, value) => sum + value, 0);
 
  if (sAreas.current.size === 0) {

    totalArea = parseInt(geojsonData.features[0].properties["Area_SQM_ESL"]);
    totalCost = parseInt(geojsonData.features[0].properties[ "Cost[$][Yr]"]);
    totalCo2 = parseInt(geojsonData.features[0].properties["CO2[kg][Yr]"]);

      endUseData = [...summaryData]
    }

  else{
    // Convert sAreas Set to an array
      const sAreasArray = Array.from(sAreas.current);

      // Get the data from selected area
      const selectedAreasData = [];
      const features = map.queryRenderedFeatures({ layers: ['energy-Building'] });

      features.forEach((feature) => {
        const areaId = feature.properties.ID_ESL;
        if (sAreasArray.includes(areaId)) {
          selectedAreasData.push({
            type: 'Feature',
            geometry: feature.geometry,
            properties: feature.properties,
          });
        }
      });

      // Parse the end use data and prepare the data for D3
      selectedAreasData.forEach((feature) => {
        const heatingData = JSON.parse(feature.properties['Heating[KWh][Mth]']);
        const coolingData = JSON.parse(feature.properties['Cooling[KWh][Mth]']);
        const equipmentData = JSON.parse(feature.properties['Equipment[KWh][Mth]']);
        const lightingData = JSON.parse(feature.properties['Lighting[KWh][Mth]']);
        const hotWaterData = JSON.parse(feature.properties['HotWater[KWh][Mth]']);
        const pvData = JSON.parse(feature.properties['PV[KWh][Mth]']);
        const co2Data = JSON.parse(feature.properties['CO2[kg][Yr]']);
        const costData = JSON.parse(feature.properties['Cost[$][Yr]']);
        const areaData = JSON.parse(feature.properties['Area_SQM_ESL']);

        console.log('co2Data:', co2Data);

        heatingData.forEach((heatingValue, index) => {
          const dataIndex = index; // Month index
          endUseData[dataIndex].heating += parseFloat(heatingValue);
          endUseData[dataIndex].cooling += parseFloat(coolingData[index]);
          endUseData[dataIndex].equipment += parseFloat(equipmentData[index]);
          endUseData[dataIndex].lighting += parseFloat(lightingData[index]);
          endUseData[dataIndex].hotWater += parseFloat(hotWaterData[index]);
          endUseData[dataIndex].pv += parseFloat(pvData[index]);
        });

        totalCo2 += parseInt(co2Data);
        totalCost += parseInt(costData);
        totalArea += areaData;

        console.log('totalCo2:', totalCo2);
      });

}

const totalData = endUseData.reduce((accumulator, monthData) => {
  return {
    heating: accumulator.heating + monthData.heating,
    cooling: accumulator.cooling + monthData.cooling,
    equipment: accumulator.equipment + monthData.equipment,
    lighting: accumulator.lighting + monthData.lighting,
    hotWater: accumulator.hotWater + monthData.hotWater,
    pv: accumulator.pv + monthData.pv,
  };
}, {
  heating: 0,
  cooling: 0,
  equipment: 0,
  lighting: 0,
  hotWater: 0,
  pv: 0,
});

const totalSum = Object.values(totalData).reduce((sum, value) => sum + value, 0);

  // Create a stack generator
  const stack = d3.stack()
    .keys(['equipment', 'lighting','hotWater', 'PV','cooling','heating'])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

  // Generate stacked data
  const stackedData = stack(endUseData);

    // Create SVG container dimensions and margins
    const svgWidth = 340;
    const svgHeight = 225;
    const margin = { top: 30, right: 20, bottom: 80, left: 40 };
    const graphWidth = svgWidth - margin.left - margin.right;
    const graphHeight = svgHeight - margin.top - margin.bottom;
  
    // Create SVG container
    const svg = graphContainer.append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);
  
    // Create a group element for the graph and apply the left and top margin
    const graphGroup = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  

      // Add title
      graphGroup.append('text')
      .attr('class', 'graph-title')
      .attr('x', graphWidth / 2 )
      .attr('y', margin.top / 2 -30)
      .attr('font-size', '14px')
      .attr('text-anchor', 'middle')
      .text('Energy Use by End Use');

      graphGroup.append('text')
      .attr('class', 'graph-title')
      .attr('x', graphWidth + 1 )
      .attr('y', graphHeight + 30)
      .attr('font-size', '10px')
      .attr('text-anchor', 'middle')
      .text('Month');

      graphGroup.append('text')
      .attr('class', 'graph-title')
      .attr('x', - 15)
      .attr('y', margin.top -40)
      .attr('font-size', '10px')
      .attr('text-anchor', 'middle')
      .text('kWh');

      const maxSum = d3.max(endUseData, d => d3.sum(Object.values(d).slice(1))); // Sum of all properties except Month
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([1, 12]) // Assuming 12 months
      .range([0, graphWidth]);
  
      const yScale = d3.scaleLinear()
      .domain([0, maxSum])
      .range([graphHeight, 0]);
  
    // Create color scale for different elements
    const colorScale = d3.scaleOrdinal()
      .domain(['equipment', 'lighting','hotWater', 'PV', 'cooling', 'heating'])
      .range(['#959595','#f2e75c','#eec176', '#9C27B0', '#6faadd','#cf5867'])
      
      graphGroup.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale).ticks(8)
        .tickFormat((d) => {
          let divider = 1;
          let suffix = '';

          if (d >= 1e9) {
            divider = 1e9;
            suffix = 'G';
          } else if (d >= 1e6) {
            divider = 1e6;
            suffix = 'M';
          } else if (d >= 1e3) {
            divider = 1e3;
            suffix = 'K';
          }

          return (d / divider) + suffix;
        }));
          
    // Append a group for each stack
    const stackGroups = graphGroup.selectAll('.stack')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('class', 'stack')
      .attr('fill', d => colorScale(d.key));
  
    // Append rectangles for each stack element
    stackGroups.selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('x', d => xScale(d.data.Month)) // Use 'Month' instead of 'month'
    .attr('y', d => yScale(d[1]))
    .attr('height', d => yScale(d[0]) - yScale(d[1]))
    .attr('width', xScale(1) - xScale(0)-5);


    graphGroup.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${graphHeight})`)
    .call(d3.axisBottom(xScale).ticks(12).tickFormat(d3.format('d'))); // Format ticks as integers 

    // Add reference line
   // Create a line group for reference lines
const referenceLineGroup = graphGroup.append('g')
.attr('class', 'reference-lines');

// Get the y-axis ticks as reference line values
const yTicks = graphGroup.selectAll('.y-axis .tick'); // Assuming your y-axis has the class 'y-axis'
const referenceLineValues = yTicks.data().map((d) => +d);

// Append reference lines for each y-axis tick
referenceLineValues.forEach((value) => {
referenceLineGroup.append('line')
  .attr('x1', 0) // Start from the left edge of the graph
  .attr('x2', graphWidth +25) // Extend to the right edge of the graph
  .attr('y1', yScale(value))
  .attr('y2', yScale(value))
  .attr('class', 'reference-line')
  .style('stroke', 'grey') // Customize line color as needed
  .attr('stroke-width', .3)
  .style('stroke-dasharray', '4 4');
});

    // Add legend
    const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${margin.left}, ${svgHeight - margin.bottom + 20})`); // Adjust the vertical position
  
  const legendSpacing = 100;
  
  // Loop through the keys and add legend entries
  colorScale.domain().forEach((key, index) => {
    const legendEntry = legend.append('g')
      .attr('transform', `translate(${(index % 3) * legendSpacing}, ${Math.floor(index / 3) * 20})`); // Adjust the horizontal and vertical positions
  
    legendEntry.append('rect')
      .attr('x', 0)
      .attr('y', 20)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', colorScale(key));
  
    legendEntry.append('text')
      .attr('x', 15)
      .attr('y', 25)
      .attr('dy', '0.35em')
      .style('font-size', '10px')
      .text(key);
  });
  
});

  };


// For generating the fuel use of selected buildings.
  export const generateFuelUseGraph = (sAreas, mapRef) => {
    const map = mapRef.current;
    if (!map) {
      // Map is not available yet, return or handle the error
      return;
    }
  
    const graphContainer = d3.select('#graph-container-energyfueluse');
  
    // Clear previous graph content
    graphContainer.html('');
    
    let aggregatedData =  [
      { month: 1, gas: 0, electricity: 0 },
      { month: 2, gas: 0, electricity: 0 },
      { month: 3, gas: 0, electricity: 0 },
      { month: 4, gas: 0, electricity: 0 },
      { month: 5, gas: 0, electricity: 0 },
      { month: 6, gas: 0, electricity: 0 },
      { month: 7, gas: 0, electricity: 0 },
      { month: 8, gas: 0, electricity: 0 },
      { month: 9, gas: 0, electricity: 0 },
      { month: 10, gas: 0, electricity: 0 },
      { month: 11, gas: 0, electricity: 0 },
      { month: 12, gas: 0, electricity: 0 }
    ]
    const summaryData = 
    [
      { month: 1, gas: 292456832, electricity: 37756 },
      { month: 2, gas: 243212032, electricity: 33694 },
      { month: 3, gas: 214523040, electricity: 36607 },
      { month: 4, gas: 113816456, electricity: 32627 },
      { month: 5, gas: 40872760, electricity: 36890 },
      { month: 6, gas: 13437732, electricity: 38806 },
      { month: 7, gas: 5359225, electricity: 43566 },
      { month: 8, gas: 9691384, electricity: 42551 },
      { month: 9, gas: 28674048, electricity: 35716 },
      { month: 10, gas: 80831360, electricity: 34014 },
      { month: 11, gas: 158096176, electricity: 34262 },
      { month: 12, gas: 238814736, electricity: 35995 }
    ]
  
    if (sAreas.current.size === 0) {
      aggregatedData = [...summaryData];
    }

    else{

    // Get the data from selected area
    const selectedAreasData = [];
    const features = map.queryRenderedFeatures({ layers: ['energy-Building'] });
    
    features.forEach((feature) => {
      const areaId = feature.properties.ID_ESL;
      if (sAreas.current.has(areaId)) {
        selectedAreasData.push({
          type: 'Feature',
          geometry: feature.geometry,
          properties: feature.properties,
        });
      }
    });

    // Parse the fuel use data and prepare the data for D3
     aggregatedData = selectedAreasData.reduce((acc, feature) => {
      const gasData = JSON.parse(feature.properties['Gas[kWh][Mth]']);
      const electricityData = JSON.parse(feature.properties['Electricity[kWh][Mth]']);

  
      gasData.forEach((gasValue, index) => {
        if (!acc[index]) {
          acc[index] = { month: index + 1, gas: 0, electricity: 0 };
        }
        acc[index].gas += Math.round(parseFloat(gasValue));
        acc[index].electricity += Math.round(parseFloat(electricityData[index]));
      });

    
      return acc;
    }, []);
  }
  
    const svgWidth = 340;
    const svgHeight = 225;
  
    const margin = { top: 30, right: 20, bottom: 40, left: 40 };
    const graphWidth = svgWidth - margin.left - margin.right;
    const graphHeight = svgHeight - margin.top - margin.bottom;
  
    // Create SVG container
    const svg = graphContainer.append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);
  
    // Create a group element for the graph and apply the left margin
    const graphGroup = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    // Calculate the maximum value for y-axis domain
    const maxGas = d3.max(aggregatedData, d => d.gas);
    const maxElectricity = d3.max(aggregatedData, d => d.electricity);
    const maxYValue = Math.max(maxGas, maxElectricity);
  
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([1, 12]) // Assuming 12 months
      .range([0, graphWidth]);
  
    const yScale = d3.scaleLinear()
      .domain([0, maxYValue])
      .range([graphHeight, 0]);

  // Create line generators
  const gasLine = d3.line()
  .x(d => xScale(d.month))
  .y(d => yScale(d.gas));

const electricityLine = d3.line()
  .x(d => xScale(d.month))
  .y(d => yScale(d.electricity));

// Append axes
graphGroup.append('g')
  .attr('transform', `translate(0, ${graphHeight})`)
  .call(d3.axisBottom(xScale));

  graphGroup.append('g')
  .attr('class', 'y-axis')
  .call(d3.axisLeft(yScale).ticks(8)
    .tickFormat((d) => {
      let divider = 1;
      let suffix = '';

      if (d >= 1e9) {
        divider = 1e9;
        suffix = 'G';
      } else if (d >= 1e6) {
        divider = 1e6;
        suffix = 'M';
      } else if (d >= 1e3) {
        divider = 1e3;
        suffix = 'K';
      }

      return (d / divider) + suffix;
    }));

graphGroup.append('text')
  .attr('class', 'graph-title')
  .attr('x', graphWidth / 2)
  .attr('y', margin.top - 40)
  .attr('font-size', '14px')
  .attr('text-anchor', 'middle')
  .text('Energy Use by Fuel Use');

  graphGroup.append('text')
.attr('class', 'graph-title')
.attr('x', graphWidth + 1 )
.attr('y', graphHeight + 30)
.attr('font-size', '10px')
.attr('text-anchor', 'middle')
.text('Month');

graphGroup.append('text')
.attr('class', 'graph-title')
.attr('x', - 20)
.attr('y', margin.top - 40)
.attr('font-size', '10px')
.attr('text-anchor', 'middle')
.text('kWh');

// Append lines
graphGroup.append('path')
  .datum(aggregatedData)
  .attr('fill', 'none')
  .attr('stroke', '#FFB100')
  .attr('stroke-width', 2)
  .attr('d', gasLine);

graphGroup.append('path')
  .datum(aggregatedData)
  .attr('fill', 'none')
  .attr('stroke', '#1569C7')
  .attr('stroke-width', 2)
  .attr('d', electricityLine);


//Add reference line
  const referenceLineGroup = graphGroup.append('g')
.attr('class', 'reference-lines');

// Get the y-axis ticks as reference line values
const yTicks = graphGroup.selectAll('.y-axis .tick'); // Assuming your y-axis has the class 'y-axis'
const referenceLineValues = yTicks.data().map((d) => +d);

// Append reference lines for each y-axis tick
referenceLineValues.forEach((value) => {
  referenceLineGroup.append('line')
    .attr('x1', 0) // Start from the left edge of the graph
    .attr('x2', graphWidth) // Extend to the right edge of the graph
    .attr('y1', yScale(value))
    .attr('y2', yScale(value))
    .attr('class', 'reference-line')
    .style('stroke', 'grey') // Customize line color as needed
    .attr('stroke-width', 0.3)
    .style('stroke-dasharray', '4 4');
});


// Add legend
const legend = svg.append('g')
  .attr('class', 'legend')
  .attr('transform', `translate(${margin.left}, ${svgHeight - margin.bottom})`); // Bottom of the graph

const legendSpacing = 100; // Spacing between legend items
const legendheight = 35;

// Add legend entries for Gas
legend.append('line')
  .attr('x1', 0)
  .attr('y1', legendheight)
  .attr('x2', 30)
  .attr('y2', legendheight)
  .attr('stroke', '#FFB100')
  .attr('stroke-width', 2);

legend.append('text')
  .attr('x', 35)
  .attr('y', legendheight)
  .attr('dy', '0.35em')
  .style('font-size', '10px')
  .style('fill', 'black')
  .text('Gas');

// Add legend entries for Electricity
legend.append('line')
  .attr('x1', legendSpacing)
  .attr('y1', legendheight)
  .attr('x2', legendSpacing + 30)
  .attr('y2', legendheight)
  .attr('stroke', '#1569C7')
  .attr('stroke-width', 2);

legend.append('text')
  .attr('x', legendSpacing + 35)
  .attr('y', legendheight)
  .attr('dy', '0.35em')
  .style('font-size', '10px')
  .style('fill', 'black')
  .text('Electricity');

// Log the data in the console
//console.log('Fuel Use Data:', aggregatedData);

  };


// For generating the 24h energy load of selected feeder line.
  export const generateWinterEnergyLoadGraph = (sAreas, mapRef) => {
      const map = mapRef.current;
      if (!map) {
        // Map is not available yet, return or handle the error
        return;
      }
    
      const graphContainer = d3.select('#graph-container-energyone');
    
      // Clear previous graph content
      graphContainer.html('');
    
      // Get the data from selected area
      const selectedAreasData = [];
      const features = map.queryRenderedFeatures({ layers: ['energy-Feeder'] });
      
      features.forEach((feature) => {
        const areaId = feature.properties.ID_ESL;
        if (sAreas.current.has(areaId)) {
          selectedAreasData.push({
            type: 'Feature',
            geometry: feature.geometry,
            properties: feature.properties,
          });
        }
      });
  
      // Extract the gas and electricity demand arrays
      const fullData = selectedAreasData.reduce((acc, feature) => {
        const gasData = JSON.parse(feature.properties['GasDemand_KWh']);
        const electricityData = JSON.parse(feature.properties['ElectricityDemand_KWh']);
      
        
      console.log('gasData:', gasData);

        gasData.forEach((gasValue, index) => {
          if (!acc[index]) {
            acc[index] = { hour: index + 1, gas: 0, electricity: 0 };
          }
          acc[index].gas += Math.round(gasValue);
          acc[index].electricity += Math.round(electricityData[index]);
        });
    
        return acc;
      }, []);

       // to limit the line range demonstrated in graph.
    const startIndex = 1;
    const endIndex = 168;

    const hourlyData = fullData.filter((d, index) => index >= startIndex && index <= endIndex);

      const svgWidth = 340;
      const svgHeight = 220;
      const margin = { top: 50, right: 20, bottom: 40, left: 60 };
      const graphWidth = svgWidth - margin.left - margin.right;
      const graphHeight = svgHeight - margin.top - margin.bottom;

      const svg = graphContainer.append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);
  
    // Create a group element for the graph and apply the left margin
    const graphGroup = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    // Calculate the maximum value for y-axis domain
    const maxGas = d3.max(hourlyData, d => d.gas);
    const maxElectricity = d3.max(hourlyData, d => d.electricity);
    const maxYValue = Math.max(maxGas, maxElectricity);

        // Create scales
    const xScale = d3.scaleLinear()
    .domain([1, 168]) // Assuming 1 week
    .range([0, graphWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, maxYValue])
    .range([graphHeight, 0]);

      // Create line generators
      const gasLine = d3.line()
      .x(d => xScale(d.hour))
      .y(d => yScale(d.gas));
    
    const electricityLine = d3.line()
      .x(d => xScale(d.hour))
      .y(d => yScale(d.electricity));

      // Create custom tick values for the x-axis
const customXAxisTicks = [24, 48, 72, 96, 120, 144]; // Add more values as needed

const xAxis = d3.axisBottom(xScale)
    .tickValues(customXAxisTicks);

  // Append the x-axis to the SVG
  graphGroup.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + graphHeight + ")")
      .call(xAxis);

  graphGroup.append('g')
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));

  graphGroup.append('text')
    .attr('class', 'graph-title')
    .attr('x', graphWidth / 2)
    .attr('y', margin.top - 70)
    .attr('font-size', '13px')
    .attr('text-anchor', 'middle')
    .text('Energy Load of Winter Week')
    .append('tspan')
    .attr('font-size', '10px') 
    .text(' (1.1-1.7)');

    graphGroup.append('text')
  .attr('class', 'graph-title')
  .attr('x', - 20)
  .attr('y', margin.top - 60)
  .attr('font-size', '10px')
  .attr('text-anchor', 'middle')
  .text('kWh');

  graphGroup.append('text')
  .attr('class', 'graph-title')
  .attr('x', graphWidth + 8 )
  .attr('y', graphHeight +15)
  .attr('font-size', '10px')
  .attr('text-anchor', 'middle')
  .text('Hr');

//Append vertical line to indicate the 24h gap

const verticalLinesData = [24, 48, 72, 96, 120, 144, 168];

graphGroup.selectAll(".vertical-line")
    .data(verticalLinesData)
    .enter().append("line")
    .attr("class", "vertical-line")
    .attr("x1", d => xScale(d))
    .attr("x2", d => xScale(d))
    .attr("y1", 0) // Adjust the starting and ending y-coordinates as needed
    .attr("y2", graphHeight) // Adjust the starting and ending y-coordinates as needed
    .attr('stroke-width', 1)
    .style("stroke", "black") // Color of the lines
    .style("stroke-dasharray", "2"); // Style for dashed lines
  

  //Add reference line
  const referenceLineGroup = graphGroup.append('g')
  .attr('class', 'reference-lines');
  
  // Get the y-axis ticks as reference line values
  const yTicks = graphGroup.selectAll('.y-axis .tick'); // Assuming your y-axis has the class 'y-axis'
  const referenceLineValues = yTicks.data().map((d) => +d);
  
  // Append reference lines for each y-axis tick
  referenceLineValues.forEach((value) => {
    referenceLineGroup.append('line')
      .attr('x1', 0) // Start from the left edge of the graph
      .attr('x2', graphWidth) // Extend to the right edge of the graph
      .attr('y1', yScale(value))
      .attr('y2', yScale(value))
      .attr('class', 'reference-line')
      .style('stroke', 'grey') // Customize line color as needed
      .attr('stroke-width', 0.3)
      .style('stroke-dasharray', '4 4');
  });
  
// Append lines
graphGroup.append('path')
  .datum(hourlyData)
  .attr('fill', 'none')
  .attr('stroke', '#FFB100')
  .attr('stroke-width', 2)
  .attr('d', gasLine);

graphGroup.append('path')
  .datum(hourlyData)
  .attr('fill', 'none')
  .attr('stroke', '#1569C7')
  .attr('stroke-width', 2)
  .attr('d', electricityLine);


  

  // Add legend
const legend = svg.append('g')
.attr('class', 'legend')
.attr('transform', `translate(${margin.left}, ${svgHeight - margin.bottom})`); // Bottom of the graph

const legendSpacing = 100; // Spacing between legend items

  // Add legend entries for Gas
legend.append('line')
.attr('x1', 0)
.attr('y1', 30)
.attr('x2', 30)
.attr('y2', 30)
.attr('stroke', '#FFBF00')
.attr('stroke-width', 2);

legend.append('text')
.attr('x', 35)
.attr('y', 30)
.attr('dy', '0.35em')
.style('font-size', '10px')
.style('fill', 'black')
.text('Gas');

// Add legend entries for Electricity
legend.append('line')
.attr('x1', legendSpacing)
.attr('y1', 30)
.attr('x2', legendSpacing + 30)
.attr('y2', 30)
.attr('stroke', '#1569C7')
.attr('stroke-width', 2);

legend.append('text')
.attr('x', legendSpacing + 35)
.attr('y', 30)
.attr('dy', '0.35em')
.style('font-size', '10px')
.style('fill', 'black')
.text('Electricity');

  
  };

  export const generateSummerEnergyLoadGraph = (sAreas, mapRef) => {
    const map = mapRef.current;
    if (!map) {
      // Map is not available yet, return or handle the error
      return;
    }
  
    const graphContainer = d3.select('#graph-container-energytwo');
  
    // Clear previous graph content
    graphContainer.html('');
  
    // Get the data from selected area
    const selectedAreasData = [];
      const features = map.queryRenderedFeatures({ layers: ['energy-Feeder'] });
      
      features.forEach((feature) => {
        const areaId = feature.properties.ID_ESL;
        if (sAreas.current.has(areaId)) {
          selectedAreasData.push({
            type: 'Feature',
            geometry: feature.geometry,
            properties: feature.properties,
          });
        }
      });

    // Extract the gas and electricity demand arrays
    const fullData = selectedAreasData.reduce((acc, feature) => {
      const gasData = JSON.parse(feature.properties['GasDemand_KWh']);
      const electricityData = JSON.parse(feature.properties['ElectricityDemand_KWh']);
    
      gasData.forEach((gasValue, index) => {
        if (!acc[index]) {
          acc[index] = { hour: index + 1, gas: 0, electricity: 0 };
        }
        acc[index].gas += Math.round(gasValue);
        acc[index].electricity += Math.round(electricityData[index]);
      });
  
      return acc;
    }, []);

    // to limit the line range demonstrated in graph.
    const startIndex = 5285;
    const endIndex = 5453;

    const hourlyData = fullData.filter((d, index) => index >= startIndex && index <= endIndex);
    

    const svgWidth = 340;
    const svgHeight = 220;
    const margin = { top: 50, right: 20, bottom: 40, left: 60 };
    const graphWidth = svgWidth - margin.left - margin.right;
    const graphHeight = svgHeight - margin.top - margin.bottom;

    //const yMaxGas = d3.max(hourlyData, d => d.gas);
    //const yMaxElectricity = d3.max(hourlyData, d => d.electricity);

    const svg = graphContainer.append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  // Create a group element for the graph and apply the left margin
  const graphGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Calculate the maximum value for y-axis domain
  const maxGas = d3.max(hourlyData, d => d.gas);
  const maxElectricity = d3.max(hourlyData, d => d.electricity);
  const maxYValue = Math.max(maxGas, maxElectricity);

      // Create scales
  const xScale = d3.scaleLinear()
  .domain([5285, 5453]) // Assuming 1 week
  .range([0, graphWidth]);

const yScale = d3.scaleLinear()
  .domain([0, maxYValue])
  .range([graphHeight, 0]);

    // Create line generators
    const gasLine = d3.line()
    .x(d => xScale(d.hour))
    .y(d => yScale(d.gas));
  
  const electricityLine = d3.line()
    .x(d => xScale(d.hour))
    .y(d => yScale(d.electricity));

          // Create custom tick values for the x-axis
const customXAxisTicks = [5309, 5333, 5357, 5381, 5405, 5429]; // Add more values as needed

const xAxis = d3.axisBottom(xScale)
    .tickValues(customXAxisTicks);

// Append axes
graphGroup.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + graphHeight + ")")
    .call(xAxis);

graphGroup.append('g')
.attr("class", "y-axis")
.call(d3.axisLeft(yScale));

graphGroup.append('text')
.attr('class', 'graph-title')
.attr('x', graphWidth / 2)
.attr('y', margin.top - 70)
.attr('font-size', '13px')
.attr('text-anchor', 'middle')
.text('Energy Load of Summer Week')
.append('tspan')
.attr('font-size', '10px') 
.text(' (7.1-7.7)');


graphGroup.append('text')
.attr('class', 'graph-title')
.attr('x', -20)
.attr('y', margin.top - 60)
.attr('font-size', '10px')
.attr('text-anchor', 'middle')
.text('kWh');

graphGroup.append('text')
.attr('class', 'graph-title')
.attr('x', graphWidth + 8 )
.attr('y', graphHeight +15)
.attr('font-size', '10px')
.attr('text-anchor', 'middle')
.text('Hr');

//Append vertical line to indicate the 24h gap

const verticalLinesData = [5309, 5333, 5357, 5381, 5405, 5429, 5453];

graphGroup.selectAll(".vertical-line")
    .data(verticalLinesData)
    .enter().append("line")
    .attr("class", "vertical-line")
    .attr("x1", d => xScale(d))
    .attr("x2", d => xScale(d))
    .attr("y1", 0) // Adjust the starting and ending y-coordinates as needed
    .attr("y2", graphHeight) // Adjust the starting and ending y-coordinates as needed
    .attr('stroke-width', 1)
    .style("stroke", "black") // Color of the lines
    .style("stroke-dasharray", "2"); // Style for dashed lines

// Append lines
graphGroup.append('path')
.datum(hourlyData)
.attr('fill', 'none')
.attr('stroke', '#FFB100')
.attr('stroke-width', 2)
.attr('d', gasLine);

graphGroup.append('path')
.datum(hourlyData)
.attr('fill', 'none')
.attr('stroke', '#1569C7')
.attr('stroke-width', 2)
.attr('d', electricityLine);

  //Add reference line
  const referenceLineGroup = graphGroup.append('g')
  .attr('class', 'reference-lines');
  
  // Get the y-axis ticks as reference line values
  const yTicks = graphGroup.selectAll('.y-axis .tick'); // Assuming your y-axis has the class 'y-axis'
  const referenceLineValues = yTicks.data().map((d) => +d);
  
  // Append reference lines for each y-axis tick
  referenceLineValues.forEach((value) => {
    referenceLineGroup.append('line')
      .attr('x1', 0) // Start from the left edge of the graph
      .attr('x2', graphWidth) // Extend to the right edge of the graph
      .attr('y1', yScale(value))
      .attr('y2', yScale(value))
      .attr('class', 'reference-line')
      .style('stroke', 'grey') // Customize line color as needed
      .attr('stroke-width', 0.3)
      .style('stroke-dasharray', '4 4');
  });



// Add legend
const legend = svg.append('g')
.attr('class', 'legend')
.attr('transform', `translate(${margin.left}, ${svgHeight - margin.bottom})`); // Bottom of the graph

const legendSpacing = 100; // Spacing between legend items

// Add legend entries for Gas
legend.append('line')
.attr('x1', 0)
.attr('y1', 30)
.attr('x2', 30)
.attr('y2', 30)
.attr('stroke', '#FFB100')
.attr('stroke-width', 2);

legend.append('text')
.attr('x', 35)
.attr('y', 30)
.attr('dy', '0.35em')
.style('font-size', '10px')
.style('fill', 'black')
.text('Gas');

// Add legend entries for Electricity
legend.append('line')
.attr('x1', legendSpacing)
.attr('y1', 30)
.attr('x2', legendSpacing + 30)
.attr('y2', 30)
.attr('stroke', '#1569C7')
.attr('stroke-width',2);

legend.append('text')
.attr('x', legendSpacing + 35)
.attr('y', 30)
.attr('dy', '0.35em')
.style('font-size', '10px')
.style('fill', 'black')
.text('Electricity');


};

export const generateLoadDurationGraph = (sAreas, mapRef) => {
  const map = mapRef.current;
  if (!map) {
    // Map is not available yet, return or handle the error
    return;
  }

  const graphContainer = d3.select('#graph-container-energythree');

  // Clear previous graph content
  graphContainer.html('');

  // Get the data from selected area
  const selectedAreasData = [];
      const features = map.queryRenderedFeatures({ layers: ['energy-Feeder'] });
      
      features.forEach((feature) => {
        const areaId = feature.properties.ID_ESL;
        if (sAreas.current.has(areaId)) {
          selectedAreasData.push({
            type: 'Feature',
            geometry: feature.geometry,
            properties: feature.properties,
          });
        }
      });

  // Extract the gas and electricity demand arrays
  const hourlyData = selectedAreasData.reduce((acc, feature) => {
    const gasData = JSON.parse(feature.properties['GasDemand_KWh']);
    const electricityData = JSON.parse(feature.properties['ElectricityDemand_KWh']);
  
    gasData.forEach((gasValue, index) => {
      if (!acc[index]) {
        acc[index] = { hour: index + 1, gas: 0, electricity: 0 };
      }
      acc[index].gas += Math.round(gasValue);
      acc[index].electricity += Math.round(electricityData[index]);
    });

    return acc;
  }, []);

  // Separate the 'gas' and 'electricity' data into two arrays
const gasData = hourlyData.map((item) => ({ hour: item.hour, gas: item.gas, electricity: 0 }));
const electricityData = hourlyData.map((item) => ({ hour: item.hour, gas: 0, electricity: item.electricity }));

// Sort the 'gasData' and 'electricityData' arrays individually
gasData.sort((a, b) => b.gas - a.gas);
electricityData.sort((a, b) => b.electricity - a.electricity);

// Merge the sorted 'gasData' and 'electricityData' back into 'hourlyData'
hourlyData.forEach((item, index) => {
  item.gas = gasData[index].gas;
  item.electricity = electricityData[index].electricity;
});



  const svgWidth = 340;
  const svgHeight = 220;
  const margin = { top: 60, right: 20, bottom: 40, left: 60 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  //const yMaxGas = d3.max(hourlyData, d => d.gas);
  //const yMaxElectricity = d3.max(hourlyData, d => d.electricity);

  const svg = graphContainer.append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

// Create a group element for the graph and apply the left margin
const graphGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Calculate the maximum value for y-axis domain
const maxGas = d3.max(hourlyData, d => d.gas);
const maxElectricity = d3.max(hourlyData, d => d.electricity);
const maxYValue = Math.max(maxGas, maxElectricity);

    // Create scales
const xScale = d3.scaleLinear()
.domain([1, 8765]) // Assuming 1 year
.range([0, graphWidth]);

const yScale = d3.scaleLinear()
.domain([0, maxYValue])
.range([graphHeight, 0]);

  // Create line generators
  const gasLine = d3.line()
  .x(d => xScale(d.hour))
  .y(d => yScale(d.gas));

const electricityLine = d3.line()
  .x(d => xScale(d.hour))
  .y(d => yScale(d.electricity));


// Append axes
graphGroup.append('g')
.attr('transform', `translate(0, ${graphHeight})`)
.call(d3.axisBottom(xScale));

graphGroup.append('g')
.attr('class', 'y-axis')
.call(d3.axisLeft(yScale));

graphGroup.append('text')
.attr('class', 'graph-title')
.attr('x', graphWidth / 2)
.attr('y', margin.top - 70)
.attr('font-size', '14px')

.attr('text-anchor', 'middle')
.text('Load Duration Curve');

graphGroup.append('text')
.attr('class', 'graph-title')
.attr('x', -20)
.attr('y', margin.top - 70)
.attr('font-size', '10px')
.attr('text-anchor', 'middle')
.text('kWh');

graphGroup.append('text')
.attr('class', 'graph-title')
.attr('x', graphWidth + 8 )
.attr('y', graphHeight +15)
.attr('font-size', '10px')
.attr('text-anchor', 'middle')
.text('Hr');

// Append lines
graphGroup.append('path')
.datum(hourlyData)
.attr('fill', 'none')
.attr('stroke', '#FFB100')
.attr('stroke-width', 2)
.attr('d', gasLine);

graphGroup.append('path')
.datum(hourlyData)
.attr('fill', 'none')
.attr('stroke', '#1569C7')
.attr('stroke-width', 2)
.attr('d', electricityLine);

  //Add reference line
  const referenceLineGroup = graphGroup.append('g')
  .attr('class', 'reference-lines');
  
  // Get the y-axis ticks as reference line values
  const yTicks = graphGroup.selectAll('.y-axis .tick'); // Assuming your y-axis has the class 'y-axis'
  const referenceLineValues = yTicks.data().map((d) => +d);
  
  // Append reference lines for each y-axis tick
  referenceLineValues.forEach((value) => {
    referenceLineGroup.append('line')
      .attr('x1', 0) // Start from the left edge of the graph
      .attr('x2', graphWidth) // Extend to the right edge of the graph
      .attr('y1', yScale(value))
      .attr('y2', yScale(value))
      .attr('class', 'reference-line')
      .style('stroke', 'grey') // Customize line color as needed
      .attr('stroke-width', 0.3)
      .style('stroke-dasharray', '4 4');
  });

// Add legend
const legend = svg.append('g')
.attr('class', 'legend')
.attr('transform', `translate(${margin.left}, ${svgHeight - margin.bottom})`); // Bottom of the graph

const legendSpacing = 100; // Spacing between legend items

// Add legend entries for Gas
legend.append('line')
.attr('x1', 0)
.attr('y1', 30)
.attr('x2', 30)
.attr('y2', 30)
.attr('stroke', '#FFB100')
.attr('stroke-width', 2);

legend.append('text')
.attr('x', 35)
.attr('y', 30)
.attr('dy', '0.35em')
.style('font-size', '10px')
.style('fill', 'black')
.text('Gas');

// Add legend entries for Electricity
legend.append('line')
.attr('x1', legendSpacing)
.attr('y1', 30)
.attr('x2', legendSpacing + 30)
.attr('y2', 30)
.attr('stroke', '#1569C7')
.attr('stroke-width', 2);

legend.append('text')
.attr('x', legendSpacing + 35)
.attr('y', 30)
.attr('dy', '0.35em')
.style('font-size', '10px')
.style('fill', 'black')
.text('Electricity');


};



  export const generateBasicInfoGraph = (selectedAreas, mapRef) => {

    const map = mapRef.current;

    if (!map) {
      // Map is not available yet, return or handle the error
      return;
    }

    const graphContainer = d3.select('#graph-container-info');

  // Clear previous graph content
  graphContainer.html('');

  // Get the data from selected area

  const selectedAreasData = selectedAreas.current.map((area) => {
    const features = map.queryRenderedFeatures({ layers: ['mobility-Street-Detailed', 'mobility-Block-Detailed'] });
    const selectedFeature = features.find((feature) => feature.properties.object_id === area);
    if (selectedFeature) {
      return {
        type: 'Feature',
        geometry: selectedFeature.geometry,
        properties: selectedFeature.properties,
      };
    }
    return null;
  }).filter(Boolean);


  const dataset1 = [[1,2,3,4],[1,2,3,4]]


  const table = d3.create("table");
  table.append("tbody")
    .selectAll("tr")
    .data(dataset1)
    .join("tr")
    .selectAll("td")
    .data(row => row)
    .join("td")
    .text(d => d)
    .style("text-align", "center")  
  return table.node();

}

export const generateSelectedEndUseGraph = (selectedAreas, mapRef, buildingLayerCode) => {
    
  const map = mapRef.current;

  //TBD with the selected gas and electricity
if (!map || selectedAreas.current.length === 0 || buildingLayerCode === "Gas[KWh_m2][Yr]"|| buildingLayerCode === 'Electricity[KWh_m2][Yr]'){
  return;
}

if (sAreas.current.size === 0){
  return;
}

const graphContainer = d3.select('#graph-container-energyzero');

// Clear previous graph content
graphContainer.html('');
let endUseData = Array.from({ length: 12 }, (_, month) => ({
  Month: month + 1,
  'Equipment[KWh_m2][Yr]': 0,
  'Lighting[KWh_m2][Yr]': 0,
  'HotWater[KWh_m2][Yr]': 0,
  'PV[KWh_m2][Yr]': 0,
  'Heating[KWh_m2][Yr]': 0, // Update the key to match the format of buildingLayerCode
  'Cooling[KWh_m2][Yr]': 0,
}));


const selectedAreasData = [];
const features = map.queryRenderedFeatures({ layers: ['energy-building'] });

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

// Parse the end use data and prepare the data for D3
selectedAreasData.forEach((feature) => {
  const heatingData = JSON.parse(feature.properties['Heating[KWh][Mth]']);
  const coolingData = JSON.parse(feature.properties['Cooling[KWh][Mth]']);
  const equipmentData = JSON.parse(feature.properties['Equipment[KWh][Mth]']);
  const lightingData = JSON.parse(feature.properties['Lighting[KWh][Mth]']);
  const hotWaterData = JSON.parse(feature.properties['HotWater[KWh][Mth]']);
  const pvData = JSON.parse(feature.properties['PV[KWh][Mth]']);

  heatingData.forEach((heatingValue, index) => {
    const dataIndex = index; // Month index
    endUseData[dataIndex]['Heating[KWh_m2][Yr]'] += parseFloat(heatingValue);
    endUseData[dataIndex]['Cooling[KWh_m2][Yr]'] += parseFloat(coolingData[index]);
    endUseData[dataIndex]['Equipment[KWh_m2][Yr]'] += parseFloat(equipmentData[index]);
    endUseData[dataIndex]['Lighting[KWh_m2][Yr]'] += parseFloat(lightingData[index]);
    endUseData[dataIndex]['HotWater[KWh_m2][Yr]'] += parseFloat(hotWaterData[index]);
    endUseData[dataIndex]['PV[KWh_m2][Yr]'] += parseFloat(pvData[index]);
  });

});


// Create a stack generator
const stack = d3.stack()
.keys([buildingLayerCode])
  .order(d3.stackOrderNone)
  .offset(d3.stackOffsetNone);

// Generate stacked data
const stackedData = stack(endUseData);

  // Create SVG container dimensions and margins
  const svgWidth = 340;
  const svgHeight = 200;
  const margin = { top: 40, right: 20, bottom: 60, left: 70 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;

  // Create SVG container
  const svg = graphContainer.append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  // Create a group element for the graph and apply the left and top margin
  const graphGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

    graphGroup.append('text')
    .attr('class', 'graph-title')
    .attr('x', graphWidth / 2 )
    .attr('y', margin.top / 2 - 40 )
    .attr('font-size', '14px')
    .attr('text-anchor', 'middle')
    .text('Energy Use by Selected Metric');

    graphGroup.append('text')
    .attr('class', 'graph-title')
    .attr('x', graphWidth + 1 )
    .attr('y', graphHeight + 30)
    .attr('font-size', '10px')
    .attr('text-anchor', 'middle')
    .text('Month');

    graphGroup.append('text')
    .attr('class', 'graph-title')
    .attr('x', - 15)
    .attr('y', margin.top - 50)
    .attr('font-size', '10px')
    .attr('text-anchor', 'middle')
    .text('kWh');

  const maxSum = d3.max(endUseData, dataPoint => dataPoint[buildingLayerCode]);
    // Create scales

  const yScale = d3.scaleLinear()
    .domain([0, maxSum])
    .range([graphHeight, 0]);

  const xScale = d3.scaleLinear()
    .domain([1, 12]) // Assuming 12 months
    .range([0, graphWidth]);



  // Create color scale for different elements
  const colorScale = d3.scaleOrdinal()
  .domain([buildingLayerCode])
  .range([buildingCodeToColor[buildingLayerCode]]);


    graphGroup.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale).ticks(8));
    
  // Append a group for each stack
  const stackGroups = graphGroup.selectAll('.stack')
    .data(stackedData)
    .enter()
    .append('g')
    .attr('class', 'stack')
    .attr('fill', d => colorScale(d.key));

  // Append rectangles for each stack element
  stackGroups.selectAll('rect')
  .data(d => d)
  .enter()
  .append('rect')
  .attr('x', d => xScale(d.data.Month)) // Use 'Month' instead of 'month'
  .attr('y', d => yScale(d[1]))
  .attr('height', d => yScale(d[0]) - yScale(d[1]))
  .attr('width', xScale(1) - xScale(0)-5);


  graphGroup.append('g')
  .attr('class', 'x-axis')
  .attr('transform', `translate(0, ${graphHeight})`)
  .call(d3.axisBottom(xScale).ticks(12).tickFormat(d3.format('d'))); // Format ticks as integers 

  // Add reference line
 // Create a line group for reference lines
const referenceLineGroup = graphGroup.append('g')
.attr('class', 'reference-lines');

// Get the y-axis ticks as reference line values
const yTicks = graphGroup.selectAll('.y-axis .tick'); // Assuming your y-axis has the class 'y-axis'
const referenceLineValues = yTicks.data().map((d) => +d);

// Append reference lines for each y-axis tick
referenceLineValues.forEach((value) => {
referenceLineGroup.append('line')
.attr('x1', 0) // Start from the left edge of the graph
.attr('x2', graphWidth +25) // Extend to the right edge of the graph
.attr('y1', yScale(value))
.attr('y2', yScale(value))
.attr('class', 'reference-line')
.style('stroke', 'grey') // Customize line color as needed
.attr('stroke-width', .3)
.style('stroke-dasharray', '4 4');
});

  // Add legend
  const legend = svg.append('g')
  .attr('class', 'legend')
  .attr('transform', `translate(${margin.left}, ${svgHeight - margin.bottom + 20})`); // Adjust the vertical position

const legendSpacing = 100;

// Loop through the keys and add legend entries
colorScale.domain().forEach((key, index) => {
  const legendEntry = legend.append('g')
    .attr('transform', `translate(${(index % 3) * legendSpacing}, ${Math.floor(index / 3) * 20})`); // Adjust the horizontal and vertical positions

  legendEntry.append('rect')
    .attr('x', 0)
    .attr('y', 15)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', colorScale(buildingLayerCode));

  legendEntry.append('text')
    .attr('x', 15)
    .attr('y', 20)
    .attr('dy', '0.35em')
    .style('font-size', '10px')
    .text(buildingLayerCode);
});


  //console.log("End Use Data:" , endUseData);
};