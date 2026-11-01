import type {Level} from './model';
export function parseKeyRows(lines:string[],level:Level):{key:number[];points:number[]}|null{
 const found=new Map<number,{answer:number;point:number}>();
 for(const line of lines){
  const text=line.replace(/[①②③④⑤]/g,c=>String('①②③④⑤'.indexOf(c)+1));
  for(const match of text.matchAll(/(?:^|\s)([1-9]|[1-4][0-9]|50)\s+([1-5])\s+([1-3])(?=\s|$)/g)){
   const n=Number(match[1]),answer=Number(match[2]),point=Number(match[3]);
   if(answer>(level==='advanced'?5:4)||found.has(n))return null;
   found.set(n,{answer,point});
  }
 }
 if(found.size!==50)return null;
 const values=Array.from({length:50},(_,i)=>found.get(i+1)!);
 if(values.reduce((s,v)=>s+v.point,0)!==100)return null;
 return {key:values.map(v=>v.answer),points:values.map(v=>v.point)};
}
export async function readKey(file:File,level:Level){
 const pdf=await import('pdfjs-dist');pdf.GlobalWorkerOptions.workerSrc=new URL('pdfjs-dist/build/pdf.worker.min.mjs',import.meta.url).toString();
 const task=pdf.getDocument({data:new Uint8Array(await file.arrayBuffer())});
 try{const doc=await task.promise;const lines:string[]=[];for(let n=1;n<=doc.numPages;n++){
  const page=await doc.getPage(n);const content=await page.getTextContent();const rows=new Map<number,{x:number;text:string}[]>();
  for(const item of content.items){if(!('str' in item))continue;const y=Math.round(item.transform[5]/3)*3;const row=rows.get(y)||[];row.push({x:item.transform[4],text:item.str});rows.set(y,row)}
  for(const [,row]of [...rows.entries()].sort(([a],[b])=>b-a))lines.push(row.sort((a,b)=>a.x-b.x).map(x=>x.text).join(' '));
 }return parseKeyRows(lines,level)}finally{await task.destroy()}
}
