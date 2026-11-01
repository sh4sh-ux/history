import {pastQuestions} from '../data/past-questions';
export type LessonResult = 'correct'|'review';
export type LessonProgress = Record<string,LessonResult>;
export const LESSON_KEY = 'joseon518-lesson-past-v1';
export function loadLessonProgress():LessonProgress {
  try {
    const value = JSON.parse(localStorage.getItem(LESSON_KEY)||'{}');
    if(!value||typeof value!=='object'||Array.isArray(value))return {};
    return Object.fromEntries(Object.entries(value).filter(([id,result]) => pastQuestions.some(q=>q.id===id)&&(result==='correct'||result==='review'))) as LessonProgress;
  }catch{return {}}
}
