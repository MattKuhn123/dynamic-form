import { DynamicFormQuestion } from "./dynamic-form-question.model";

export class DynamicFormSection {
  conditions: { section: string, key: string, value: string }[];
  description: string;
  list: boolean;
  questions: DynamicFormQuestion[];
  required: boolean;
  key: string;

  constructor(options: {
    conditions?: { section: string, key: string, value: string }[];
    description?: string;
    list?: boolean;
    questions?: DynamicFormQuestion[];
    required?: boolean;
    key?: string;
  } = {}) {
    this.conditions = options.conditions || [];
    this.description = options.description || "";
    this.list = !!options.list;
    this.questions = options.questions || [];
    this.required = !!options.required;
    this.key = options.key || "";
  }
}