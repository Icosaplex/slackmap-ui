import { useEffect, useState } from 'react';
import { mapStyles } from './constants';

export const useMapStyle = (zoomLevel?: number) => {
  const [mapStyle, setMapStyle] = useState(mapStyles.light);

  useEffect(() => {
    if (!zoomLevel) {
      return;
    }
    if (zoomLevel > 11) {
      setMapStyle(mapStyles.satellite);
    } else {
      setMapStyle(mapStyles.light);
    }
  }, [zoomLevel]);

  return mapStyle;
};
