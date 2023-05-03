import { DynamicFormQuestion } from "./dynamic-form-question.model";
import { DynamicFormSectionCondition } from "./dynamic-form-section-condition.model";

export class DynamicFormSection {
  conditions: DynamicFormSectionCondition[];
  subtitle: string;
  info: string;
  list: boolean;
  questions: DynamicFormQuestion[];
  required: boolean;
  key: string;

  constructor(options: {
    conditions?: DynamicFormSectionCondition[];
    subtitle?: string;
    info?: string
    list?: boolean;
    questions?: DynamicFormQuestion[];
    required?: boolean;
    key?: string;
  } = {}) {
    this.conditions = options.conditions || [];
    this.subtitle = options.subtitle || "";
    this.info = options.info || "";
    this.list = !!options.list;
    this.questions = options.questions || [];
    this.required = !!options.required;
    this.key = options.key || "";
  }
}