
import React, { useRef, useEffect , useState} from 'react';

 export const roundValue = (value) => {

    if (value > 11000){
      return Math.round(value / 1000) * 1000;
    }

     if (value > 1000){
        return Math.round(value / 100) * 100;
      }

     if (value > 100){
      return Math.round(value / 10) * 10;
    }

    if (value > 10){
      return Math.round(value / 5) * 5;
    }


      else{
        return value.toFixed(0);
      }
  }

  // Import any necessary dependencies here if needed

// Function to generate the color legend
export const generateLegend = (displayingLayers, maxStreetValue, maxBlockValue, maxBuildingValue, maxFeederValue, maxCurrentValue, buildingLayerCode, feederLayerCode, mobilityLayerCode, legendUnit, setMaxStreetValue, setMaxBlockValue, setMaxBuildingValue, setMaxFeederValue, setMaxCurrentValue) => {
  const legendItems = [];
  let currentMax = 9;
  let colorScale = getColorScale(mobilityLayerCode, currentMax);

  if (displayingLayers.includes('mobility-Street-Detailed')) {
    currentMax = maxStreetValue;
    colorScale = getColorScale(mobilityLayerCode, currentMax);
  } else if (displayingLayers.includes('mobility-Block-Detailed')) {
    currentMax = maxBlockValue;
    colorScale = getColorScale(mobilityLayerCode, currentMax);
  } else if (displayingLayers.includes('energy-Building')) {
    currentMax = maxBuildingValue;
    colorScale = getColorScale(buildingLayerCode, currentMax);
  } else if (displayingLayers.includes('energy-Feeder')) {
    currentMax = maxFeederValue;
    colorScale = getColorScale(feederLayerCode, currentMax);
  }

  // Add the legend title at the top of the legend
  legendItems.push(
    <div key="legend-title" className="legend-title">
      {legendUnit}
    </div>
  );

  // Use the getColorScale function to get the color scale array

  legendItems.push(<div className="input-container">{generateMaxInputValue()}</div>);
  
  // Loop through the color scale array in reverse order to create legend items
  for (let i = colorScale.length - 2; i >= 2; i -= 2) {
    const value = parseFloat(colorScale[i]); // Convert value to a number
    const color = colorScale[i + 1];

    legendItems.push(
      <div key={value} className="legend-item">
        <span className="value-label">{roundValue(value)}</span>
        <div className="color-swatch" style={{ backgroundColor: color }} />
      </div>
    );
  }

  return legendItems;
};

// Function to generate the max input value for user self-define
export const generateMaxInputValue = (
  displayingLayers,
  maxStreetValue,
  maxBlockValue,
  maxBuildingValue,
  maxFeederValue,
  maxCurrentValue,
  setMaxStreetValue,
  setMaxBlockValue,
  setMaxBuildingValue,
  setMaxFeederValue
) => {
  if (displayingLayers.includes('mobility-Street-Detailed')) {
    return (
      <input
        id="user-max-value"
        type="number"
        value={parseInt(maxStreetValue)}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          setMaxStreetValue(value);
        }}
        onBlur={(e) => {
          if (maxStreetValue < 10) {
            setMaxStreetValue(10);
          }
          if (e.target.value.trim() === '') {
            setMaxStreetValue(maxCurrentValue);
          }
        }}
        placeholder="Enter Max Value"
        inputMode="numeric"
      />
    );
  } else if (displayingLayers.includes('mobility-Block-Detailed')) {
    return (
      <input
        id="user-max-value"
        type="number"
        value={parseInt(maxBlockValue)}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          setMaxBlockValue(value);
        }}
        onBlur={(e) => {
          if (maxBlockValue < 10) {
            setMaxBlockValue(10);
          }
          if (e.target.value.trim() === '') {
            setMaxBlockValue(maxCurrentValue);
          }
        }}
        placeholder="Enter Max Value"
        inputMode="numeric"
        />
      )
      } else if (displayingLayers.includes('energy-Building')) {
      return (
        <input
          id="user-max-value"
          type="number"
          value={parseInt(maxBuildingValue)}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setMaxBuildingValue(value);

          }}
          onBlur={(e) => {
            if (maxBuildingValue < 10) {
              setMaxBuildingValue(10);
            }
            if (e.target.value.trim() === '') {
              setMaxBuildingValue(maxCurrentValue);
            }
          }}
          placeholder="Enter Max Value"
          inputMode="numeric"
        />
      );
    } else if (displayingLayers.includes('energy-Feeder')) {
      return (
        <input
          id="user-max-value"
          type="number"
          value={parseInt(maxFeederValue)}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setMaxFeederValue(value);

          }}
          onBlur={(e) => {
            if (maxFeederValue < 10) {
              setMaxFeederValue(10);
            }
            if (e.target.value.trim() === '') {
              setMaxFeederValue(maxCurrentValue);
            }
          }}
          placeholder="Enter Max Value"
          inputMode="numeric"
        />
      );
    }
};

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


  /*

  const initialMaxValueRef = useRef(maxStreetValue);

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

  */
