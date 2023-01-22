export interface SpotDetailsForm {
  name?: string;
  description?: string;
  accessInfo?: string;
  contactInfo?: string;
  restrictionLevel?: SlacklineRestrictionLevel;
  restrictionInfo?: string;
  extraInfo?: string;
  images?: {
    s3Key?: string;
    id?: string;
    content?: string;
    isCover?: boolean;
  }[];
}
