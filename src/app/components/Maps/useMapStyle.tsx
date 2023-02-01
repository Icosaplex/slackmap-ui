import { Projection } from 'mapbox-gl';
import { useEffect, useState } from 'react';
import { mapStyles } from './constants';

export const useMapStyle = (zoomLevel?: number) => {
  const [mapStyle, setMapStyle] = useState(mapStyles.light);
  const [projection, setProjection] = useState<Projection['name']>('globe');

  useEffect(() => {
    if (!zoomLevel) {
      return;
    }
    if (zoomLevel < 6) {
      setProjection('globe');
    } else {
      setProjection('mercator');
    }
    if (zoomLevel > 10) {
      setMapStyle(mapStyles.satelliteStreets);
    } else {
      setMapStyle(mapStyles.light);
    }
  }, [zoomLevel]);

  return { mapStyle, projection };
};
