export class DynamicFormQuestion {
  key: string;
  label: string;
  required: boolean;
  controlType: string;
  type: string;
  options: { key: string, value: string }[];
  dependsOn: { key: string, value: string }[];
  
  constructor(options: {
    key?: string;
    label?: string;
    required?: boolean;
    controlType?: string;
    type?: string;
    options?: { key: string, value: string }[];
    dependsOn?: { key: string, value: string }[];
  } = {}) {
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
    this.dependsOn = options.dependsOn || [];
  }
}