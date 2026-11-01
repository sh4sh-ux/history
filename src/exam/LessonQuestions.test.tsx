import {afterEach,beforeEach,describe,it,expect} from 'vitest';
import {render,screen,fireEvent,cleanup,within} from '@testing-library/react';
import {App} from '../main';
import {events,kings} from '../data/history';
import {pastQuestions,forKing,forLesson,forReadLessons} from '../data/past-questions';
import {LESSON_KEY,loadLessonProgress} from './lesson-progress';
afterEach(cleanup);beforeEach(()=>localStorage.clear());
describe('강의와 실제 기출 연결',()=>{
  it('회차·번호·정답·출처와 강의 연결 대상이 유효하고 중복되지 않는다',()=>{
    expect(new Set(pastQuestions.map(q=>q.id)).size).toBe(pastQuestions.length);
    for(const q of pastQuestions){
      expect(q.number).toBeGreaterThanOrEqual(1);expect(q.number).toBeLessThanOrEqual(50);
      expect(q.answer).toBeGreaterThanOrEqual(1);expect(q.answer).toBeLessThanOrEqual(5);
      expect(q.original).toMatch(/^https:\/\/www\.comcbt\.com\//);expect(q.verification).toMatch(/^https:\/\//);
      q.kings.forEach(k=>expect(kings.some(king=>king.id===k.id)).toBe(true));
      q.lessons.forEach(l=>expect(events.some(e=>e.id===l.id)).toBe(true));
    }
  });
  it('정종의 계승 배경으로 제1차 왕자의 난을 연결하되 제2차 난 자체의 문제로 섞지 않는다',()=>{
    expect(forKing(2).map(q=>q.id)).toContain('75-advanced-19');
    expect(forLesson('accession-2').map(q=>q.id)).toContain('75-advanced-19');
    expect(forLesson('conflict2').map(q=>q.id)).not.toContain('75-advanced-19');
    expect(forReadLessons(['hangul']).map(q=>q.id)).toEqual(['73-advanced-21']);
    expect(forReadLessons(['hangul','hall'])).toHaveLength(1);
    expect(forReadLessons(['hangul']).map(q=>q.id)).not.toContain('75-advanced-21');
  });
  it('정종 강의에서 원문 링크와 정답 해설을 펼치고 복습 결과를 저장한다',()=>{
    render(<App/>);fireEvent.change(screen.getByRole('combobox',{name:'왕 바로 선택'}),{target:{value:'2'}});
    const region=screen.getByRole('region',{name:'이 강의와 연결된 기출문제'});
    const title=within(region).getByText('왕세자 이방석과 제1차 왕자의 난',{selector:'strong'});
    fireEvent.click(title.closest('summary')!);
    const card=title.closest('details')!;
    expect(within(card).getByRole('link',{name:/제75회 심화 19번 원문/})).toHaveAttribute('href','https://www.comcbt.com/cbt/problem/16523/19/');
    expect(card).toHaveTextContent('정종이 왕이 된 배경');
    fireEvent.click(within(card).getByText('정답과 쉬운 해설 보기',{selector:'summary'}));
    expect(within(card).getByText('정답 1번')).toBeVisible();
    expect(card).toHaveTextContent('곧바로 태종이 된 것은 아니에요');
    fireEvent.click(within(card).getByRole('button',{name:'복습할래요'}));
    expect(JSON.parse(localStorage.getItem(LESSON_KEY)!)).toEqual({'75-advanced-19':'review'});
    fireEvent.click(within(region).getByRole('button',{name:'읽은 이야기의 기출 모아 보기'}));
    fireEvent.click(screen.getByRole('button',{name:'기출 복습 (1)'}));
    expect(screen.getByText('왕세자 이방석과 제1차 왕자의 난',{selector:'strong'})).toBeVisible();
  });
  it('읽은 이야기만 모으고 원문이 아닌 연결 안내라는 점을 표시한다',()=>{
    render(<App/>);fireEvent.click(screen.getByRole('button',{name:'역사 퀴즈'}));
    expect(screen.getByText('이야기를 먼저 펼쳐 보세요')).toBeVisible();
    fireEvent.click(screen.getByRole('button',{name:'왕조 연표에서 배우기'}));
    fireEvent.change(screen.getByRole('combobox',{name:'왕 바로 선택'}),{target:{value:'4'}});
    fireEvent.click(screen.getByRole('button',{name:/1446년.*훈민정음 반포/}));
    const dialog=screen.getByRole('dialog');
    expect(within(dialog).getByRole('region',{name:'이 이야기와 연결된 기출문제'})).toHaveTextContent('제73회 심화 21번');
    fireEvent.click(within(dialog).getByRole('button',{name:'읽은 이야기의 기출 모아 보기'}));
    expect(screen.queryByRole('dialog')).toBeNull();
    const region=screen.getByRole('region',{name:'강의별 한능검 기출'});
    expect(region).toHaveTextContent('읽은 이야기 1개와 연결된 기출');
    expect(region.querySelectorAll('.lesson-question')).toHaveLength(1);
    fireEvent.click(within(region).getByText('훈민정음의 주인공 세종과 칠정산',{selector:'strong'}).closest('summary')!);
    expect(within(region).getByText(/문제 지문·그림·보기는 원문 링크에서 확인/)).toBeVisible();
  });
  it('왕별 찾기·미등록 안내·복습 복원과 정답 처리 후 오답 제거가 작동한다',()=>{
    localStorage.setItem(LESSON_KEY,JSON.stringify({'70-advanced-24':'review'}));
    render(<App/>);fireEvent.click(screen.getByRole('button',{name:'역사 퀴즈'}));
    fireEvent.click(screen.getByRole('button',{name:'왕별로 찾기'}));
    const select=screen.getByRole('combobox',{name:'기출 연결 왕 선택'});
    fireEvent.change(select,{target:{value:'22'}});
    expect(screen.getByText('규장각으로 정조를 찾고 수원 화성 연결하기',{selector:'strong'})).toBeVisible();
    fireEvent.change(select,{target:{value:'27'}});
    expect(screen.getByText(/이 왕의 연결 기출은 아직 준비 중/)).toBeVisible();
    fireEvent.click(screen.getByRole('button',{name:'기출 복습 (1)'}));
    fireEvent.click(screen.getByText('규장각으로 정조를 찾고 수원 화성 연결하기',{selector:'strong'}).closest('summary')!);
    fireEvent.click(screen.getByRole('button',{name:'맞혔어요'}));
    expect(screen.getByText(/아직 복습할 기출이 없어요/)).toBeVisible();
    expect(loadLessonProgress()['70-advanced-24']).toBe('correct');
  });
  it('손상된 기록과 없는 문항·결과를 무시한다',()=>{
    localStorage.setItem(LESSON_KEY,'broken');expect(loadLessonProgress()).toEqual({});
    localStorage.setItem(LESSON_KEY,JSON.stringify({'70-advanced-24':'correct','missing':'review','75-advanced-19':'wrong'}));
    expect(loadLessonProgress()).toEqual({'70-advanced-24':'correct'});
  });
});
