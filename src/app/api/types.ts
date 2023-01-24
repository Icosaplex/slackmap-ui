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
  createdDateTime: string;
  lastModifiedDateTime?: string;
  restrictionInfo?: string;
  isMeasured?: boolean;
  images?: { s3Key: string; isCover?: boolean }[];
  isUserEditor?: boolean;
  hasNoEditors?: boolean;
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
  images?: { id?: string; content?: string; isCover?: boolean }[];
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
  images?: { id?: string; content?: string; isCover?: boolean }[];
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
  createdDateTime: string;
  lastModifiedDateTime?: string;
  restrictionInfo?: string;
  images?: { s3Key: string; isCover?: boolean }[];
  isUserEditor?: boolean;
  hasNoEditors?: boolean;
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
  images?: { id?: string; content?: string; isCover?: boolean }[];
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
  images?: { id?: string; content?: string; isCover?: boolean }[];
}

export interface GetGuideDetailsAPIResponse {
  id: string;
  creatorUserId: string;
  description?: string;
  type: GuideType;
  typeLabel: string;
  createdDateTime: string;
  lastModifiedDateTime?: string;
  isUserEditor?: boolean;
  images?: { s3Key: string; isCover?: boolean }[];
}

export interface UpdateGuideDetailsPayload {
  geoJson: FeatureCollection;
  description?: string;
  type: GuideType;
  images?: { id?: string; content?: string; isCover?: boolean }[];
}

export interface CreateGuideDetailsPayload {
  geoJson: FeatureCollection;
  description?: string;
  type: GuideType;
  images?: { id?: string; content?: string; isCover?: boolean }[];
}

export interface GetUserBasicDetailsAPIResponse {
  name: string;
  surnam?: string;
  email: string;
  profilePictureUrl?: string;
}
