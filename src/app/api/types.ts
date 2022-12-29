export interface GetLineDetailsAPIResponse {
  type?: SlacklineType;
  creatorUserId: string;
  geoJson: string; // Always FeatureCollection type
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
}
