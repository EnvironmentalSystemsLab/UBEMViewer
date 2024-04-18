import React, { useRef, useEffect , useState} from 'react';
import * as d3 from 'd3';
  
  // trying to read the max value as 100%, then arrange each object into its range.
  const ColorScaleRef = [
    0, "rgba(65, 182, 196, 0.6)",
    10, "rgba(127, 205, 187, 0.6)",
    20, "rgba(199, 233, 180, 0.6)",
    30, "rgba(237, 248, 177, 0.6)",
    40, "rgba(255, 255, 204, 0.6)",
    50, "rgba(255, 237, 160, 0.6)",
    60, "rgba(254, 217, 118, 0.6)",
    70, "rgba(254, 178, 76, 0.6)",
    80, "rgba(253, 141, 60, 0.6)",
    90, "rgba(252, 78, 42, 0.6)",
    100, "rgba(227, 26, 28, 0.6)"
  ].sort((a, b) => a - b);

 
 // Default Coloring logic for Street between value and color code
 export const getColorScale = (field, maxValue) => {
    if (maxValue === null || isNaN(maxValue) || maxValue < 9) {
      // If maxValue is null or not a valid number, set it to 0
      maxValue = 9;
    } 

    const numSteps = 10; // Number of steps to create between 0 and maxValue
    const stepSize = maxValue / numSteps;
  
    const colorScale = [
      'interpolate',
      ['linear'],
      ['to-number', ['get', field]],
      0,'rgba(65, 182, 196, 0.85)', // Default color for values less than the first stop
    ];
  
    // Manually define the color stops with corresponding colors
    const colorStops = [];
  
    for (let i = 1; i <= numSteps; i++) {
      if(i === 1){
        const stopValue = i * stepSize;
        colorStops.push({ stop: stopValue, color:'rgba(127, 205, 187, .99)'});
      }
      if(i === 2){
        const stopValue = i * stepSize;
        colorStops.push({ stop: stopValue, color: 'rgba(199, 233, 180, .99)' });
      }
      if (i === 3) {
        const stopValue = i * stepSize;
        colorStops.push({ stop: stopValue, color: 'rgba(220, 230, 177, 0.99)' });
      }
      if (i === 4) {
        const stopValue = i * stepSize;
        colorStops.push({ stop: stopValue, color: 'rgba(247, 237, 195,0.99)' });
      }
      if (i === 5) {
        const stopValue = i * stepSize;
        colorStops.push({ stop: stopValue, color: 'rgba(250, 240, 160, 0.99)' });
      }
      if (i === 6) {
        const stopValue = i * stepSize;
        colorStops.push({ stop: stopValue, color: 'rgba(255, 200, 118, 0.99)' });
      }
      if(i === 7){
        const stopValue = i * stepSize;
        colorStops.push({ stop: stopValue, color: 'rgba(254, 178, 76, .99)' });
      }
      if(i === 8){
        const stopValue = i * stepSize;
        colorStops.push({ stop: stopValue, color: 'rgba(253, 141, 60, .99)'});
      }
      if(i === 9){
        const stopValue = i * stepSize;
        colorStops.push({ stop: stopValue,  color: 'rgba(252, 78, 42, .99)'});
      }
      if(i === 10){
        const stopValue = i * stepSize;
        colorStops.push({ stop: stopValue, color: 'rgba(227, 26, 28, .99)'});
      }
      
    }
  
    // Push the stop-value, color pairs into the colorScale array
    for (const stopInfo of colorStops) {
      const stopValue = stopInfo.stop;
      const color = stopInfo.color;
      colorScale.push(stopValue, color);
    }
  
    //console.log(colorScale)

    return colorScale;
  };
 
  // Generate color legend 
export const FakeGenerateLegend = (displayingLayers, maxStreetValue, maxBlockValue, layerCode, buildingLayerCode, feederLayerCode) => {
  const legendItems = [];
  let currentMax = 9;
  let colorScale = null;
 
  if (displayingLayers.includes('mobility-Street-Detailed')){
    currentMax = maxStreetValue;
    colorScale = getColorScale(layerCode, currentMax)
    
  } else if (displayingLayers.includes('mobility-Block-Detailed')){
    currentMax = maxBlockValue;
    colorScale = getColorScale(layerCode, currentMax)
   
  }else if (displayingLayers.includes('energy-Building')){
    currentMax = maxBuildingValue;
    colorScale = getColorScale(buildingLayerCode, currentMax);
  }else if (displayingLayers.includes('energy-Feeder')){
    currentMax = maxFeederValue;
    colorScale = getColorScale(feederLayerCode, currentMax);
  }


  // Use the getColorScale function to get the color scale array
 

  legendItems.push( <div className="input-container"> {generateMaxInputValue()}</div>)
  // Loop through the color scale array in reverse order to create legend items
  for (let i = colorScale.length - 2; i >= 2; i -= 2) {
    const value = parseFloat(colorScale[i]); // Convert value to a number
    const color = colorScale[i +1];
    
    

    legendItems.push(
      <div key={value} className="legend-item">
        <span className="value-label">{value.toFixed(0)}</span>
        <div className="color-swatch" style={{ backgroundColor: color }} />
      </div>
    );
  }

  // Add the legend title at the bottom of the legend
  legendItems.push(
    <div key="legend-title" className="legend-title">
       People / hr 
    </div>
  );

  return legendItems;
};

