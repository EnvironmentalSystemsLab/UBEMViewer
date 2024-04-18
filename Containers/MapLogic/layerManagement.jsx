// change the ideal layer's name here
export const toggleableLayers = [

  { id: 'energy-Building', label: 'Building Energy' },
  { id: 'energy-Feeder', label: 'Grid Energy' },
  { id: 'mobility-Street-Detailed', label: 'Street Mobility' },
  { id: 'mobility-Block-Detailed', label: 'Block Mobility' },

];


export const getHighlightedLayerId = (layerId) => {
  if (!layerId) return null;
  return `${layerId}-highlighted`;
};

export const getOtherLayerId = (layerId) => {
  if (!layerId) return null;
  return `${layerId}-other`;
};

