import {beforeEach,describe,expect,it,vi} from 'vitest';
import {complete,freshStore,grade,loadExam,makeAttempt,parseNumbers,STORE_KEY,type Attempt} from './model';
import {parseKeyRows} from './readKey';
beforeEach(()=>{localStorage.clear();vi.restoreAllMocks()});
const attempt=():Attempt=>makeAttempt('80','advanced','paper.pdf',false,1000);
describe('실제 기출 답안 기록과 채점',()=>{
 it('심화 80분·기본 70분을 절대 시각으로 기록한다',()=>{expect(makeAttempt('80','advanced','a.pdf',true,1000).deadline).toBe(4801000);expect(makeAttempt('79','basic','a.pdf',true,1000).deadline).toBe(4201000)});
 it('정답만 있으면 정답 수만 계산하고 배점 없이 점수나 급수를 만들지 않는다',()=>{const a=attempt();a.key=Array(50).fill(1);a.answers={'1':1,'2':2};const g=grade(a);expect(g.correct).toBe(1);expect(g.unanswered).toBe(48);expect(g.score).toBeNull();expect(g.rank).toBeNull();expect(g.wrong).toContain(3)});
 it('문항별 배점으로 점수와 심화·기본 기준을 계산한다',()=>{const a=attempt();a.key=Array(50).fill(1);a.points=Array(50).fill(2);for(let n=1;n<=40;n++)a.answers[n]=1;expect(grade(a).score).toBe(80);expect(grade(a).rank).toBe('1급 기준');a.level='basic';expect(grade(a).rank).toBe('4급 기준');delete a.answers[40];expect(grade(a).rank).toBe('5급 기준')});
 it('50개 정답과 배점만 받아들이고 기본의 5번 선택·잘못된 배점은 거부한다',()=>{expect(parseNumbers('① '.repeat(50),'key','basic')).toHaveLength(50);expect(()=>parseNumbers('1 '.repeat(49),'key','advanced')).toThrow('50개');expect(()=>parseNumbers('5 '.repeat(50),'key','basic')).toThrow('1~4');expect(()=>parseNumbers('1 '.repeat(50),'points','advanced')).toThrow('100점');expect(()=>parseNumbers('1. ① 2. ②','key','advanced')).toThrow()});
 it('정답표 행의 문항 번호·정답·배점이 모두 맞을 때만 자동 인식한다',()=>{const rows=Array.from({length:50},(_,i)=>`${i+1} ${i%5+1} 2`);expect(parseKeyRows(rows,'advanced')?.key).toHaveLength(50);expect(parseKeyRows(rows,'basic')).toBeNull();expect(parseKeyRows(rows.slice(1),'advanced')).toBeNull();expect(parseKeyRows([...rows,rows[0]],'advanced')).toBeNull()});
 it('제출은 한 번만 기록되고 미제출 답안은 재접속 후 복구된다',()=>{const a=attempt();a.answers[1]=3;const data={...freshStore(),active:a};localStorage.setItem(STORE_KEY,JSON.stringify(data));expect(loadExam().active?.answers[1]).toBe(3);const done=complete(data,2000);expect(done.active).toBeNull();expect(done.history[0].submittedAt).toBe(2000);expect(complete(done,3000)).toEqual(done)});
 it('손상된 저장 정보와 유효 범위를 벗어난 답안을 복원하지 않는다',()=>{localStorage.setItem(STORE_KEY,'broken');expect(loadExam()).toEqual(freshStore());const a=attempt();a.answers['51']=1;localStorage.setItem(STORE_KEY,JSON.stringify({active:a,history:[]}));expect(loadExam().active).toBeNull()});
});
