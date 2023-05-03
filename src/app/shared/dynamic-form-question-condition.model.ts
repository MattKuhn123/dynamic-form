
export class DynamicFormQuestionCondition {
  key: string;
  value: string;
  
  constructor(options: {
    key?: string;
    value?: string;
  } = {}) {
    this.key = options.key || '';
    this.value = options.value || '';
  }
}