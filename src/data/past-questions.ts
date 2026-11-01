// Verified references, not a transcription or reconstruction of the exam papers.
// Keep the original question number and answer; lesson connections and explanations are ours.
export type PastQuestion = {
  id: string;
  round: number;
  number: number;
  level: '심화';
  points: number;
  topic: string;
  kings: {id: number; relation: string}[];
  lessons: {id: string; reason: string}[];
  hint: string;
  answer: number;
  explanation: string;
  original: string;
  verification: string;
};
const cbt = (exam: number, number: number) => `https://www.comcbt.com/cbt/problem/${exam}/${number}/`;
const explanation = (round: number) => `https://five-talent.com/quiz/${round}/explanation`;
const source73 = 'https://www.comcbt.com/xe/webhaesul/9920647';
export const pastQuestions: PastQuestion[] = [
  {
    id:'75-advanced-19',round:75,number:19,level:'심화',points:2,topic:'왕세자 이방석과 제1차 왕자의 난',
    kings:[{id:1,relation:'태조 때 일어난 사건'},{id:2,relation:'정종이 왕이 된 배경'},{id:3,relation:'이방원이 권력을 잡은 배경'}],
    lessons:[{id:'conflict1',reason:'이방석이 세자가 되자 왜 이방원이 반발했는지 떠올려요.'},{id:'accession-2',reason:'정종의 즉위로 이어진 제1차 왕자의 난의 원인을 묻는 문항이에요.'},{id:'accession-3',reason:'태종의 즉위에 앞선 첫 번째 왕자의 난과 연결돼요.'}],
    hint:'이방석의 세자 책봉이 다른 왕자들에게 어떤 영향을 주었을까요?',answer:1,
    explanation:'어린 이방석이 후계자가 되면서 이방원 등과 갈등이 커졌어요. 이방원이 일으킨 제1차 왕자의 난 뒤에는 정종이 왕이 되었어요. 곧바로 태종이 된 것은 아니에요.',
    original:cbt(16523,19),verification:explanation(75),
  },
  {
    id:'71-advanced-19',round:71,number:19,level:'심화',points:2,topic:'한양 천도로 태조의 시대 알아보기',
    kings:[{id:1,relation:'태조의 수도 이전과 재위 시기'}],
    lessons:[{id:'capital',reason:'한양 천도의 주인공을 알아낸 뒤 같은 왕 때의 사건을 골라요.'},{id:'conflict1',reason:'제1차 왕자의 난이 태조 재위 중 일어났다는 점을 확인해요.'}],
    hint:'한양 천도와 제1차 왕자의 난은 어느 왕의 재위 중에 있었나요?',answer:4,
    explanation:'1394년 한양 천도와 1398년 제1차 왕자의 난은 모두 태조 때의 일이에요. 사건에 이방원이 등장한다고 그때 왕도 태종이었다고 생각하면 안 돼요.',
    original:cbt(16266,19),verification:'https://www.comcbt.com/cbt/page/16266/',
  },
  {
    id:'70-advanced-17',round:70,number:17,level:'심화',points:2,topic:'왕자의 난 이후 태종의 제도 정비',
    kings:[{id:2,relation:'정종 다음 왕을 이해하는 연결 문항'},{id:3,relation:'태종의 즉위와 정치 제도'}],
    lessons:[{id:'conflict2',reason:'두 차례 왕자의 난을 거쳐 왕이 된 이방원을 알아보아요.'},{id:'accession-3',reason:'즉위한 태종이 나라의 제도를 어떻게 바꾸었는지 연결해요.'}],
    hint:'왕자의 난으로 힘을 얻은 인물을 먼저 찾아요.',answer:4,
    explanation:'자료 속 왕은 태종이에요. 태종은 문하부를 없애고, 신하들의 잘못을 지적하던 관리들을 사간원이라는 독립 기관에 두었어요. 왕을 찾은 뒤 그 왕의 정책을 연결하는 문제예요.',
    original:cbt(16227,17),verification:explanation(70),
  },
  {
    id:'73-advanced-20',round:73,number:20,level:'심화',points:2,topic:'조선 건국을 도운 정도전',
    kings:[{id:1,relation:'태조와 함께 새 나라를 설계한 인물'}],
    lessons:[{id:'founding',reason:'조선 건국을 도운 정도전의 생각과 활동을 살펴봐요.'},{id:'conflict1',reason:'이방원과 대립한 정도전이 어떤 인물이었는지 연결해요.'}],
    hint:'왕은 이성계였어요. 새 나라의 제도를 함께 설계한 신하는 누구였나요?',answer:1,
    explanation:'정도전은 조선경국전으로 나라의 제도를 제시했어요. 불씨잡변에서는 불교를 비판했어요. 왕의 이름과 함께 나라를 세운 신하의 활동도 연결해 기억해요.',
    original:source73,verification:explanation(73),
  },
  {
    id:'73-advanced-21',round:73,number:21,level:'심화',points:2,topic:'훈민정음의 주인공 세종과 칠정산',
    kings:[{id:4,relation:'세종의 문자·과학 업적'}],
    lessons:[{id:'hangul',reason:'훈민정음이라는 단서로 세종을 찾고 다른 업적까지 연결해요.'},{id:'hall',reason:'세종 때 학문과 과학이 발전한 모습을 함께 살펴봐요.'}],
    hint:'훈민정음을 만든 왕을 찾은 뒤, 그 왕 때의 과학 업적을 골라요.',answer:3,
    explanation:'훈민정음은 세종을 알아보는 단서예요. 세종 때에는 한양을 기준으로 하늘의 움직임을 계산하는 칠정산도 만들었어요. 한 왕의 여러 업적을 묶어 두면 도움이 돼요.',
    original:source73,verification:explanation(73),
  },
  {
    id:'75-advanced-21',round:75,number:21,level:'심화',points:2,topic:'세종 때 여진에 대한 대응과 6진',
    kings:[{id:4,relation:'같은 왕의 시대를 더 알아보는 문항'}],lessons:[],
    hint:'조선의 세종과 고려의 윤관을 구분해 보세요.',answer:2,
    explanation:'세종 때 김종서는 두만강 일대에 6진을 설치했어요. 고려의 윤관이 별무반을 이끌고 여진을 상대한 일과는 시대가 달라요.',
    original:cbt(16523,21),verification:explanation(75),
  },
  {
    id:'70-advanced-18',round:70,number:18,level:'심화',points:2,topic:'세종의 북방 개척을 도운 김종서',
    kings:[{id:4,relation:'세종 때 활동한 인물'},{id:6,relation:'단종을 돕다 계유정난 때 희생된 인물'},{id:7,relation:'수양대군의 권력 장악과 연결된 인물'}],
    lessons:[{id:'accession-6',reason:'어린 단종을 보좌한 김종서의 다른 활동을 확인해요.'},{id:'accession-7',reason:'계유정난 때 제거된 김종서가 어떤 인물이었는지 연결해요.'}],
    hint:'세종을 도와 두만강 일대를 개척하고 단종 때에도 활동한 인물이에요.',answer:1,
    explanation:'김종서는 세종 때 북쪽의 6진 개척에 힘썼어요. 이후 단종을 돕던 중 1453년 계유정난 때 수양대군 쪽에 의해 살해되었어요. 한 인물이 여러 왕의 시대를 살았다는 점도 기억해요.',
    original:cbt(16227,18),verification:explanation(70),
  },
  {
    id:'70-advanced-24',round:70,number:24,level:'심화',points:2,topic:'규장각으로 정조를 찾고 수원 화성 연결하기',
    kings:[{id:22,relation:'정조의 인재 등용과 화성 건설'}],
    lessons:[{id:'kyujanggak',reason:'규장각과 검서관을 단서로 정조를 찾아요.'},{id:'jeongjo-accession',reason:'정조가 즉위한 뒤 펼친 정책과 사업을 이어서 배워요.'}],
    hint:'규장각을 발전시키고 여러 출신의 학자를 등용한 왕이에요.',answer:2,
    explanation:'규장각과 서얼 출신 검서관은 정조를 가리키는 단서예요. 정조 때 수원 화성을 쌓으면서 정약용이 설계한 거중기 등을 사용했어요.',
    original:cbt(16227,24),verification:explanation(70),
  },
  {
    id:'75-advanced-22',round:75,number:22,level:'심화',points:3,topic:'인종에서 명종으로, 외척의 갈등과 을사사화',
    kings:[{id:12,relation:'인종 사후의 왕위 계승 배경'},{id:13,relation:'명종 즉위 직후의 정치 갈등'}],
    lessons:[{id:'accession-12',reason:'인종의 짧은 재위 뒤 어떤 갈등이 이어졌는지 살펴봐요.'},{id:'accession-13',reason:'명종 즉위와 대윤·소윤의 갈등을 연결해요.'}],
    hint:'왕실 친척인 대윤과 소윤이 다툰 사건을 떠올려요.',answer:2,
    explanation:'1545년 명종이 왕이 된 직후 외척끼리 다투며 윤임 등이 제거된 을사사화가 일어났어요. 인종에서 명종으로 왕이 바뀐 과정과 함께 보면 이해하기 쉬워요.',
    original:cbt(16523,22),verification:explanation(75),
  },
  {
    id:'71-advanced-22',round:71,number:22,level:'심화',points:2,topic:'인조 때 사건의 순서와 병자호란',
    kings:[{id:16,relation:'인조 재위 중의 전쟁과 왕실'}],
    lessons:[{id:'accession-16',reason:'인조반정 뒤 이괄의 난, 병자호란, 소현세자의 청 체류를 시간 순서로 이어요.'}],
    hint:'인조가 남한산성으로 피란했을 때의 일을 찾아요.',answer:5,
    explanation:'이괄의 난은 1624년, 병자호란은 1636~1637년이에요. 병자호란 중 남한산성에서는 청과 화의를 맺을지, 끝까지 싸울지를 두고 의견이 갈렸어요.',
    original:cbt(16266,22),verification:'https://www.comcbt.com/cbt/page/16266/',
  },
  {
    id:'75-advanced-24',round:75,number:24,level:'심화',points:2,topic:'영조의 왕위 계승 갈등과 탕평',
    kings:[{id:21,relation:'영조가 정치를 안정시키려 한 방법'}],
    lessons:[{id:'accession-21',reason:'즉위 뒤 이인좌의 난을 겪은 영조가 탕평을 강조한 배경을 떠올려요.'}],
    hint:'붕당끼리의 지나친 다툼을 줄이려 한 왕이에요.',answer:3,
    explanation:'영조는 이인좌의 난 등을 겪으며 붕당 간 대립을 줄이려 했어요. 탕평 교서를 내리고 성균관에 탕평비를 세운 일이 그 노력과 연결돼요.',
    original:cbt(16523,24),verification:explanation(75),
  },
  {
    id:'75-advanced-27',round:75,number:27,level:'심화',points:2,topic:'어린 순조의 즉위 이후 세도정치',
    kings:[{id:23,relation:'순조 시대의 권력 변화'}],
    lessons:[{id:'accession-23',reason:'왕비의 친정 집안이 힘을 얻은 순조 시대의 문제로 연결해요.'}],
    hint:'정조의 아들이며 김조순의 사위였던 왕을 찾아요.',answer:4,
    explanation:'순조 때에는 안동 김씨 등 외척의 힘이 커졌어요. 1811년 평안도에서 홍경래의 난이 일어났고 반란군은 정주성을 차지했어요.',
    original:cbt(16523,27),verification:explanation(75),
  },
];
export const forKing = (id:number) => pastQuestions.filter(q => q.kings.some(k => k.id===id));
export const forLesson = (id:string) => pastQuestions.filter(q => q.lessons.some(l => l.id===id));
export const forReadLessons = (ids:string[]) => pastQuestions.filter(q => q.lessons.some(l => ids.includes(l.id)));
