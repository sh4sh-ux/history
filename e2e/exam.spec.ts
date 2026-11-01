import {test,expect} from '@playwright/test';
// Synthetic documents verify the PDF flow without redistributing official exam content.
function pdf(pages:string[][]){
 const objects:string[]=[];
 objects[1]='<< /Type /Catalog /Pages 2 0 R >>';
 const kids=pages.map((_,i)=>`${4+i*2} 0 R`).join(' ');
 objects[2]=`<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>`;
 objects[3]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
 pages.forEach((lines,i)=>{const id=4+i*2;const stream=lines.map((line,n)=>`BT /F1 10 Tf 40 ${750-n*13} Td (${line}) Tj ET`).join('\n');objects[id]=`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${id+1} 0 R >>`;objects[id+1]=`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`});
 let output='%PDF-1.4\n';const offsets=[0];for(let i=1;i<objects.length;i++){offsets[i]=Buffer.byteLength(output);output+=`${i} 0 obj\n${objects[i]}\nendobj\n`}
 const xref=Buffer.byteLength(output);output+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;for(let i=1;i<objects.length;i++)output+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;output+=`trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
 return Buffer.from(output);
}
test('기출 PDF 표시, 기본 4지선다, 재접속, 정답표 채점과 오답 메모가 작동한다',async ({page},testInfo)=>{
 test.setTimeout(90000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('');await page.getByRole('button',{name:'역사 퀴즈',exact:true}).click();await page.getByRole('button',{name:'한능검 기출시험',exact:true}).click();
 await expect(page.getByRole('link',{name:/공식 문제지·정답표 받기/})).toHaveAttribute('href','https://www.historyexam.go.kr/pst/list.do?bbs=dat');
 await page.getByRole('textbox',{name:'시험 회차'}).fill('79');await page.getByRole('combobox',{name:'시험 종류'}).selectOption('basic');await page.getByRole('checkbox',{name:/시간 제한 사용/}).uncheck();
 await page.getByLabel('문제지 PDF 불러오기',{exact:true}).setInputFiles({name:'test-paper.pdf',mimeType:'application/pdf',buffer:pdf([['Synthetic paper page one'],['Synthetic paper page two']])});
 await page.getByRole('button',{name:'기출 시험 시작'}).click();await expect(page.getByText('1 / 2쪽',{exact:true})).toBeVisible();await page.getByRole('button',{name:'다음 쪽'}).click();await expect(page.getByText('2 / 2쪽',{exact:true})).toBeVisible();
 if(testInfo.project.name==='mobile')await page.getByRole('button',{name:'답안 표시하기',exact:true}).click();
 await expect(page.getByRole('radio',{name:'1번 답 5'})).toHaveCount(0);await page.getByRole('radio',{name:'1번 답 2'}).check();await page.getByRole('radio',{name:'2번 답 1'}).check();
 await page.reload();await page.getByRole('button',{name:'역사 퀴즈',exact:true}).click();await page.getByRole('button',{name:'한능검 기출시험',exact:true}).click();
 if(testInfo.project.name==='mobile')await page.getByRole('button',{name:'답안 표시하기',exact:true}).click();
 await expect(page.getByRole('radio',{name:'1번 답 2'})).toBeChecked();await expect(page.getByRole('radio',{name:'2번 답 1'})).toBeChecked();
 await page.getByRole('button',{name:'답안 제출하기'}).click();await expect(page.getByText(/아직 답하지 않은 문제 48개/)).toBeVisible();await page.getByRole('button',{name:'제출 확정'}).click();
 await page.getByLabel('정답표 PDF 불러오기',{exact:true}).setInputFiles({name:'test-key.pdf',mimeType:'application/pdf',buffer:pdf([Array.from({length:50},(_,i)=>`${i+1} 2 2`)])});
 await expect(page.getByText('정답을 적용하기 전에 확인해요')).toBeVisible();await page.getByRole('button',{name:'확인했어요 · 이 정답으로 채점'}).click();await expect(page.getByRole('heading',{name:'2점 · 인증 기준 미달'})).toBeVisible();
 await page.getByRole('checkbox',{name:'틀린 문제만 보기'}).check();await expect(page.getByRole('radio',{name:'1번 답 2'})).toHaveCount(0);await page.getByRole('textbox',{name:'2번 오답 메모'}).fill('자료에서 단서를 찾기');
 await page.screenshot({path:testInfo.outputPath('official-exam-review.png'),fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.getByRole('button',{name:'시험 목록으로'}).click();await page.getByRole('button',{name:/제79회 기본/}).click();await expect(page.getByRole('textbox',{name:'2번 오답 메모'})).toHaveValue('자료에서 단서를 찾기');expect(errors).toEqual([]);
});
