export const QUALIFICATION_FIELDS = [
  'name',
  'email',
  'company',
  'projectType',
  'budget',
  'message',
] as const;

export type QualificationField = (typeof QUALIFICATION_FIELDS)[number];

export interface QualificationFormState {
  success: boolean;
  message: string;
  errors?: Partial<Record<QualificationField, string[]>>;
  values?: Partial<Record<QualificationField, string>>;
  attempt: number;
}

export const initialQualificationState: QualificationFormState = {
  success: false,
  message: '',
  attempt: 0,
};
