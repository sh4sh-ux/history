import { test, expect } from '@playwright/test';

test('왕 → 사건 → 상세, 검색, 마인드맵, 퀴즈와 기록이 동작한다', async ({page}, testInfo) => {
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('');
 await expect(page.getByRole('heading',{name:'한눈에 보는 조선왕조'})).toBeVisible();
 await expect(page.locator('.king')).toHaveCount(27);
 await page.screenshot({path:testInfo.outputPath('timeline.png'),fullPage:true});
 for(const king of [
  {name:'태조',id:1,title:'조선 건국',hanja:'朝鮮建國'},
  {name:'정종',id:2,title:'제2차 왕자의 난',hanja:'王子之亂'},
  {name:'태종',id:3,title:'계미자 제작',hanja:'癸未字'},
  {name:'세종',id:4,title:'훈민정음 반포',hanja:'訓民正音'},
 ]){
  await page.getByRole('button',{name:new RegExp(`제${king.id}대 ${king.name}`)}).click();
  await expect(page.locator('#king-content')).toContainText(king.name);
  await page.getByRole('button',{name:new RegExp(`년.*${king.title}`)}).click();
  const dialog=page.getByRole('dialog');
  await expect(dialog.getByRole('heading',{name:king.title,exact:true})).toBeVisible();
  await expect(dialog.getByRole('heading',{name:king.hanja,exact:true})).toBeVisible();
  await expect(dialog.getByText('어떤 시대였을까요?')).toBeVisible();
  if(king.id===4){
   await dialog.getByRole('button',{name:'책갈피 저장'}).click();
   await page.screenshot({path:testInfo.outputPath('event-detail.png'),fullPage:true});
  }
  await dialog.getByRole('button',{name:'상세 닫기'}).click();
 }
 await page.getByRole('textbox',{name:'역사 검색'}).fill('정인지');
 await expect(page.getByRole('button',{name:/훈민정음 반포/})).toBeVisible();
 await page.getByRole('button',{name:'검색 지우기'}).click();
 await page.getByRole('button',{name:'역사 마인드맵',exact:true}).click();
 await page.getByRole('combobox',{name:'왕 선택'}).selectOption('1');
 await expect(page.getByRole('region',{name:'역사 마인드맵'})).toBeVisible();
 await page.getByRole('button',{name:/1394년.*한양 천도/}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('button',{name:'상세 닫기'}).click();
 await page.screenshot({path:testInfo.outputPath('mindmap.png'),fullPage:true});
 await page.getByRole('button',{name:'역사 퀴즈',exact:true}).click();
 await page.getByRole('button',{name:'2. 1446년',exact:true}).click();
 await expect(page.getByRole('button',{name:'오답 복습 (1)'})).toBeVisible();
 await page.getByRole('button',{name:'오답 복습 (1)'}).click();
 await expect(page.locator('.quiz-card')).toHaveCount(1);
 await page.getByRole('button',{name:'1. 1392년',exact:true}).click();
 await expect(page.getByText(/복습할 오답이 없어요/)).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'나의 서재',exact:true}).click();
 await expect(page.getByRole('button',{name:/훈민정음 반포/})).toHaveCount(2);
 await page.screenshot({path:testInfo.outputPath('learning-record.png'),fullPage:true});
 await page.getByRole('button',{name:'테마 변경'}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.screenshot({path:testInfo.outputPath('light-theme.png'),fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 expect(errors).toEqual([]);
});

test('PWA 파일과 오프라인 재방문이 작동한다',async ({page,context})=>{
 await page.goto('');
 const manifest=await page.request.get('manifest.webmanifest');
 expect(manifest.ok()).toBeTruthy();
 const data=await manifest.json();
 expect(data.scope).toBe('/history/');
 expect(data.icons.some((icon:{sizes:string})=>icon.sizes==='512x512')).toBeTruthy();
 await page.evaluate(async()=>{await navigator.serviceWorker.ready});
 await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller))).toBeTruthy();
 await context.setOffline(true);
 await page.reload();
 await expect(page.getByRole('heading',{name:'한눈에 보는 조선왕조'})).toBeVisible();
 await page.getByRole('button',{name:/제4대 세종/}).click();
 await page.getByRole('button',{name:/훈민정음 반포/}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await context.setOffline(false);
});
