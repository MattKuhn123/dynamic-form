import { DynamicStepQuestion } from "./dynamic-step-question.model";

export class DynamicStep {
    description: string;
    dependsOn: { step: number, key: string, value: string }[];
    key: string;
    questions: DynamicStepQuestion<any>[];
    title: string;
  
    constructor(options: {
        description?: string;
        dependsOn?: { step: number, key: string, value: string }[];
        key?: string;
        questions?: DynamicStepQuestion<any>[];
        title?: string;
    } = {}) {
        this.description = options.description || "";
        this.dependsOn = options.dependsOn || [];
        this.key = options.key || "";
        this.questions = options.questions || [];
        this.title = options.title || "";
    }
  }