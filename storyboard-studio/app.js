/* Storyboard Studio app. Plain JS, no build step. */
const clone=o=>JSON.parse(JSON.stringify(o));
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $=id=>document.getElementById(id);
const fmt=n=>(Math.round(n*10)/10).toString();
const tc=s=>{const m=Math.floor(s/60),r=s-m*60;return m+':'+(r<10?'0':'')+r.toFixed(1)};
const moveOf=id=>MOVES.find(m=>m.id==id)||MOVES[0];
const LS='storyboardStudio.v1';
const UPD={ready:false,mine:(()=>{const e=document.querySelector('script[src*="app.js"]');const m=e&&e.getAttribute('src').match(/v=([^&]+)/);return m?m[1]:''})()};
const LINKED=['script','gfx','broll','loc','pos','move','hard','lens','fps','kind','roll','beat','notes'];
const VIEWS=[['bird',"Bird's-eye"],['story','Storyboard'],['list','Shot List'],['shoot','Shoot Order'],['build','Combos & Hard Moves'],['script','Script']];

const S={boards:{},meta:clone(SEED_META),order:[]};
SEED_BOARDS.forEach(b=>{S.boards[b.id]=clone(b);S.order.push(b.id)});
const U={sec:'board',board:'merino',view:'bird',shot:null,itab:'frame',ctab:{},allTab:{},showHid:false,scope:'whole',cat:null,groupBy:'loc',shootLook:'list'};
try{const p=JSON.parse(localStorage.getItem('storyboardStudio.shootView'));if(p){U.groupBy=p.groupBy==='lens'?'lens':'loc';U.shootLook=p.shootLook==='cards'?'cards':'list'}}catch(e){}
const saveShootPrefs=()=>{try{localStorage.setItem('storyboardStudio.shootView',JSON.stringify({groupBy:U.groupBy,shootLook:U.shootLook}))}catch(e){}};
let db=null,assets=null,saved={},timer=null,dirty=new Set(),metaDirty=false;

/* ---------- storage ---------- */
function lsRead(){try{const r=JSON.parse(localStorage.getItem(LS));if(r){Object.assign(S.boards,r.boards||{});r.boards&&Object.keys(r.boards).forEach(k=>{dirtyAll.add(k);if(!S.order.includes(k))S.order.push(k)});if(r.meta)S.meta=r.meta;if(r.ui){U.board=S.boards[r.ui.board]?r.ui.board:U.board;U.view=r.ui.view||U.view}}}catch(e){}}
function lsWrite(){try{const out={};dirtyAll.forEach(k=>{if(S.boards[k])out[k]=S.boards[k]});localStorage.setItem(LS,JSON.stringify({boards:out,meta:S.meta,ui:{board:U.board,view:U.view}}))}catch(e){}}
const dirtyAll=new Set();
function touch(b){b.updated=Date.now();dirty.add(b.id);dirtyAll.add(b.id);queue()}
function touchMeta(){metaDirty=true;queue()}
function queue(){clearTimeout(timer);timer=setTimeout(flush,700);setSave('Saving…')}
async function flush(){
  lsWrite();
  if(!db){setSave('Saved on this computer');return}
  try{
    for(const id of [...dirty]){const body=clone(S.boards[id]);saved[id]=JSON.stringify(body);await db.doc('boards/'+id).set(body);dirty.delete(id)}
    if(metaDirty){await db.doc('meta/shoot').set(clone(S.meta));metaDirty=false}
    setSave('Saved online. Phone and Macs match.');
  }catch(e){setSave('Could not save online. Kept on this computer.')}
}
function setSave(t){const el=$('saveNote');if(el)el.textContent=t}
async function connect(){
  if(!window.claude||!claude.use)return;
  try{db=await claude.use('db')}catch(e){db=null}
  if(!db)return;
  try{assets=await claude.use('assets')}catch(e){assets=null}
  setSave('Saved online. Phone and Macs match.');
  db.collection('boards').onSnapshot(q=>{
    let ch=false;
    q.docs.forEach(d=>{if(d.metadata.hasPendingWrites)return;const v=d.data();if(!v||!v.id||(S.meta.gone||[]).includes(v.id))return;const j=JSON.stringify(v);if(saved[v.id]===j)return;saved[v.id]=j;S.boards[v.id]=clone(v);ensureBase(S.boards[v.id],!v.tbase);{const d=tplDiff(S.boards[v.id]);if(d&&d.n)applyTpl(S.boards[v.id])}dirtyAll.add(v.id);if(!S.order.includes(v.id))S.order.push(v.id);ch=true});
    if(ch&&!document.activeElement.closest?.('.insp'))render();
  },()=>setSave('Online saving stopped. Kept on this computer.'));
  db.doc('meta/shoot').onSnapshot(d=>{if(d.exists&&!d.metadata.hasPendingWrites){S.meta=clone(d.data());if((S.meta.gone||[]).some(i=>S.boards[i])){purgeGone();render()}else if(U.view==='shoot')renderMain()}},()=>{});
  if(U.shot)renderInsp();
}

/* ---------- helpers ---------- */
const B=()=>S.boards[U.board];
const shotById=(b,id)=>b.shots.find(s=>s.id===id);
const act=b=>b.shots.some(s=>s.hidden)?Object.assign(Object.create(b),{shots:b.shots.filter(s=>!s.hidden)}):b;
const TF=['title','pos','kind','move','hard','lens','fps','f','ask','swapped','extra','solo','beat','loc','roll','dur'];
const lidOf=s=>s.lid||s.id,eqv=(a,c)=>JSON.stringify(a??null)===JSON.stringify(c??null);
function tplOf(b){return typeof SEED_BOARDS!=='undefined'?SEED_BOARDS.find(x=>x.id===(b.from||b.id)):null}
function snapT(t){const o={};t.shots.forEach(s=>{const r={};TF.forEach(k=>r[k]=s[k]===undefined?null:clone(s[k]));o[lidOf(s)]=r});return {shots:o,order:t.shots.map(lidOf),flags:clone(t.flags||[])}}
function ensureBase(b,persist){if(b.tbase||!tplOf(b))return;b.tbase=snapT(tplOf(b));if(persist)touch(b)}
function tplDiff(b){const t=tplOf(b);if(!t||!b.tbase)return null;const cur=snapT(t),base=b.tbase,ch=[],add=[];
  cur.order.forEach(l=>{const c=cur.shots[l],bs=base.shots[l],s=b.shots.find(x=>lidOf(x)===l);
    if(!bs){if(!s)add.push(l);return}if(!s)return;
    TF.forEach(k=>{if(!eqv(c[k],bs[k])&&eqv(s[k],bs[k])&&!eqv(s[k],c[k]))ch.push([l,k,c[k]])})});
  const rem=base.order.filter(l=>!cur.shots[l]&&b.shots.some(x=>lidOf(x)===l));
  const fl=!eqv(cur.flags,base.flags)&&eqv(b.flags,base.flags);
  return {cur,ch,add,rem,fl,shots:new Set(ch.map(x=>x[0])).size+add.length+rem.length,n:ch.length+add.length+rem.length+(fl?1:0)}}
function applyTpl(b){const d=tplDiff(b),t=tplOf(b);if(!d)return 0;
  d.ch.forEach(([l,k,v])=>{const s=b.shots.find(x=>lidOf(x)===l);if(v===null)delete s[k];else s[k]=clone(v)});
  d.add.forEach(l=>{const ts=t.shots.find(x=>lidOf(x)===l),n=clone(ts);n.lid=l;if(b.shots.some(x=>x.id===n.id))n.id='s'+Math.random().toString(36).slice(2,9);n.got=false;
    const prev=d.cur.order[d.cur.order.indexOf(l)-1],pi=prev?b.shots.findIndex(x=>lidOf(x)===prev):-1;b.shots.splice(pi+1,0,n)});
  d.rem.forEach(l=>{const j=b.shots.findIndex(x=>lidOf(x)===l);if(j>=0)b.shots.splice(j,1)});
  if(d.fl)b.flags=clone(t.flags||[]);b.tbase=d.cur;touch(b);return d.shots}
