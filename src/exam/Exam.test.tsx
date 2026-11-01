import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {Exam} from './Exam';
import {makeAttempt,STORE_KEY} from './model';
vi.mock('./PdfReader',()=>({PdfReader:()=> <div>PDF viewer</div>}));
vi.mock('./files',()=>({getPaper:async()=>null,savePaper:async()=>{},removePaper:async()=>{}}));
afterEach(cleanup);beforeEach(()=>localStorage.clear());
it('저장한 시험을 이어 풀고 제출 확인 뒤에만 채점한다',()=>{
 localStorage.setItem(STORE_KEY,JSON.stringify({active:makeAttempt('80','advanced','paper.pdf',false),history:[]}));
 render(<Exam/>);fireEvent.click(screen.getByRole('radio',{name:'1번 답 2'}));expect(screen.getByText('1/50문항 답안 표시')).toBeVisible();fireEvent.click(screen.getByRole('button',{name:'답안 제출하기'}));expect(screen.getByText(/아직 답하지 않은 문제 49개/)).toBeVisible();fireEvent.click(screen.getByRole('button',{name:'제출 확정'}));expect(screen.getByText('답안을 제출했어요')).toBeVisible();fireEvent.click(screen.getByText('정답 번호를 직접 붙여 넣을게요'));fireEvent.change(screen.getByRole('textbox',{name:'정답 번호 50개'}),{target:{value:'2 '.repeat(50)}});fireEvent.click(screen.getByRole('button',{name:'정답 미리보기'}));expect(screen.getByText('정답을 적용하기 전에 확인해요')).toBeVisible();fireEvent.click(screen.getByRole('button',{name:'확인했어요 · 이 정답으로 채점'}));expect(screen.getByText('50문항 중 1개 정답')).toBeVisible();fireEvent.click(screen.getByRole('checkbox',{name:'틀린 문제만 보기'}));expect(screen.queryByRole('radio',{name:'1번 답 2'})).not.toBeInTheDocument();fireEvent.change(screen.getByRole('textbox',{name:'2번 오답 메모'}),{target:{value:'다음에 자료를 꼼꼼히 읽기'}});expect(JSON.parse(localStorage.getItem(STORE_KEY)!).history[0].notes['2']).toContain('꼼꼼히');
});
it('만료된 시험은 다시 접속해도 자동 제출되며 답안을 수정할 수 없다',()=>{const a=makeAttempt('79','basic','paper.pdf',true,Date.now()-71*60000);localStorage.setItem(STORE_KEY,JSON.stringify({active:a,history:[]}));render(<Exam/>);expect(screen.getByText('답안을 제출했어요')).toBeVisible();expect(screen.getByRole('radio',{name:'1번 답 1'})).toBeDisabled();expect(JSON.parse(localStorage.getItem(STORE_KEY)!).active).toBeNull()});
