import {pastQuestions} from '../data/past-questions';
export type LessonResult = 'correct'|'review';
export type LessonProgress = Record<string,LessonResult>;
export type LessonAnswers = Record<string,{choice:number;checked:boolean}>;
export const LESSON_KEY = 'joseon518-lesson-past-v1';
export const LESSON_ANSWERS_KEY = 'joseon518-lesson-answers-v1';
export function loadLessonAnswers():LessonAnswers {
  try {
    const value = JSON.parse(localStorage.getItem(LESSON_ANSWERS_KEY)||'{}');
    if(!value||typeof value!=='object'||Array.isArray(value))return {};
    return Object.fromEntries(Object.entries(value).filter(([id,a])=>{
      if(!pastQuestions.some(q=>q.id===id)||!a||typeof a!=='object')return false;
      const answer=a as {choice:number;checked:boolean};
      return Number.isInteger(answer.choice)&&answer.choice>=1&&answer.choice<=5&&typeof answer.checked==='boolean';
    })) as LessonAnswers;
  }catch{return {}}
}
export function loadLessonProgress():LessonProgress {
  try {
    const value = JSON.parse(localStorage.getItem(LESSON_KEY)||'{}');
    if(!value||typeof value!=='object'||Array.isArray(value))return {};
    return Object.fromEntries(Object.entries(value).filter(([id,result]) => pastQuestions.some(q=>q.id===id)&&(result==='correct'||result==='review'))) as LessonProgress;
  }catch{return {}}
}
