import React, { useEffect, useRef, useState } from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';
import * as d3 from 'd3';

const colorScale = d3.scaleOrdinal()
    .domain(['Heating', 'Cooling', 'Equipment', 'Lighting', 'HotWater', 'PV'])
    .range(['#cf5867', '#6faadd', '#959595', '#f2e75c', '#eec176', '#9C27B0']);

function StackedBar({ data, colorScale, onBarDoubleClick }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    d3.select(element).selectAll("*").remove();

    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const width = 220 - margin.left - margin.right;
    const height = 20 - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([0, d3.sum(data, d => d.value)])
      .range([0, width]);

    let offset = 0;
    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => {
        const position = offset;
        offset += xScale(d.value);
        return position;
      })
      .attr("y", 0)
      .attr("width", d => xScale(d.value))
      .attr("height", height)
      .attr("fill", d => colorScale(d.name))
      .on("dblclick", d => onBarDoubleClick(d.name));

  }, [data, colorScale, onBarDoubleClick]);

  return <Box ref={ref} />;
}

function Legend({ colorScale }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    d3.select(element).selectAll("*").remove();

    const legendSpacing = 100;
    const legendRowHeight = 20;
    const numRows = Math.ceil(colorScale.domain().length / 3);
    const svgHeight = numRows * legendRowHeight;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', '100%')
      .attr('height', svgHeight)
      .append('g');

    colorScale.domain().forEach((key, index) => {
      const rowIndex = Math.floor(index / 3);
      const columnIndex = index % 3;

      const legendEntry = svg.append('g')
        .attr('transform', `translate(${columnIndex * legendSpacing}, ${rowIndex * legendRowHeight})`);

      legendEntry.append('rect')
        .attr('x', 40)
        .attr('y', 0)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', colorScale(key));

      legendEntry.append('text')
        .attr('x', 60)
        .attr('y', 10)
        .style('font-size', '10px')
        .text(key);
    });
  }, [colorScale]);

  return <Box ref={ref} />;
}

function MobilityScenario({ mapRef, setBuildingDataUrl, setIthacaEnergyUrl, BUILDING_DATA_URL,BUILDING_DATA_URL_INITIAL, ITHACA_ENERGY_URL_INITIAL }) {
  const [scenarios, setScenarios] = useState([
    { id: 1, name: 'Baseline', data: [{ name: 'Heating', value: 39973.0 }, { name: 'Cooling', value: 4630.0 }, { name: 'Equipment', value: 3372.0 }, { name: 'Lighting', value: 1810.0 }, { name: 'HotWater', value: 4900.0 }, { name: 'PV', value: 0.0 }] },
    { id: 2, name: 'ResidentialElectrified', data: [{ name: 'Heating', value: 32973.0 }, { name: 'Cooling', value: 4630.0 }, { name: 'Equipment', value: 3372.0 }, { name: 'Lighting', value: 1810.0 }, { name: 'HotWater', value: 4900.0 }, { name: 'PV', value: 0.0 }] },
    { id: 3, name: 'CommercialElectrified', data: [{ name: 'Heating', value: 22973.0 }, { name: 'Cooling', value: 4630.0 }, { name: 'Equipment', value: 3372.0 }, { name: 'Lighting', value: 1810.0 }, { name: 'HotWater', value: 4900.0 }, { name: 'PV', value: 0.0 }] },
    { id: 4, name: 'FullElectrified', data: [{ name: 'Heating', value: 15973.0 }, { name: 'Cooling', value: 4630.0 }, { name: 'Equipment', value: 3372.0 }, { name: 'Lighting', value: 1810.0 }, { name: 'HotWater', value: 4900.0 }, { name: 'PV', value: 0.0 }] }
  ]);
  const [selectedScenario, setSelectedScenario] = useState(null);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedId = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const targetIndex = scenarios.findIndex(scenario => scenario.id === targetId);
    const draggedIndex = scenarios.findIndex(scenario => scenario.id === draggedId);

    const newScenarios = [...scenarios];
    const [draggedScenario] = newScenarios.splice(draggedIndex, 1);
    newScenarios.splice(targetIndex, 0, draggedScenario);

    setScenarios(newScenarios);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDoubleClick = (scenarioName) => {
    setSelectedScenario(scenarioName); // Update the selected scenario state

    let newUrl, newSumUrl;
    switch (selectedScenario) {
case 'Baseline':
        newUrl = "./ScenarioData/Baseline_clean.geojson";
        newSumUrl = "./ScenarioData/Baseline_SiteSummary.geojson";
        break;
      case 'Residential Electrified':
        newUrl = "./ScenarioData/ResidentialElectrified_clean.geojson";
        newSumUrl = "./ScenarioData/ResidentialElectrified_SiteSummary.geojson";
        break;

        case 'Commercial Electrified':
          newUrl = "./ScenarioData/CommercialElectrified_clean.geojson";
          newSumUrl = "./ScenarioData/CommercialElectrified_SiteSummary.geojson";
          break;
  
        case 'Full Electrified':
          newUrl = "./ScenarioData/FullElectrified_clean.geojson";
          newSumUrl = "./ScenarioData/FullElectrified_SiteSummary.geojson";
          break;
  

      default:
        newUrl = BUILDING_DATA_URL_INITIAL;
        newSumUrl = ITHACA_ENERGY_URL_INITIAL;
    }

    // Update state with new URLs if they are different
    if (newUrl !== BUILDING_DATA_URL) {
      setBuildingDataUrl(newUrl);
      setIthacaEnergyUrl(newSumUrl);
    }

    // Assuming mapRef.current is the map object and it's initialized correctly
    const map = mapRef.current;
    if (map) {
      map.getSource('ithaca-energy-Building').setData(newUrl);
      map.getSource('ithaca-energy-Summary').setData(newSumUrl);
    } 
      

  };

  return (
    <Box>
    <List style={{ padding: '12px', backgroundColor: 'transparent', fontFamily: 'Open Sans, sans-serif' }}>
      {scenarios.map((scenario) => (
        <ListItem
          key={scenario.id}
          draggable
          onDragStart={(e) => handleDragStart(e, scenario.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, scenario.id)}
          onDoubleClick={() => handleDoubleClick(scenario.name)} // Double-click handler moved here
          style={{
            margin: '8px 0',
            backgroundColor: selectedScenario === scenario.name ? '#E0E0E0' : '#F5F5F5',
            borderRadius: '4px',
            border: '1px solid #E0E0E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px',
            height: '35px',
            cursor: 'pointer' // Optional: Changes the cursor to indicate the item is clickable
          }}
          disableGutters
        >
          <Box>
            {scenario.name.split(" ").map((part, index) => (
              <Typography key={index} variant="body2" style={{ fontSize: '12px' }}>{part}</Typography>
            ))}
          </Box>
          <StackedBar data={scenario.data} colorScale={colorScale} />
        </ListItem>
      ))}
    </List>
    <Legend colorScale={colorScale} />
  </Box>
  );
}

export default MobilityScenario;
