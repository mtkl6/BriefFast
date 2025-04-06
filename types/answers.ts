/**
 * Type definitions for questionnaire answers
 */

/**
 * Answer data for a questionnaire
 * Keys are field IDs and values are the responses
 */
export interface AnswerData {
  [fieldId: string]: string | string[] | number | boolean | null | undefined;
}

/**
 * Saved brief data structure
 */
export interface BriefData {
  id: string;
  content: string;
  template: string;
  answers: AnswerData;
  createdAt: string;
  updatedAt: string;
}

export default AnswerData;
