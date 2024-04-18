// main CSS file
import './indexStyle.css'
import ReactDOM from 'react-dom';

// Import from other pacakges
import React, { useRef, useEffect, useState } from 'react';

import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import sgMail from '@sendgrid/mail';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';


// Import from other classes
import { getColorScale } from "./Containers/MapLogic/coloringLogic"

import { roundValue } from "./Containers/MapLogic/legendLogic"

import { openPopup } from "./Containers/MapLogic/popupLogic"

import {
  clearSelectedAreas,
  exportSelectedAreas
} from "./Containers/MapLogic/selectionLogic"

import {
  generateMobilitySenarioBarGraph,
  generateMobilitySummaryBarGraph,
  generateWeekdayBarGraph,
  generateWeekendBarGraph,
}from "./Containers/GraphGeneration/mobilityGraph"

import {
  generateBuildingSenarioGraph,
  generateSummaryUseGraph,
  generateEndUseGraph,
  generateFuelUseGraph,
  generateWinterEnergyLoadGraph,
  generateSummerEnergyLoadGraph,
  generateLoadDurationGraph
} from "./Containers/GraphGeneration/energyGraph"

import {
  getHighlightedLayerId,
  getOtherLayerId,
  toggleableLayers
} from "./Containers/MapLogic/layerManagement"

// Import from other modules
import HomePage from './ReturnBlock/HomePage';
import SelectionTutorial from './ReturnBlock/SelectionTutorial';
import DashboardSelector from './ReturnBlock/DashboardSelector';
import BuildingSelection from './ReturnBlock/BuildingSelection'
import FeederSelection from './ReturnBlock/FeederSelection'
import FirstMobilitySelection from './ReturnBlock/FirstMobilitySelection'
import SecondMobilitySelection from './ReturnBlock/SecondMobilitySelection'
import LoginPopup from './ReturnBlock/LoginPopup'
import MobilityTabSwitch from './ReturnBlock/MobilityTabSwitch'
import BuildingTabSwitch from './ReturnBlock/BuildingTabSwitch'
import FeederTabSwitch from './ReturnBlock/FeederTabSwitch'
import MobilityScenario from './ReturnBlock/MobilityScenario'
import ImportGeojson from './ReturnBlock/ImportGeojson'



// Tokens for accesing Mapbox and email Service
mapboxgl.accessToken = 'pk.eyJ1Ijoia3g2NCIsImEiOiJjbGkzd2E1dmsxMzNoM2twY2p2azF0bGVlIn0.t_v73kaAMUtoGBPESpw3uA';

sgMail.setApiKey('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');

//import { sendEmail } from "./MapLogic/contactManagement"

// Source data 
const ITHACA_BOUNDARY_URL =
  "./Data/ithaca_mobility_summary.geojson"

const ITHACA_MOBILITY_URL =
  "./Data/ithaca_mobility_summary_point.geojson"

const ITHACA_ENERGY_URL_INITIAL =
"./Data/ithaca_siteSummary_energy.geojson";

const BUILDING_DATA_URL_INITIAL =
"./Data/ithaca_energy_buildingData_1107.geojson";

const FEEDER_DATA_URL =
  "./Data/ithaca_energy_feeder.geojson"

const STREET_DATA_URL =
  './Data/ithaca_trip_volume_by_streets.geojson' // full file for finding max value

const BLOCK_DATA_URL =
  './Data/ithaca_trip_volume_from_blocks.geojson' // full file for finding max value

const MOBILITY_METRIC_URL =
  './Data/mobility_metric_specification.json' // full file for finding max value

const ENERGY_METRIC_URL =
  './Data/energy_metric_specification.json' // full file for finding max value

const STREET_DATA_URL_MVT =
  "https://geotile.urbano.io/Ithaca_TripVolume/{z}/{x}/{y}.mvt"


