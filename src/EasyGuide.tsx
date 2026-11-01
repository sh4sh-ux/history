import {easyStories,easyMethods,glossary} from './data/easy-history';
import {successions} from './data/succession';

export function EasyGuide({kingId}:{kingId:number}) {
 const story=successions[kingId], easy=easyStories[kingId];
 if(!story||!easy)return null;
 return <div className="easy-guide" role="region" aria-label="처음 읽는 세 단계 안내">
   <span className="easy-label">처음이라면, 이것부터 읽어요</span>
   <p className="easy-method">{easyMethods[story.method!]}</p>
   <div className="easy-steps">{[
     ['1','먼저, 누구인지 알아봐요',easy.who],
     ['2','왜 이 사람이 왕이 됐나요?',easy.why],
     ['3',kingId===27?'황제가 된 뒤에는요?':'왕이 된 뒤에는요?',easy.after],
   ].map(([number,question,answer])=><div className="easy-step" key={number}><span aria-hidden="true">{number}</span><div><h4>{question}</h4><p>{answer}</p></div></div>)}</div>
 </div>;
}
export function WordHelp({text}:{text:string}) {
 const terms=glossary.filter(item=>text.includes(item.term)&&!(item.term==='세자'&&text.includes('왕세자')));
 if(!terms.length)return null;
 return <section className="word-help" aria-label="어려운 말 풀이"><h4>낯선 말은 눌러서 뜻을 확인해요</h4><div className="word-help-grid">{terms.map(item=><details key={item.term}><summary>{item.term}</summary><p>{item.meaning}</p></details>)}</div></section>;
}
