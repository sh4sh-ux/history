import { ArrowUpRight, Crown } from 'lucide-react';
import { successions } from './data/succession';
import { events, type HistoryEvent } from './data/history';

type Props = { kingId: number; onOpen: (event: HistoryEvent) => void };
export function SuccessionStory({ kingId, onOpen }: Props) {
  const story = successions[kingId];
  if (!story) return null;
  return <section key={kingId} className="succession-story" aria-label="왕위 계승 이야기">
    <div className="succession-title"><Crown size={19}/><span className="eyebrow">왕이 되기 전부터, 즉위한 뒤까지</span></div>
    <h3>{story.title}</h3>{story.method&&<span className="succession-method">{story.method}</span>}
    <p className="succession-summary">{story.summary}</p>
    <div className="succession-family">{story.relationships.map(person => <div key={person.label}>
      <small>{person.label}</small><strong>{person.name}</strong><p>{person.explanation}</p>
    </div>)}</div>
    <p className="succession-people">관련 인물 · {story.people?.join(' · ')}</p>
    <h4>시간 순서로 따라가 봐요</h4>
    <ol className="succession-timeline">{story.milestones.map(step => <li key={`${step.year}-${step.title}`}>
      <time>{step.year}년</time><div><h5>{step.title}</h5><p>{step.description}</p>
      <div className="succession-links"><a href={step.source.url} target="_blank" rel="noreferrer" aria-label={`${step.year}년 ${step.title} 출처`}>근거 자료 <ArrowUpRight size={12}/></a>
      {step.event && <button onClick={() => onOpen(events.find(event => event.id === step.event)!)}>사건 상세 읽기 <ArrowUpRight size={13}/></button>}</div></div>
    </li>)}</ol>
    {story.outcome&&<div className="succession-outcome"><h4>즉위 뒤에는 무엇이 달라졌나요?</h4><p>{story.outcome}</p></div>}
    <h4>궁금한 점을 하나씩 풀어 봐요</h4>
    <div className="succession-questions">{story.questions.map(item => <details key={item.question}>
      <summary>{item.question}</summary><p>{item.answer}</p><a href={item.source.url} target="_blank" rel="noreferrer">{item.source.title} <ArrowUpRight size={12}/></a>
    </details>)}</div>
    <p className="muted">위 연표에는 선택한 왕이 즉위하기 전과 재위가 끝난 뒤의 일도 포함될 수 있어요. 구체적인 월·일은 당시 기록의 음력을 기준으로 했어요.</p>
  </section>;
}
