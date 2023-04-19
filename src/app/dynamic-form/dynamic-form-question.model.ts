export class DynamicFormQuestion {
  controlType: string;
  dependsOn: { key: string, value: string }[];
  key: string;
  label: string;
  options: { key: string, value: string }[];
  required: boolean;
  type: string;
  
  constructor(options: {
    controlType?: string;
    dependsOn?: { key: string, value: string }[];
    key?: string;
    label?: string;
    options?: { key: string, value: string }[];
    required?: boolean;
    type?: string;
  } = {}) {
    this.controlType = options.controlType || '';
    this.dependsOn = options.dependsOn || [];
    this.key = options.key || '';
    this.label = options.label || '';
    this.options = options.options || [];
    this.required = !!options.required;
    this.type = options.type || '';
  }
}