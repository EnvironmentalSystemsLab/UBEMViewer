  // For cleaning the selection area in both frontend and backend.
  // Remeber to update the layer name here!
  export const clearSelectedAreas = (mapRef, sAreas) => {
    // Clear the sAreas Set
    sAreas.current = new Set();

   

    // Clear the filters applied to the highlighted layers
    const map = mapRef.current;
    if (map) {
      const highlightedLayers = ['mobility-Street-Detailed-highlighted','mobility-Block-Detailed-highlighted','mobility-Street-Detailed-other','energy-Building-highlighted','energy-Feeder-highlighted' ,];
      
      //TBD
      highlightedLayers.forEach((layerId) => {
        map.setFilter(layerId, ['in', 'object_id', '']);
          map.setFilter(layerId, ['in', 'ID_ESL', '']);
      });
    }
  };


   // Export the data and generate a new popup html page
   export const exportSelectedAreas = () => {
    const map = mapRef.current;
  
    if (!map) {
      // Map is not available yet, return or handle the error
      return;
    }
  
    const selectedAreasData = selectedAreas.current.map((area) => {
      const features = map.queryRenderedFeatures({ layers: ['mobility-Street-Detailed','mobility-Block-Detailed','energy-Building','energy-Feeder'] });
      let selectedFeature = null;
      
      if(displayingLayers.includes('mobility-Street-Detailed') ||displayingLayers.includes('mobility-Block-Detailed')){
     selectedFeature = features.find((feature) => feature.properties.object_id === area);
      }

      if(displayingLayers.includes('energy-Building') ||displayingLayers.includes('energy-Feeder')){
        selectedFeature = features.find((feature) => feature.properties.ID_ESL === area);
         }
  
      if (selectedFeature) {
        return {
          type: 'Feature',
          geometry: selectedFeature.geometry,
          properties: selectedFeature.properties,
        };
      }
  
      return null;
    }).filter(Boolean);
  
    const exportedData = {
      type: 'FeatureCollection',
      features: selectedAreasData,
    };
  
    const jsonStr = JSON.stringify(exportedData, null, 2);
  
    // Open a new window with the JSON string displayed in a textarea
    const popup = window.open('', '_blank', 'width=600,height=400');
    popup.document.write(`

 
      <textarea style="width:100%; height:95%">${jsonStr}</textarea>
      <button onclick="copyToClipboard()">Copy to Clipboard</button>
      <button onclick="closePopup()">Cancel</button>
      <button onclick="downloadFile()">Download</button>
      <button onclick="importSelectedAreas()">Import</button>
      <script>
        function copyToClipboard() {
          const textarea = document.querySelector('textarea');
          textarea.select();
          document.execCommand('copy');
        }
        
        function closePopup() {
          window.close();
        }
        
        function downloadFile() {
          const textarea = document.querySelector('textarea');
          const jsonStr = textarea.value;
          const blob = new Blob([jsonStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'selected_areas.json';
          link.click();
          URL.revokeObjectURL(url);
        }
  
        function importSelectedAreas() {
          const textarea = document.querySelector('textarea');
          const jsonStr = textarea.value;
          const importedData = JSON.parse(jsonStr);
        
          // Update the selectedAreas ref with the imported data
          selectedAreas.current = importedData;
        
          // Update the filter of the current layer based on the imported data
          const map = mapRef.current;
          if (map) {
            const currentLayer = 'mobility-Block-Car'; // Replace with the actual current layer ID
            const selectedAreaCars = importedData.map((area) => area.properties.car);
            map.setFilter(currentLayer, ['in', 'car', ...selectedAreaCars]);
          }
        
          // Close the popup window
          window.close();
        }
        
      </script>`
    );
  };
