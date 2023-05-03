import { DynamicFormQuestionOption } from "./dynamic-form-question-option.model";

export class DynamicFormQuestion {
  controlType: string;
  conditions: { key: string, value: string }[];
  key: string;
  label: string;
  options: DynamicFormQuestionOption[];
  required: boolean;
  
  type: string; // text, number, date
  min: number; // for number
  max: number; // for number
  minLength: number; // for text
  maxLength: number; // for text
  email: boolean; // for text
  allowNumbers: boolean; // for text
  allowSpaces: boolean; // for text
  allowPunctuation: boolean; // for text
  temporal: string; // past, future
  
  constructor(options: {
    controlType?: string;
    conditions?: { key: string, value: string }[];
    key?: string;
    label?: string;
    options?: DynamicFormQuestionOption[];
    required?: boolean;

    type?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    allowNumbers?: boolean;
    allowSpaces?: boolean;
    allowPunctuation?: boolean;
    temporal?: string;
  } = {}) {
    this.controlType = options.controlType || '';
    this.conditions = options.conditions || [];
    this.key = options.key || '';
    this.label = options.label || '';
    this.options = options.options || [];
    this.required = !!options.required;
    
    this.type = options.type || '';
    this.min = options.min || 0; // for number
    this.max = options.max || 0; // for number
    this.minLength = options.minLength || 0; // for text
    this.maxLength = options.maxLength || 0; // for text
    this.email = !!options.email; // for text
    this.allowNumbers = !!options.allowNumbers; // for text
    this.allowSpaces = !!options.allowSpaces; // for text
    this.allowPunctuation = !!options.allowPunctuation; // for text
    this.temporal = options.temporal || ''; // past, future, default
  }
}