// Main function for running the whole website.
function App() {

  //default setting for map constructor 
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  const [selectionValues, setSelectionValues] = useState([0, 398]);
 
  // flexible Source data 
  const [BUILDING_DATA_URL, setBuildingDataUrl] = useState(BUILDING_DATA_URL_INITIAL);
  const [ITHACA_ENERGY_URL, setIthacaEnergyUrl] = useState(ITHACA_ENERGY_URL_INITIAL);

  // default setting for map style
  const [isDarkMode, setIsDarkMode] = useState(true);
  const darkMode = 'mapbox://styles/kx64/cli3wnmsr04wo01qnee2w7n93';
  const lightMode = 'mapbox://styles/kx64/cljdd8xr6003l01qkbxctho6q';

  // for changing tile and info and modular contianer when switching between different city API
  const [title, setTitle] = useState('Urbano.io');
  const [cityInfoText, setCityInfoText] = useState('');

  // container for manage sidebar module's visivility.
  const [homeContainerVisible, setHomeContainerVisible] = useState(true);
  const [generalContainerVisible, setGeneralContainerVisible] = useState(false);
  const [mobilityContainerVisible, setMobilityContainerVisible] = useState(false);
  const [blockContainerVisible, setBlockContainerVisible] = useState(false);
  const [energyContainerVisible, setEnergyContainerVisible] = useState(false);
  const [buildingContainerVisible, setBuildingContainerVisible] = useState(false);
  const [feederContainerVisible, setFeederContainerVisible] = useState(false);
  const [notUsingContainerVisible, setNotUsingContainerVisible] = useState(false);
  const [metricSelectionContainerVisible, setMetricSelectionContainerVisible] = useState(false);
  const [selectedMobilityGraph, setSelectedMobilityGraph] = useState('weekday');
  const [selectedEnergyBuildingGraph, setSelectedEnergyBuildingGraph] = useState('enduse');
  const [selectedEnergyGridGraph, setSelectedEnergyGridGraph] = useState('winter');

  // Variables For manage layer and layer selector's visibility 
  const [displayingLayers, setDisplayingLayers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Variables For manage selected areas
  const sAreas = useRef(new Set()); // Set to store selected areas
 // const selectedAreas = useRef([]); // Array to store selected areas
  const [sAreasLength, setSAreasLength] = useState(0);

  // layerCode State Variables series for query specific visualization type
  const [mobilityLayerCode, setMobilityLayerCode] = useState(('1_1_-1_-1_-1_-1'));
  const [buildingLayerCode, setBuildingLayerCode] = useState(("Gas[kWh_m2][Yr]"));
  const [feederLayerCode, setFeederLayerCode] = useState(('PeakHourElectricityDemand_KW'));

  // maxValue State Variables setting 
  const [maxStreetValue, setMaxStreetValue] = useState(12857);
  const [maxBlockValue, setMaxBlockValue] = useState(1700);
  const [maxBuildingValue, setMaxBuildingValue] = useState(1000);
  const [minBuildingValue, setMinBuildingValue] = useState(0);
  const [maxFeederValue, setMaxFeederValue] = useState(53143);
  const [maxCurrentValue, setMaxCurrentValue] = useState(1);
  const [minCurrentValue, setMinCurrentValue] = useState(1);
  const [propertiesNumber, setPropertiesNumber] = useState({
    season: 1, // the data only has Spring so far
    mode: -1,
    weekday: 1,
    timeOfDay: -1,
    fromActivity: -1,
    toActivity: -1,
  });

  // legend Unit State Variables setting 
  const [legendUnit, setLegendUnit] = useState("People/hr");

  //for displaying current selected layer in Metric selector
  const [selectedLayerLabel, setSelectedLayerLabel] = useState(
    displayingLayers.length > 0
      ? toggleableLayers.find((layer) => layer.id === displayingLayers[0])?.label
      : 'Dashboard Selector'
  );

  // Click title to back home page      
  const handleTitleClick = () => {
    if (mapRef.current) {

      const map = mapRef.current;

      displayingLayers.forEach((layerId) => {
        map.setLayoutProperty(layerId, 'visibility', 'none');
      });

      setTitle('Urbano.io');

      setBuildingContainerVisible(false);
      setMobilityContainerVisible(false);
      setBlockContainerVisible(false);
      setEnergyContainerVisible(false);
      setFeederContainerVisible(false);
      setGeneralContainerVisible(false);
      setHomeContainerVisible(true);


      clearSelectedAreas(mapRef, sAreas);
      setSAreasLength(sAreas.current.size);

      map.flyTo({
        center: [-76.5087, 42.4558],
        zoom: 8,
      });
    }

  };

  // Click digital twin menu to access different API 
  const handleDigitalTwinClick = () => {
    if (mapRef.current) {

      const map = mapRef.current;

      map.flyTo({
        center: [-76.5087, 42.4440],
        zoom: 13,
      });

      setDisplayingLayers(['energy-Building', 'energy-Building-highlighted', 'energy-Building-other']);

      displayingLayers.forEach((layerId) => {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
      });

      setTitle('Urbano.io / Ithaca');
      setCityInfoText('Ithaca /ˈɪθəkə/ is a city and the county seat of Tompkins County, New York, United States. Situated on the southern shore of Cayuga Lake in the Finger Lakes region of New York, Ithaca is the largest community in the Ithaca metropolitan statistical area. It is named after the Greek island of Ithaca.')


      setHomeContainerVisible(false);
      setGeneralContainerVisible(true);
      setMobilityContainerVisible(false);

      clearSelectedAreas(mapRef,sAreas);
      setSAreasLength(sAreas.current.size);

      popup.remove();

    }

  };

   // Switch between different graph
  const handleGraphClick = (event) => {
    if(event.target.value == "weekend"|| event.target.value == "weekday"){
    setSelectedMobilityGraph(event.target.value);
    }
    if(event.target.value == "summary"|| event.target.value == "enduse"||event.target.value == "fueluse"){
      setSelectedEnergyBuildingGraph(event.target.value);
      }
    if(event.target.value == "winter"||event.target.value == "summer"||event.target.value == "loadduration"){
      setSelectedEnergyGridGraph(event.target.value);
      }
  };

  // For changing current mobility layer
  const handlePropertyChange = (property, value) => {
    setPropertiesNumber((prevState) => ({
      ...prevState,
      [property]: parseInt(value),
    }));
  };

  const handleSubmit = () => {
    // 1 represent Spring since the geoJSON only contains the Spring data so far, will update later.
    const testOutput =
      `1_${propertiesNumber.weekday}_${propertiesNumber.mode}_${propertiesNumber.timeOfDay}_${propertiesNumber.fromActivity}_${propertiesNumber.toActivity}`;

    setMobilityLayerCode(testOutput);

    console.log("the layer Code you selected is", mobilityLayerCode);

  };

  const handleGroupSelect = () => {
      
  };


  // For calling clearSelectedAreas by ESC key
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        clearSelectedAreas(mapRef,sAreas);
        setSAreasLength(sAreas.current.size);


        // TBD, how to intialize the graph data back to the orignal data?

        if (displayingLayers.includes("energy-Building")) {
          generateEndUseBarGraph(sAreas, mapRef);
          generateFuelUseBarGraph(sAreas, mapRef);
         
        }

        if (displayingLayers.includes("energy-Feeder")) {

          generateWinterEnergyLoadGraph(sAreas, mapRef);
          generateSummerEnergyLoadGraph(sAreas, mapRef);
          generateLoadDurationGraph(sAreas, mapRef);

        }

        if (displayingLayers.includes("mobility-Block-Detailed")) {
          generateMobilitySenarioBarGraph(sAreas, mapRef);
          generateMobilitySummaryBarGraph(sAreas, mapRef);
          generateWeekdayBarGraph(sAreas, mapRef);
          generateWeekendBarGraph(sAreas, mapRef);

        }

        if (displayingLayers.includes("mobility-Street-Detailed")) {
          generateMobilitySenarioBarGraph(sAreas, mapRef);
          generateMobilitySummaryBarGraph(sAreas, mapRef);
          generateWeekdayBarGraph(sAreas, mapRef);
          generateWeekendBarGraph(sAreas, mapRef);

        }

      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // For finding the max value of the current selected layer (in mobility STREET)
  useEffect(() => {
    // Load the GeoJSON data
    fetch(STREET_DATA_URL)
      .then((response) => response.json())
      .then((data) => {
        // Extract property values and convert to numbers
        const propertyValues = data.features.map((feature) => {
          const propertyValue = feature.properties[mobilityLayerCode]?.replace(/,/g, '') || 0; // Use 0 if property is missing or not a valid number
          return propertyValue;
        });

        // Sort the property values in ascending order
        propertyValues.sort((a, b) => a - b);

        // Calculate the first quartile (Q1) and the third quartile (Q3)
        const Q1Index = Math.floor(propertyValues.length * 0.05);
        const Q3Index = Math.floor(propertyValues.length * 0.95);
        const Q1 = propertyValues[Q1Index];
        const Q3 = propertyValues[Q3Index];

        // Calculate the interquartile range (IQR)
        const IQR = Q3 - Q1;

        // Define the threshold value as Q3 + (1.5 * IQR)
        const threshold = Q3 + (1.5 * IQR);

        // Filter out data points greater than the threshold
        const filteredValues = propertyValues.filter((value) => value <= threshold);

        // Get the maximum value from the remaining data points
        const maxVal = Math.max(...filteredValues);

        setMaxStreetValue(maxVal);

        if (displayingLayers.includes("mobility-Street-Detailed")) {
          setMaxCurrentValue(maxVal);
        }

      })
      .catch((error) => {
        console.error('Error loading GeoJSON data:', error);
      });



  }, [mobilityLayerCode]);



  // For finding the max value of the current selected layer (in mobility BLOCK)
  useEffect(() => {
    // Load the GeoJSON data
    fetch(BLOCK_DATA_URL)
      .then((response) => response.json())
      .then((data) => {
        // Extract property values and convert to numbers
        const propertyValues = data.features.map((feature) => {
          const propertyValue = parseFloat(feature.properties[mobilityLayerCode]?.replace(/,/g, '')) || 0; // Use 0 if property is missing or not a valid number
          return propertyValue;
        });

        // Sort the property values in ascending order
        propertyValues.sort((a, b) => a - b);

        // Calculate the first quartile (Q1) and the third quartile (Q3)
        const Q1Index = Math.floor(propertyValues.length * 0.05);
        const Q3Index = Math.floor(propertyValues.length * 0.95);
        const Q1 = propertyValues[Q1Index];
        const Q3 = propertyValues[Q3Index];

        // Calculate the interquartile range (IQR)
        const IQR = Q3 - Q1;

        // Define the threshold value as Q3 + (1.5 * IQR)
        const threshold = Q3 + (1.5 * IQR);

        // Filter out data points greater than the threshold
        const filteredValues = propertyValues.filter((value) => value <= threshold);

        // Get the maximum value from the remaining data points
        const maxVal = Math.max(...filteredValues);

        setMaxBlockValue(maxVal);

        if (displayingLayers.includes("mobility-Block-Detailed")) {
          setMaxCurrentValue(maxVal);
        }

      })
      .catch((error) => {
        console.error('Error loading GeoJSON data:', error);
      });
  }, [mobilityLayerCode]);

  // For finding the max value of the current selected layer (in energy BUILDING)
  useEffect(() => {
    // Load the GeoJSON data
    fetch(BUILDING_DATA_URL)
      .then((response) => response.json())
      .then((data) => {
        // Extract property values and convert to numbers
        const propertyValues = data.features.map((feature) => {
          const propertyValue = feature.properties[buildingLayerCode] || 0;
          // Use 0 if property is missing or not a valid number
          return propertyValue;
        });

        // Sort the property values in ascending order
        propertyValues.sort((a, b) => a - b);

        // Calculate the first quartile (Q1) and the third quartile (Q3)
        const Q1Index = Math.floor(propertyValues.length * 0.2);
        const Q3Index = Math.floor(propertyValues.length * 0.8);
        const Q1 = propertyValues[Q1Index];
        const Q3 = propertyValues[Q3Index];

        // Calculate the interquartile range (IQR)
        const IQR = Q3 - Q1;

        // Define the threshold value as Q3 + (1.5 * IQR)
        const threshold = Q3 + (1.5 * IQR);

        // Filter out data points greater than the threshold
        const filteredValues = propertyValues.filter((value) => value <= threshold);

        // Get the maximum and minimum value from the remaining data points
        const maxVal = Math.max(...filteredValues);
        const minVal = Math.min(...filteredValues);
        
        setMaxBuildingValue(maxVal);
        setMinBuildingValue(minVal);

        if (displayingLayers.includes("energy-Building")) {
          setMaxCurrentValue(maxVal);
          setMinCurrentValue(minVal);
        }

        // console.log("max building value is", maxBuildingValue);
      })
      .catch((error) => {
        console.error('Error loading GeoJSON data:', error);
      });
  }, [buildingLayerCode, BUILDING_DATA_URL]);


  // For finding the max value of the current selected layer (in energy FEEDER)
  useEffect(() => {
    // Load the GeoJSON data
    fetch(FEEDER_DATA_URL)
      .then((response) => response.json())
      .then((data) => {
        // Extract property values and convert to numbers
        const propertyValues = data.features.map((feature) => {
          const propertyValue = parseFloat(String(feature.properties[feederLayerCode]).replace(/,/g, '')) || 0;
          // Use 0 if property is missing or not a valid number
          return propertyValue;
        });

        // Sort the property values in ascending order
        propertyValues.sort((a, b) => a - b);

        // Calculate the first quartile (Q1) and the third quartile (Q3)
        const Q1Index = Math.floor(propertyValues.length * 0.2);
        const Q3Index = Math.floor(propertyValues.length * 0.8);
        const Q1 = propertyValues[Q1Index];
        const Q3 = propertyValues[Q3Index];

        // Calculate the interquartile range (IQR)
        const IQR = Q3 - Q1;

        // Define the threshold value as Q3 + (1.5 * IQR)
        const threshold = Q3 + (1.5 * IQR);

        // Filter out data points greater than the threshold
        const filteredValues = propertyValues.filter((value) => value <= threshold);

        // Get the maximum value from the remaining data points
        const maxVal = Math.max(...filteredValues);
        

        setMaxFeederValue(maxVal);

        if (displayingLayers.includes("energy-Feeder")) {
          setMaxCurrentValue(maxVal);
        }

        //console.log("max Feeder Value: ", maxFeederValue);
      })
      .catch((error) => {
        console.error('Error loading GeoJSON data:', error);
      });
  }, [feederLayerCode]);

  // Generate color legend 
  const generateLegend = (displayingLayers) => {
    const legendItems = [];
    let currentMax = 9;
    let colorScale = getColorScale(mobilityLayerCode, currentMax);

    if (displayingLayers.includes('mobility-Street-Detailed')) {
      currentMax = maxStreetValue;
      colorScale = getColorScale(mobilityLayerCode, currentMax)
    } else if (displayingLayers.includes('mobility-Block-Detailed')) {
      currentMax = maxBlockValue;
      colorScale = getColorScale(mobilityLayerCode, currentMax)
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


    legendItems.push(<div className="input-container"> {generateMaxInputValue()}</div>)
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
  }

  // for user to self define the maxvalue for comparison
  const generateMaxInputValue = () => {
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

      );
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

  // map constructor
  useEffect(() => {

    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: lightMode,
      center: [-76.5087, 42.4558],
      zoom: 8.5,
      dragRotate: false, // Disable map rotation when dragging with the Ctrl key
      accessToken: mapboxgl.accessToken,
    });

    mapRef.current = map;
    // const map = mapRef.current; // for using in other useEffect() block

    return () => {
      if (map) {
        map.remove();
      }
    };

  }, [isDarkMode]);


  //Add geocoder function
  useEffect(() => {
    if (mapRef.current) {

      const map = mapRef.current;

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        flyTo: {
          bearing: 0,
          // Control the flight curve, making it move slowly and
          // zoom out almost completely before starting to pan.
          speed: 2, // Make the flying slow.
          curve: 1, // Change the speed at which it zooms out.
          // This can be any easing function: it takes a number between
          // 0 and 1 and returns another number between 0 and 1.
          easing: function (t) {
            return t;
          }
        },
        mapboxgl: mapboxgl,
      });

      map.addControl(geocoder);

    }
  }, []);

  // Add navigation control
  useEffect(() => {
    if (mapRef.current) {

      const map = mapRef.current;

      map.addControl(new mapboxgl.NavigationControl());

    }
  }, []);

  // FINAL Mobility layer 
  useEffect(() => {
    if (mapRef.current) {

      const map = mapRef.current;

      var clickedItems = []; // Array to store clicked selected values

      // for adding event
      const canvas = map.getCanvasContainer();

      // Variable to hold the starting xy coordinates
      // when `mousedown` occured.
      let start;

      // Variable to hold the current xy coordinates
      // when `mousemove` or `mouseup` occurs.
      let current;

      // Variable for the draw box element.
      let box;

      // Disable default box zooming

      // map.boxZoom.disable();

      map.on('load', function () {

        const layers = map.getStyle().layers;
        // Find the index of the first symbol layer in the map style.
        let firstSymbolId;
        for (const layer of layers) {
          if (layer.type === 'symbol') {
            firstSymbolId = layer.id;
            break;
          }
        }

        // Add the source to query
        map.addSource('mobility-Street-mvt', {
          "type": "vector",
          "tiles": [STREET_DATA_URL_MVT],
        });

        map.addSource('mobility-Street-geojson', {
          "type": "geojson",
          "data": STREET_DATA_URL,
        });

        map.addSource('mobility-Block-geojson', {
          "type": "geojson",
          "data": BLOCK_DATA_URL,
        });

        map.addSource('mobility-Ithaca', {
          "type": "geojson",
          "data": ITHACA_BOUNDARY_URL,
        });

        map.addSource('mobility-Ithaca-dot', {
          "type": "geojson",
          "data": ITHACA_MOBILITY_URL,
        });

        map.addLayer(
          {
            "id": 'mobility-Block-Detailed',
            "type": 'fill',
            "source": 'mobility-Block-geojson',
            //"source-layer": "all",
            "paint": {
              'fill-outline-color': '#ECECEC', // no line in default
              'fill-color': getColorScale(mobilityLayerCode, maxBlockValue), // replace it with properties's name in string format
              "fill-opacity": 0.75
            },
            "layout": { "visibility": 'none', },
          },
          firstSymbolId
        );


        map.addLayer(
          {
            "id": 'mobility-Block-Detailed-other',
            "type": 'fill',
            "source": 'mobility-Block-geojson',

            "paint": {
              'fill-opacity': 0
            },

            "layout": { "visibility": 'none', },
          },
          firstSymbolId
        );


        // Add the highlighted layer
        map.addLayer(
          {
            "id": 'mobility-Block-Detailed-highlighted',
            "type": "fill",
            "source": 'mobility-Block-geojson',
            //"source-layer": "all",
            "paint": {
              "fill-outline-color": "#ffffff",
              "fill-color": "#E8E8E8",
              "fill-opacity": .99
            },
            "filter": ["in", "object_id", ""], // Initial filter with empty "car" values // need to replaced with id! it will acutally read the name in properties, so don't use alias.
            "layout": { "visibility": 'none', },
          },
          firstSymbolId
        );

        map.addLayer(
          {
            "id": 'mobility-Street-Detailed',
            "type": 'line',
            "source": 'mobility-Street-geojson',
            //"source-layer": "all",
            "paint": {
              'line-color': getColorScale(mobilityLayerCode, maxStreetValue),
              'line-width':
                [
                  "interpolate",
                  ["exponential", 1],
                  ["to-number", ['get', mobilityLayerCode]],  // Be aware whether the data is in sting or number!
                  0, 1,   // thickness - dataValue
                  parseFloat(maxStreetValue), 5,    // Find a smart way for generating the suitable thickness!
                ],
            },
            "layout": { "visibility": 'none', },
          },
          firstSymbolId
        );


        map.addLayer(
          {
            "id": 'mobility-Street-Detailed-other',
            "type": 'line',
            "source": 'mobility-Street-geojson',

            "paint": {
              'line-color': "#f7f7f7",
              'line-width': 0
            },
            "layout": { "visibility": 'none', },
          },
          firstSymbolId
        );

        // add the highlighted layer
        map.addLayer(
          {
            "id": "mobility-Street-Detailed-highlighted",
            "type": "line",
            "source": 'mobility-Street-geojson',
            //"source-layer": "all",
            "paint": {

              'line-color': "#d8d8d8",
              'line-width':
                [
                  "interpolate",
                  ["exponential", 1],
                  ["to-number", ['get', mobilityLayerCode]],  // Be aware whether the data is in sting or number!
                  0, 1.75,   // thickness - dataValue
                  parseFloat(maxStreetValue), 6,    // Find a smart way for generating the suitable thickness!
                ],

            },
            "filter": ['in', 'object_id', ''],// Initial filter with empty object_id values
            "layout": { "visibility": 'none', }

          },
          firstSymbolId
        );

        map.addLayer({
          "id": 'mobility-point',// will contain more city point in the future!
          "type": 'circle',
          "source": 'mobility-Ithaca-dot',
          "paint": {
            'circle-color': "rgba(254, 178, 76, 0.85)",
            'circle-radius': 40,
          },
          "layout": { "visibility": 'visible' },
        });

        map.addLayer({
          "id": 'mobility-point-label', // Unique ID for the text layer
          "type": 'symbol', // Set the layer type to 'symbol' to display text
          "source": 'mobility-Ithaca-dot',
          "layout": {
            'text-field': ['get', 'name'], // Replace 'label' with the correct property name from your data source
            'text-font': ['Open Sans Regular'], // Set the font-family for the text
            'text-size': 18, // Set the font size for the text

          },

        });

        map.addLayer({
          "id": 'mobility-Ithaca-boundary',
          "type": 'line',
          "source": 'mobility-Ithaca',
          //"source-layer": "all",
          "paint": {
            'line-color': "#bbbbbb",
            'line-dasharray': [10, 6], // Set the dash and gap length
            'line-opacity': 0.6,
          },
          "layout": { "visibility": 'none', },
        });

        // create popup for seeing Ithaca's Info
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        map.on('mouseenter', 'mobility-point', (e) => {
          // Change the cursor style as a UI indicator.
          map.getCanvas().style.cursor = 'pointer';

          // Copy coordinates array.
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description =
            `<div style="font-size: 20px; font-weight: bold; margin-bottom: 5px;">Ithaca, New York</div>
              <div style="font-size: 12px; font-weight: normal; margin-bottom: 10px;">Available Dashboard:</div>
       
              <div style="font-size: 10px; font-weight: light;">Building Energy </div>
              <div style="font-size: 10px; font-weight: light;">Grid Energy </div>
              <div style="font-size: 10px; font-weight: light;">Street Mobility </div>
              <div style="font-size: 10px; font-weight: light;">Block Mobility </div>`

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          // Populate the popup and set its coordinates
          // based on the feature found.
          popup.setLngLat(coordinates).setHTML(description).addTo(map);
        });

        map.on('mouseleave', 'mobility-point', () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });

        // click the circle to active city layer, change title, remove popup, etc.
        map.on('click', 'mobility-point', (e) => {
          // Center the map view on the clicked circle
          map.flyTo({
            center: e.features[0].geometry.coordinates,
            zoom: 13,
          });

          setDisplayingLayers(['energy-Building', 'energy-Building-highlighted', 'energy-Building-other']);

          displayingLayers.forEach((layerId) => {
            map.setLayoutProperty(layerId, 'visibility', 'visible');
          });

          setTitle('Urbano.io / Ithaca');
          setCityInfoText('Ithaca /ˈɪθəkə/ is a city and the county seat of Tompkins County, New York, United States. Situated on the southern shore of Cayuga Lake in the Finger Lakes region of New York, Ithaca is the largest community in the Ithaca metropolitan statistical area. It is named after the Greek island of Ithaca.')


          setHomeContainerVisible(false);
          setGeneralContainerVisible(true);

          popup.remove();
        });

        // for define the current view boarder after boxzoom.
        map.on('boxzoomend', (e) => {
          // Get the bounds of the box zoom

          map.dragPan.enable();

          const boxZoomBounds = e.boxZoomBounds;

          // Adjust the map's zoom level to fit the box zoom bounds
          map.fitBounds(boxZoomBounds, {
            padding: 1, // Optional: You can specify padding to leave space around the bounds
          });

        });

        // For manage layer visiblity based on the current zoom level.
        map.on('zoom', () => {
          const dotLayerId = 'mobility-point';
          const dotLabelLayerId = 'mobility-point-label';
          const boundaryLayerId = 'mobility-Ithaca-boundary';

          const zoomThreshold = 10;

          if (map.getZoom() < zoomThreshold) {
            // Set the layer's visibility to "visible" when zoom level is less than 6
            map.setLayoutProperty(dotLayerId, 'visibility', 'visible');
            map.setLayoutProperty(dotLabelLayerId, 'visibility', 'visible');
            map.setLayoutProperty(boundaryLayerId, 'visibility', 'none');

            //setSAreasLength(sAreas.current.size);

          } else {

            // Set the layer's visibility to "none" when zoom level is greater than or equal to 6
            map.setLayoutProperty(dotLayerId, 'visibility', 'none');
            map.setLayoutProperty(dotLabelLayerId, 'visibility', 'none');
            map.setLayoutProperty(boundaryLayerId, 'visibility', 'visible');

          }
        });

        canvas.addEventListener('mousedown', onMouseDown, true);
     

        // Return the xy coordinates of the mouse position
        function mousePos(e) {
          const rect = canvas.getBoundingClientRect();
          return new mapboxgl.Point(
            e.clientX - rect.left - canvas.clientLeft,
            e.clientY - rect.top - canvas.clientTop
          );
        }

        function updateMobilityFilter() {
          map.setFilter('mobility-Street-Detailed-highlighted', ['!in', 'object_id', ...sAreas.current]);
          map.setFilter('mobility-Block-Detailed-highlighted', ['!in', 'object_id', ...sAreas.current]);
        }

        function onMouseDown(event) {
          if (event.button !== 0) return;
        
          if (event.shiftKey) {
            map.dragPan.disable();
          }
        
          document.addEventListener('mouseup', onMouseUp);
          document.addEventListener('keydown', onKeyDown);
        
          start = mousePos(event);
        
          if (event.ctrlKey) {
            const features = map.queryRenderedFeatures([start, start], {
              layers: ['mobility-Street-Detailed', 'mobility-Block-Detailed'],
            });
            const mId = features.map((feature) => feature.properties.object_id);
        
            sAreas.current = new Set([...sAreas.current].filter((area) => !mId.includes(area)));
        
            updateMobilityFilter() ;
            setSAreasLength(sAreas.current.size);
          }
        }
        

        function onMouseUp(event) {
          map.dragPan.enable();
        
          current = mousePos(event);
        
          // Query for features once
          const features = map.queryRenderedFeatures([start, current], {
            layers: ['mobility-Street-Detailed', 'mobility-Block-Detailed'],
          });
        
          // Pass the event and features to mobilityFinish
          mobilityFinish(event, features);
        }
        
        function mobilityFinish(event, features) {
          if (!box) {
            box = document.createElement('div');
            box.classList.add('boxdraw');
            canvas.appendChild(box);
          }
        
          if (event.shiftKey) {
            // Add the new IDs to the sAreas Set
            for (const feature of features) {
              
              sAreas.current.add(feature.properties.object_id);
            }
              
            updateMobilityFilter() ;
          
          }
          if (event.ctrlKey) {
       
            for (const feature of features) {
              
              sAreas.current.delete(feature.properties.object_id);
            }
              
            updateMobilityFilter() ;
          
          }
        
        
          // Remove the event listener.
          document.removeEventListener('keydown', onKeyDown);
          document.removeEventListener('mouseup', onMouseUp);
          setSAreasLength(sAreas.current.size);
          //console.log(sAreas.current);
        }

        //Click ESC for remove eventlistener.
        function onKeyDown(event) {
          if (event.keyCode === 27) mobilityfinish();
        }

        // Define a reusable function for handling the click event in mobility layers 
        // hold shift + click for selection, simple click for popup

        // add it later!!!
        // function handleMobilityLayerClick(e) {} and related layer management 


      });
    }
  }, []);

  // FINAL Energy layer 
  useEffect(() => {
    if (mapRef.current) {

      const map = mapRef.current;

      var clickedItems = []; // Array to store clicked selected values

      // for adding event
      const canvas = map.getCanvasContainer();

      // Variable to hold the starting xy coordinates
      // when `mousedown` occured.
      let start;

      // Variable to hold the current xy coordinates
      // when `mousemove` or `mouseup` occurs.
      let current;

      // Variable for the draw box element.
      let box;


      map.on('load', function () {

        const layers = map.getStyle().layers;
        // Find the index of the first symbol layer in the map style.
        let firstSymbolId;
        for (const layer of layers) {
          if (layer.type === 'symbol') {
            firstSymbolId = layer.id;
            break;
          }
        }

        // Add the source to query
        map.addSource('ithaca-energy-Summary', {
          "type": "geojson",
          "data": ITHACA_ENERGY_URL,
        });

        map.addSource('ithaca-energy-Building', {
          "type": "geojson",
          "data": BUILDING_DATA_URL,
        });

        map.addSource('ithaca-energy-Feeder', {
          "type": "geojson",
          "data": FEEDER_DATA_URL,
        });

        map.addLayer(
          {
            "id": 'energy-Building',
            "type": 'fill',
            "source": 'ithaca-energy-Building',
            "filter": ['has', 'Equipment[KWh][Yr]'],
            //"source-layer": "all",
            "paint": {
              'fill-outline-color': '#eeeeee', // no line in default
              'fill-color': getColorScale(buildingLayerCode, maxBuildingValue),
            },
            "layout": { "visibility": 'none', },
          },
          firstSymbolId
        );



        // Add the highlighted layer
        map.addLayer(
          {
            "id": 'energy-Building-highlighted',
            "type": "fill",
            "source": 'ithaca-energy-Building',
            //"source-layer": "all",
            "paint": {
              "fill-outline-color": "#ffffff",
              "fill-color": "#d8d8d8", // background color is f7f7f7
              "fill-opacity": .99
            },
            "filter": ['in', 'ID_ESL', ''], // Initial filter with empty "ID_ESL" values // need to replaced with id! it will acutally read the name in properties, so don't use alias.
            "layout": { "visibility": 'none', },

          },
          firstSymbolId
        );

        map.addLayer(
          {
            "id": 'energy-Building-other',
            "type": 'fill',
            "source": 'ithaca-energy-Building',
            "filter": ['!', ['has', 'Gas[kWh][Mth]']],

            "paint": {
              'fill-outline-color': '#d9d9d9', // no line in default
              'fill-color': '#f1f1f1',
            },
            "layout": { "visibility": 'none', },
          },
          firstSymbolId
        );

        map.addLayer(
          {
            "id": 'energy-Feeder',
            "type": 'line',
            "source": 'ithaca-energy-Feeder',
            "filter": ['has', "GasDemand_KWh"],
            //"source-layer": "all",
            "paint": {
              'line-color': getColorScale(feederLayerCode, maxFeederValue),
              'line-width': 3,
            },
            "layout": { "visibility": 'none', },
          },
          firstSymbolId

        );


        map.addLayer(
          {
            "id": 'energy-Feeder-other',
            "type": 'line',
            "source": 'ithaca-energy-Feeder',
            "filter": ['!', ['has', "GasDemand_KWh"]],
            "paint": {
              'line-width': 3,
              'line-color': "#d8d8d8",
            },
            "layout": { "visibility": 'none', },
          },
          firstSymbolId
        );


        // add the highlighted layer
        map.addLayer(
          {
            "id": "energy-Feeder-highlighted",
            "type": "line",
            "source": 'ithaca-energy-Feeder',
            "filter": ['has', "GasDemand_KWh"],
            //"source-layer": "all",
            "paint": {
              'line-color': "#d8d8d8",
              'line-width': 3,
            },

            "layout": { "visibility": 'none', }
          },
          firstSymbolId
        );

        canvas.addEventListener('mousedown', onMouseDown, true);

        // Return the xy coordinates of the mouse position
    // Return the xy coordinates of the mouse position
function mousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return new mapboxgl.Point(
    e.clientX - rect.left - canvas.clientLeft,
    e.clientY - rect.top - canvas.clientTop
  );
}

function updateEnergyFilter() {
  map.setFilter('energy-Building-highlighted', ['!in', 'ID_ESL', ...sAreas.current]);
  map.setFilter('energy-Feeder-highlighted', ['!in', 'ID_ESL', ...sAreas.current]);
}

// Handle mouse down event
function onMouseDown(event) {
  if (event.button !== 0) return;

  if (event.shiftKey) {
    map.dragPan.disable();
  }

  // Ensure previous event listeners are removed before adding new ones
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('keydown', onKeyDown);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('keydown', onKeyDown);

  start = mousePos(event);

  // Control key logic for deselecting features
  if (event.ctrlKey) {
    const features = map.queryRenderedFeatures([start, start], {
      layers: ['energy-Building', 'energy-Feeder'],
    });
    const eId = features.map((feature) => feature.properties.ID_ESL);

    eId.forEach((id) => {
      if (sAreas.current.has(id)) { // Check if ID is in the set before deleting
        sAreas.current.delete(id);
      }
    });

    updateEnergyFilter();
  }
}

// Handle mouse up event
function onMouseUp(event) {
  map.dragPan.enable();

  current = mousePos(event);

  // Query for features once
  const features = map.queryRenderedFeatures([start, current], {
    layers: ['energy-Building', 'energy-Feeder'],
  });

  // Pass the event and features to energyFinish
  energyFinish(event, features);
}

// Handle key down event for cancelling selection
function onKeyDown(event) {
  if (event.keyCode === 27) { // 'Esc' key code
    energyFinish(event, []);
  }
}

// Finalize energy feature selection
function energyFinish(event, features) {
  // Remove event listeners to prevent multiple bindings
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('keydown', onKeyDown);

  if (event.shiftKey) {
    // Add new IDs to the sAreas set, avoiding duplicates
    features.forEach((feature) => {
      const id = feature.properties.ID_ESL;
      if (!sAreas.current.has(id)) { // Check if ID is not in the set before adding
        sAreas.current.add(id);
      }
    });

    updateEnergyFilter();
  } else if (event.ctrlKey) {
    // Remove IDs from the sAreas set
    features.forEach((feature) => {
      const id = feature.properties.ID_ESL;
      if (sAreas.current.has(id)) { // Check if ID is in the set before deleting
        sAreas.current.delete(id);
      }
    });
    updateEnergyFilter();
  }

  setSAreasLength(sAreas.current.size);
  console.log(sAreas.current);


        
    }

        
  useEffect(() => {
    // This effect will re-run whenever mapRef changes
    generateEndUseGraph(sAreas, mapRef, ITHACA_ENERGY_URL);
  }, [BUILDING_DATA_URL]);
   
      });
    }
  }, []);

  
  // change scenerio
  const handleScenarioClick = (event) => {

    const map = mapRef.current;
    
    const selectedScenario = event.target.value;

    let newUrl;
    let newSumUrl;

    switch (selectedScenario) {
      case 'current':
        newUrl = BUILDING_DATA_URL_INITIAL;
        newSumUrl = ITHACA_ENERGY_URL_INITIAL;
        break;

      case 'base':
        newUrl = "./ScenarioData/Baseline_clean.geojson";
        newSumUrl = "./ScenarioData/Baseline_SiteSummary.geojson";
        break;

      case 'commercial':
        newUrl = "./ScenarioData/CommercialElectrified_clean.geojson";
        newSumUrl = "./ScenarioData/CommercialElectrified_SiteSummary.geojson";
        break;

      case 'residential':
        newUrl = "./ScenarioData/ResidentialElectrified_clean.geojson";
        newSumUrl = "./ScenarioData/ResidentialElectrified_SiteSummary.geojson";
        break;

      case 'full':
        newUrl = "./ScenarioData/FullElectrified_clean.geojson";
        newSumUrl = "./ScenarioData/FullElectrified_SiteSummary.geojson";
        break;

      default:
        newUrl = BUILDING_DATA_URL_INITIAL;
        newSumUrl = ITHACA_ENERGY_URL_INITIAL;
    }

    // Update the state with the new URL
    if (newUrl !== BUILDING_DATA_URL) {
      setBuildingDataUrl(newUrl);
      setIthacaEnergyUrl(newSumUrl);
    }

    map.getSource('ithaca-energy-Building').setData(newUrl);
    map.getSource('ithaca-energy-Summary').setData(ewSumUrl);
  };


  // Function to update the map layer with the new values
  useEffect(() => {

    const updateMapLayer = async () => {
      if (mapRef.current) {
        const map = mapRef.current;
        const streetLayerId = 'mobility-Street-Detailed';
        const streetLayerIdHighlighted = 'mobility-Street-Detailed-highlighted';
        const blockLayerId = 'mobility-Block-Detailed';
        const buildingLayerId = 'energy-Building';
        const feederLayerId = 'energy-Feeder';
        const feederLayerIdHighlighted = 'energy-Feeder-highlighted';
        const currentStreetMax = maxStreetValue;
        const currentBlockMax = maxBlockValue;
        const currentBuildingMax = maxBuildingValue;
        const currentFeederMax = maxFeederValue;

        // Check if the layer already exists
        if (map.getLayer(streetLayerId)) {
          // Update the layer paint properties with the new values
          map.setPaintProperty(streetLayerId, 'line-color', getColorScale(mobilityLayerCode, currentStreetMax));
          map.setPaintProperty(streetLayerIdHighlighted, 'line-width',

            [
              "interpolate",
              ["exponential", 1],
              ["to-number", ['get', mobilityLayerCode]],  // Be aware whether the data is in sting or number!
              0, 1.75,   // thickness - dataValue
              parseFloat(maxStreetValue), 6,    // Find a smart way for generating the suitable thickness!
            ],
          );

          map.setPaintProperty(streetLayerId, 'line-width',

            [
              "interpolate",
              ["exponential", 1],
              ["to-number", ['get', mobilityLayerCode]],  // Be aware whether the data is in sting or number!
              0, 1.5,   // thickness - dataValue
              parseFloat(maxStreetValue), 6,    // Find a smart way for generating the suitable thickness!
            ],

          );
        }
        if (map.getLayer(blockLayerId)) {
          // Update the layer paint properties with the new values
          map.setPaintProperty(blockLayerId, 'fill-color', getColorScale(mobilityLayerCode, currentBlockMax));
        }

        if (map.getLayer(buildingLayerId)) {
          // Update the layer paint properties with the new values
          map.setPaintProperty(buildingLayerId, 'fill-color', getColorScale(buildingLayerCode, currentBuildingMax));
        }

        if (map.getLayer(feederLayerId)) {
          // Update the layer paint properties with the new values
          map.setPaintProperty(feederLayerId, 'line-color', getColorScale(feederLayerCode, currentFeederMax));

        }
      }

    };

    // Use a setTimeout to wait for a brief moment before updating the map layer
    // This allows the maxValue to be updated first!
    const timeoutId = setTimeout(updateMapLayer, 700);

    // Clean up the setTimeout when the component unmounts or when the effect is re-run
    return () => clearTimeout(timeoutId);
  }, [maxBlockValue, maxStreetValue, maxBuildingValue, maxFeederValue, mobilityLayerCode, buildingLayerCode, feederLayerCode]);

  // For manage visibility of layers.
  // order matters! you need to visualize the highlighted layer before the original layer for activating the selection function.

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;

      // Remember to add ids of new layers here
      const toggleableLayerIds = ['mobility-Street-Detailed', 'mobility-Block-Detailed', 'energy-Building', 'energy-Feeder'];

      for (const id of toggleableLayerIds) {
        if (!map.getLayer(id)) continue;

        const isHighlighted = displayingLayers.includes(getHighlightedLayerId(id));
        const isOther = displayingLayers.includes(getOtherLayerId(id));
        const isVisible = displayingLayers.includes(id) || isHighlighted || isOther;

        if (isOther) {
          map.setLayoutProperty(getOtherLayerId(id), 'visibility', isVisible ? 'visible' : 'none');
        }

        if (isHighlighted) {
          map.setLayoutProperty(getHighlightedLayerId(id), 'visibility', isVisible ? 'visible' : 'none');
        }

        map.setLayoutProperty(id, 'visibility', isVisible ? 'visible' : 'none');

      }
    }
  }, [displayingLayers]);

  // for manage Dashboard dropdown'visiblity
  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // for manage different layers'visiblity
  const handleLayerToggle = (layerId) => {
    const map = mapRef.current;

    const highlightedLayerId = getHighlightedLayerId(layerId);
    const otherLayerId = getOtherLayerId(layerId);

    const isHighlightedVisible = displayingLayers.includes(highlightedLayerId);
    const isOtherVisible = displayingLayers.includes(otherLayerId);

    const previousHighlightedLayerId = displayingLayers.find((id) => id !== highlightedLayerId);

    //clear current selection when switching to another layer
    clearSelectedAreas(mapRef,sAreas);
    map.setLayoutProperty(previousHighlightedLayerId, 'visibility', 'none');

    // map.setLayoutProperty("energy-Building-other", 'visibility', 'none'); // shouldn't be specific, TBD
    // map.setLayoutProperty("mobility-Street-Detailed-highlighted", 'visibility', 'none'); // shouldn't be specific, TBD
    // map.setLayoutProperty("mobility-Block-Detailed-highlighted", 'visibility', 'none'); // shouldn't be specific, TBD
    // map.setLayoutProperty("energy-Building-Detailed-highlighted", 'visibility', 'none'); // shouldn't be specific, TBD
    // map.setLayoutProperty("energy-Feeder-Detailed-highlighted", 'visibility', 'none'); // shouldn't be specific, TBD

    displayingLayers.forEach((layerId) => {
      map.setLayoutProperty(layerId, 'visibility', 'none');
    });

    if (displayingLayers.includes(layerId)) {
      // Deselect the layer and its highlighted layer
      setDisplayingLayers(displayingLayers.filter((id) => id !== highlightedLayerId && id !== otherLayerId && id !== layerId));
      setSelectedLayerLabel('Map Dashboard Selector'); // Reset the title to 'Metric Selector'

      setMobilityContainerVisible(false);
      setEnergyContainerVisible(false);
      setMobilityContainerVisible(false);
      setBuildingContainerVisible(false);
      setFeederContainerVisible(false);
      set
    } else {
      // Select the current layer and its highlighted layer
      const updatedLayers = [highlightedLayerId, otherLayerId, layerId];
      setDisplayingLayers(updatedLayers);
      map.setLayoutProperty(highlightedLayerId, 'visibility', isHighlightedVisible ? 'visible' : 'none');
      map.setLayoutProperty(otherLayerId, 'visibility', isOtherVisible ? 'visible' : 'none');
      const selectedLayer = toggleableLayers.find((layer) => layer.id === layerId);
      setSelectedLayerLabel(selectedLayer?.label || 'Map Dashboard Selector'); // Set the title to the selected layer label
    }

    // handleDropdownToggle();

  };

  // For Manage different sidebar containers's visibliy.
  useEffect(() => {

//    if(sAreas.current.size =! 0){
//      setMetricContainerVisible(true);
//    }else{
//      setMetricContainerVisible(false);
//    }

    if (displayingLayers.includes("energy-Building")) {
      setMobilityContainerVisible(false);
      setEnergyContainerVisible(true);
      setBuildingContainerVisible(true);
      setFeederContainerVisible(false);

      fetch(ENERGY_METRIC_URL)
        .then(response => response.json())
        .then(data => {
          const metricDescription = data[0].metric_description;
          setCityInfoText(metricDescription);
        })

      setMaxCurrentValue(maxBuildingValue);
      setLegendUnit("kWh/m2")
 
    }

    if (displayingLayers.includes("energy-Feeder")) {
      setMobilityContainerVisible(false);
      setBlockContainerVisible(false);
      setEnergyContainerVisible(true);
      setFeederContainerVisible(true);
      setBuildingContainerVisible(false);

      fetch(ENERGY_METRIC_URL)
        .then(response => response.json())
        .then(data => {
          const metricDescription = data[1].metric_description;
          setCityInfoText(metricDescription);
        })

      setMaxCurrentValue(maxFeederValue);
      setLegendUnit("kW")

    }

    if (displayingLayers.includes("mobility-Street-Detailed") || displayingLayers.includes("mobility-Block-Detailed")) {
      setMobilityContainerVisible(true);
      setEnergyContainerVisible(false);
      setBuildingContainerVisible(false);
      setFeederContainerVisible(false);

      if (displayingLayers.includes("mobility-Street-Detailed")) {
        fetch(MOBILITY_METRIC_URL)
          .then(response => response.json())
          .then(data => {
            const metricDescription = data[0].metric_description;
            setCityInfoText(metricDescription);
          })

        setMaxCurrentValue(maxStreetValue);
        setBlockContainerVisible(false);
      }
      else {
        fetch(MOBILITY_METRIC_URL)
          .then(response => response.json())
          .then(data => {
            const metricDescription = data[1].metric_description;
            setCityInfoText(metricDescription);
          })

        setMaxCurrentValue(maxBlockValue);
        setBlockContainerVisible(true);
      }

      setLegendUnit("Number of Trips")
    }

  }, [displayingLayers, buildingLayerCode, sAreas]);

  useEffect(() => {
    // Parse min and max building values as floats
    const parsedMinBuildingValue = parseInt(minBuildingValue);
    const parsedMaxBuildingValue = parseInt(maxBuildingValue);
  
    // Ensure the selection values are within the new range
    const newSelectionValues = [
      Math.min(selectionValues[0], parsedMaxBuildingValue),
      Math.min(selectionValues[1], parsedMaxBuildingValue),
    ];
  
    // Adjust if the left pointer exceeds the right pointer
    if (newSelectionValues[0] > newSelectionValues[1]) {
      newSelectionValues[0] = parsedMinBuildingValue;
    }
  
    // Reset the selectionValues
    setSelectionValues(newSelectionValues);
  }, [maxBuildingValue, minBuildingValue]); // Add other dependencies as necessary


  const toggleDropdowns = () => {
    // Toggle the visibility of dropdowns
    setMetricSelectionContainerVisible(!metricSelectionContainerVisible);
  
  };
  
  return (
    <div className="container">


{(mobilityContainerVisible || energyContainerVisible) && (
      <div className="sidebar">

        <div className="title-container">

          {/* <img className="logo-image" src="./Image/LogoDraftV2.png" width="50" /> */}
          <div className="title">
            <p onClick={handleTitleClick}>{title}</p>
          </div>
          
          <p className='version-text'> v.2.0411</p>
          <div><ImportGeojson onDataImport={setBuildingDataUrl}/></div>
        </div>
        

         {/*
        <div>
          <SelectionTutorial />
        </div>
        */}

        {homeContainerVisible && (
          <div className="home-page">
            <HomePage handleDigitalTwinClick={handleDigitalTwinClick} />
          </div>
        )}

        {generalContainerVisible && (
          <div>
            <DashboardSelector
              toggleableLayers={toggleableLayers}
              displayingLayers={displayingLayers}
              handleLayerToggle={handleLayerToggle}
            />
          </div>
        )}

        {notUsingContainerVisible && (
          <div className="city-info">{cityInfoText}</div>
        )}

        {generalContainerVisible && (
           <div class="hr-container">
           <span class="third-title">Scenerio Selector</span>
           <hr class="sidebar-divider" />
         </div>
          )}

        {mobilityContainerVisible && (
          <div>
            <MobilityScenario 
            mapRef={mapRef}
            setBuildingDataUrl={setBuildingDataUrl}
            setIthacaEnergyUrl={setIthacaEnergyUrl}
            BUILDING_DATA_URL={BUILDING_DATA_URL}
            BUILDING_DATA_URL_INITIAL={BUILDING_DATA_URL_INITIAL}
            ITHACA_ENERGY_URL_INITIAL={ITHACA_ENERGY_URL_INITIAL}/>
          </div>
        )}
       
        {buildingContainerVisible && (
         <div>
         <MobilityScenario 
         mapRef={mapRef}
         setBuildingDataUrl={setBuildingDataUrl}
         setIthacaEnergyUrl={setIthacaEnergyUrl}
         BUILDING_DATA_URL={BUILDING_DATA_URL}
         BUILDING_DATA_URL_INITIAL={BUILDING_DATA_URL_INITIAL}
         ITHACA_ENERGY_URL_INITIAL={ITHACA_ENERGY_URL_INITIAL}/>
       </div>
          )}

        {feederContainerVisible && (
          <div>
          <MobilityScenario 
          mapRef={mapRef}
          setBuildingDataUrl={setBuildingDataUrl}
          setIthacaEnergyUrl={setIthacaEnergyUrl}
          BUILDING_DATA_URL={BUILDING_DATA_URL}
          BUILDING_DATA_URL_INITIAL={BUILDING_DATA_URL_INITIAL}
          ITHACA_ENERGY_URL_INITIAL={ITHACA_ENERGY_URL_INITIAL}/>
        </div>
        )}

      </div>
      )}

{(mobilityContainerVisible || energyContainerVisible) && ( 
      <div className="sidebar-graph">

        {generalContainerVisible && (
          <div>
            <div class="hr-container">
              <span class="summary-title">Summary Report</span> 
            </div>
            <div className="selected-number">
              <p>{sAreasLength} Selected objects.</p>
            </div>  
          </div>
        )}

        {mobilityContainerVisible && (
          <div>
            <MobilityTabSwitch />
          </div>
        )}

        {buildingContainerVisible && (     
          <div>
            <BuildingTabSwitch />
          </div>
        )}

        {feederContainerVisible && (
          <div>
            <FeederTabSwitch />
          </div>
        )}
 
       
    {/*     {notUsingContainerVisible && (
          <button className="contact-button" onClick={sendEmail}>Contact</button>
        )} */}
      
        {(homeContainerVisible || generalContainerVisible) && (
          <div style={{ margin: '20px' }}>
          </div>
        )}
   
       {/*  {notUsingContainerVisible && (
          <button className="contact-button" onClick={exportSelectedAreas}>Export / Import</button>
        )} */}

        {mobilityContainerVisible && (
          generateMobilitySenarioBarGraph(sAreas, mapRef) ,
          generateMobilitySummaryBarGraph(sAreas, mapRef),
          generateWeekdayBarGraph(sAreas, mapRef),
          generateWeekendBarGraph(sAreas, mapRef)
        )}

       {energyContainerVisible && (
          generateBuildingSenarioGraph(sAreas, mapRef, ITHACA_ENERGY_URL),
          generateSummaryUseGraph(sAreas, mapRef, ITHACA_ENERGY_URL),
          generateEndUseGraph(sAreas, mapRef, ITHACA_ENERGY_URL),
          generateFuelUseGraph(sAreas, mapRef)     
        )}

        {feederContainerVisible && (
          generateWinterEnergyLoadGraph(sAreas, mapRef),
          generateSummerEnergyLoadGraph(sAreas, mapRef),
          generateLoadDurationGraph(sAreas, mapRef)
        )}

      </div>
      )}

      <div className="content-container">

        <div className="map-container" ref={mapContainer}></div>

        {(homeContainerVisible) && (
          <div className='homepage-title'>Urbano.io Map</div>
        )}

          <div className="login-container">
          <LoginPopup  />
          </div>

        {(mobilityContainerVisible || energyContainerVisible) && (
          <div className="main-legend-container">{generateLegend(displayingLayers)}</div>
        )}

        {(mobilityContainerVisible || energyContainerVisible) && (
                  <div className="metric-container">
                    
                    {generalContainerVisible && (
                    <div style={{ position: 'relative' }}>
                      <span class="click-title" onClick={toggleDropdowns}>
                        <div  class= "click-title"style={{ display: 'flex', alignItems: 'center' }}>
                          <img src="./Image/metric.png" alt="Metrics Icon" style={{ width: '30px', marginLeft: '5px' }} />
                          Metrics
                        </div>
                      </span>
                    </div>
                  )}

                  {metricSelectionContainerVisible && buildingContainerVisible && (<BuildingSelection buildingLayerCode={buildingLayerCode} setBuildingLayerCode={setBuildingLayerCode} />)}
          
                  {metricSelectionContainerVisible && feederContainerVisible && (<FeederSelection feederLayerCode={feederLayerCode} setFeederLayerCode={setFeederLayerCode} />)}
          
                  {metricSelectionContainerVisible && mobilityContainerVisible && (
                    <FirstMobilitySelection
                      propertiesNumber={propertiesNumber}
                      handlePropertyChange={handlePropertyChange}
                      blockContainerVisible={blockContainerVisible}
                    />
                  )}
          
                  {metricSelectionContainerVisible && mobilityContainerVisible && (
                    <SecondMobilitySelection
                      propertiesNumber={propertiesNumber}
                      handlePropertyChange={handlePropertyChange}
                    />
                  )}
          
                  {metricSelectionContainerVisible && mobilityContainerVisible && (
                    <button className="submit-button" onClick={handleSubmit}>Apply</button>
                  )}
                </div>
          )}


 {/*
        {(mobilityContainerVisible || energyContainerVisible) && (
          <div className="groupSelection-container">
            
            {generalContainerVisible && (
            <div class="hr-container">
              <span class="third-title">Building Group Selector</span>

            </div>
  
          )}

{generalContainerVisible && (
  <div style={{ margin: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className='groupSelection-min'>{parseInt(minBuildingValue)}</div>
      <Range
        step={1}
        min={parseInt(minBuildingValue)}
        max={parseInt(maxBuildingValue)}
        values={selectionValues}
        onChange={(values) => setSelectionValues(values)}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '2px',
              width: '200px',
              backgroundColor: '#ccc',
              position: 'relative',
              marginTop: '25px', // Adjust as needed
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '10px',
              width: '20px',
              backgroundColor: '#999',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute', // Ensuring absolute positioning
         
            }}
          >
            <div style={{
              position: 'absolute',
              top: index === 0 ? '-30px' : '15px', // Adjust label position
              left: '50%',
              transform: 'translateX(-50%)',
            
              padding: '2px 5px',
              fontSize: '12px',
              borderRadius: '4px',
              whiteSpace: 'nowrap'
            }}>
              {selectionValues[index]}
            </div>
          </div>
        )}
      />
      <div className='groupSelection-max'>{parseInt(maxBuildingValue)}</div>
    </div>
      <button className="groupSelect-button" onClick={handleSubmit}>Select</button>
  </div>                 
                </div>
           )}
           
           )}*/}
          

      </div>
    </div>

  );

}

export function renderToDOM(container) {
  ReactDOM.render(<App />, container);
}
