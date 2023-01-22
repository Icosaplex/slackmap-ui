export interface GuideDetailsForm {
  description?: string;
  type: GuideType;
  images?: {
    s3Key?: string;
    id?: string;
    content?: string;
    isCover?: boolean;
  }[];
}
