import { Feature } from '@turf/turf';

export const validateLineFeatures = (features: Feature[]): string[] => {
  const errors: string[] = [];
  if (features.filter(f => !f.properties?.isExtra).length > 1) {
    errors.push('Only 1 line feature is allowed');
  }
  return errors;
};
