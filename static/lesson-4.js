const screens=[...document.querySelectorAll(".lesson-screen")];
const gate=document.getElementById("lesson4Gate");
const lesson=document.getElementById("interactiveLesson");
const prev=document.getElementById("previousScreen");
const next=document.getElementById("nextScreen");
const counter=document.getElementById("screenCounter");
const bar=document.getElementById("lessonProgressBar");
const progressText=document.getElementById("lessonProgressText");
const nav=document.getElementById("lessonNavigation");
const audio=LatinLessonCommon.createAudioController("../../assets/audio/latin/book1");
let quizPassed=false,orderIndex=0,builderIndex=0;

const parts=[
  {number:1,form:"amō",meaning:"I love",purpose:"present meaning and dictionary form",audio:"amo-pp1.mp3"},
  {number:2,form:"amāre",meaning:"to love",purpose:"present infinitive and present stem",audio:"amo-pp2.mp3"},
  {number:3,form:"amāvī",meaning:"I have loved",purpose:"perfect stem",audio:"amo-pp3.mp3"},
  {number:4,form:"amātum",meaning:"to love / in order to love",purpose:"supine stem used later",audio:"amo-pp4.mp3"}
];
const examples={
  navigo:{parts:["nāvigō","nāvigāre","nāvigāvī","nāvigātum"],meaning:"sail",audio:"navigo-pp.mp3"},
  canto:{parts:["cantō","cantāre","cantāvī","cantātum"],meaning:"sing",audio:"canto-pp.mp3"},
  aedifico:{parts:["aedificō","aedificāre","aedificāvī","aedificātum"],meaning:"build",audio:"aedifico-pp.mp3"}
};
const builderTasks=[
  {shown:["vocō","vocāre","?","vocātum"],answer:"vocāvī",options:["vocāvī","vocābat","vocābit"]},
  {shown:["labōrō","?","labōrāvī","labōrātum"],answer:"labōrāre",options:["labōrāre","labōrāvī","labōrō"]},
  {shown:["?","festīnāre","festīnāvī","festīnātum"],answer:"festīnō",options:["festīnō","festīnat","festīnābam"]},
  {shown:["cantō","cantāre","cantāvī","?"],answer:"cantātum",options:["cantātum","cantant","cantāre"]},
  {shown:["nāvigō","nāvigāre","?","nāvigātum"],answer:"nāvigāvī",options:["nāvigāvī","nāvigābit","nāvigābat"]},
  {shown:["aedificō","?","aedificāvī","aedificātum"],answer:"aedificāre",options:["aedificāre","aedificāvī","aedificō"]}
];
const quiz=[
  {question:"Which principal part is the present infinitive?",options:["first","second","third"],answer:"second"},
  {question:"Which form means ‘to love’?",options:["amō","amāre","amāvī"],answer:"amāre"},
  {question:"Which principal part supplies the perfect stem?",options:["first","second","third"],answer:"third"},
  {question:"What is the perfect stem of amāvī?",options:["amā-","amāv-","amāt-"],answer:"amāv-"},
  {question:"Which is the regular first-conjugation pattern?",options:["-ō, -āre, -āvī, -ātum","-ō, -ere, -uī, -um","-s, -t, -mus, -nt"],answer:"-ō, -āre, -āvī, -ātum"},
  {question:"Which set is correct for cantō?",options:["cantō, cantāre, cantāvī, cantātum","cantō, cantēre, cantī, cantum","cantat, cantāre, cantābat, cantābit"],answer:"cantō, cantāre, cantāvī, cantātum"},
  {question:"Remove which letters from amāre to find the present stem?",options:["-re","-āre","-e"],answer:"-re"}
];

