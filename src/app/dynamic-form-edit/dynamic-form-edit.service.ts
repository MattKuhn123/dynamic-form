import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicFormQuestion } from '../shared/dynamic-form-question.model';
import { DynamicFormSection } from '../shared/dynamic-form-section.model';
import { keyRequiredValidator } from './key-required.validator';
import { questionMinimum } from './question-minimum.validator';
import { DynamicFormQuestionOption } from '../shared/dynamic-form-question-option.model';
import { DynamicFormQuestionCondition } from '../shared/dynamic-form-question-condition.model';
import { DynamicFormSectionCondition } from '../shared/dynamic-form-section-condition.model';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormEditService {
  public sectionToGroup(fb: FormBuilder, section: DynamicFormSection): FormGroup {
    return fb.group({
      key: fb.control({value: section.key || "", disabled: true}, [Validators.required]),
      subtitle: fb.control(section.subtitle || "", [Validators.required]),
      info: fb.control(section.info || ""),
      list: fb.control(section.list || false, [Validators.required]),
      required: fb.control(section.required || false, [Validators.required]),
      conditions: fb.array(section.conditions.map((condition: any) => this.sectionConditionsToGroup(fb, condition))),
      questions: fb.array(section.questions.map(question => this.questionToGroup(fb, question)))
    }, { validators: [ questionMinimum, keyRequiredValidator ] });
  }

  public sectionConditionsToGroup(fb: FormBuilder, condition: DynamicFormSectionCondition): FormGroup {
    return fb.group({
      key: fb.control(condition.key || ""),
      section: fb.control(condition.section || 0),
      value: fb.control(condition.value || ""),
    });
  }

  public questionToGroup(fb: FormBuilder, question: DynamicFormQuestion): FormGroup {
    return fb.group({
      key: fb.control({value: question.key || "", disabled: true}, [Validators.required]),
      controlType: fb.control(question.controlType || "", [Validators.required]),
      conditions: fb.array(question.conditions.map(condition => this.questionConditionsToGroup(fb, condition))),
      label: fb.control(question.label || ""),
      options: fb.array(question.options.map(option => this.questionOptionToGroup(fb, option)) || []),
      required: fb.control(question.required || ""),
      info: fb.control(question.info || ""),
      
      type: fb.control(question.type), // text, number
      min: fb.control(question.min), // for number
      max: fb.control(question.max), // for number
      
      minLength: fb.control(question.minLength), // for text
      maxLength: fb.control(question.maxLength), // for text
      email: fb.control(question.email), // for text
      allowNumbers: fb.control(question.allowNumbers), // for text
      allowSpaces: fb.control(question.allowSpaces), // for text
      allowPunctuation: fb.control(question.allowPunctuation), // for text

      temporal: fb.control(question.temporal) // past, future, implied for date

    }, { validators: keyRequiredValidator });
  }

  public questionConditionsToGroup(fb: FormBuilder, condition: DynamicFormQuestionCondition): FormGroup {
    return fb.group({
      key: fb.control(condition.key || ""),
      value: fb.control(condition.value || ""),
    });
  }

  public questionOptionToGroup(fb: FormBuilder, option: DynamicFormQuestionOption): FormGroup {
    return fb.group({
      key: option.key,
      value: option.value
    });
  }

  public getSection(secs: FormArray, secIdx: number): FormGroup { return secs.at(secIdx) as FormGroup; }
  public getSectionKey(secs: FormArray, secIdx: number): FormControl { return this.getSection(secs, secIdx).get("key") as FormControl; }
  public getSectionRequired(secs: FormArray, secIdx: number): FormControl { return this.getSection(secs, secIdx).get("required") as FormControl; }
  public getSectionList(secs: FormArray, secIdx: number): FormControl { return this.getSection(secs, secIdx).get("list") as FormControl; }
  public getSectionConditions(secs: FormArray, secIdx: number): FormArray { return (this.getSection(secs, secIdx)).get("conditions") as FormArray; }
  public getSectionCondition(secs: FormArray, secIdx: number, dpdsIdx: number): FormGroup { return this.getSectionConditions(secs, secIdx).at(dpdsIdx) as FormGroup; }
  public getSectionConditionsSection(secs: FormArray, secIdx: number, dpdsIdx: number): FormControl { return this.getSectionCondition(secs, secIdx, dpdsIdx).get("section") as FormControl; }
  public getSectionConditionsQuestion(secs: FormArray, secIdx: number, dpdsIdx: number): FormControl { return this.getSectionCondition(secs, secIdx, dpdsIdx).get("key") as FormControl; }
  public getSectionConditionsValue(secs: FormArray, secIdx: number, dpdsIdx: number): FormControl { return this.getSectionCondition(secs, secIdx, dpdsIdx).get("value") as FormControl; }
  
  public getQuestions(secs: FormArray, secIdx: number): FormArray { return (this.getSection(secs, secIdx)).get("questions") as FormArray; }
  public getQuestion(secs: FormArray, secIdx: number, qIdx: number): FormGroup { return this.getQuestions(secs, secIdx).at(qIdx) as FormGroup; }
  public getQuestionKey(secs: FormArray, secIdx: number, qIdx: number): FormControl { return this.getQuestion(secs, secIdx, qIdx).get("key") as FormControl; }
  public getQuestionCtrlType(secs: FormArray, secIdx: number, qIdx: number): FormControl { return this.getQuestion(secs, secIdx, qIdx).get("controlType") as FormControl; }
  public getQuestionType(secs: FormArray, secIdx: number, qIdx: number): FormControl { return this.getQuestion(secs, secIdx, qIdx).get("type") as FormControl; }
  public getQuestionEmail(secs: FormArray, secIdx: number, qIdx: number): FormControl { return this.getQuestion(secs, secIdx, qIdx).get("email") as FormControl; }
  
  public getQuestionNumbers(secs: FormArray, secIdx: number, qIdx: number): FormControl { return this.getQuestion(secs, secIdx, qIdx).get("allowNumbers") as FormControl; }
  public getQuestionSpaces(secs: FormArray, secIdx: number, qIdx: number): FormControl { return this.getQuestion(secs, secIdx, qIdx).get("allowSpaces") as FormControl; }
  public getQuestionPunctuation(secs: FormArray, secIdx: number, qIdx: number): FormControl { return this.getQuestion(secs, secIdx, qIdx).get("allowPuncutation") as FormControl; }
  
  public getQuestionLabel(secs: FormArray, secIdx: number, qIdx: number): FormControl { return this.getQuestion(secs, secIdx, qIdx).get("label") as FormControl; }
  public getQuestionRequired(secs: FormArray, secIdx: number, qIdx: number): FormControl { return this.getQuestion(secs, secIdx, qIdx).get("required") as FormControl; }
  
  public getQuestionOptions(secs: FormArray, secIdx: number, qIdx: number): FormArray { return this.getQuestion(secs, secIdx, qIdx).get("options") as FormArray; }
  public getQuestionOption(secs: FormArray, secIdx: number, qIdx: number, optIdx: number): FormControl { return (this.getQuestion(secs, secIdx, qIdx).get("options") as FormArray).at(optIdx) as FormControl; }
  
  public getQuestionConditions(secs: FormArray, secIdx: number, qIdx: number): FormArray { return this.getQuestion(secs, secIdx, qIdx).get("conditions") as FormArray; }
  public getQuestionCondition(secs: FormArray, secIdx: number, qIdx: number, dpdsIdx: number): FormControl { return this.getQuestionConditions(secs, secIdx, qIdx).at(dpdsIdx) as FormControl; }
  public getQuestionConditionsQuestion(secs: FormArray, secIdx: number, qIdx: number, dpdsIdx: number): FormControl { return this.getQuestionCondition(secs, secIdx, qIdx, dpdsIdx).get("key") as FormControl; }
  public getQuestionConditionsValue(secs: FormArray, secIdx: number, qIdx: number, dpdsIdx: number): FormControl { return this.getQuestionCondition(secs, secIdx, qIdx, dpdsIdx).get("value") as FormControl; }
  
  public getSectionsForSectionConditions(secs: FormArray): string[] {
    const sections: DynamicFormSection[] = secs.getRawValue() as DynamicFormSection[];
    return sections.map(section => section.key);
  }
  public getQuestionsForConditions(secs: FormArray, secKey: string): string[] {
    const secIdx = this.getIndexOfSection(secs, secKey);
    const sec = this.getQuestions(secs, secIdx).getRawValue() as DynamicFormQuestion[];
    return sec.filter(question => ["radio", "dropdown", "checkbox"].findIndex(ctrlType => ctrlType === question.controlType) > -1).map(q => q.key);
  }
  
  public getValuesForConditions(secs: FormArray, secKey: string, qKey: string): DynamicFormQuestionOption[] {
    const secIdx = this.getIndexOfSection(secs, secKey);
    return this.getQuestionOptions(secs, secIdx, this.getIndexOfQuestionInSection(secs, secIdx, qKey)).value;
  }

  public isQuestionOptionable(secs: FormArray, secIdx: number, qIdx: number): boolean { return ["radio", "dropdown"].findIndex(ctrlType => ctrlType === this.getQuestionCtrlType(secs, secIdx, qIdx).value) > -1; }
  
  public getIndexOfQuestionInSection(secs: FormArray, secIdx: number, qKey: string): number { return (this.getQuestions(secs, secIdx).getRawValue() as DynamicFormQuestion[]).findIndex(question => question.key === qKey); }
  public getIndexOfSection(secs: FormArray, sKey: string): number { return (secs.getRawValue() as DynamicFormSection[]).findIndex(section => section.key === sKey); }
}
