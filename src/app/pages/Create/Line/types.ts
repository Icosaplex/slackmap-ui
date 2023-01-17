export interface LineDetailsForm {
  type?: SlacklineType | '';
  name?: string;
  description?: string;
  length?: number;
  height?: number;
  isMeasured: boolean;
  accessInfo?: string;
  anchorsInfo?: string;
  gearInfo?: string;
  contactInfo?: string;
  restrictionLevel?: SlacklineRestrictionLevel | '';
  restrictionInfo?: string;
  extraInfo?: string;
}
