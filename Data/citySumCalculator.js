const fs = require('fs');
const path = require('path');

// Function to calculate the sum of "Area_SQM_ESL" values
function sumArea(geojson) {
  let totalArea = 0;

  geojson.features.forEach(feature => {
    if (feature.properties && feature.properties.Area_SQM_ESL) {
      const areaValue = feature.properties.Area_SQM_ESL;

      // Check if the value is a valid number
      if (!isNaN(areaValue)) {
        totalArea += areaValue;
      }
    }
  });

  return totalArea;
}

// Function to calculate the sum of "Area_SQM_ESL" values
function sumCost(geojson) {
  let totalCost = 0;

  geojson.features.forEach(feature => {
    if (feature.properties && feature.properties['Cost[$][Yr]']) {
      const costValue = feature.properties['Cost[$][Yr]'];

      // Check if the value is a valid number
      if (!isNaN(costValue)) {
        totalCost += costValue;
      }
    }
  });

  return totalCost;
}

// Function to calculate the sum of "Area_SQM_ESL" values
function sumCo2(geojson) {
  let totalCo2 = 0;

  geojson.features.forEach(feature => {
    if (feature.properties && feature.properties['CO2[kg][Yr]']) {
      const co2Value = feature.properties['CO2[kg][Yr]'];

      // Check if the value is a valid number
      if (!isNaN(co2Value)) {
        totalCo2 += co2Value;
      }
    }
  });

  return totalCo2;
}


// Function to read GeoJSON from a file and calculate the sum of "Area_SQM_ESL" values
function sumAreaFromGeoJSONFile(filePath) {
  try {
    // Read the GeoJSON file synchronously
    const geojson = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Call the existing sumArea function to calculate the sum of "Area_SQM_ESL" values
    const totalArea = sumArea(geojson);
    const totalCost = sumCost(geojson);
    const totalCo2 = sumCo2(geojson);

    return { totalArea, totalCost, totalCo2 };
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Get the path to the GeoJSON file
const geojsonFilePath = path.join(__dirname, 'ithaca_energy_buildingData_1107.geojson');

// Call the function and log the result
const result = sumAreaFromGeoJSONFile(geojsonFilePath);
console.log("Total Area:", result.totalArea);
console.log("Total Cost:", result.totalCost);
console.log("Total Co2:", result.totalCo2);
