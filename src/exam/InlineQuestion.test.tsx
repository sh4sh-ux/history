import {afterEach,beforeEach,describe,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup,within} from '@testing-library/react';
import {App} from '../main';
import {InlineQuestion} from './InlineQuestion';
import {paperContent} from '../data/past-paper-content';
import {pastQuestions} from '../data/past-questions';
import {LESSON_ANSWERS_KEY,LESSON_KEY,loadLessonAnswers} from './lesson-progress';
afterEach(cleanup);beforeEach(()=>localStorage.clear());
describe('앱 안에서 보는 기출 문제지',()=>{
  it.each(pastQuestions)('$id의 질문, 요약 자료와 5개 보기를 외부 접속 없이 표시한다',q=>{
    render(<InlineQuestion question={q} answers={{}} onAnswer={vi.fn()} onGrade={vi.fn()}/>);
    const paper=paperContent[q.id];
    expect(screen.getByRole('heading',{name:`${q.number}. ${paper.question}`})).toBeVisible();
    expect(screen.getByText(paper.materialSummary)).toBeVisible();
    expect(screen.getByText(/원문 자료를 쉬운 말로 요약했어요/)).toBeVisible();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
    for(const choice of paper.choices)expect(screen.getByText(choice,{exact:true})).toBeVisible();
    expect(screen.getByRole('button',{name:'정답 확인하기'})).toBeDisabled();
    expect(screen.queryByRole('img')).toBeNull();
  });
  it('답안을 채점하고 틀린 문제를 저장하며 재접속 후 정답으로 고칠 수 있다',()=>{
    const view=render(<App/>);
    const choose=()=>{
      fireEvent.change(screen.getByRole('combobox',{name:'왕 바로 선택'}),{target:{value:'2'}});
      const region=screen.getByRole('region',{name:'이 강의와 연결된 기출문제'});
      const title=within(region).getByText('왕세자 이방석과 제1차 왕자의 난',{selector:'strong'});
      fireEvent.click(title.closest('summary')!);return title.closest('details')!;
    };
    let card=choose();
    fireEvent.click(within(card).getByRole('radio',{name:'제75회 심화 19번 2번'}));
    fireEvent.click(within(card).getByRole('button',{name:'정답 확인하기'}));
    expect(within(card).getByRole('status')).toHaveTextContent('다시 살펴봐요. 정답은 1번이에요.');
    expect(loadLessonAnswers()['75-advanced-19']).toEqual({choice:2,checked:true});
    expect(JSON.parse(localStorage.getItem(LESSON_KEY)!)['75-advanced-19']).toBe('review');
    view.unmount();render(<App/>);card=choose();
    expect(within(card).getByRole('radio',{name:'제75회 심화 19번 2번'})).toBeChecked();
    expect(within(card).getByRole('status')).toHaveTextContent('다시 살펴봐요');
    fireEvent.click(within(card).getByRole('radio',{name:'제75회 심화 19번 1번'}));
    expect(within(card).queryByRole('status')).toBeNull();
    fireEvent.click(within(card).getByRole('button',{name:'정답 확인하기'}));
    expect(within(card).getByRole('status')).toHaveTextContent('정답이에요!');
    expect(JSON.parse(localStorage.getItem(LESSON_KEY)!)['75-advanced-19']).toBe('correct');
  });
  it('원본 이미지가 실패해도 요약 자료와 5개 보기를 그대로 표시한다',async()=>{
    const q=pastQuestions[0];
    render(<InlineQuestion question={q} answers={{}} onAnswer={vi.fn()} onGrade={vi.fn()}/>);
    fireEvent.click(screen.getByText('시험지 원본 자료도 보기',{selector:'summary'}));
    const img=await screen.findByRole('img');fireEvent.error(img);
    expect(screen.getByRole('status')).toHaveTextContent('원본 이미지를 불러오지 못했어요');
    expect(img).not.toBeVisible();
    expect(screen.getByText(paperContent[q.id].materialSummary)).toBeVisible();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });
  it('손상된 답안과 범위를 벗어난 번호를 복원하지 않는다',()=>{
    localStorage.setItem(LESSON_ANSWERS_KEY,'broken');expect(loadLessonAnswers()).toEqual({});
    localStorage.setItem(LESSON_ANSWERS_KEY,JSON.stringify({'missing':{choice:2,checked:true},'75-advanced-19':{choice:8,checked:true},'70-advanced-24':{choice:2,checked:true}}));
    expect(loadLessonAnswers()).toEqual({'70-advanced-24':{choice:2,checked:true}});
    expect(Object.keys(paperContent).sort()).toEqual(pastQuestions.map(q=>q.id).sort());
  });
});