function tplBtn(b){const d=tplDiff(b);if(!d||!d.n){if(d&&b.tbase&&!eqv(b.tbase,d.cur))b.tbase=d.cur;return ''}return `<button class="btn tplu" id="tplU" title="Brings in the template's newer names, moves, images and new shots. Keeps your combos, hidden shots, order and anything you changed yourself.">Get template updates <b>${d.shots||1}</b></button>`}
const total=b=>b.shots.reduce((a,s)=>a+(+s.dur||0),0);
const needsNum=s=>/\[/.test(s.script||'');
const num=(b,s)=>b.shots.indexOf(s)+1;
function comboRuns(b){const out=[];b.shots.forEach((s,i)=>{if(!s.combo)return;const l=out[out.length-1];if(l&&l.key===s.combo&&l.end===i-1){l.end=i;l.shots.push(s)}else out.push({key:s.combo,start:i,end:i,shots:[s]})});return out}
function combosNext(b,i){const s=b.shots[i],n=b.shots[i+1];return s&&n&&s.combo&&s.combo===n.combo}
function heroSrc(s){if(s.media&&s.media.hero)return s.media.hero.url;return moveOf(s.move).res||''}
function gimbalSrc(s){if(s.media&&s.media.gimbal)return s.media.gimbal.url;return moveOf(s.move).op||''}
const dots=n=>`<span class="dots ${n>=3?'h3':''}" title="Difficulty ${n} of 3">${'●'.repeat(n)}${'○'.repeat(3-n)}</span>`;

/* ---------- drawn scenes (viewBox 90x160) ---------- */
const SC={
 wall:(a,b)=>`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="90" height="160" fill="url(#g)"/>`,
 living:()=>SC.wall('#b9a58b','#6d5a48')+`<rect x="52" y="14" width="30" height="62" fill="#e9dcc2"/><path d="M67 14v62M52 45h30" stroke="#8d7a62" stroke-width="1"/><rect y="118" width="90" height="42" fill="#4a382b"/><rect x="4" y="96" width="46" height="24" rx="3" fill="#8a8f92"/><rect x="4" y="88" width="46" height="14" rx="3" fill="#9da2a5"/>`,
 sofa:()=>SC.wall('#a99479','#5c4b3c')+`<rect x="14" y="20" width="24" height="32" fill="#403328"/><rect x="16" y="22" width="20" height="28" fill="#c4b193"/><rect y="124" width="90" height="36" fill="#43332a"/><rect x="-4" y="84" width="98" height="46" rx="5" fill="#7c8286"/><rect x="-4" y="72" width="98" height="24" rx="5" fill="#8f9599"/>`,
 armchair:()=>SC.wall('#8f7f6c','#463a30')+`<rect x="60" y="12" width="20" height="74" fill="#d6c7a8" opacity=".7"/><path d="M78 124c0-40-12-52-33-52s-33 12-33 52z" fill="#7a5a3f"/><rect y="124" width="90" height="36" fill="#3a2c23"/>`,
 kitchen:()=>SC.wall('#d7d2c8','#a8a39a')+`<rect x="4" y="6" width="36" height="42" fill="#2a3036"/><rect x="50" y="6" width="36" height="42" fill="#2a3036"/><path d="M22 0v60M68 0v54" stroke="#222" stroke-width=".7"/><path d="M14 72a8 10 0 0 1 16 0zM60 66a8 10 0 0 1 16 0z" fill="#17191c"/><rect y="100" width="90" height="8" fill="#f1eee8"/><rect y="108" width="90" height="52" fill="#20262c"/>`,
 terrace:()=>`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#32507a"/><stop offset=".5" stop-color="#d78a55"/><stop offset=".72" stop-color="#f4c47b"/></linearGradient></defs><rect width="90" height="160" fill="url(#g)"/><path d="M0 92h12V70h9v12h10V60h8v26h14V74h10v14h12V66h15v30H0z" fill="#2a3346"/><rect y="104" width="90" height="56" fill="#46392f"/><path d="M0 96h90M0 104h90M10 96v8M30 96v8M50 96v8M70 96v8" stroke="#16191f" stroke-width="1.2"/>`,
 patio:()=>`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a8a9c"/><stop offset=".6" stop-color="#ecc48a"/></linearGradient></defs><rect width="90" height="160" fill="url(#g)"/><ellipse cx="18" cy="72" rx="22" ry="30" fill="#3f5a3c"/><ellipse cx="74" cy="66" rx="24" ry="34" fill="#35503a"/><rect y="104" width="90" height="56" fill="#8b7a68"/><path d="M0 120h90M0 138h90M30 104l-8 56M60 104l8 56" stroke="#6d5f50" stroke-width=".8"/>`,
 exterior:()=>`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb3cc"/><stop offset="1" stop-color="#dfe8ee"/></linearGradient></defs><rect width="90" height="160" fill="url(#g)"/><path d="M4 74 45 38l41 36z" fill="#3b3f46"/><rect x="12" y="74" width="66" height="50" fill="#b68c6e"/><rect x="39" y="94" width="13" height="30" fill="#232a31"/><rect x="18" y="84" width="14" height="14" fill="#e9dfbd"/><rect x="58" y="84" width="14" height="14" fill="#e9dfbd"/><rect y="124" width="90" height="36" fill="#5f6a61"/><path d="M38 124h15l14 36H24z" fill="#a9a8a2"/>`,
 drone:()=>`<rect width="90" height="160" fill="#4d6e49"/><path d="M0 104h90v14H0z" fill="#8e8f8c"/><path d="M14 30h62v54H14z" fill="#59402f"/><path d="M14 30l31 27 31-27M14 84l31-27 31 27" stroke="#3a2a1f" stroke-width="1.2" fill="none"/><rect x="26" y="124" width="38" height="20" rx="3" fill="#2fa7c4"/><ellipse cx="9" cy="20" rx="12" ry="11" fill="#2f4d2f"/><ellipse cx="82" cy="134" rx="13" ry="12" fill="#2f4d2f"/>`,
 entry:()=>SC.wall('#c8bca8','#7e7364')+`<rect x="27" y="30" width="36" height="96" fill="#2d3640"/><rect x="31" y="34" width="28" height="88" fill="#f3e6c4" opacity=".9"/><rect y="126" width="90" height="34" fill="#54473a"/><path d="M45 34v88" stroke="#2d3640"/>`,
 dining:()=>SC.wall('#b7a68f','#6a5a4a')+`<path d="M45 0v26" stroke="#222"/><path d="M30 38a15 12 0 0 1 30 0z" fill="#d7b46a"/><rect x="10" y="94" width="70" height="7" fill="#3a2a20"/><rect x="16" y="101" width="4" height="36" fill="#2a1e17"/><rect x="70" y="101" width="4" height="36" fill="#2a1e17"/><rect y="136" width="90" height="24" fill="#4a3a2d"/>`,
 stairs:()=>SC.wall('#c2b8a9','#756a5c')+`<path d="M0 160V130h22v-16h20V98h20V82h28v78z" fill="#54402f"/><path d="M6 118 78 54" stroke="#20252b" stroke-width="2.4"/>`,
 bedroom:()=>SC.wall('#a8a397','#5d5850')+`<rect x="56" y="16" width="26" height="60" fill="#e6dcc4"/><rect x="6" y="88" width="78" height="40" rx="3" fill="#e9e6df"/><rect x="6" y="76" width="78" height="18" rx="3" fill="#6d7a84"/><rect x="12" y="84" width="24" height="12" rx="3" fill="#fff"/><rect x="42" y="84" width="24" height="12" rx="3" fill="#fff"/><rect y="128" width="90" height="32" fill="#4b3e33"/>`,
 ensuite:()=>SC.wall('#dfe0dc','#a3a6a4')+`<rect x="8" y="26" width="42" height="40" rx="2" fill="#b8c8d2"/><rect x="4" y="84" width="60" height="9" fill="#f5f4f0"/><rect x="6" y="93" width="56" height="42" fill="#3a4750"/><rect y="135" width="90" height="25" fill="#8d8f8e"/><rect x="66" y="20" width="24" height="115" fill="#c8d6dc" opacity=".55"/>`,
 basement:()=>SC.wall('#6f6a64','#3c3834')+`<rect x="8" y="30" width="74" height="40" fill="#1e2024"/><rect x="11" y="33" width="68" height="34" fill="#35506a"/><rect x="8" y="96" width="74" height="28" rx="3" fill="#59616a"/><rect y="124" width="90" height="36" fill="#2c2a28"/>`,
 backyard:()=>`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9dc0d6"/><stop offset="1" stop-color="#e1e7dd"/></linearGradient></defs><rect width="90" height="160" fill="url(#g)"/><rect y="62" width="90" height="26" fill="#4f6f46"/><rect y="88" width="90" height="72" fill="#6d8f54"/><rect x="10" y="104" width="70" height="28" rx="3" fill="#8e8a82"/><rect x="18" y="110" width="30" height="16" fill="#553f2e"/>`,
 phone:()=>SC.wall('#d5915a','#58402f')+`<rect x="24" y="40" width="42" height="80" rx="5" fill="#0d1217"/><rect x="27" y="45" width="36" height="70" rx="2" fill="#35566f"/><path d="M14 150c0-22 10-38 22-40l18-2c8 2 18 14 22 42z" fill="#b9856a"/>`,
 gear:()=>SC.wall('#71695f','#37322c')+`<rect x="20" y="62" width="50" height="34" rx="4" fill="#15181b"/><circle cx="45" cy="79" r="13" fill="#262b30"/><circle cx="45" cy="79" r="7" fill="#3f6d8a"/><path d="M45 96v30M14 62V40h62v22" stroke="#111" stroke-width="3" fill="none"/>`,
 card:()=>`<rect width="90" height="160" fill="#fff"/>`
};
function sceneSvg(k){const f=SC[k];return f?`<svg class="sc" viewBox="0 0 90 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${f()}</svg>`:`<svg class="sc" viewBox="0 0 90 160" aria-hidden="true"><rect width="90" height="160" fill="#26394c"/></svg>`}
let gid=0;
function frameHTML(s,mode){
  const f=s.f||{};
  if(mode==='hero'||mode==='gimbal'){const src=mode==='hero'?heroSrc(s):gimbalSrc(s);if(src)return `<div class="fr"><video class="ct" src="${esc(src)}" autoplay muted loop playsinline></video><span class="cue">${mode==='hero'?'HERO':'HOW TO'}</span></div>`}
  if(s.media&&s.media.frame)return `<div class="fr"><img class="real" src="${esc(s.media.frame.url)}" alt=""></div>`;
  if(f.img)return `<div class="fr"><img class="real" src="${esc(f.img)}" alt="" loading="lazy"></div>`;
  const uid='f'+(++gid);
  let h=sceneSvg(f.scene).replace(/id="g"/g,`id="${uid}"`).replace(/url\(#g\)/g,`url(#${uid})`);
  if(f.scene==='card'&&!f.el)h+=`<div class="endcard">THE OP TEAM<small>SoldMike</small></div>`;
  if(f.el==='collage')h+=`<div class="collage">${'<i></i>'.repeat(16)}</div>`;
  if(f.behind)h+=`<div class="bh ${esc(f.bs||'serif')}">${esc(f.behind)}</div>`;
  if(f.talent)h+=`<img class="tal ${f.talent}" src="img/mike.png" alt="">`;
  const ev=(f.ev||'').split('|');
  if(f.el==='bar')h+=`<div class="el barx"><b>${esc(ev[0])}</b><div class="t"><i></i></div></div><i class="rc" style="left:6cqw;top:16cqw;transform:rotate(-7deg)"></i><i class="rc" style="right:6cqw;top:12cqw;transform:rotate(6deg)"></i>`;
  if(f.el==='pills'){const p=[['left:4cqw','top:34cqw'],['right:4cqw','top:60cqw'],['left:8cqw','top:88cqw']];ev.forEach((t,i)=>h+=`<span class="pill" style="${p[i%3].join(';')}">${esc(t)}</span>`)}
  if(f.el==='logos'){const p=[['left:7cqw','top:26cqw'],['right:7cqw','top:42cqw'],['left:11cqw','top:62cqw']];ev.forEach((t,i)=>h+=`<span class="chip" style="${p[i%3].join(';')}">${esc(t)}</span>`)}
  if(f.el==='carousel')h+=`<i class="rc" style="left:4cqw;bottom:56cqw;transform:rotate(-10deg) scale(.86)"></i><i class="rc" style="left:39cqw;bottom:92cqw"></i><i class="rc" style="right:4cqw;bottom:56cqw;transform:rotate(10deg) scale(.86)"></i>`;
  if(f.el==='endpill')h+=`<div class="endp"><img src="img/mike.png" alt=""><span>${esc(ev[0])}</span></div>`;
  if(f.el==='strike')h+=`<div class="el strike">${esc(ev[0])}<i></i></div>`;
  if(s.title&&!f.talent)h+=`<div class="ttl">${esc(s.title)}</div>`;
  if(f.cap){const c=esc(f.cap).replace(/\*(.+?)\*/g,'<em>$1</em>');h+=`<div class="cap">${c}</div>`}
  return `<div class="fr">${h}</div>`;
}

/* ---------- rail ---------- */
/* ---------- areas & folders (Nov 7): Templates / Properties / Commercials / Projects ---------- */
const AREAS=[['templates','Templates'],['properties','Properties'],['commercials','Commercials'],['projects','Projects']];
const AREA_ONE={properties:'property',commercials:'commercial',projects:'project'};
const areaOf=b=>b.area||(b.family==='merino'?'properties':'templates');
const folderOf=b=>b.folder||(b.family==='merino'?'merino':null);
const fnameOf=b=>b.fname||(b.family==='merino'?'1 Merino Rd':b.name);
const verName=b=>(['merino','merinotour'].includes(b.id)?'Old plan · ':'')+(b.version||b.name);
const rid=()=>'s'+Math.random().toString(36).slice(2,9);
function foldersIn(a){const m={},out=[];S.order.forEach(id=>{const b=S.boards[id];if(!b||areaOf(b)!==a)return;const f=folderOf(b)||b.id;if(!m[f]){m[f]={id:f,name:fnameOf(b),boards:[]};out.push(m[f])}m[f].boards.push(b)});return out}
function openFolder(fid){const f=foldersIn(U.area).find(x=>x.id===fid);if(!f)return;U.sec='board';U.board=f.boards[0].id;U.shot=null;U.sbs=false;render()}
function renderRail(){
  const a=U.area||'templates';
  const seg=`<div class="areas">${AREAS.map(([k,n])=>`<button class="${a===k?'on':''}" data-area="${k}">${n}</button>`).join('')}</div>`;
  let body='';
  if(a==='templates'){
    const boardsIn=c=>S.order.filter(id=>S.boards[id]&&S.boards[id].cat===c&&areaOf(S.boards[id])==='templates');
    const nb=b=>`<button class="nav ${U.sec==='board'&&U.board===b.id?'on':''}" data-b="${b.id}"><span>${esc(b.name)}</span><small>${b.shots.filter(s=>!s.hidden).length}</small></button>`;
    const cat=c=>{const ids=boardsIn(c.id);return `<button class="nav sub ${U.sec==='cat'&&U.cat===c.id?'on':''}" data-c="${c.id}"><span>${esc(c.name)}</span><small>${ids.length}</small></button><div class="nest">${linkedList(ids.map(i=>S.boards[i]),nb)}</div>`};
    body=`<div class="grp"><h4>Templates</h4>${CATEGORIES.map(cat).join('')}</div>
    <div class="grp"><h4>Library</h4><button class="nav sub ${U.sec==='moves'?'on':''}" data-m="1"><span>Gimbal moves</span><small>${MOVES.filter(m=>m.id!==0&&m.id!==14).length}</small></button></div>`;
  }else{
    const lab=AREAS.find(x=>x[0]===a)[1],one=AREA_ONE[a],fs=foldersIn(a),cur=S.boards[U.board];
    body=`<div class="grp"><h4>${lab}</h4><button class="nav sub ${U.sec==='area'?'on':''}" data-al="1"><span>All ${lab.toLowerCase()}</span><small>${fs.length}</small></button>
    ${fs.map(f=>{const here=U.sec==='board'&&cur&&(folderOf(cur)||cur.id)===f.id;return `<button class="nav sub fold" data-fold="${f.id}"><span>${here?'▾':'▸'} ${esc(f.name)}</span><small>${f.boards.length}</small></button><div class="nest">${linkedList(f.boards,b=>`<button class="nav ${U.sec==='board'&&U.board===b.id&&!U.sbs?'on':''}" data-b="${b.id}"><span>${esc(verName(b))}</span><small>${b.shots.filter(s=>!s.hidden).length}</small></button>`)}${f.boards.length>1?`<button class="nav ${here&&U.sbs?'on':''}" data-sbsf="${f.boards[0].id}"><span>Side by side</span></button>`:''}</div>`}).join('')}
    <button class="nav newf" data-newf="1"><span>+ New ${one}</span></button></div>`;
  }
  $('rail').innerHTML=`<div class="toprow"><div class="logo">Storyboard Studio<span>Toronto Property Media</span></div><button class="updbtn${UPD.ready?' ready':''}" id="updBtn" title="Load the newest version">${UPD.ready?'⬆ New version: tap to update':'↻ Update'}</button></div>${seg}${body}
  <div class="save" id="saveNote">${db?'Saved online. Phone and Macs match.':'Saved on this computer'}</div>`;
  const r=$('rail');const ub=$('updBtn');if(ub)ub.onclick=doUpdate;
  r.querySelectorAll('[data-area]').forEach(e=>e.onclick=()=>{const k=e.dataset.area;if(k===U.area)return;U.area=k;U.shot=null;U.sbs=false;U.newF=false;
    if(k==='templates'){const b=S.boards[U.board];if(b&&areaOf(b)==='templates')U.sec='board';else{U.sec='cat';U.cat='houses'}}else U.sec='area';render()});
  r.querySelectorAll('[data-b]').forEach(e=>e.onclick=()=>{U.sec='board';U.board=e.dataset.b;U.shot=null;U.sbs=false;render()});
  r.querySelectorAll('[data-c]').forEach(e=>e.onclick=()=>{U.sec='cat';U.cat=e.dataset.c;U.shot=null;U.newF=false;render()});
  r.querySelectorAll('[data-fold]').forEach(e=>e.onclick=()=>openFolder(e.dataset.fold));
  r.querySelectorAll('[data-sbsf]').forEach(e=>e.onclick=()=>{U.sec='board';U.board=e.dataset.sbsf;U.sbs=true;U.shot=null;render()});
  const al=r.querySelector('[data-al]');if(al)al.onclick=()=>{U.sec='area';U.shot=null;render()};
  const nf=r.querySelector('[data-newf]');if(nf)nf.onclick=()=>{U.sec='area';U.newF=true;U.shot=null;render();const i=$('fName');if(i)i.focus()};
  const mm=r.querySelector('[data-m]');if(mm)mm.onclick=()=>{U.sec='moves';U.shot=null;render()};
}
/* New board / new folder: pick a template and what to make (Reel, Virtual Tour or Both, linked). */
const MAKES=[['reel','Reel'],['tour','Virtual Tour'],['both','Both (linked)']];
const MAKE_DEF={properties:'both',commercials:'reel',projects:'reel',houses:'both',condos:'both',luxury:'both',realtor:'reel'};
function srcOptions(){const tpl=S.order.map(i=>S.boards[i]).filter(b=>b&&areaOf(b)==='templates');let h='<option value="blank">Blank board</option>';
  CATEGORIES.forEach(c=>{const bs=tpl.filter(b=>b.cat===c.id);if(!bs.length)return;const fam={};bs.forEach(b=>{if(b.family&&b.linked!==false)(fam[b.family]=fam[b.family]||[]).push(b)});const done=new Set(),o=[];
    bs.forEach(b=>{const f=b.family&&fam[b.family];if(f&&f.length>1){if(done.has(b.family))return;done.add(b.family);o.push(['fam:'+b.family,f.map(x=>verName(x)).join(' + ')+' · '+f[0].name.replace(/ · .*$/,'').replace(/(Listing )?Reel$/,'').replace(/Virtual Tour$/,'').trim()])}else o.push(['b:'+b.id,b.name])});
    h+=`<optgroup label="${esc(c.name)}">${o.map(([v,n])=>`<option value="${v}">${esc(n)}</option>`).join('')}</optgroup>`});return h}
function srcBoards(v){if(!v||v==='blank')return [];if(v.startsWith('fam:')){const k=v.slice(4);return S.order.filter(i=>S.boards[i]&&S.boards[i].family===k&&areaOf(S.boards[i])==='templates')}return S.boards[v.slice(2)]?[v.slice(2)]:[]}
function newForm(ctx){const key=ctx.area||ctx.cat,one=ctx.area?AREA_ONE[ctx.area]:'board';
  if(U.newKey!==key){U.newKey=key;U.newSrc=ctx.area==='properties'?'fam:std':'blank';U.newMake=MAKE_DEF[key]||'reel'}
  const ph=ctx.area==='properties'?'22 Oak Cres':ctx.area==='commercials'?'Spring home value promo':ctx.area==='projects'?'AI short film':'Luxury listing';
  return `<form class="newfold" id="newFold"><label class="fld"><span>${one[0].toUpperCase()+one.slice(1)} name</span><input id="fName" value="${esc(U.newName||'')}" placeholder="${ph}"></label>
  <label class="fld"><span>Start from template</span><select id="fSrc">${srcOptions().replace(`value="${U.newSrc}"`,`value="${U.newSrc}" selected`)}</select></label>
  <div class="fvs mk"><span>Make</span>${MAKES.map(([k,n])=>`<label><input type="radio" name="mk" value="${k}" ${U.newMake===k?'checked':''}> ${n}</label>`).join('')}</div>
  <p class="fnote">${ctx.area?'Copies go into the new folder. The template is not changed.':'Makes a new template here.'} Both = a Reel and a Virtual Tour linked together, so changes carry between them. You can add more versions later.</p><span class="ferr" id="fErr"></span>
  <div class="facts"><button class="btn pri">Create ${one}</button><button type="button" class="btn" id="fCancel">Cancel</button></div></form>`}
function buildSet(srcIds,make,fieldsFor){const tag=Date.now().toString(36),fam='fam'+tag,ids=[];
  let pool=srcIds.map(i=>S.boards[i]).filter(Boolean);
  if(!pool.length){const sh=[newShot()];sh.forEach(s=>s.lid=s.id);pool=[{target:45,outfit:'',flags:[],combos:{},shots:sh}]}
  (make==='both'?['tour','reel']:[make]).forEach((w,i)=>{const isT=w==='tour',src=pool.find(b=>(b.aspect==='16/9')===isT)||pool[0],ver=isT?'Virtual Tour':'Reel';
    const n=clone(src),from=src.from||src.id;if(from)n.from=from;else delete n.from;delete n.tbase;delete n.group;
    n.shots.forEach(s=>{s.lid=s.lid||s.id;s.got=false;s.id=rid()});
    if(isT){n.aspect='16/9';if(src.aspect!=='16/9')n.target=Math.max(n.target||0,120)}else delete n.aspect;
    n.id='b'+tag+i;n.version=ver;n.family=fam;n.linked=true;n.status='Draft';Object.assign(n,fieldsFor(ver));
    S.boards[n.id]=n;S.order.push(n.id);ids.push(n.id);if(n.from)ensureBase(n,false);touch(n)});
  return ids}
function wireNewForm(ctx,rerender){const f=$('newFold');if(!f)return;
  $('fName').oninput=e=>{U.newName=e.target.value;$('fErr').textContent=''};
  $('fSrc').onchange=e=>{U.newSrc=e.target.value};
  f.querySelectorAll('[name=mk]').forEach(r=>r.onchange=()=>{U.newMake=r.value});
  $('fCancel').onclick=()=>{U.newF=false;rerender()};
  f.onsubmit=e=>{e.preventDefault();const name=$('fName').value.trim();if(!name){$('fErr').textContent='Type a name first';$('fName').focus();return}
    const make=(f.querySelector('[name=mk]:checked')||{}).value||'reel',src=srcBoards(U.newSrc);let ids;
    if(ctx.area){const fid='f'+Date.now().toString(36),lab=AREAS.find(x=>x[0]===ctx.area)[1];
      ids=buildSet(src,make,ver=>({area:ctx.area,folder:fid,fname:name,name:name+' · '+ver,sub:lab+' · '+name,cat:''}));U.area=ctx.area}
    else{const c=CATEGORIES.find(x=>x.id===ctx.cat);ids=buildSet(src,make,ver=>({cat:c.id,name:make==='both'?name+' · '+ver:name,sub:c.name,area:undefined,folder:undefined,fname:undefined}));ids.forEach(i=>{const b=S.boards[i];delete b.area;delete b.folder;delete b.fname})}
    U.sec='board';U.board=ids[0];U.newF=false;U.newName='';U.newKey=null;U.sbs=false;U.shot=null;render();toast(`${name} created${ids.length>1?': Reel and Virtual Tour, linked':''}`)}}
function renderArea(){const a=U.area,lab=AREAS.find(x=>x[0]===a)[1],one=AREA_ONE[a],fs=foldersIn(a);
  $('main').innerHTML=`<div class="head"><div><h1>${lab}</h1><div class="sub">${fs.length} ${fs.length===1?one:lab.toLowerCase()} · each folder holds its own reels and tours</div></div><div class="acts"><button class="btn pri" id="newF">New ${one}</button></div></div>
  ${U.newF?newForm({area:a}):''}
  ${fs.length?`<div class="fgrid">${fs.map(f=>`<button class="fcard" data-fold2="${f.id}">${frameHTML(f.boards[0].shots[0]||{f:{}})}<b>${esc(f.name)}</b><span>${f.boards.map(b=>esc(verName(b))).join(' · ')}</span></button>`).join('')}</div>`:`<div class="empty">No ${lab.toLowerCase()} yet. Tap New ${one} to start one from a template.</div>`}`;
  const m=$('main');
  $('newF').onclick=()=>{U.newF=!U.newF;renderArea();const i=$('fName');if(i)i.focus()};
  m.querySelectorAll('[data-fold2]').forEach(e=>e.onclick=()=>openFolder(e.dataset.fold2));
  wireNewForm({area:a},renderArea)}
/* sidebar: boards linked together get a side line */
function linkedList(boards,item){const g=[],m={};boards.forEach(b=>{const k=b.family&&b.linked!==false?'f:'+b.family:'b:'+b.id;if(!m[k]){m[k]=[];g.push(m[k])}m[k].push(b)});
  return g.map(x=>x.length>1?`<div class="lnk" title="Linked: changes carry between these">${x.map(item).join('')}</div>`:item(x[0])).join('')}
function sbsView(b){const vs=[b,...siblings(b)].sort((x,y)=>S.order.indexOf(x.id)-S.order.indexOf(y.id));
  return `<div class="sbsw"><div class="sbs" style="grid-template-columns:repeat(${vs.length},minmax(250px,1fr))">${vs.map(x=>{const sh=x.shots.filter(s=>!s.hidden);return `<div class="sbc"><button class="sbh" data-ver="${x.id}"><b>${esc(verName(x))}</b><small>${x.aspect==='16/9'?'16:9':'9:16'} · ${sh.length} shots · ${fmt(sh.reduce((t,s)=>t+(+s.dur||0),0))}s</small></button><div class="sbt">${sh.map((s,i)=>`<i style="flex:${s.dur} 1 0;background:${KINDS[s.kind].c}" title="${i+1}. ${esc(s.title||s.pos||'')}"></i>`).join('')}</div><div class="sbl">${sh.map((s,i)=>`<button class="sbr" data-sbo="${x.id}|${s.id}"><span class="sbk" style="background:${KINDS[s.kind].c}"></span><em>${i+1}</em><span class="sbn">${esc(s.title||s.script||s.pos||'')}</span><small>${s.dur}s</small></button>`).join('')}</div></div>`}).join('')}</div></div>`}
function removeBoard(b){const sib=siblings(b);delete S.boards[b.id];S.order=S.order.filter(i=>i!==b.id);S.meta.gone=S.meta.gone||[];if(!S.meta.gone.includes(b.id))S.meta.gone.push(b.id);touchMeta();dirty.delete(b.id);dirtyAll.delete(b.id);
  if(db){try{const p=db.doc('boards/'+b.id).delete();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
  U.sbs=false;U.shot=null;const tpl=!folderOf(b);if(sib.length){U.board=sib[0].id;U.sec='board'}else if(tpl){U.sec='cat';U.cat=b.cat||'houses';U.board=S.order[0]}else{U.sec='area';U.board=S.order[0]}render();toast(tpl?'Board deleted':sib.length?'Version removed':'Folder removed')}
function purgeGone(){(S.meta.gone||[]).forEach(id=>{delete S.boards[id]});S.order=S.order.filter(i=>S.boards[i]);if(!S.boards[U.board])U.board=S.order[0]}

/* ---------- main ---------- */
function render(){renderRail();renderMain();renderInsp();try{lsWrite()}catch(e){}}
function renderMain(){
  gid=0;
  const wide=U.sec==='area'||(U.sec==='board'&&(B().aspect==='16/9'||(U.sbs&&folderOf(B()))));$('main').classList.toggle('wide',wide);$('insp').classList.toggle('wide',wide);
  if(U.sec==='moves')return renderMoves();
  if(U.sec==='cat')return renderCat();
  if(U.sec==='area')return renderArea();
  const b=B();
  const sbs=U.sbs&&!!folderOf(b)&&siblings(b).length>0;const v=sbs?sbsView(b):{bird:birdView,story:storyView,list:listView,shoot:shootView,build:buildView,script:scriptView}[U.view](U.view==='story'?b:act(b));
  $('main').innerHTML=`<div class="head"><div><h1 id="bName" title="Tap to rename this board" style="cursor:text">${esc(b.name)} <span style="font-size:.55em;opacity:.45;font-weight:400">✎ rename</span></h1><div class="sub">${folderOf(b)?esc(AREAS.find(x=>x[0]===areaOf(b))[1])+' › '+esc(fnameOf(b))+' · ':''}${esc(b.sub||'')} · ${esc(b.status||'')}</div></div>
    <div class="acts">${tplBtn(b)}${!folderOf(b)&&!SEED_BOARDS.some(x=>x.id===b.id)?`<button class="btn" id="rmV" data-lab="Delete board">Delete board</button>`:''}<button class="btn" id="addV">Add version</button><button class="btn" id="dupB">Duplicate board</button><button class="btn pri" id="addS">Add shot</button></div></div>
  ${versionBar(b)}${U.addPick?pickHTML(b):''}${sbs?'':`<div class="tabs" role="tablist">${VIEWS.map(([k,n])=>`<button class="tab ${U.view===k?'on':''}" role="tab" aria-selected="${U.view===k}" data-v="${k}">${n}</button>`).join('')}</div>`}${v}`;
  wireMain(b);if(U.view==='script'&&!sbs)wireScript(b);
}
function siblings(b){return b.family?S.order.map(i=>S.boards[i]).filter(x=>x&&x.family===b.family&&x.id!==b.id):[]}
function versionBar(b){
  const tpls=S.order.map(i=>S.boards[i]).filter(x=>x&&areaOf(x)==='templates');
  const form=U.addV?`<form class="verform" id="verForm"><label class="fld"><span>Version name</span><input id="vName" value="${b.aspect==='16/9'?'Reel':'Virtual Tour'}"></label>${folderOf(b)?`<label class="fld"><span>Start from</span><select id="vSrc"><option value="">Copy of this version (linked)</option>${tpls.map(x=>`<option value="${x.id}">Template: ${esc(x.name)}</option>`).join('')}</select></label>`:''}<label class="fld"><span>Shape</span><select id="vShape"><option value="16/9">Horizontal 16:9</option><option value="9/16">Vertical 9:16</option></select></label><button class="btn pri">Create linked version</button><button type="button" class="btn" id="vCancel">Cancel</button></form>`:'';
  if(!b.family)return folderOf(b)?`<div class="vers"><button class="btn sm" id="rmV">Remove this version</button></div>${form}`:form;
  const sib=siblings(b),on=b.linked!==false;
  return `<div class="vers"><div class="seg2">${[b,...sib].sort((x,y)=>S.order.indexOf(x.id)-S.order.indexOf(y.id)).map(x=>`<button class="${x.id===b.id?'on':''}" data-ver="${x.id}">${esc(verName(x))}</button>`).join('')}</div>
  ${folderOf(b)&&sib.length?`<button class="btn sm ${U.sbs?'pri':''}" id="sbsT">${U.sbs?'One at a time':'Side by side'}</button>`:''}${folderOf(b)?`<button class="btn sm" id="rmV">Remove this version</button>`:''}<button class="sw ${on?'on':''}" id="linkT" role="switch" aria-checked="${on}"><i></i>${on?'Linked: changes here also go to '+esc(sib.map(x=>x.version||x.name).join(', ')):'Not linked: changes stay on this version'}</button></div>${form}`;
}
function syncShot(b,s,k){
  if(!b.family||b.linked===false||s.solo||!LINKED.includes(k))return;
  siblings(b).forEach(x=>{if(x.linked===false)return;const t=x.shots.find(y=>y.lid===s.lid);if(t&&!t.solo){t[k]=s[k];touch(x)}});
}
function createVersion(b,name,aspect,srcId){
  const id='b'+Date.now().toString(36);
  if(!b.family){b.family='f'+id;b.linked=true;b.version=b.version||'Original';b.shots.forEach(s=>s.lid=s.lid||s.id)}
  const src=srcId&&S.boards[srcId];
  const n=src?clone(src):clone(b);n.id=id;n.version=name;n.name=(folderOf(b)?fnameOf(b):b.name)+' · '+name;n.aspect=src?src.aspect:aspect;n.linked=true;delete n.group;
  if(src){n.from=src.from||src.id;delete n.tbase;n.family=b.family;['area','folder','fname','sub','status'].forEach(k=>{if(b[k]!==undefined)n[k]=b[k]});if(!b.folder&&folderOf(b)){n.area=areaOf(b);n.folder=folderOf(b);n.fname=fnameOf(b)}n.shots.forEach(s=>s.lid=s.lid||s.id)}
  n.shots.forEach(s=>{s.id='s'+Math.random().toString(36).slice(2,9);s.got=false;s.lid=s.lid});
  S.boards[id]=n;S.order.splice(S.order.indexOf(b.id)+1,0,id);U.board=id;U.addV=false;U.sbs=false;if(src)ensureBase(n,false);touch(b);touch(n);render();toast('Linked version created');
}
function legend(b){
  const vis=b.shots.filter(s=>!s.hidden),of=ks=>vis.filter(s=>ks.includes(s.kind));
  const area=l=>({'Exterior · Sony':'Exterior','Exterior · Drone':'Drone','Interior · Main':'Main floor','Interior · Second':'Second floor','Interior · Basement':'Basement','Interior · Suite':'Suite'})[l]||l||'Other';
  const dd=list=>{const g={};list.forEach(s=>{const a=area(s.loc);(g[a]=g[a]||[]).push(s)});return `<div class="dd${list.length>10?' two':''}">${Object.entries(g).map(([a,ss])=>`<div class="ddg"><b>${esc(a)} <span>${ss.length}</span></b>${ss.map(s=>`<button class="ddi" data-open="${s.id}"><span>#${num(b,s)}</span>${esc(s.title||s.script||s.pos||'')}<em>${esc(moveOf(s.move).name)}</em></button>`).join('')}</div>`).join('')}</div>`};
  const item=(sw,label,list,sub)=>list.length?`<details class="lgd"><summary><i style="background:${sw}"></i>${label} <b class="lc">${list.length}</b>${sub?` <small class="ls">${sub}</small>`:''}<span class="car">▾</span></summary>${dd(list)}</details>`:'';
  const wide=of(['wide','hero','burst']);
  return `<div class="legend">${item(KINDS.wide.c,'Wide',wide)}${item(KINDS.medium.c,'Medium',of(['medium']))}${item(KINDS.closeup.c,'Close-up',of(['closeup']))}${item(KINDS.drone.c,'Drone',of(['drone']))}${item(KINDS.burst.c,'0.5s burst',of(['burst']),'of the wide')}${item(KINDS.hero.c,'Hero',of(['hero']),'of the wide')}${item(KINDS.graphic.c,'Graphic only',of(['graphic']))}${item(KINDS.twilight.c,'Twilight',of(['twilight']))}${item(KINDS.staging.c,'Virtual Staging',of(['staging']))}${item(KINDS.aieffect.c,'AI Effect',of(['aieffect']))}${item(KINDS.agent.c,'Agent',of(['agent']))}<span class="lt">${vis.length} shots</span>${Object.keys(b.combos||{}).length?`<span><i class="hatch"></i>Ramp room on combo clips</span>`:''}</div>`;
}
function flagsHTML(b){
  const n=b.shots.filter(needsNum);
  let h=(b.flags||[]).map(f=>`<div class="flag"><b>CHECK</b><span>${esc(f)}</span></div>`).join('');
  if(n.length)h+=`<div class="flag"><b>NUMBERS</b><span>${n.length} ${n.length===1?'line needs':'lines need'} a real number: shot ${n.map(s=>num(b,s)).join(', ')}.</span></div>`;
  return h;
}
function storyStrip(b){const pos={};comboRuns(b).forEach(r=>r.shots.forEach((s,i)=>pos[s.id]={k:r.key,i:i+1,n:r.shots.length}));let lastBeat=null,t=0;
  return `<div class="sheet story ${b.aspect==='16/9'?'h':'v'}">${b.shots.map((s,i)=>{const p=pos[s.id],m=moveOf(s.move),at=t;t+=+s.dur||0;const beat=s.beat!==lastBeat?`<div class="beatlab">${esc(s.beat||'')}<small>${tc(at)}</small></div>`:'';lastBeat=s.beat;
    return `${beat}<div class="mini sbm ${U.shot===s.id?'sel':''}${p?' inc':''}" ${p?`style="--cc:${comboColor(p.k)}"`:''} role="button" tabindex="0" draggable="true" data-s="${s.id}"><div class="bar" style="background:${KINDS[s.kind].c}"></div><span class="n">${i+1}${s.extra||s.swapped?' +':''}</span>${s.got?'<span class="ck">✓</span>':''}${frameHTML(s)}<div class="mcap"><b>${esc(s.title||s.script||s.pos||'')}</b><span>${esc(m.name)} · ${s.dur}s${p?` · <i style="color:var(--cc)">combo ${esc(p.k)} ${p.i}/${p.n}</i>`:''}</span>${comboBtn(b.id,s)}${p&&p.i===1?`<button class="cundo sm" data-cundo="${b.id}|${s.id}">Undo combo ${esc(p.k)}</button>`:''}</div>${combosNext(b,i)?`<span class="cl"><span class="lk">${esc(s.combo)}</span></span>`:''}</div>`}).join('')}</div>`}
function birdView(b){
  const T=total(b)||1,over=T>b.target,rs=comboRuns(b);
  const a=b.shots.filter(s=>s.roll==='A').reduce((x,s)=>x+(+s.dur||0),0),br=b.shots.filter(s=>s.roll==='B').reduce((x,s)=>x+(+s.dur||0),0);
  const film=b.shots.filter(s=>s.roll!=='G'),got=film.filter(s=>s.got).length;
  const hard=b.shots.filter(s=>s.hard>=3).length;
  const locs=new Set(film.map(s=>s.loc)).size;
  const beats=[];let t=0;b.shots.forEach(s=>{const l=beats[beats.length-1];if(l&&l.n===s.beat)l.d+=+s.dur||0;else beats.push({n:s.beat,t,d:+s.dur||0});t+=+s.dur||0});
  const starts=[];t=0;b.shots.forEach(s=>{starts.push(t);t+=+s.dur||0});
  const ticks=[];for(let i=0;i<=T;i+=5)ticks.push(i);
  return `<div class="stats">
    <div class="stat"><b class="${over?'over':''}">${fmt(T)}s</b><span>runtime, target ${b.target}s</span></div>
    <div class="stat"><b>${b.shots.length}</b><span>shots</span></div>
    <div class="stat"><b>${locs}</b><span>locations</span></div>
    <div class="stat"><b>${fmt(a)}s / ${fmt(br)}s</b><span>A-roll / B-roll</span></div>
    <div class="stat"><b>${rs.length}</b><span>combos</span></div>
    <div class="stat"><b>${hard}</b><span>hard moves</span></div>${b.shots.some(s=>s.extra)?`<div class="stat"><b>${b.shots.filter(s=>s.extra).length}</b><span>extras</span></div>`:''}${b.shots.some(s=>s.swapped)?`<div class="stat"><b>${b.shots.filter(s=>s.swapped).length}</b><span>swaps</span></div>`:''}
    <div class="stat"><b>${got}/${film.length}</b><span>captured</span></div>
  </div>
  <div class="sect">Storyboard, in story order <small>· how the finished video plays · drag to reorder</small></div>
  ${storyStrip(b)}
  <div class="sect">Timeline</div>
  ${legend(b)}
  <div class="tlwrap"><div class="tl">
    <div class="lane">${beats.map(x=>`<div class="seg" style="left:${x.t/T*100}%;width:${x.d/T*100}%" title="${esc(x.n)}">${esc(x.n)}</div>`).join('')}</div>
    <div class="tiles">${b.shots.map((s,i)=>{const c=KINDS[s.kind].c,cm=!!s.combo;return `<button class="tile ${U.shot===s.id?'sel':''} ${s.got?'got':''} ${s.extra||s.swapped?'isx':''}" style="flex:${s.dur} 1 0;background:${c}" data-s="${s.id}" title="${i+1}. ${esc(s.title||s.script||s.gfx)} (${s.dur}s)">${cm?'<i class="hd l"></i><i class="hd r"></i>':''}${s.dur>=1?i+1:''}</button>`}).join('')}</div>
    <div class="rollrow">${b.shots.map(s=>`<i class="${s.roll}" style="flex:${s.dur} 1 0"></i>`).join('')}</div>
    ${rs.length?`<div class="lane combos">${rs.map(r=>{const st=starts[r.start],en=starts[r.end]+(+b.shots[r.end].dur||0);return `<div class="seg" style="left:${st/T*100}%;width:${(en-st)/T*100}%">${esc(r.key)}</div>`}).join('')}</div>`:''}
    <div class="ruler">${ticks.map(i=>`<span style="left:${i/T*100}%">${i}s</span>`).join('')}</div>
  </div></div>
  ${(b.flags||[]).length?`<div class="sect">Notes to check</div>${flagsHTML(b)}`:''}`;
}
function allTabs(b){const a=U.allTab[b.id]??'frame';return `<div class="alltabs"><span class="seglab">Show all</span><div class="seg2">${[['frame','Frame'],['hero','Hero'],['gimbal','Gimbal']].map(([k,l])=>`<button data-all="${k}" class="${a===k?'on':''}">${l}</button>`).join('')}</div></div>`}
function storyView(b){
  const runs=comboRuns(b),pos={};runs.forEach(r=>r.shots.forEach((s,i)=>pos[s.id]={k:r.key,i:i+1,n:r.shots.length}));
  const hc=b.shots.filter(s=>s.hidden).length;let vn=0;
  return `${legend(b)}${allTabs(b)}${hc?`<label class="showhid"><input type="checkbox" id="showHid" ${U.showHid?'checked':''}> Show hidden shots (${hc})</label>`:''}<div class="board" id="boardGrid">${b.shots.map((s,i)=>{
    if(s.hidden&&!U.showHid)return '';const no=s.hidden?'':++vn;
    const k=KINDS[s.kind],m=moveOf(s.move),tab=U.ctab[s.id]||'frame',p=pos[s.id];
    const line=esc(s.script||s.title||s.gfx||'').replace(/\[[^\]]*\]/g,x=>`<mark>${x}</mark>`);
    return `<article class="card ${U.shot===s.id?'sel':''}${s.hidden?' hid':''}${p?' inc'+(p.i===1?' cfirst':'')+(p.i===p.n?' clast':''):''}" ${p?`style="--cc:${comboColor(p.k)}"`:''} draggable="true" data-s="${s.id}">
      <div class="top" style="background:${k.c}"><span class="badge">${s.roll==='G'?'GFX':s.roll+'-ROLL'}</span><span>${s.hidden?'HIDDEN':'#'+no}</span>${tagHTML(s)}${s.ask?'<span class="badge" style="background:var(--gold);color:#17120a">NOTE</span>':''}<span class="r">${s.dur}s</span></div>
      ${p?`<div class="cband"><span>COMBO ${esc(p.k)}</span><button class="cundo" data-cundo="${b.id}|${s.id}">Undo combo</button><span>${p.i} of ${p.n}</span></div>`:''}
      <div class="pic" data-open="${s.id}">${frameHTML(s,tab)}
        <div class="mt"><button class="${tab==='frame'?'on':''}" data-t="frame" data-id="${s.id}">Frame</button><button class="${tab==='hero'?'on':''}" data-t="hero" data-id="${s.id}" ${heroSrc(s)?'':'disabled'}>Hero</button><button class="${tab==='gimbal'?'on':''}" data-t="gimbal" data-id="${s.id}" ${gimbalSrc(s)?'':'disabled'}>Gimbal</button></div></div>
      <div class="body"><div class="line${s.script?'':' nm'}">${line}</div>
        <div class="kv">${s.lens?`<b>Lens</b><span>${esc(s.lens)}${s.fps?' · '+s.fps+' fps':''}</span>`:''}<b>Where</b><span>${esc(s.loc)}${s.pos&&!s.title?' · '+esc(s.pos):''}</span>${s.gfx?`<b>Graphic</b><span>${esc(s.gfx)}</span>`:''}${s.broll?`<b>B-roll</b><span>${esc(s.broll)}</span>`:''}</div>
        ${moveBig(m,s)}
        <div class="cfoot">${comboBtn(b.id,s)}<label class="capt hidt"><input type="checkbox" data-hid="${b.id}|${s.id}" ${s.hidden?'checked':''}>Hide</label><button class="delb" data-del="${b.id}|${s.id}">Delete</button></div></div>
      ${combosNext(b,i)?`<div class="link"><span class="lk" title="${esc(s.link||'Linked to next clip')}">${esc(s.combo)}</span></div>`:''}
    </article>`}).join('')}<button class="addcard" id="addS2">Add shot</button></div>`;
}

function listView(b){
  let t=0;const notes=b.shots.filter(s=>s.ask).length;
  const rows=b.shots.map((s,i)=>{const at=t;t+=+s.dur||0;const m=moveOf(s.move),k=KINDS[s.kind];
    return `<tr data-open="${s.id}" class="${U.shot===s.id?'on':''}"><td class="n">${i+1}</td><td class="n">${tc(at)}</td><td class="n">${s.dur}s</td><td><span class="lb" style="background:${k.c}">${esc(k.label)}</span>${tagHTML(s)}</td><td class="n">${s.roll==='G'?'GFX':s.roll}</td><td>${esc(s.loc)}</td><td class="w">${s.combo?`<span class="cmb">${esc(s.combo)}</span>`:''}${esc(s.title||s.script||s.gfx)}${s.title&&s.script?'<br><small>'+esc(s.script)+'</small>':''}</td><td>${esc(m.name)} ${dots(s.hard||1)}</td><td class="n">${esc(s.lens)}${s.fps?' · '+s.fps:''}</td><td class="n">${s.got?'✓':''}</td><td class="w ask">${esc(s.ask||'')}</td></tr>`}).join('');
  return `${legend(b)}${notes?`<div class="flag"><b>NOTES</b><span>${notes} ${notes===1?'note':'notes'} for Claude on this board. ${db?'Tell Claude to check your notes.':'Copy them and paste them to Claude.'}</span>${db?'':'<button class="btn" id="copyN" style="margin-left:auto">Copy notes</button>'}</div>`:''}<div class="tblwrap"><table class="sl"><thead><tr><th>#</th><th>At</th><th>Len</th><th>Label</th><th>Roll</th><th>Where</th><th>Shot</th><th>Move</th><th>Lens · fps</th><th>Got</th><th>Note for Claude</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/* ---------- shoot order ---------- */
const byLens=()=>U.groupBy==='lens';
const orderKey=b=>(b.group||b.family||b.id)+(byLens()?':lens':'');
function gearOf(s){return s.kind==='drone'||/drone/i.test(s.lens||'')?'Drone':(s.lens||'No lens set')}
function gearLabel(g){const n=parseInt(g,10);return !n?g:g+(n>=35?' · Detail lens':' · Wide lens')}
function gearRank(g){if(g==='Drone')return 1000;return parseInt(g,10)||2000}
function setupsFor(b,whole){
  const list=whole&&b.group?S.order.map(i=>S.boards[i]).filter(x=>x&&x.group===b.group):[b];
  const map={},lens=byLens();
  list.forEach(x=>x.shots.forEach(s=>{if(s.roll==='G')return;const g=gearOf(s),k=(x.family||x.id)+'|'+(lens?'lens:'+g:s.loc);(map[k]=map[k]||{key:k,board:x,gear:g,loc:lens?gearLabel(g):s.loc,shots:[]}).shots.push(s)}));
  const saved=(S.meta.order&&S.meta.order[orderKey(b)])||[];
  const keys=Object.keys(map).sort((p,q)=>{const a=saved.indexOf(p),c=saved.indexOf(q);return (a<0?99:a)-(c<0?99:c)||(lens?gearRank(map[p].gear)-gearRank(map[q].gear):0)});
  return keys.map(k=>map[k]);
}
const startOf=b=>(S.meta.starts&&S.meta.starts[b.group||b.family||b.id])||S.meta.start||'12:45';
function setupMin(su){const n=S.meta.mins&&S.meta.mins[su.key];if(n)return +n;return 15+su.shots.length*5+su.shots.filter(s=>s.hard>=3).length*10}
function shootRows(su){
  const rows=[...su.shots];
  if(byLens()){const seen=[];su.board.shots.forEach(s=>{if(!seen.includes(s.loc))seen.push(s.loc)});return rows.sort((p,q)=>seen.indexOf(p.loc)-seen.indexOf(q.loc))}
  return rows.sort((p,q)=>(p.combo?0:1)-(q.combo?0:1));
}
function shootRowHTML(su,s){const bb=su.board,m=moveOf(s.move),k=KINDS[s.kind];
  return `<div class="row ${s.got?'got':''}"><input type="checkbox" aria-label="Captured" data-got="${bb.id}|${s.id}" ${s.got?'checked':''}><div class="th" data-open2="${bb.id}|${s.id}">${frameHTML(s)}</div><button class="sn sblink" data-sb="${bb.id}|${s.id}" title="See this shot in the Storyboard">#${num(bb,s)}</button><span>${tagHTML(s)}${s.combo?`<span class="cmb">COMBO ${esc(s.combo)}</span>`:''}${esc(s.script||s.title||s.pos)}${needsNum(s)?' <span class="cmb" style="background:var(--warn)">NUMBER</span>':''}<small class="rowsub">${esc(k.label)}${byLens()?' · '+esc(s.loc):''}</small></span><span class="mv">${esc(m.name)} ${dots(s.hard||1)}</span><span class="tech">${esc(s.lens)}${s.fps?' · '+s.fps+'fps':''}${s.combo?'<br>roll '+(+s.dur+4)+'s':''}</span></div>`}
const COMBO_COLORS=['#d4a73a','#4fb3d9','#e0708a','#7bc47f','#b08cf0','#f39c4a'];
function comboColor(k){return COMBO_COLORS[Math.max(0,'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(k))%COMBO_COLORS.length]}
function comboBtn(bid,s){return `<label class="capt cmbt"><input type="checkbox" data-cmb="${bid}|${s.id}" ${s.combo?'checked':''}>Combo</label>`}
function newComboInfo(){return {name:'New combo',why:'',handoff:'Match speed and direction across the cut.',drill:['Rehearse the move','Shoot each clip with 2s of room at both ends','Check the handoff on the monitor'],checks:[]}}
function toggleCombo(b,id){const i=b.shots.findIndex(x=>x.id===id),s=b.shots[i];if(i<0)return;b.combos=b.combos||{};
  const p=b.shots[i-1],n=b.shots[i+1];
  if(s.combo){const k=s.combo;delete s.combo;delete s.link;if(p&&p.combo===k)delete p.link;
    if(p&&p.combo===k&&n&&n.combo===k){const nk=nextCombo(b);for(let j=i+1;j<b.shots.length&&b.shots[j].combo===k;j++)b.shots[j].combo=nk;b.combos[nk]=b.combos[nk]||newComboInfo()}
    return}
  const k=(p&&p.combo)||(n&&n.combo)||nextCombo(b);s.combo=k;
  if(p&&p.combo&&n&&n.combo&&n.combo!==k){const old=n.combo;for(let j=i+1;j<b.shots.length&&b.shots[j].combo===old;j++)b.shots[j].combo=k}
  b.combos[k]=b.combos[k]||newComboInfo()}
function undoCombo(b,id){const i=b.shots.findIndex(x=>x.id===id);if(i<0||!b.shots[i].combo)return;const k=b.shots[i].combo;let a=i,z=i;while(a>0&&b.shots[a-1].combo===k)a--;while(z<b.shots.length-1&&b.shots[z+1].combo===k)z++;for(let j=a;j<=z;j++){delete b.shots[j].combo;delete b.shots[j].link}if(a>0&&b.shots[a-1].combo)delete b.shots[a-1].link}
function moveBig(m,s){return `<div class="mvbig"><span class="mvn">${esc(m.name)}</span><span class="mvd">${dots(s.hard||1)}</span></div>`}
function shootCardHTML(su,s,n,pos){const bb=su.board,m=moveOf(s.move),k=KINDS[s.kind],tab=U.ctab[s.id]||'frame',p=pos[s.id];
  return `<article class="card shootcard ${s.got?'got':''} ${U.shot===s.id?'sel':''}" data-s="${s.id}">
    <div class="top" style="background:${k.c}"><span class="badge">${esc(k.label)}</span><span>Shoot ${n}</span>${tagHTML(s)}<span class="r">#${num(bb,s)} · ${s.dur}s</span></div>
    ${p?`<div class="cband"><span>COMBO ${esc(p.k)}</span><button class="cundo" data-cundo="${bb.id}|${s.id}">Undo combo</button><span>clip ${p.i} of ${p.n}</span></div>`:''}
    <div class="pic" data-open2="${bb.id}|${s.id}">${frameHTML(s,tab)}
      <div class="mt"><button class="${tab==='frame'?'on':''}" data-t="frame" data-id="${s.id}">Frame</button><button class="${tab==='hero'?'on':''}" data-t="hero" data-id="${s.id}" ${heroSrc(s)?'':'disabled'}>Hero</button><button class="${tab==='gimbal'?'on':''}" data-t="gimbal" data-id="${s.id}" ${gimbalSrc(s)?'':'disabled'}>Gimbal</button></div></div>
    <div class="body"><div class="line${s.script?'':' nm'}">${esc(s.script||s.title||s.pos||'')}</div>
      <div class="kv">${s.lens?`<b>Lens</b><span>${esc(s.lens)}${s.fps?' · '+s.fps+' fps':''}</span>`:''}<b>Where</b><span>${esc(s.loc)}</span>${s.combo?`<b>Roll</b><span>${+s.dur+4}s</span>`:''}</div>
      ${moveBig(m,s)}
      <div class="cfoot"><label class="capt"><input type="checkbox" data-got="${bb.id}|${s.id}" ${s.got?'checked':''}>Captured</label>${comboBtn(bb.id,s)}<button class="sblink" data-sb="${bb.id}|${s.id}">See in Storyboard #${num(bb,s)}</button></div></div>
  </article>`}
function shootView(b){
  const whole=U.scope==='whole'&&!!b.group,cards=U.shootLook==='cards';
  const sets=setupsFor(b,whole),all=sets.flatMap(x=>x.shots),got=all.filter(s=>s.got).length;
  let clock=toMin(startOf(b)),n=0;
  const totalMin=sets.reduce((a,x)=>a+setupMin(x),0);
  const pos={};new Set(sets.map(x=>x.board)).forEach(x=>comboRuns(x).forEach(r=>r.shots.forEach((s,i)=>pos[s.id]={k:r.key,i:i+1,n:r.shots.length})));
  return `${legend(b)}<div class="scope">${b.group?`<div class="seg2"><button data-sc="whole" class="${whole?'on':''}">Whole shoot day</button><button data-sc="one" class="${whole?'':'on'}">This video only</button></div>`:''}
    <span class="seglab">Group by</span><div class="seg2"><button data-gb="loc" class="${byLens()?'':'on'}">Location</button><button data-gb="lens" class="${byLens()?'on':''}">Lens</button></div>
    <span class="seglab">View</span><div class="seg2"><button data-sl="list" class="${cards?'':'on'}">List</button><button data-sl="cards" class="${cards?'on':''}">Storyboard</button></div>${cards?allTabs(b):''}
    <label>Start <input class="inp" type="time" id="startT" value="${esc(startOf(b))}"></label></div>
  <div class="scope"><span>${sets.length} setups · about ${Math.floor(totalMin/60)}h ${totalMin%60}m · ${all.length} shots, filmed out of story order</span></div>
  <div class="prog" aria-label="Captured"><i style="width:${all.length?got/all.length*100:0}%"></i></div>
  <div class="scope"><span>${got} of ${all.length} captured</span></div>
  ${byLens()&&sets.some(x=>x.shots.some(s=>s.combo))?'<div class="flag"><b>COMBOS</b><span>Combo clips are split across lenses in this view. Match height, direction and speed where the clips join.</span></div>':''}
  ${sets.length>1?`<div class="jump">${sets.map((su,i)=>`<button data-jump="${i}">${esc(su.gear&&byLens()?su.gear:su.loc)} <small>${su.shots.filter(s=>s.got).length}/${su.shots.length}</small></button>`).join('')}</div>`:''}
  ${sets.map((su,i)=>{const when=fromMin(clock);clock+=setupMin(su);const note=S.meta.notes&&S.meta.notes[su.key];
    const prev=sets[i-1],chg=su.board.outfit&&(!prev||prev.board.id!==su.board.id);
    const rows=shootRows(su);
    return `<section class="setup" id="setup${i}"><header><span class="clock">${when}</span><div><h3>${esc(su.loc)}</h3><div class="meta">${esc(su.board.name)}${su.board.outfit?' · '+esc(su.board.outfit):''}${chg&&i?' · outfit change':''} · ${su.shots.length} shots</div></div>
      <div class="ord"><label class="meta">Min <input class="inp" style="width:58px" type="number" min="5" step="5" data-min="${esc(su.key)}" value="${setupMin(su)}"></label><button data-up="${i}" aria-label="Move setup up">↑</button><button data-dn="${i}" aria-label="Move setup down">↓</button></div></header>
      ${note?`<div class="note">${esc(note)}</div>`:''}
      ${cards?`<div class="board shootboard">${rows.map(s=>shootCardHTML(su,s,++n,pos)).join('')}</div>`:rows.map(s=>shootRowHTML(su,s)).join('')}
    </section>`}).join('')}`;
}
const toMin=t=>{const [h,m]=String(t).split(':').map(Number);return (h||0)*60+(m||0)};
const fromMin=x=>{const h=Math.floor(x/60)%24,m=x%60,ap=h>=12?'PM':'AM';return ((h%12)||12)+':'+(m<10?'0':'')+m+' '+ap};

/* ---------- combos + hard moves ---------- */
function buildView(b){
  const runs=comboRuns(b);
  const seen={};b.shots.forEach(s=>{if(s.roll==='G')return;const m=moveOf(s.move);if(m.id===0)return;const e=seen[m.id]=seen[m.id]||{m,hard:0,n:[]};e.hard=Math.max(e.hard,s.hard||1);e.n.push(num(b,s))});
  const lad=Object.values(seen).sort((p,q)=>p.hard-q.hard||p.n[0]-q.n[0]);
  const cs=runs.map(r=>{const c=(b.combos||{})[r.key]||{name:'Combo '+r.key,drill:[],checks:[]};
    return `<section class="combo"><h3>Combo ${esc(r.key)}: ${esc(c.name)}</h3><p>${esc(c.why||'')}</p>
    <div class="chain">${r.shots.map((s,i)=>`<div class="cc" data-open="${s.id}">${frameHTML(s)}<small>#${num(b,s)} · ${s.dur}s on screen<br>roll ${+s.dur+4}s · ${s.fps} fps</small></div>${i<r.shots.length-1?`<div class="jn">${esc(s.link||'Linked')}</div>`:''}`).join('')}</div>
    <div class="cols"><div><div class="sect" style="margin-top:0">The handoff</div><p>${esc(c.handoff||'')}</p><p>Roll at least 2s before and 2s after what the edit needs, so the ramp has room.</p></div>
    <div class="drill"><div class="sect" style="margin-top:0">Build up to it</div>${(c.drill||[]).map((d,i)=>`<label><input type="checkbox" data-dr="${esc(r.key)}|${i}" ${(c.checks||[]).includes(i)?'checked':''}><span>${esc(d)}</span></label>`).join('')}</div></div></section>`}).join('');
  return `${runs.length?cs:'<div class="empty">No combos on this board yet. Open a shot and link it to the next clip.</div>'}
  <div class="sect">Practice ladder: easiest move to hardest</div>
  <div class="ladder">${lad.map(e=>`<div class="lad">${e.m.op||e.m.res?`<video src="${esc(e.m.op||e.m.res)}" muted loop playsinline preload="metadata" data-hv></video>`:'<div class="novid"></div>'}<div><h4>${esc(e.m.name)} ${dots(e.hard)}</h4><p>Shot ${e.n.join(', ')}. ${esc(e.m.mode)} mode, ${esc(e.m.lens)}.</p><p>${esc(e.m.mistake)}</p></div></div>`).join('')}</div>`;
}

/* ---------- library pages ---------- */
function renderMoves(){
  $('main').innerHTML=`<div class="head"><div><h1>Gimbal moves</h1><div class="sub">Every gimbal and drone move. Hover a clip to play it. Tap a clip to see it full screen.</div></div></div>
  <div class="movegrid">${MOVES.filter(m=>m.id!==0&&m.id!==14).map(m=>`<article class="move"><div class="vids"><div>${m.res?`<video src="${esc(m.res)}#t=0.1" muted loop playsinline preload="metadata" data-hv data-big></video>`:'<em>No clip yet</em>'}<span>RESULT</span></div><div>${m.op?`<video src="${esc(m.op)}#t=0.1" muted loop playsinline preload="metadata" data-hv data-big></video>`:'<em>No operator clip yet</em>'}<span>HOW TO</span></div></div>
  <div class="tx"><h3>${esc(m.name)} ${dots(m.hard)}</h3><p class="used">${tourUse(m)}</p><p>${esc(m.mode)} mode · ${esc(m.lens)}</p><p><b>Technique.</b> ${esc(m.tech)}</p><p><b>Mistake.</b> ${esc(m.mistake)}</p><p><b>Tip.</b> ${esc(m.tip)}</p></div></article>`).join('')}</div>`;
  hover();
  $('main').querySelectorAll('video[data-big]').forEach(v=>{v.style.cursor='zoom-in';v.onclick=()=>{v.loop=true;const p=v.play();if(p&&p.catch)p.catch(()=>{});
    if(v.webkitEnterFullscreen)try{v.webkitEnterFullscreen();return}catch(e){}if(v.requestFullscreen)v.requestFullscreen().catch(()=>{});else if(v.webkitRequestFullscreen)v.webkitRequestFullscreen()}});
}
const tagHTML=s=>s.extra?'<span class="xtra">EXTRA</span>':s.swapped?'<span class="xtra">SWAP</span>':'';
const tourUse=m=>{const t=S.boards.tour;if(!t)return '';const n=t.shots.filter(s=>s.move==m.id).length,x=t.shots.filter(s=>s.move==m.id&&s.extra).length;return n?`On the Standard Virtual Tour: ${n} ${n===1?'shot':'shots'}${x?' ('+x+' extra)':''}`:'Not on the Standard Virtual Tour yet'};
function renderCat(){
  const c=CATEGORIES.find(x=>x.id===U.cat),ids=S.order.filter(i=>S.boards[i]&&S.boards[i].cat===c.id&&areaOf(S.boards[i])==='templates');
  $('main').innerHTML=`<div class="head"><div><h1>${esc(c.name)}</h1><div class="sub">Templates · ${ids.length} ${ids.length===1?'board':'boards'}</div></div><div class="acts"><button class="btn pri" id="newB">New board</button></div></div>
  ${U.newF?newForm({cat:c.id}):''}
  ${ids.length?`<div class="sheet" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:18px">${ids.map(i=>{const b=S.boards[i];return `<button class="mini" data-b2="${i}">${frameHTML(b.shots[0]||{f:{}})}<div style="padding-top:7px;font-weight:700">${esc(b.name)}</div><div style="font-size:12px;color:var(--mut)">${b.shots.length} shots · ${fmt(total(b))}s${b.family&&b.linked!==false&&siblings(b).length?' · linked':''}</div></button>`}).join('')}</div>`:`<div class="empty">No templates here yet. Tap New board to start one.</div>`}`;
  $('main').querySelectorAll('[data-b2]').forEach(e=>e.onclick=()=>{U.sec='board';U.board=e.dataset.b2;render()});
  $('newB').onclick=()=>{U.newF=!U.newF;renderCat();const i=$('fName');if(i)i.focus()};
  wireNewForm({cat:c.id},renderCat);
}
function newShot(){return {id:'s'+Math.random().toString(36).slice(2,9),roll:'B',kind:'wide',beat:'New',loc:'Location',pos:'',dur:2,move:1,hard:1,lens:'24mm',fps:30,script:'',gfx:'',broll:'',f:{scene:'living'}}}

/* ---------- Script tab + teleprompter (Nov 8) ---------- */
const spoken=s=>s.roll==='A'||s.kind==='agent';
function shotLines(b){return b.shots.filter(s=>!s.hidden&&(s.script||'').trim())}
function scriptView(b){
  const lines=shotLines(b),onScr=b.shots.filter(s=>!s.hidden&&!spoken(s)&&/Text:|Label:|Big serif|Comment pill/i.test(s.gfx||''));
  const say=lines.filter(spoken),vo=lines.filter(s=>!spoken(s));
  const row=(s,who)=>`<div class="scl"><div class="scm"><b>#${num(b,s)}</b> ${esc(s.title||s.pos||'')} · ${who}</div><div class="sct">${esc(s.script)}</div></div>`;
  const txt=s=>(s.gfx||'').split(/(?<=\.)\s+/).filter(x=>/Text:|Label:|Big serif|Comment pill/i.test(x)).join(' ');
  const scripts=b.scripts||[];
  return `<div class="scv">
  <div class="scbox"><div class="schd"><h2>Reel lines (from the shots)</h2>${say.length||vo.length?`<button class="btn pri" data-tp="shots">▶ Teleprompter</button>`:''}</div>
  ${say.length||vo.length?say.map(s=>row(s,'<span class="who you">You on camera</span>')).join('')+vo.map(s=>row(s,'<span class="who vo">Voiceover</span>')).join(''):`<p class="scempty">No spoken lines yet. Open a shot and type its line in "Script".</p>`}
  ${onScr.length?`<details class="scos"><summary>On-screen text (${onScr.length})</summary>${onScr.map(s=>`<div class="scl small"><div class="scm"><b>#${num(b,s)}</b> ${esc(s.title||'')}</div><div class="sct sm">${esc(txt(s)||s.gfx)}</div></div>`).join('')}</details>`:''}</div>
  ${scripts.map((x,i)=>`<div class="scbox"><div class="schd">${U.sedit===x.id?`<input class="scname" data-sname="${i}" value="${esc(x.name)}">`:`<h2>${esc(x.name)}</h2>`}<div class="scacts"><button class="btn pri" data-tp="${i}">▶ Teleprompter</button><button class="btn" data-sedit="${x.id}">${U.sedit===x.id?'Done':'Edit'}</button>${U.sedit===x.id?`<button class="btn" data-sdel="${i}">Delete</button>`:''}</div></div>
    ${U.sedit===x.id?`<textarea class="scedit" data-stext="${i}">${esc(x.text)}</textarea>`:`<div class="sct pre">${esc(x.text)}</div>`}</div>`).join('')}
  <button class="btn" id="sAdd">+ Add a script</button></div>`}
function tpText(b,k){if(k==='shots')return shotLines(b).filter(spoken).concat(shotLines(b).filter(s=>!spoken(s))).map(s=>`— shot ${num(b,s)} · ${spoken(s)?'on camera':'voiceover'} —\n${s.script}`).join('\n\n');const x=(b.scripts||[])[+k];return x?x.text:''}
function teleprompter(text,title){
  const P=Object.assign({speed:+(localStorage.getItem('tp.speed')||40),size:+(localStorage.getItem('tp.size')||56),mirror:false,run:false},{});
  const o=document.createElement('div');o.className='tp';o.innerHTML=`<div class="tpbar"><b>${esc(title)}</b><span class="tpc"><button data-k="slow">Slower</button><span class="tpv" id="tpSp"></span><button data-k="fast">Faster</button><button data-k="small">A−</button><button data-k="big">A+</button><button data-k="mirror">Mirror</button><button data-k="top">Restart</button><button data-k="close">Close</button></span></div><div class="tpscroll"><div class="tpline"></div><div class="tptext"></div><div class="tpend">— end —</div></div><div class="tphint">Tap the text to start / pause</div>`;
  document.body.appendChild(o);document.body.style.overflow='hidden';
  const sc=o.querySelector('.tpscroll'),tx=o.querySelector('.tptext'),sp=o.querySelector('#tpSp'),hint=o.querySelector('.tphint');tx.textContent=text;
  const apply=()=>{tx.style.fontSize=P.size+'px';sp.textContent='Speed '+P.speed;o.classList.toggle('mir',P.mirror);try{localStorage.setItem('tp.speed',P.speed);localStorage.setItem('tp.size',P.size)}catch(e){}};apply();
  let last=0,acc=0,raf=0;const step=t=>{if(!P.run)return;if(last){acc+=(t-last)/1000*P.speed;const n=Math.floor(acc);if(n){sc.scrollTop+=n;acc-=n}}last=t;if(sc.scrollTop+sc.clientHeight>=sc.scrollHeight-2){P.run=false;hint.textContent='End. Tap Restart or Close';return}raf=requestAnimationFrame(step)};
  const toggle=()=>{P.run=!P.run;last=0;hint.textContent=P.run?'Tap to pause':'Paused · tap to continue';if(P.run)raf=requestAnimationFrame(step)};
  sc.onclick=toggle;
  const close=()=>{P.run=false;cancelAnimationFrame(raf);o.remove();document.body.style.overflow='';removeEventListener('keydown',key)};
  const key=e=>{if(e.key==='Escape')close();if(e.key===' '){e.preventDefault();toggle()}if(e.key==='ArrowUp'){P.speed=Math.min(200,P.speed+10);apply()}if(e.key==='ArrowDown'){P.speed=Math.max(10,P.speed-10);apply()}};addEventListener('keydown',key);
  o.querySelectorAll('[data-k]').forEach(bn=>bn.onclick=e=>{e.stopPropagation();const k=bn.dataset.k;
    if(k==='slow')P.speed=Math.max(10,P.speed-10);if(k==='fast')P.speed=Math.min(200,P.speed+10);if(k==='small')P.size=Math.max(28,P.size-6);if(k==='big')P.size=Math.min(110,P.size+6);
    if(k==='mirror')P.mirror=!P.mirror;if(k==='top'){sc.scrollTop=0;P.run=false;hint.textContent='Tap the text to start'}if(k==='close')return close();apply()});
}
function wireScript(b){const m=$('main');
  m.querySelectorAll('[data-tp]').forEach(e=>e.onclick=()=>{const k=e.dataset.tp;teleprompter(tpText(b,k),k==='shots'?b.name+' · reel lines':(b.scripts[+k]||{}).name||'Script')});
  m.querySelectorAll('[data-sedit]').forEach(e=>e.onclick=()=>{U.sedit=U.sedit===e.dataset.sedit?null:e.dataset.sedit;renderMain()});
  m.querySelectorAll('[data-stext]').forEach(e=>e.oninput=()=>{b.scripts[+e.dataset.stext].text=e.value;touch(b)});
  m.querySelectorAll('[data-sname]').forEach(e=>e.oninput=()=>{b.scripts[+e.dataset.sname].name=e.value;touch(b)});
  m.querySelectorAll('[data-sdel]').forEach(e=>e.onclick=()=>{if(!e.classList.contains('armed')){e.classList.add('armed');e.textContent='Tap again to delete';setTimeout(()=>{if(e.isConnected){e.classList.remove('armed');e.textContent='Delete'}},3000);return}b.scripts.splice(+e.dataset.sdel,1);U.sedit=null;touch(b);renderMain()});
  const a=$('sAdd');if(a)a.onclick=()=>{b.scripts=b.scripts||[];const id='sc'+Date.now().toString(36);b.scripts.push({id,name:'New script',text:''});U.sedit=id;touch(b);renderMain();const t=m.querySelector('.scedit');if(t)t.focus()};
}

/* ---------- wiring ---------- */
function hover(){document.querySelectorAll('video[data-hv]').forEach(v=>{v.onmouseenter=()=>v.play().catch(()=>{});v.onmouseleave=()=>v.pause();v.onclick=()=>v.paused?v.play().catch(()=>{}):v.pause()})}
function open(id){U.shot=id;U.itab='frame';renderInsp();document.querySelectorAll('.sel').forEach(e=>e.classList.remove('sel'));document.querySelectorAll(`[data-s="${id}"]`).forEach(e=>e.classList.add('sel'))}
function wireMain(b){
  const m=$('main');
  m.querySelectorAll('[data-v]').forEach(e=>e.onclick=()=>{U.view=e.dataset.v;renderMain();lsWrite()});
  const tu=$('tplU');if(tu)tu.onclick=()=>{if(!tu.classList.contains('armed')){tu.classList.add('armed');tu.innerHTML='Tap again to update';setTimeout(()=>{if(tu.isConnected)render()},3500);return}const n=applyTpl(b);render();toast(n?`Updated ${n} ${n===1?'shot':'shots'}. Your combos, hidden shots and order are kept.`:'Already up to date')};
  const bn=$('bName');if(bn)bn.onclick=()=>{if(bn.querySelector('input'))return;const inp=document.createElement('input');inp.value=b.name;inp.style.cssText='font:inherit;width:100%;max-width:640px;padding:2px 6px;border:2px solid var(--acc,#4d9be6);border-radius:6px;background:transparent;color:inherit';bn.innerHTML='';bn.appendChild(inp);inp.focus();inp.select();let done=false;const save=ok=>{if(done)return;done=true;const v=inp.value.trim();if(ok&&v&&v!==b.name){b.name=v;touch(b);toast('Board renamed')}render()};inp.onkeydown=e=>{if(e.key==='Enter')save(true);if(e.key==='Escape')save(false)};inp.onblur=()=>save(true)};
  $('dupB').onclick=()=>{const id='b'+Date.now().toString(36),n=clone(b);n.id=id;n.name=b.name+' copy';delete n.group;delete n.family;delete n.linked;delete n.version;n.from=b.from||b.id;n.shots.forEach(s=>{s.lid=s.lid||s.id;s.got=false;s.id='s'+Math.random().toString(36).slice(2,9)});S.boards[id]=n;S.order.push(id);U.board=id;touch(n);render();toast('Board duplicated')};
  const add=(s0)=>{const s=s0||newShot();const ai=b.shots.findIndex(x=>x.id===U.shot),anc=ai>=0?b.shots[ai]:null;
    if(ai>=0)b.shots.splice(ai+1,0,s);else b.shots.push(s);
    if(b.family){s.lid=s.id;if(b.linked!==false)siblings(b).forEach(x=>{if(x.linked===false)return;const c=clone(s);c.id='s'+Math.random().toString(36).slice(2,9);const xi=anc?x.shots.findIndex(y=>y.lid===anc.lid):-1;if(xi>=0)x.shots.splice(xi+1,0,c);else x.shots.push(c);touch(x)})}
    touch(b);U.shot=s.id;renderMain();open(s.id);return s};
  $('addV').onclick=()=>{U.addV=!U.addV;renderMain()};
  const vf=$('verForm');if(vf){vf.onsubmit=e=>{e.preventDefault();createVersion(b,$('vName').value.trim()||'Version',$('vShape').value,$('vSrc')?$('vSrc').value:'')};$('vCancel').onclick=()=>{U.addV=false;renderMain()}}
  m.querySelectorAll('[data-ver]').forEach(e=>e.onclick=()=>{U.board=e.dataset.ver;U.shot=null;U.sbs=false;render()});
  const sb=$('sbsT');if(sb)sb.onclick=()=>{U.sbs=!U.sbs;U.shot=null;render()};
  m.querySelectorAll('[data-sbo]').forEach(e=>e.onclick=()=>{const [bi,si]=e.dataset.sbo.split('|');U.board=bi;U.sbs=false;U.view='story';render();open(si);const c=document.querySelector(`.card[data-s="${si}"]`);if(c)c.scrollIntoView({block:'center'})});
  const rv=$('rmV');if(rv)rv.onclick=()=>{if(!rv.classList.contains('armed')){const lab=rv.textContent;rv.classList.add('armed');rv.textContent=!folderOf(b)?'Tap again to delete '+b.name:siblings(b).length?'Tap again to remove '+verName(b):'Tap again: removes the whole folder';setTimeout(()=>{if(rv.isConnected){rv.classList.remove('armed');rv.textContent=lab}},3500);return}removeBoard(b)};
  const lt=$('linkT');if(lt)lt.onclick=()=>{b.linked=b.linked===false;touch(b);renderMain()};
  const pickOpen=()=>{U.addPick=!U.addPick;renderMain();if(U.addPick){const q=$('pickQ');if(q){q.focus();$('pick').scrollIntoView({block:'nearest'})}}};$('addS').onclick=pickOpen;const a2=$('addS2');if(a2)a2.onclick=()=>{U.addPick=true;renderMain();window.scrollTo({top:0,behavior:'smooth'});const q=$('pickQ');if(q)q.focus()};
  wirePick(b,add);
  m.querySelectorAll('.tile,.mini[data-s]').forEach(e=>e.onclick=()=>open(e.dataset.s));
  m.querySelectorAll('[data-open]').forEach(e=>e.onclick=()=>open(e.dataset.open));
  m.querySelectorAll('[data-t]').forEach(e=>e.onclick=ev=>{ev.stopPropagation();U.ctab[e.dataset.id]=e.dataset.t;U.allTab[B().id]='';renderMain()});
  m.querySelectorAll('[data-all]').forEach(e=>e.onclick=()=>{const b=B(),k=e.dataset.all;U.allTab[b.id]=k;b.shots.forEach(s=>{U.ctab[s.id]=(k==='hero'&&!heroSrc(s))||(k==='gimbal'&&!gimbalSrc(s))?'frame':k});renderMain()});
  m.querySelectorAll('.card[draggable],.mini[draggable]').forEach(c=>{
    c.addEventListener('dragstart',ev=>{ev.dataTransfer.setData('text/plain',c.dataset.s);c.classList.add('drag')});
    c.addEventListener('dragend',()=>c.classList.remove('drag'));
    c.addEventListener('dragover',ev=>{ev.preventDefault();c.classList.add('over')});
    c.addEventListener('dragleave',()=>c.classList.remove('over'));
    c.addEventListener('drop',ev=>{ev.preventDefault();c.classList.remove('over');const from=ev.dataTransfer.getData('text/plain'),to=c.dataset.s;if(from===to)return;if(moveGroup(b,from,to)){touch(b);renderMain()}});
  });
  m.querySelectorAll('[data-sc]').forEach(e=>e.onclick=()=>{U.scope=e.dataset.sc;renderMain()});
  m.querySelectorAll('[data-gb]').forEach(e=>e.onclick=()=>{U.groupBy=e.dataset.gb;saveShootPrefs();renderMain()});
  m.querySelectorAll('[data-sl]').forEach(e=>e.onclick=()=>{U.shootLook=e.dataset.sl;saveShootPrefs();renderMain()});
  m.querySelectorAll('[data-sb]').forEach(e=>e.onclick=()=>{const [bi,si]=e.dataset.sb.split('|');U.board=bi;U.view='story';U.shot=si;renderMain();renderRail();const c=document.querySelector(`.card[data-s="${si}"]`);if(c){c.classList.add('sel');c.scrollIntoView({block:'center'})}});
  m.querySelectorAll('[data-jump]').forEach(e=>e.onclick=()=>{const t=$('setup'+e.dataset.jump);if(t)t.scrollIntoView({block:'start'})});
  const st=$('startT');if(st)st.onchange=()=>{(S.meta.starts=S.meta.starts||{})[b.group||b.family||b.id]=st.value;touchMeta();renderMain()};
  m.querySelectorAll('[data-hid]').forEach(e=>{e.closest('label').onclick=ev=>ev.stopPropagation();e.onchange=()=>{const [bi,si]=e.dataset.hid.split('|'),x=S.boards[bi],s=shotById(x,si);if(e.checked)s.hidden=true;else delete s.hidden;touch(x);render()}});
  m.querySelectorAll('[data-del]').forEach(e=>e.onclick=ev=>{ev.stopPropagation();if(!e.classList.contains('armed')){e.classList.add('armed');e.textContent='Tap again to delete';setTimeout(()=>{if(e.isConnected){e.classList.remove('armed');e.textContent='Delete'}},3000);return}const [bi,si]=e.dataset.del.split('|'),x=S.boards[bi],j=x.shots.findIndex(y=>y.id===si);if(j<0)return;x.shots.splice(j,1);if(U.shot===si)U.shot=null;touch(x);render()});
  m.querySelectorAll('details.lgd').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)m.querySelectorAll('details.lgd[open]').forEach(o=>{if(o!==d)o.open=false})}));
  m.querySelectorAll('.ddi[data-open]').forEach(e=>e.onclick=ev=>{ev.stopPropagation();e.closest('details').open=false;open(e.dataset.open)});
  const sh=$('showHid');if(sh)sh.onchange=()=>{U.showHid=sh.checked;renderMain()};
  m.querySelectorAll('[data-cundo]').forEach(e=>e.onclick=ev=>{ev.stopPropagation();ev.preventDefault();const [bi,si]=e.dataset.cundo.split('|'),x=S.boards[bi];undoCombo(x,si);touch(x);renderMain()});
  m.querySelectorAll('[data-cmb]').forEach(e=>{e.closest('label').onclick=ev=>ev.stopPropagation();e.onchange=()=>{const [bi,si]=e.dataset.cmb.split('|'),x=S.boards[bi];toggleCombo(x,si);touch(x);renderMain()}});
  m.querySelectorAll('[data-got]').forEach(e=>e.onchange=()=>{const [bi,si]=e.dataset.got.split('|'),x=S.boards[bi],s=shotById(x,si);s.got=e.checked;touch(x);renderMain()});
  m.querySelectorAll('[data-open2]').forEach(e=>e.onclick=()=>{const [bi,si]=e.dataset.open2.split('|');U.board=bi;renderMain();renderRail();open(si)});
  m.querySelectorAll('[data-min]').forEach(e=>e.onchange=()=>{(S.meta.mins=S.meta.mins||{})[e.dataset.min]=+e.value;touchMeta();renderMain()});
  const mv=(i,d)=>{const sets=setupsFor(b,U.scope==='whole'&&!!b.group).map(x=>x.key);const j=i+d;if(j<0||j>=sets.length)return;[sets[i],sets[j]]=[sets[j],sets[i]];(S.meta.order=S.meta.order||{})[orderKey(b)]=sets;touchMeta();renderMain()};
  m.querySelectorAll('[data-up]').forEach(e=>e.onclick=()=>mv(+e.dataset.up,-1));
  m.querySelectorAll('[data-dn]').forEach(e=>e.onclick=()=>mv(+e.dataset.dn,1));
  m.querySelectorAll('[data-dr]').forEach(e=>e.onchange=()=>{const [k,i]=e.dataset.dr.split('|'),c=b.combos[k];c.checks=c.checks||[];const n=+i;c.checks=e.checked?[...c.checks,n]:c.checks.filter(x=>x!==n);touch(b)});
  const cn=$('copyN');if(cn)cn.onclick=()=>{const t=b.name+'\n'+b.shots.filter(s=>s.ask).map(s=>'Shot '+num(b,s)+' ('+(s.title||s.script||'').slice(0,50)+'): '+s.ask).join('\n');navigator.clipboard.writeText(t).then(()=>toast('Notes copied'),()=>toast('Could not copy'))};
  hover();
}

/* ---------- inspector: the three-in-one block ---------- */
function renderInsp(){
  const el=$('insp');
  if(U.sec!=='board'||!U.shot){el.hidden=true;return}
  const b=B(),s=shotById(b,U.shot);if(!s){el.hidden=true;return}
  const i=b.shots.indexOf(s),m=moveOf(s.move),tab=U.itab;
  const opt=(o,v)=>o.map(([k,n])=>`<option value="${esc(k)}" ${String(k)===String(v)?'selected':''}>${esc(n)}</option>`).join('');
  const side=tab==='gimbal'?`<b>${esc(m.name)}</b><p>${esc(m.tech)}</p><p>${esc(m.mistake)}</p><em>TIP</em><p>${esc(m.tip)}</p>`
    :tab==='hero'?`<b>Hero moment</b><p>${s.media&&s.media.hero?'Your clip for this shot.':'Sample of this move from your library. Upload the real money moment when you have it.'}</p>`
    :`<b>${esc(KINDS[s.kind].label)} · ${s.roll==='G'?'graphic':s.roll+'-roll'}</b><p>${esc(s.loc)}${s.pos?' · '+esc(s.pos):''}</p><p>${esc(m.name)}</p>${s.combo?`<em>COMBO ${esc(s.combo)} · ROLL ${+s.dur+4}S</em>`:''}`;
  el.hidden=false;
  el.innerHTML=`<div class="ih"><h2>Shot ${i+1}</h2><button class="x" id="prevS" aria-label="Previous shot">←</button><button class="x" style="margin-left:0" id="nextS" aria-label="Next shot">→</button><button class="x" id="closeI">Close</button></div>
  <div class="vtabs"><button class="${tab==='frame'?'on':''}" data-it="frame">Frame</button><button class="${tab==='hero'?'on':''}" data-it="hero" ${heroSrc(s)?'':'disabled'}>Hero moment</button><button class="${tab==='gimbal'?'on':''}" data-it="gimbal" ${gimbalSrc(s)?'':'disabled'}>Gimbal move</button></div>
  <div class="three"><div>${frameHTML(s,tab)}</div><div class="side">${side}</div></div>
  ${assets?`<div class="up">${['frame','hero','gimbal'].map(k=>`<label class="btn">Upload ${k}<input type="file" accept="${k==='frame'?'image/*':'video/*,image/gif'}" data-up2="${k}"></label>`).join('')}</div>`:''}
  <label class="fld note4"><span>Note for Claude</span><textarea data-f="ask" placeholder="Type a change for this shot, then tell Claude to check your notes.">${esc(s.ask)}</textarea></label>
  <label class="fld"><span>Script line</span><textarea data-f="script">${esc(s.script)}</textarea></label>
  <label class="fld"><span>Graphic overlay</span><textarea data-f="gfx">${esc(s.gfx)}</textarea></label>
  <label class="fld"><span>B-roll over top</span><input data-f="broll" value="${esc(s.broll)}"></label>
  <div class="fg2"><label class="fld"><span>Location</span><input data-f="loc" value="${esc(s.loc)}"></label><label class="fld"><span>Position</span><input data-f="pos" value="${esc(s.pos)}"></label></div>
  <div class="fg3"><label class="fld"><span>Roll</span><select data-f="roll">${opt([['A','A-roll'],['B','B-roll'],['G','Graphic']],s.roll)}</select></label><label class="fld"><span>Label</span><select data-f="kind">${opt(Object.entries(KINDS).map(([k,v])=>[k,v.label]),s.kind)}</select></label><label class="fld"><span>Seconds</span><input type="number" min=".5" step=".5" data-f="dur" value="${s.dur}"></label></div>
  <div class="fg3"><label class="fld"><span>Move</span><select data-f="move">${opt(MOVES.map(x=>[x.id,x.name]),s.move)}</select></label><label class="fld"><span>Difficulty</span><select data-f="hard">${opt([[1,'Easy'],[2,'Medium'],[3,'Hard']],s.hard||1)}</select></label><label class="fld"><span>Lens / fps</span><input data-f="lens" value="${esc(s.lens)}"></label></div>
  <div class="fg2"><label class="fld"><span>Frame rate</span><input data-f="fps" value="${esc(s.fps)}"></label><label class="fld"><span>Beat</span><input data-f="beat" value="${esc(s.beat)}"></label></div>
  <label class="fld"><span>Notes</span><textarea data-f="notes">${esc(s.notes)}</textarea></label>
  ${b.family?`<label class="solo"><input type="checkbox" id="soloS" ${s.solo?'checked':''}> Change this shot only on this version</label>`:''}
  <div class="up"><button class="btn" id="linkN">${combosNext(b,i)?'Unlink from next clip':'Link to next clip (combo)'}</button><button class="btn" id="dupS">Duplicate</button><button class="btn" id="delS">Delete</button></div>`;
  $('closeI').onclick=()=>{U.shot=null;renderInsp();document.querySelectorAll('.sel').forEach(e=>e.classList.remove('sel'))};
  $('prevS').onclick=()=>{const p=b.shots[i-1];if(p)open(p.id)};
  $('nextS').onclick=()=>{const n=b.shots[i+1];if(n)open(n.id)};
  el.querySelectorAll('[data-it]').forEach(e=>e.onclick=()=>{U.itab=e.dataset.it;renderInsp()});
  let t;
  el.querySelectorAll('[data-f]').forEach(e=>{e.oninput=()=>{const k=e.dataset.f;s[k]=e.type==='number'||k==='move'||k==='hard'?+e.value:e.value;syncShot(b,s,k);touch(b);clearTimeout(t);t=setTimeout(renderMain,250)};if(e.tagName==='SELECT')e.onchange=()=>{e.oninput();renderInsp()}});
  el.querySelectorAll('[data-up2]').forEach(e=>e.onchange=async()=>{const f=e.files[0];if(!f)return;toast('Uploading…');try{const r=await assets.upload(f);s.media=s.media||{};s.media[e.dataset.up2]={id:r.id,url:r.url};touch(b);render();toast('Uploaded')}catch(x){toast('Upload failed. Files must be under 20 MB.')}});
  const so=$('soloS');if(so)so.onchange=()=>{s.solo=so.checked;touch(b)};
  $('linkN').onclick=()=>{const n=b.shots[i+1];if(!n)return toast('This is the last shot');if(combosNext(b,i)){delete n.combo;delete s.link}else{const k=s.combo||nextCombo(b);s.combo=k;n.combo=k;b.combos[k]=b.combos[k]||{name:'New combo',why:'',handoff:'Match speed and direction across the cut.',drill:['Rehearse the move','Shoot each clip with 2s of room at both ends','Check the handoff on the monitor'],checks:[]}}touch(b);render()};
  $('dupS').onclick=()=>{const c=clone(s);c.id='s'+Math.random().toString(36).slice(2,9);c.got=false;b.shots.splice(i+1,0,c);touch(b);renderMain();open(c.id)};
  let armed=false;$('delS').onclick=e=>{if(!armed){armed=true;e.target.textContent='Tap again to delete';return}b.shots.splice(i,1);U.shot=null;touch(b);render()};
}
/* ---------- preset shot picker (Add shot) ---------- */
const PRESETS=(()=>{const seen=new Set(),out=[];if(typeof SEED_BOARDS==='undefined')return out;
  ['tour','reel','condo'].forEach(id=>{const t=SEED_BOARDS.find(x=>x.id===id);if(!t)return;t.shots.forEach(s=>{if(s.hidden)return;const name=(s.title||s.pos||'').trim(),k=name.toLowerCase();if(!name||seen.has(k))return;seen.add(k);out.push({key:'p'+out.length,name,from:t.name,s:clone(s)})})});
  if(typeof PRESET_EXTRA!=='undefined')PRESET_EXTRA.forEach(x=>{if(seen.has(x.name.toLowerCase()))return;seen.add(x.name.toLowerCase());out.push({key:'p'+out.length,name:x.name,from:x.from,s:clone(x.s)})});return out})();
function presetArea(s){if(s.kind==='drone')return 'Drone';if(['twilight','staging','aieffect'].includes(s.kind))return 'Specialty';if(s.kind==='agent')return 'Agent';const l=(s.loc||'').toLowerCase(),n=(s.title||s.pos||'').toLowerCase();
  if(/kitchen|rapid push|hurley|island|faucet/.test(n))return 'Kitchen';if(/dining/.test(n))return 'Dining';if(/family|living|fireplace|feature wall/.test(n))return 'Family & living';
  if(/master|en ?suite|bedroom|bath|vanity|closet/.test(n))return 'Bedrooms & baths';if(/basement|rec|bar|gym|theat/.test(n)||/basement|lower/.test(l))return 'Basement';
  if(/exterior|outside|backyard|yard|front|porch|garage|pool/.test(l+' '+n))return 'Exterior';if(/foyer|entrance|stair|hall/.test(n))return 'Foyer & stairs';if(/suite/.test(l))return 'Bedrooms & baths';if(/main/.test(l))return 'Main floor';return 'Other'}
const PICK_ORDER=['Drone','Exterior','Foyer & stairs','Kitchen','Dining','Family & living','Main floor','Bedrooms & baths','Basement','Other','Specialty','Agent'];
function pickHTML(b){const q=(U.pickQ||'').toLowerCase().trim(),groups={};
  PRESETS.forEach(p=>{const m=moveOf(p.s.move),hay=(p.name+' '+m.name+' '+(p.s.loc||'')+' '+(p.s.lens||'')+' '+KINDS[p.s.kind].label).toLowerCase();if(q&&!q.split(/\s+/).every(w=>hay.includes(w)))return;(groups[presetArea(p.s)]=groups[presetArea(p.s)]||[]).push(p)});
  const ai=b.shots.findIndex(x=>x.id===U.shot),where=ai>=0?`after shot #${ai+1} (${esc(b.shots[ai].title||b.shots[ai].pos||'selected')})`:'at the end';
  const item=p=>{const s=p.s,m=moveOf(s.move),n=b.shots.filter(x=>(x.title||x.pos)===p.name).length;return `<button class="pki" data-pk="${p.key}" title="Add ${esc(p.name)}"><span class="pkbar" style="background:${KINDS[s.kind].c}"></span>${s.f&&s.f.img?`<img src="${esc(s.f.img)}" alt="" loading="lazy">`:'<span class="pknoimg"></span>'}<span class="pkt"><b>${esc(p.name)}</b><small>${esc(m.name)} · ${esc(s.lens||'')} · ${s.dur}s${/Virtual Tour/.test(p.from)?'':' · '+esc(p.from.replace(/^Standard /,''))}</small>${n?`<em>on this board ×${n}</em>`:''}</span></button>`};
  const gs=PICK_ORDER.filter(g=>groups[g]).map(g=>`<details class="pg" data-pg="${g}" ${q||(U.pickGrp||{})[g]?'open':''}><summary>${esc(g)} <small>${groups[g].length}</small><span class="car">▾</span></summary><div class="pgrid">${groups[g].map(item).join('')}</div></details>`).join('');
  return `<div class="pick" id="pick"><div class="pickhd"><b>Add a shot</b><input id="pickQ" type="search" placeholder="Search presets: kitchen, orbit, drone…" value="${esc(U.pickQ||'')}"><button class="btn" id="pickC">+ Custom shot</button><button class="btn" id="pickX">Close</button></div>
  <div class="pickinfo">Preset shots come ready with the move, lens, length and image. New shots go ${where}. Tap a shot on the board first to choose where.</div>
  ${gs||'<div class="empty">No preset matches. Try another word, or add a Custom shot.</div>'}</div>`}
function wirePick(b,add){const pk=$('pick');if(!pk)return;
  $('pickX').onclick=()=>{U.addPick=false;renderMain()};
  $('pickC').onclick=()=>{const s=add();toast('Custom shot added. Fill it in on the right.')};
  const q=$('pickQ');let tm;q.oninput=()=>{clearTimeout(tm);tm=setTimeout(()=>{U.pickQ=q.value;const pos=q.selectionStart;renderMain();const n=$('pickQ');if(n){n.focus();n.setSelectionRange(pos,pos)}},180)};
  pk.querySelectorAll('details.pg').forEach(d=>d.ontoggle=()=>{U.pickGrp=U.pickGrp||{};U.pickGrp[d.dataset.pg]=d.open});
  pk.querySelectorAll('[data-pk]').forEach(e=>e.onclick=()=>{const p=PRESETS.find(x=>x.key===e.dataset.pk);if(!p)return;const s=clone(p.s);
    ['combo','link','hidden','got','ask','swapped','solo','extra','lid','media'].forEach(k=>delete s[k]);s.id='s'+Math.random().toString(36).slice(2,9);s.preset=p.name;
    add(s);toast(`Added ${p.name} as shot #${b.shots.findIndex(x=>x.id===s.id)+1}`)})}
/* drag: a combo moves as one block; dropping on another combo lands before it, never inside it */
function runOf(b,id){const i=b.shots.findIndex(x=>x.id===id);if(i<0)return null;const k=b.shots[i].combo;let a=i,z=i;if(k){while(a>0&&b.shots[a-1].combo===k)a--;while(z<b.shots.length-1&&b.shots[z+1].combo===k)z++}return [a,z]}
function moveGroup(b,from,to){const f=runOf(b,from),t=runOf(b,to);if(!f||!t)return false;if(t[0]>=f[0]&&t[1]<=f[1])return false;
  const down=t[0]>f[1],ref=b.shots[down?t[1]:t[0]].id,blk=b.shots.splice(f[0],f[1]-f[0]+1);
  const at=b.shots.findIndex(x=>x.id===ref)+(down?1:0);b.shots.splice(at,0,...blk);
  if(blk.length>1)toast(`Moved combo ${blk[0].combo} (${blk.length} clips) together`);return true}
const nextCombo=b=>'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').find(l=>!b.shots.some(s=>s.combo===l));
function toast(t){const e=$('toast');e.textContent=t;e.hidden=false;clearTimeout(e._t);e._t=setTimeout(()=>e.hidden=true,t.length>60?4500:2200)}
addEventListener('keydown',e=>{if(e.key==='Escape'&&U.shot){U.shot=null;renderInsp()}});

lsRead();purgeGone();U.area=areaOf(B()||{});Object.values(S.boards).forEach(b=>ensureBase(b,dirtyAll.has(b.id)));let autoUp=0;Object.values(S.boards).forEach(b=>{const d=tplDiff(b);if(d&&d.n)autoUp+=applyTpl(b)});render();if(autoUp)toast(`Template updates added to ${autoUp} ${autoUp===1?'shot':'shots'}. Your combos, hidden shots and order are kept.`);connect();

/* ---------- Update button (Nov 8): always at the top; turns gold when a newer version is live ---------- */
async function latestVersion(){try{const r=await fetch('index.html?u='+Date.now(),{cache:'no-store'});if(!r.ok)return '';const t=await r.text();const m=t.match(/app\.js\?v=([^"&]+)/);return m?m[1]:''}catch(e){return ''}}
async function checkUpdate(){if(!UPD.mine)return;const v=await latestVersion();const ready=!!v&&v!==UPD.mine;if(ready!==UPD.ready){UPD.ready=ready;renderRail()}}
async function doUpdate(){const b=$('updBtn');if(b){b.textContent='Updating…';b.disabled=true}
  try{await flush()}catch(e){}
  try{await Promise.all(['index.html','app.js','data.js'].map(f=>fetch(f,{cache:'reload'}).catch(()=>{})));const v=await latestVersion();if(v)await Promise.all(['app.js?v='+v,'data.js?v='+v].map(f=>fetch(f,{cache:'reload'}).catch(()=>{})))}catch(e){}
  const u=new URL(location.href);u.searchParams.set('u',Date.now());location.replace(u.toString())}
checkUpdate();setInterval(checkUpdate,120000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkUpdate()});