// for user to self0define the maxvalue for comparison
 const generateMaxInputValue = (displayingLayers, maxStreetValue,maxBlockValue ) => {
  if (displayingLayers.includes('mobility-Street-Detailed')) {
    return (
      <input
        id="user-max-value"
        type="number"
        value={Math.floor(maxStreetValue)}
        onChange={(e) => {
          // Parse the input value to a float and set the max value as an integer
          const value = parseInt(e.target.value);
          setMaxStreetValue(value);
        }}
        onBlur={handleBlur}
        placeholder="Enter Max Value"
        inputMode="numeric"
      />
    );
  } else if (displayingLayers.includes('mobility-Block-Detailed')) {
    return (
      <input
        id="user-max-value"
        type="number"
        value={Math.floor(maxBlockValue)}
        onChange={(e) => {
          // Parse the input value to a float and set the max value as an integer
          const value = parseInt(e.target.value);
          setMaxBlockValue(value);
        }}
        onBlur={handleBlur}
        placeholder="Enter Max Value"
        inputMode="numeric"
      />
    );
  }
};

 const handleBlur = (e) => {
  // If the input value is empty, reset the max value to its initial value
  if (e.target.value.trim() === '') {
    if (displayingLayers.includes('mobility-Street-Detailed')) {
      setMaxStreetValue(initialMaxValueRef.current);
    } else if (displayingLayers.includes('mobility-Block-Detailed')) {
      setMaxBlockValue(initialMaxValueRef.current);
    }
  }
};


 const OriGetColorScale = (field, maxValue) => {
  if (maxValue === null || isNaN(maxValue) || maxValue < 9) {
    // If maxValue is null or not a valid number, set it to 0
    maxValue = 9;
  } 

  const numSteps = 10; // Number of steps to create between 0 and maxValue
  const stepSize = maxValue / numSteps;

  const colorScale = [
    'interpolate',
    ['linear'],
    ['to-number', ['get', field]],
    0,'rgba(65, 182, 196, 0.85)', // Default color for values less than the first stop
  ];

  // Manually define the color stops with corresponding colors
  const colorStops = [];

  for (let i = 1; i <= numSteps; i++) {
    if(i === 1){
      const stopValue = i * stepSize;
      colorStops.push({ stop: stopValue, color:'rgba(127, 205, 187, .99)'});
    }
    if(i === 2){
      const stopValue = i * stepSize;
      colorStops.push({ stop: stopValue, color: 'rgba(199, 233, 180, .99)' });
    }
    if(i === 3){
      const stopValue = i * stepSize;
      colorStops.push({ stop: stopValue, color: 'rgba(237, 248, 177, .99)' });
    }
    if(i === 4){
      const stopValue = i * stepSize;
      colorStops.push({ stop: stopValue, color: 'rgba(255, 255, 204, .99)'  });
    }
    if(i === 5){
      const stopValue = i * stepSize;
      colorStops.push({ stop: stopValue, color: 'rgba(255, 237, 160, .99)' });
    }
    if(i === 6){
      const stopValue = i * stepSize;
      colorStops.push({ stop: stopValue, color: 'rgba(254, 217, 118,.99)' });
    }
    if(i === 7){
      const stopValue = i * stepSize;
      colorStops.push({ stop: stopValue, color: 'rgba(254, 178, 76, .99)' });
    }
    if(i === 8){
      const stopValue = i * stepSize;
      colorStops.push({ stop: stopValue, color: 'rgba(253, 141, 60, .99)'});
    }
    if(i === 9){
      const stopValue = i * stepSize;
      colorStops.push({ stop: stopValue,  color: 'rgba(252, 78, 42, .99)'});
    }
    if(i === 10){
      const stopValue = i * stepSize;
      colorStops.push({ stop: stopValue, color: 'rgba(227, 26, 28, .99)'});
    }
    
  }

  // Push the stop-value, color pairs into the colorScale array
  for (const stopInfo of colorStops) {
    const stopValue = stopInfo.stop;
    const color = stopInfo.color;
    colorScale.push(stopValue, color);
  }

  //console.log(colorScale)

  return colorScale;
};

/*
const BackupColorScale = [
  'interpolate',
  ['linear'],
  ['to-number', ['get', field]],
  0,'#AFB1E9', // Default color for values less than the first stop
];

// Manually define the color stops with corresponding colors
const BackUpcolorStops = [];

for (let i = 1; i <= numSteps; i++) {
  if(i === 1){
    const stopValue = i * stepSize;
    colorStops.push({ stop: stopValue, color:'#B2A3D9'});
  }
  if(i === 2){
    const stopValue = i * stepSize;
    colorStops.push({ stop: stopValue, color: '#B594C8' });
  }
  if(i === 3){
    const stopValue = i * stepSize;
    colorStops.push({ stop: stopValue, color: '#B886B7' });
  }
  if(i === 4){
    const stopValue = i * stepSize;
    colorStops.push({ stop: stopValue, color: '#BB77A6'  });
  }
  if(i === 5){
    const stopValue = i * stepSize;
    colorStops.push({ stop: stopValue, color: '#BD6996' });
  }
  if(i === 6){
    const stopValue = i * stepSize;
    colorStops.push({ stop: stopValue, color: '#C05A85' });
  }
  if(i === 7){
    const stopValue = i * stepSize;
    colorStops.push({ stop: stopValue, color: '#C34C74'  });
  }
  if(i === 8){
    const stopValue = i * stepSize;
    colorStops.push({ stop: stopValue, color: '#C63D63'});
  }
  if(i === 9){
    const stopValue = i * stepSize;
    colorStops.push({ stop: stopValue,  color: '#C92F53' });
  }
  if(i === 10){
    const stopValue = i * stepSize;
    colorStops.push({ stop: stopValue, color: '#CC2042'});
  }
  
}
*/