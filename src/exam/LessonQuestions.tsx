import {useState} from 'react';
import {ArrowUpRight,BookOpen,GraduationCap} from 'lucide-react';
import {events,kings,type HistoryEvent} from '../data/history';
import {pastQuestions,forKing,forLesson,forReadLessons,type PastQuestion} from '../data/past-questions';
import {OFFICIAL_PAPERS} from './model';
import type {LessonProgress,LessonResult} from './lesson-progress';

export type LessonActions = {
  progress: LessonProgress;
  onResult: (id:string,result:LessonResult)=>void;
  onOpen: (event:HistoryEvent)=>void;
};
const ref = (q:PastQuestion)=>`제${q.round}회 ${q.level} ${q.number}번`;

function QuestionCard({question:q,kingId,eventId,progress,onResult,onOpen}:LessonActions&{question:PastQuestion;kingId?:number;eventId?:string}) {
  const result=progress[q.id];
  const connection=eventId?q.lessons.find(l=>l.id===eventId)?.reason:q.kings.find(k=>k.id===kingId)?.relation;
  return <details className="lesson-question">
    <summary><div><span className="past-reference">{ref(q)} <span>· {q.points}점</span></span><strong>{q.topic}</strong></div><span className={`past-result ${result||''}`}>{result==='correct'?'맞혔어요':result==='review'?'복습할 문제':'기출 펼치기'}</span></summary>
    <div className="lesson-question-body">
      {connection&&<p className="past-connection"><BookOpen size={16}/><span>{connection}</span></p>}
      <p className="past-original-note">아래는 강의와 기출을 연결하는 안내예요. 문제 지문·그림·보기는 원문 링크에서 확인해요.</p>
      <a className="past-original" href={q.original} target="_blank" rel="noreferrer">{ref(q)} 원문 문제 보기 <ArrowUpRight size={16}/></a>
      <small className="past-source-note">전자문제집 CBT · 새 창 · {q.number}번을 찾아보세요. 외부 페이지에는 정답도 함께 표시될 수 있어요.</small>
      <details className="past-help"><summary>막히면 힌트 보기</summary><p>{q.hint}</p></details>
      <details className="past-help"><summary>정답과 쉬운 해설 보기</summary><div className="past-explanation"><b>정답 {q.answer}번</b><p>{q.explanation}</p><a href={q.verification} target="_blank" rel="noreferrer">회차·정답 대조 자료 <ArrowUpRight size={13}/></a></div></details>
      <div className="past-mark"><span>직접 푼 결과를 남겨요</span><button aria-pressed={result==='correct'} onClick={()=>onResult(q.id,'correct')}>맞혔어요</button><button aria-pressed={result==='review'} onClick={()=>onResult(q.id,'review')}>복습할래요</button></div>
      {!!q.lessons.length&&<div className="past-lessons"><span>이야기로 돌아가 확인해요</span>{q.lessons.map(l=>{const e=events.find(e=>e.id===l.id)!;return <button key={l.id} onClick={()=>onOpen(e)}>{e.title} <ArrowUpRight size={13}/></button>})}</div>}
    </div>
  </details>;
}

export function RelatedQuestions({kingId,eventId,onBrowse,...actions}:LessonActions&{kingId?:number;eventId?:string;onBrowse?:()=>void}) {
  const list=eventId?forLesson(eventId):forKing(kingId!);
  return <section className="related-past" aria-label={eventId?'이 이야기와 연결된 기출문제':'이 강의와 연결된 기출문제'}>
    <div className="past-section-heading"><GraduationCap size={21}/><div><small>배운 이야기 → 실제 시험</small><h3>{eventId?'이 이야기에서 만나는 기출':'이 강의에서 만나는 기출'}</h3></div><span>{list.length}문항</span></div>
    {list.length?<><p className="past-intro">회차와 번호가 확인된 실제 한능검 기출이에요. 펼쳐서 원문·힌트·해설을 확인해요.</p>{list.map(q=><QuestionCard key={`${kingId||eventId}-${q.id}`} question={q} kingId={kingId} eventId={eventId} {...actions}/>)}</>:<p className="past-empty">아직 이 {eventId?'이야기':'강의'}에 연결한 기출이 없어요. 출처와 내용을 확인한 문항부터 차례로 추가하고 있어요.</p>}
    {onBrowse&&<button className="text-button" onClick={onBrowse}>읽은 이야기의 기출 모아 보기 <ArrowUpRight size={15}/></button>}
  </section>;
}

