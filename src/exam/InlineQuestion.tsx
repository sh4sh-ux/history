import {useEffect,useState,useId} from 'react';
import {paperContent} from '../data/past-paper-content';
import type {PastQuestion} from '../data/past-questions';
import type {LessonAnswers} from './lesson-progress';

function OriginalMaterial({src,label}:{src:string;label:string}) {
  const [open,setOpen]=useState(false),[state,setState]=useState<'loading'|'loaded'|'error'>('loading');
  useEffect(()=>{if(!open||state!=='loading')return;const timer=setTimeout(()=>setState('error'),10000);return()=>clearTimeout(timer)},[open,state]);
  return <details className="original-material" onToggle={e=>setOpen(e.currentTarget.open)}>
    <summary>시험지 원본 자료도 보기</summary>
    {open&&<div>{state==='loading'&&<p role="status">원본 자료 이미지를 여는 중이에요…</p>}
      {state==='error'&&<p role="status">원본 이미지를 불러오지 못했어요. 위의 자료 요약과 아래의 보기로 계속 풀 수 있어요.</p>}
      <img src={src} alt={`${label} 원본 자료`} referrerPolicy="no-referrer" onLoad={()=>setState('loaded')} onError={()=>setState('error')} hidden={state==='error'}/>
      <small>출제: 국사편찬위원회 · 원본 자료 이미지 제공: 전자문제집 CBT</small>
    </div>}
  </details>;
}

export function InlineQuestion({question:q,answers,onAnswer,onGrade}:{question:PastQuestion;answers:LessonAnswers;onAnswer:(id:string,choice:number)=>void;onGrade:(id:string)=>void}) {
  const paper=paperContent[q.id],answer=answers[q.id],group=useId();
  const label=`제${q.round}회 ${q.level} ${q.number}번`;
  return <section className="inline-question" aria-label={`${label} 문제지`}>
    <h4>{q.number}. {paper.question}</h4>
    <div className="material-summary"><b>자료 핵심 요약</b><p>{paper.materialSummary}</p><small>원문 자료를 쉬운 말로 요약했어요. 아래 5개 보기와 정답 번호는 해당 기출 기준이에요.</small></div>
    <OriginalMaterial key={q.id} src={paper.materialImage} label={label}/>
    <fieldset className="inline-choices" aria-label={`${label} 답안 선택`}><legend>정답을 골라 보세요</legend>
      {paper.choices.map((choice,i)=><label key={i} className={answer?.choice===i+1?'chosen':''}><input type="radio" name={group} checked={answer?.choice===i+1} aria-label={`${label} ${i+1}번`} onChange={()=>onAnswer(q.id,i+1)}/><span className="choice-number">{i+1}</span><span>{choice}</span></label>)}
    </fieldset>
    <button className="primary inline-grade" disabled={!answer} onClick={()=>onGrade(q.id)}>정답 확인하기</button>
    {answer?.checked&&<div className={`inline-feedback ${answer.choice===q.answer?'correct':'wrong'}`} role="status"><b>{answer.choice===q.answer?'정답이에요!':'다시 살펴봐요.'} 정답은 {q.answer}번이에요.</b><p>{q.explanation}</p><small>{answer.choice===q.answer?'맞힌 문제로 기록했어요.':'기출 복습 목록에 모아 두었어요.'}</small></div>}
  </section>;
}
