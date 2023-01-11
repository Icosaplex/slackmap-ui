import { Projection } from 'mapbox-gl';
import { useEffect, useState } from 'react';
import { ProjectionSpecification } from 'react-map-gl';
import { mapStyles } from './constants';

export const useMapStyle = (zoomLevel?: number) => {
  const [mapStyle, setMapStyle] = useState(mapStyles.light);
  const [projection, setProjection] = useState<Projection['name']>();

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
      setMapStyle(mapStyles.satellite);
    } else {
      setMapStyle(mapStyles.light);
    }
  }, [zoomLevel]);

  return { mapStyle, projection };
};
