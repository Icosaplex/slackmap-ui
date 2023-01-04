import * as turf from '@turf/turf';

export const mapUrlSearchParams = {
  parse: (searchParams: URLSearchParams) => {
    const [longitude, latitude, zoom] =
      searchParams.get('map')?.split(',').map(Number) ?? [];
    if (!longitude || !latitude || !zoom) {
      return undefined;
    }
    return {
      longitude,
      latitude,
      zoom,
    };
  },
  stringify: (longitude: number, latitude: number, zoom: number) => {
    return `${turf.round(longitude, 5)},${turf.round(latitude, 5)},${turf.round(
      zoom,
      5,
    )}`;
  },
};