function ensure(p){p.book1??={unlocked:true,chapter1:{lessons:{}}};p.book1.chapter1??={started:false,completed:false,progress:0,lessons:{}};p.book1.chapter1.lessons??={};p.book1.chapter1.lessons.lesson4??={started:false,completed:false,progress:0,screen:0,quizScore:null,quizTotal:7,completedAt:null};return p.book1.chapter1.lessons.lesson4}
function save(updates){LatinProfiles.updateActiveProgress(p=>{Object.assign(ensure(p),updates);p.book1.chapter1.started=true;const l=p.book1.chapter1.lessons;const done=[l.lesson1?.completed,l.lesson2?.completed,l.lesson3?.completed,l.lesson4?.completed].filter(Boolean).length;p.book1.chapter1.progress=Math.round(done/4*100)})}
const controller=LatinLessonCommon.createScreenController({screens,previousButton:prev,nextButton:next,counter,progressBar:bar,progressText,navigation:nav,quizScreen:9,completeScreen:10,canLeaveQuiz:()=>quizPassed,onScreenChange:(screen,progress,options)=>{if(!options.skipSave)save({started:true,screen,progress})}});

function renderParts(){document.getElementById("principalParts").innerHTML=parts.map(p=>`<article class="principal-part-card"><span>${p.number}</span><strong>${p.form}</strong><em>${p.meaning}</em><p>${p.purpose}</p><button data-audio="${p.audio}">🔊</button></article>`).join("");document.querySelectorAll("[data-audio]").forEach(b=>b.onclick=()=>audio.play(b.dataset.audio))}
function simple(name,answer,id,success){document.querySelectorAll(`[data-question="${name}"] button`).forEach(b=>b.onclick=()=>{const group=b.closest(".choice-row");LatinLessonCommon.clearChoiceStates(group);const ok=b.dataset.answer===answer;LatinLessonCommon.markChoice(b,ok);document.getElementById(id).textContent=ok?success:"Not quite. Review which principal part supplies that stem."})}
function renderExample(key){const e=examples[key];document.getElementById("principalExample").innerHTML=`<div class="parts-sequence">${e.parts.map((p,i)=>`<span><small>${i+1}</small>${p}</span>`).join("")}</div><p><strong>Meaning:</strong> ${e.meaning}</p><button id="exampleAudio">🔊 Hear the sequence</button>`;document.getElementById("exampleAudio").onclick=()=>audio.play(e.audio)}
function renderOrder(){const expected=parts[orderIndex];document.getElementById("orderPrompt").textContent=`Choose principal part ${expected.number}.`;document.getElementById("orderFeedback").textContent="";document.getElementById("orderedSlots").innerHTML=parts.map((_,i)=>`<span class="${i<orderIndex?"filled":""}">${i<orderIndex?parts[i].form:i===orderIndex?"?":"—"}</span>`).join("");const bank=document.getElementById("orderBank");const options=LatinLessonCommon.shuffle(parts);bank.innerHTML=options.map(p=>`<button data-form="${p.form}">${p.form}</button>`).join("");bank.querySelectorAll("button").forEach(b=>b.onclick=()=>{const ok=b.dataset.form===expected.form;LatinLessonCommon.markChoice(b,ok);if(!ok){document.getElementById("orderFeedback").textContent="That form belongs in a different position.";return}orderIndex++;document.getElementById("orderScore").textContent=orderIndex;document.getElementById("orderFeedback").textContent=`Correct — ${expected.form} is principal part ${expected.number}.`;if(orderIndex<parts.length)setTimeout(renderOrder,450);else{bank.innerHTML="";document.getElementById("orderPrompt").textContent="All four parts are in order."}})}
function renderBuilder(){if(builderIndex>=builderTasks.length)return;const task=builderTasks[builderIndex];document.getElementById("partsBuilderPrompt").textContent="Choose the missing principal part.";document.getElementById("partsSequence").innerHTML=task.shown.map((p,i)=>`<span><small>${i+1}</small>${p}</span>`).join("");const choices=document.getElementById("partsChoices");choices.innerHTML=LatinLessonCommon.shuffle(task.options).map(o=>`<button data-answer="${o}">${o}</button>`).join("");document.getElementById("partsFeedback").textContent="";choices.querySelectorAll("button").forEach(b=>b.onclick=()=>{const ok=b.dataset.answer===task.answer;LatinLessonCommon.markChoice(b,ok);if(!ok){document.getElementById("partsFeedback").textContent="Check the regular pattern: -ō, -āre, -āvī, -ātum.";return}builderIndex++;document.getElementById("partsScore").textContent=builderIndex;document.getElementById("partsFeedback").textContent=`Correct — ${task.answer}.`;if(builderIndex<builderTasks.length)setTimeout(renderBuilder,450);else choices.innerHTML=""})}
function renderQuiz(){LatinLessonCommon.renderRadioQuiz(document.getElementById("lesson4Quiz"),quiz)}

