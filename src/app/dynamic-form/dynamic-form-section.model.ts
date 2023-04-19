import { DynamicFormQuestion } from "./dynamic-form-question.model";

export class DynamicFormSection {
  dependsOn: { section: number, key: string, value: string }[];
  description: string;
  questions: DynamicFormQuestion[];
  required: boolean;
  title: string;

  constructor(options: {
    dependsOn?: { section: number, key: string, value: string }[];
    description?: string;
    key?: string;
    questions?: DynamicFormQuestion[];
    required?: boolean;
    title?: string;
  } = {}) {
    this.dependsOn = options.dependsOn || [];
    this.description = options.description || "";
    this.questions = options.questions || [];
    this.required = !!options.required;
    this.title = options.title || "";
  }
}