export function LessonQuestions({read,selectedKing,onExplore,...actions}:LessonActions&{read:string[];selectedKing:number;onExplore:()=>void}) {
  const [filter,setFilter]=useState<'read'|'king'|'all'|'review'>('read');
  const [kingId,setKingId]=useState(selectedKing);
  const list=filter==='read'?forReadLessons(read):filter==='king'?forKing(kingId):filter==='review'?pastQuestions.filter(q=>actions.progress[q.id]==='review'):pastQuestions;
  const wrong=pastQuestions.filter(q=>actions.progress[q.id]==='review').length;
  return <section className="lesson-practice" aria-label="강의별 한능검 기출">
    <div className="exam-banner"><GraduationCap size={26}/><div><h3>배운 강의에 맞춰 만나는 기출</h3><p>왕과 사건을 배웠다면, 그 이야기가 실제 시험에 어떻게 나왔는지 확인해요.</p></div></div>
    <div className="lesson-filters" role="group" aria-label="기출문제 범위"><button aria-pressed={filter==='read'} onClick={()=>setFilter('read')}>읽은 이야기</button><button aria-pressed={filter==='king'} onClick={()=>setFilter('king')}>왕별로 찾기</button><button aria-pressed={filter==='all'} onClick={()=>setFilter('all')}>전체 연결 기출</button><button aria-pressed={filter==='review'} onClick={()=>setFilter('review')}>기출 복습 ({wrong})</button></div>
    {filter==='king'&&<label className="past-king-select">어느 왕의 강의를 복습할까요?<select value={kingId} onChange={e=>setKingId(Number(e.target.value))} aria-label="기출 연결 왕 선택">{kings.map(k=><option key={k.id} value={k.id}>{k.id}대 {k.name}</option>)}</select></label>}
    <p className="past-count">{filter==='read'?`읽은 이야기 ${events.filter(e=>read.includes(e.id)).length}개와 연결된 기출`:filter==='king'?`${kings[kingId-1].name} 강의와 연결된 기출`:filter==='review'?'복습할 기출':'현재 연결한 실제 기출'} <strong>{list.length}문항</strong></p>
    {!list.length?<div className="past-empty">{filter==='read'?<><h4>이야기를 먼저 펼쳐 보세요</h4><p>읽은 사건과 직접 연결된 기출이 여기에 모여요. 왕별·전체 기출도 바로 볼 수 있어요.</p><button className="primary" onClick={onExplore}>왕조 연표에서 배우기</button></>:filter==='review'?<p>아직 복습할 기출이 없어요. 풀이 뒤 ‘복습할래요’를 누르면 여기에 모여요.</p>:<p>이 왕의 연결 기출은 아직 준비 중이에요. 확인한 문항부터 차례로 추가하고 있어요.</p>}</div>:list.map(q=><QuestionCard key={`${filter}-${kingId}-${q.id}`} question={q} kingId={filter==='king'?kingId:undefined} {...actions}/>)}
    <p className="past-footnote">현재 {pastQuestions.length}문항의 연결 정보를 제공해요. 전체 기출을 모두 담은 목록은 아니에요. 강의 연결·힌트·쉬운 해설은 조선 518에서 작성했고, 원문은 외부 링크로 제공해요. 풀이 결과는 직접 표시한 복습 기록이에요.</p>
    <a className="text-button" href={OFFICIAL_PAPERS} target="_blank" rel="noreferrer">국사편찬위원회 공식 문제지·정답표 <ArrowUpRight size={14}/></a>
  </section>;
}