document.getElementById("playPrincipalSequence").onclick=async e=>{e.currentTarget.disabled=true;await audio.playSequence(parts.map(p=>p.audio),120);e.currentTarget.disabled=false};
document.querySelectorAll("[data-principal-verb]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-principal-verb]").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderExample(b.dataset.principalVerb)});
document.getElementById("lesson4Quiz").onsubmit=e=>{e.preventDefault();const score=LatinLessonCommon.scoreRadioQuiz(new FormData(e.currentTarget),quiz);const current=ensure(LatinProfiles.getActiveProfile().progress);const was=current.completed,best=Math.max(current.quizScore||0,score),passed=score>=6;const result=document.getElementById("lesson4QuizResult");result.hidden=false;result.className=`quiz-result ${passed?"success":"try-again"}`;result.textContent=passed?`Excellent — ${score}/7. Lesson complete.`:`You scored ${score}/7. Review the four-part pattern and try again.`;save({quizScore:best,quizTotal:7,completed:passed||was,progress:passed||was?100:90,completedAt:passed?(current.completedAt||new Date().toISOString()):current.completedAt});if(passed&&!was){LatinProfiles.addXp(50);LatinProfiles.updateActiveProgress(p=>{const l=ensure(p);l.completed=true;l.progress=100;if(!p.achievements.some(a=>(typeof a==="string"?a:a.id)==="four-part-scholar"))p.achievements.push({id:"four-part-scholar",title:"Four-Part Scholar",description:"Identified the four principal parts of a regular first-conjugation verb.",icon:"📜",earnedAt:new Date().toISOString()})})}if(passed){quizPassed=true;document.getElementById("lesson4FinalScore").textContent=`${best}/7`;document.getElementById("lesson4CompletionMessage").textContent=`${LatinProfiles.getActiveProfile().name} can now identify principal parts and derive the present and perfect stems.`;controller.refresh()}};
document.querySelectorAll(".next-screen").forEach(b=>b.onclick=()=>controller.show(controller.current()+1));

function init(){const profile=LatinProfiles.getActiveProfile();const unlocked=Boolean(profile.progress.book1?.chapter1?.lessons?.lesson3?.completed);gate.hidden=unlocked;lesson.hidden=!unlocked;nav.hidden=!unlocked;if(!unlocked)return;renderParts();simple("present-part","2","presentPartFeedback","Correct — the second principal part, nāvigāre, gives the present stem.");simple("perfect-stem","cantav","perfectStemFeedback","Correct — remove final -ī from cantāvī to get cantāv-.");renderExample("navigo");renderOrder();renderBuilder();renderQuiz();const saved=ensure(profile.progress);quizPassed=Boolean(saved.completed);controller.show(Math.min(saved.screen||0,9),{instant:true});if(saved.quizScore!=null){const result=document.getElementById("lesson4QuizResult");result.hidden=false;result.className=`quiz-result ${saved.quizScore>=6?"success":"try-again"}`;result.textContent=`Best score: ${saved.quizScore}/7.`;document.getElementById("lesson4FinalScore").textContent=`${saved.quizScore}/7`}}
document.addEventListener("DOMContentLoaded",init);window.addEventListener("latinprofilechanged",init);