import { FeatureCollection } from 'geojson';

export interface GetLineDetailsAPIResponse {
  id: string;
  type?: SlacklineType;
  creatorUserId: string;
  name?: string;
  description?: string;
  city?: string;
  length?: number;
  height?: number;
  accessInfo?: string;
  anchorsInfo?: string;
  gearInfo?: string;
  contactInfo?: string;
  restrictionLevel?: SlacklineRestrictionLevel;
  extraInfo?: string;
  coverImageUrl?: string;
  createdDateTime: string;
  lastModifiedDateTime?: string;
  restrictionInfo?: string;
  isMeasured?: boolean;
  isUserEditor?: boolean;
}

export interface UpdateLineDetailsPayload {
  geoJson: FeatureCollection;
  type?: SlacklineType | '';
  name?: string;
  description?: string;
  length?: number;
  height?: number;
  accessInfo?: string;
  anchorsInfo?: string;
  gearInfo?: string;
  contactInfo?: string;
  restrictionLevel?: SlacklineRestrictionLevel;
  extraInfo?: string;
  restrictionInfo?: string;
  isMeasured?: boolean;
}

export interface CreateLineDetailsPayload {
  geoJson: FeatureCollection;
  type?: SlacklineType | '';
  name?: string;
  description?: string;
  length?: number;
  height?: number;
  accessInfo?: string;
  anchorsInfo?: string;
  gearInfo?: string;
  contactInfo?: string;
  restrictionLevel?: SlacklineRestrictionLevel;
  extraInfo?: string;
  restrictionInfo?: string;
  isMeasured?: boolean;
}

export interface GetSpotDetailsAPIResponse {
  id: string;
  creatorUserId: string;
  name?: string;
  description?: string;
  accessInfo?: string;
  contactInfo?: string;
  restrictionLevel?: SlacklineRestrictionLevel;
  extraInfo?: string;
  coverImageUrl?: string;
  createdDateTime: string;
  lastModifiedDateTime?: string;
  restrictionInfo?: string;
  isUserEditor?: boolean;
}

export interface UpdateSpotDetailsPayload {
  geoJson: FeatureCollection;
  name?: string;
  description?: string;
  accessInfo?: string;
  contactInfo?: string;
  restrictionLevel?: SlacklineRestrictionLevel;
  restrictionInfo?: string;
  extraInfo?: string;
}

export interface CreateSpotDetailsPayload {
  geoJson: FeatureCollection;
  name?: string;
  description?: string;
  accessInfo?: string;
  contactInfo?: string;
  restrictionLevel?: SlacklineRestrictionLevel;
  restrictionInfo?: string;
  extraInfo?: string;
}

export interface GetUserBasicDetailsAPIResponse {
  name: string;
  surnam?: string;
  email: string;
  profilePictureUrl?: string;
}
