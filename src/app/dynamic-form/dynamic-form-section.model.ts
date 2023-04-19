import { DynamicFormQuestion } from "./dynamic-form-question.model";

export class DynamicFormSection {
  description: string;
  dependsOn: { section: number, key: string, value: string }[];
  key: string;
  questions: DynamicFormQuestion<any>[];
  title: string;
  required: boolean;

  constructor(options: {
    description?: string;
    dependsOn?: { section: number, key: string, value: string }[];
    key?: string;
    questions?: DynamicFormQuestion<any>[];
    title?: string;
    required?: boolean;
  } = {}) {
    this.description = options.description || "";
    this.dependsOn = options.dependsOn || [];
    this.key = options.key || "";
    this.questions = options.questions || [];
    this.title = options.title || "";
    this.required = !!options.required;
  }
}