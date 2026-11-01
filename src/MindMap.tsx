import {SuccessionStory} from './SuccessionStory';
import { ArrowUpRight, BookOpen, GitBranch } from 'lucide-react';
import { events, kings, type HistoryEvent, type King } from './data/history';

type Props = {
  selected: King;
  onSelect: (id: number) => void;
  onOpen: (event: HistoryEvent) => void;
  read: string[];
};

export function MindMap({ selected, onSelect, onOpen, read }: Props) {
  const stories = events.filter(event => event.king === selected.id);
  return (
    <section className="mindmap" aria-label="역사 마인드맵">
      <div className="map-heading">
        <div><GitBranch size={18}/><h3>이야기가 이어지는 역사 지도</h3></div>
        <label>왕 선택
          <select value={selected.id} onChange={event => onSelect(Number(event.target.value))}>
            {kings.map(king => <option key={king.id} value={king.id}>제{king.id}대 {king.name} · {king.start}–{king.end}</option>)}
          </select>
        </label>
      </div>
      <p className="map-guide">조선 → 왕 → 사건 순서로 따라가 보세요. 사건을 누르면 자세한 이야기가 열려요.</p>
      <div className="map-tree">
        <div className="map-root"><span className="eyebrow">518 YEARS</span><strong>조선</strong><small>1392 — 1910</small></div>
        <div className="map-trunk" aria-hidden="true"/>
        <div className="map-king"><small>제{selected.id}대 · {selected.start}–{selected.end}</small><strong>{selected.name} <span>{selected.personal}</span></strong><p>{selected.summary}</p></div>
        <div className="map-branches">
          {stories.map(event => <div className="map-branch" key={event.id}>
            <span className="map-line" aria-hidden="true"/>
            <button className="map-event" onClick={() => onOpen(event)}>
              <small>{event.year}년 <span>{event.hanja}</span></small>
              <strong>{event.title}<ArrowUpRight size={16}/></strong>
              <p>{event.intro}</p>
              <em>{read.includes(event.id) ? '✓ 읽은 이야기' : '이야기 펼치기'}</em>
            </button>
          </div>)}
          {!stories.length && <div className="map-empty"><BookOpen size={22}/><p>이 왕의 상세 이야기는 준비 중이에요.</p><button className="text-button" onClick={() => onSelect(4)}>세종 이야기 보기 <ArrowUpRight size={14}/></button></div>}
        </div>
      </div>
      <SuccessionStory kingId={selected.id} onOpen={onOpen}/>
      <p className="muted">연결선은 학습 순서를 나타내요. 사건 사이의 관계는 상세 화면의 ‘이어지는 사건’에서 살펴보세요.</p>
    </section>
  );
}
