export type Level='advanced'|'basic';
export type Attempt={id:string;round:string;level:Level;fileName:string;answers:Record<string,number>;key:number[]|null;points:number[]|null;notes:Record<string,string>;startedAt:number;deadline:number|null;submittedAt:number|null};
export type ExamStore={active:Attempt|null;history:Attempt[]};
export const STORE_KEY='joseon518-official-exam-v1';
export const OFFICIAL_PAPERS='https://www.historyexam.go.kr/pst/list.do?bbs=dat';
export const OFFICIAL_ANSWERS='https://www.historyexam.go.kr/answer/list.do';
export const OFFICIAL_GUIDE='https://www.historyexam.go.kr/pageLink.do?link=examGuideline&netfunnel=Y';
export const freshStore=():ExamStore=>({active:null,history:[]});
export function validAttempt(value:unknown):value is Attempt{
 if(!value||typeof value!=='object')return false;const a=value as Attempt;
 const max=a.level==='advanced'?5:4;
 return typeof a.id==='string'&&typeof a.round==='string'&&['advanced','basic'].includes(a.level)&&typeof a.fileName==='string'&&!!a.answers&&typeof a.answers==='object'&&Object.entries(a.answers).every(([id,n])=>/^([1-9]|[1-4][0-9]|50)$/.test(id)&&Number.isInteger(n)&&n>=1&&n<=max)&&!!a.notes&&typeof a.notes==='object'&&Object.values(a.notes).every(n=>typeof n==='string')&&(a.key===null||(Array.isArray(a.key)&&a.key.length===50&&a.key.every(n=>Number.isInteger(n)&&n>=1&&n<=max)))&&(a.points===null||(Array.isArray(a.points)&&a.points.length===50&&a.points.every(n=>Number.isInteger(n)&&n>=1&&n<=3)&&a.points.reduce((s,n)=>s+n,0)===100))&&Number.isFinite(a.startedAt)&&(a.deadline===null||Number.isFinite(a.deadline))&&(a.submittedAt===null||Number.isFinite(a.submittedAt));
}
export function loadExam():ExamStore{
 try{const data=JSON.parse(localStorage.getItem(STORE_KEY)||'null');return {active:validAttempt(data?.active)&&data.active.submittedAt===null?data.active:null,history:Array.isArray(data?.history)?data.history.filter((a:unknown)=>validAttempt(a)&&a.submittedAt!==null).slice(0,10):[]}}catch{return freshStore()}
}
export function parseNumbers(text:string,kind:'key'|'points',level:Level):number[]{
 const normalized=text.trim().replace(/[①②③④⑤]/g,char=>String('①②③④⑤'.indexOf(char)+1));
 if(!normalized||!/^[1-5\s,;|]+$/.test(normalized))throw new Error('정답 번호만 순서대로 넣어 주세요. 예: 1 3 2 5 …');
 const numbers=normalized.replace(/[\s,;|]/g,'').split('').map(Number);
 if(numbers.length!==50)throw new Error(`50개를 넣어 주세요. 현재 ${numbers.length}개예요.`);
 if(kind==='points'){
  if(numbers.some(n=>n<1||n>3)||numbers.reduce((s,n)=>s+n,0)!==100)throw new Error('배점은 각 1~3점, 50개 합계 100점이어야 해요.');
 }else if(numbers.some(n=>n<1||n>(level==='advanced'?5:4)))throw new Error(level==='advanced'?'심화 정답은 1~5번이에요.':'기본 정답은 1~4번이에요.');
 return numbers;
}
export function grade(a:Attempt){
 const wrong=Array.from({length:50},(_,i)=>i+1).filter(n=>a.key&&a.answers[n]!==a.key[n-1]);
 const unanswered=50-Object.keys(a.answers).length;
 const score=a.key&&a.points?a.key.reduce((s,answer,i)=>s+(a.answers[i+1]===answer?a.points![i]:0),0):null;
 return {correct:a.key?50-wrong.length:null,wrong,unanswered,score,rank:score===null?null:score<60?'인증 기준 미달':`${(a.level==='advanced'?1:4)+(score>=80?0:score>=70?1:2)}급 기준`};
}
export function makeAttempt(round:string,level:Level,fileName:string,timed:boolean,now=Date.now()):Attempt{
 return {id:crypto.randomUUID(),round,level,fileName,answers:{},key:null,points:null,notes:{},startedAt:now,deadline:timed?now+(level==='advanced'?80:70)*60000:null,submittedAt:null};
}
export function complete(store:ExamStore,now=Date.now()):ExamStore{
 if(!store.active)return store;const result={...store.active,submittedAt:now};return {active:null,history:[result,...store.history.filter(a=>a.id!==result.id)].slice(0,10)};
}
