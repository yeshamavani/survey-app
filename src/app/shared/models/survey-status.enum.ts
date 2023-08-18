export enum SurveyStatus {
  DRAFT = 'Draft',
  REVIEW_IN_PROGRESS = 'Review in Progress',
  SUBMITTED_FOR_REVIEW = 'Submitted for Review',
  APPROVED = 'Approved',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  EXPIRED = 'Expired',
}

export enum SurveyStatusColor {
  'Submitted for Review' = '#F59600',
  'Review in Progress' = '#00B4E5',
  'Approved' = '#00B900',
  'Draft' = '#C4C4C4',
  'Active' = '#50C7AA',
  'Completed' = '#0019B9',
  'Expired' = '#F53A3A',
}

export enum SurveyResponseStatus {
  RESPONDED = 'RESPONDED',
  NOT_RESPONDED = 'NOT_RESPONDED',
}

export enum SurveyResponseStatusColor {
  RESPONDED = '#00B900',
  NOT_RESPONDED = '#C4C4C4',
}
