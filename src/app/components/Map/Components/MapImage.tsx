import { useMap } from 'react-map-gl';

export const MapImage = (props: { name: string; url: string }) => {
  const { current: map } = useMap();

  if (map) {
    if (!map.hasImage(props.name)) {
      map.loadImage(props.url, (error, image) => {
        if (error) throw error;
        if (image && !map.hasImage(props.name)) {
          map.addImage(props.name, image, { sdf: true });
        }
      });
    }
  }

  return null;
};
