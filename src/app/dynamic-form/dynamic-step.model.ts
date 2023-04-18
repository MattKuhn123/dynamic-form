import { DynamicStepQuestion } from "./dynamic-step-question.model";

export class DynamicStep {
    description: string;
    key: string;
    order: number;
    questions: DynamicStepQuestion<any>[];
    title: string;
  
    constructor(options: {
        description?: string;
        key?: string;
        order?: number;
        questions?: DynamicStepQuestion<any>[];
        title?: string;
    } = {}) {
        this.description = options.description || "";
        this.key = options.key || "";
        this.order = options.order || 0;
        this.questions = options.questions || [];
        this.title = options.title || "";
    }
  }