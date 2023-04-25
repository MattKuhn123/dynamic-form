import { DynamicFormQuestion } from "./dynamic-form-question.model";

export class DynamicFormSection {
  dependsOn: { section: string, key: string, value: string }[];
  description: string;
  list: boolean;
  questions: DynamicFormQuestion[];
  required: boolean;
  title: string;

  constructor(options: {
    dependsOn?: { section: string, key: string, value: string }[];
    description?: string;
    list?: boolean;
    questions?: DynamicFormQuestion[];
    required?: boolean;
    title?: string;
  } = {}) {
    this.dependsOn = options.dependsOn || [];
    this.description = options.description || "";
    this.list = !!options.list;
    this.questions = options.questions || [];
    this.required = !!options.required;
    this.title = options.title || "";
  }
}