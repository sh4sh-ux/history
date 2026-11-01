import { ArrowUpRight, Crown } from 'lucide-react';
import { successions } from './data/succession';
import {EasyGuide, WordHelp} from './EasyGuide';
import { events, type HistoryEvent } from './data/history';

type Props = { kingId: number; onOpen: (event: HistoryEvent) => void };
export function SuccessionStory({ kingId, onOpen }: Props) {
  const story = successions[kingId];
  if (!story) return null;
  return <section key={kingId} className="succession-story" aria-label="왕위 계승 이야기">
    <div className="succession-title"><Crown size={19}/><span className="eyebrow">누가 · 왜 · 어떻게 왕이 되었을까</span></div>
    <h3>{story.title}</h3>{story.method&&<span className="succession-method">{story.method}</span>}
    <EasyGuide kingId={kingId}/>
    <details className="deeper-background"><summary>배경을 조금 더 자세히 알아볼까요?</summary><p className="succession-summary">{story.summary}</p></details>
    <WordHelp text={JSON.stringify(story)}/>
    <div className="succession-family">{story.relationships.map(person => <div key={person.label}>
      <small>{person.label}</small><strong>{person.name}</strong><p>{person.explanation}</p>
    </div>)}</div>
    <p className="succession-people">관련 인물 · {story.people?.join(' · ')}</p>
    <h4>먼저 무슨 일이 있었을까요?</h4>
    <ol className="succession-timeline">{story.milestones.map(step => <li key={`${step.year}-${step.title}`}>
      <time>{step.year}년</time><div><h5>{step.title}</h5><p>{step.description}</p>
      <div className="succession-links"><a href={step.source.url} target="_blank" rel="noreferrer" aria-label={`${step.year}년 ${step.title} 출처`}>근거 자료 <ArrowUpRight size={12}/></a>
      {step.event && <button onClick={() => onOpen(events.find(event => event.id === step.event)!)}>사건 상세 읽기 <ArrowUpRight size={13}/></button>}</div></div>
    </li>)}</ol>
    {story.outcome&&<div className="succession-outcome"><h4>왕이 된 뒤, 무엇이 달라졌나요?</h4><p>{story.outcome}</p></div>}
    <h4>궁금한 점을 하나씩 풀어 봐요</h4>
    <div className="succession-questions">{story.questions.map(item => <details key={item.question}>
      <summary>{item.question}</summary><p>{item.answer}</p><a href={item.source.url} target="_blank" rel="noreferrer">{item.source.title} <ArrowUpRight size={12}/></a>
    </details>)}</div>
    <p className="muted">위 연표에는 선택한 왕이 즉위하기 전과 재위가 끝난 뒤의 일도 포함될 수 있어요. 구체적인 월·일은 당시 기록의 음력을 기준으로 했어요.</p>
  </section>;
}
