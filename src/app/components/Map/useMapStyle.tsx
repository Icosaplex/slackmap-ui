import { useEffect, useState } from 'react';

const satellite = 'mapbox://styles/mapbox/satellite-v9';
const light = 'mapbox://styles/mapbox/light-v10';

export const useMapStyle = () => {
  const [mapStyle, setMapStyle] = useState(light);
  const [zoomLevel, setZoomLevel] = useState(0);

  useEffect(() => {
    if (!zoomLevel) {
      return;
    }
    if (zoomLevel > 11) {
      setMapStyle(satellite);
    } else {
      setMapStyle(light);
    }
  }, [zoomLevel]);

  return { mapStyle, setZoomLevel };
};
