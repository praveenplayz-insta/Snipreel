const $=s=>document.querySelector(s),once=(e,n)=>new Promise(r=>e.addEventListener(n,r,{once:true}));
const GR={
 natural:{f:'none'},
 cinema:{f:'contrast(1.1) saturate(1.08)',tint:['#1f6f8b','#ff9a55'],ta:.55,vig:.32},
 vivid:{f:'contrast(1.06) saturate(1.35) brightness(1.03)',vig:.12},
 warm:{f:'saturate(1.08) brightness(1.03)',tint:['#ffb26b','#ff8a3d'],ta:.5,vig:.2},
 cool:{f:'saturate(1.05) contrast(1.05)',tint:['#4aa3ff','#6fd0ff'],ta:.45,vig:.2},
 fade:{f:'contrast(.92) saturate(.85) brightness(1.06)',tint:['#9aa7c7','#e8c9b0'],ta:.35},
 noir:{f:'grayscale(1) contrast(1.22) brightness(.98)',vig:.42}};
const DOT={natural:'#bbb',cinema:'#c9744a',vivid:'#ff3d81',warm:'#ffb347',cool:'#4cc9f0',noir:'#444',fade:'#b9a9c9'};
const S={grade:'cinema',cap:'pop',len:30,voice:'on',ar:'9:16',frm:'crop',brain:'smart',sfx:'normal'};let file=null,busy=false,face=null;
const vid=document.createElement('video');vid.playsInline=true;vid.preload='auto';
const mobile=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)||matchMedia('(pointer:coarse)').matches;
const MODEL=mobile?'Xenova/whisper-tiny.en':'Xenova/whisper-base.en';
S.q=mobile?'fast':'high';if(mobile)S.voice='off';let W_=540,H_=960;const pv=$('#pv'),pc=pv.getContext('2d');
const SZ={'9:16':{high:[720,1280],fast:[540,960]},'1:1':{high:[1080,1080],fast:[720,720]},'4:5':{high:[864,1080],fast:[576,720]},'16:9':{high:[1280,720],fast:[960,540]}};
function setSize(){[W_,H_]=SZ[S.ar||'9:16'][S.q==='high'?'high':'fast'];pv.width=W_;pv.height=H_}setSize();

/* chips */
function chips(id,key,items){const el=$(id);items.forEach(([v,l,d])=>{const b=document.createElement('button');b.className='chip';b.type='button';b.innerHTML=(d?`<i style="background:${d}"></i>`:'')+l;b.onclick=()=>{S[key]=v;sync()};b.dataset.v=v;el.append(b)});
 el.sync=()=>[...el.children].forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v==S[key])));return el}
const cs=[chips('#c-grade','grade',Object.keys(GR).map(k=>[k,k[0].toUpperCase()+k.slice(1),DOT[k]])),chips('#c-cap','cap',[['pop','Pop'],['clean','Clean'],['neon','Neon'],['box','Highlight box'],['comic','Comic'],['fire','Fire'],['ice','Ice'],['type','Typewriter']]),chips('#c-len','len',[[15,'15s'],[30,'30s'],[45,'45s'],[60,'60s'],[90,'90s'],[120,'2 min'],[180,'3 min']])];
cs.push(chips('#c-voice','voice',[['on','Intro voice on'],['off','Intro voice off']]),chips('#c-q','q',[['fast','Fast'],['high','High']]),chips('#c-ar','ar',[['9:16','9:16 Shorts'],['1:1','1:1 Square'],['4:5','4:5 Feed'],['16:9','16:9 YouTube']]),chips('#c-fit','frm',[['crop','Smart crop'],['fit','Fit with blur']]),chips('#c-brain','brain',[['smart','Smart basic'],['local','On-device AI (0.5 GB)'],['gemini','Gemini']]),chips('#c-sfx','sfx',[['off','Off'],['subtle','Subtle'],['normal','Normal'],['hype','Hype']]));const sync=()=>cs.forEach(c=>c.sync());sync();

/* drawing */
let bgc=null;
function frame(x,cx){const vw=vid.videoWidth,vh=vid.videoHeight,A=W_/H_,G=GR[S.grade]||GR.natural;
 if(S.frm==='fit'&&Math.abs(vw/vh-A)>.04){
  if(!bgc)bgc=document.createElement('canvas');const bw=Math.max(16,Math.round(W_/18)),bh=Math.max(16,Math.round(H_/18));if(bgc.width!==bw||bgc.height!==bh){bgc.width=bw;bgc.height=bh}
  let bcw=vh*A,bch=vh;if(bcw>vw){bcw=vw;bch=vw/A}bgc.getContext('2d').drawImage(vid,(vw-bcw)/2,(vh-bch)/2,bcw,bch,0,0,bw,bh);
  x.filter=G.f;x.drawImage(bgc,0,0,W_,H_);x.filter='none';x.fillStyle='rgba(0,0,0,.38)';x.fillRect(0,0,W_,H_);
  const sc=Math.min(W_/vw,H_/vh),dw=vw*sc,dh=vh*sc;x.filter=G.f;x.drawImage(vid,(W_-dw)/2,(H_-dh)/2,dw,dh);x.filter='none'
 }else{let cw,ch;if(vw/vh>=A){ch=vh;cw=vh*A}else{cw=vw;ch=vw/A}
  const sx=Math.min(Math.max(cx*vw-cw/2,0),vw-cw),sy=(vh-ch)/2;x.filter=G.f;x.drawImage(vid,sx,sy,cw,ch,0,0,W_,H_);x.filter='none'}
 if(G.tint){const g=x.createLinearGradient(0,0,0,H_);g.addColorStop(0,G.tint[0]);g.addColorStop(1,G.tint[1]);x.globalCompositeOperation='soft-light';x.globalAlpha=G.ta;x.fillStyle=g;x.fillRect(0,0,W_,H_);x.globalCompositeOperation='source-over';x.globalAlpha=1}
 if(G.vig){const r=x.createRadialGradient(W_/2,H_/2,H_*.32,W_/2,H_/2,H_*.72);r.addColorStop(0,'rgba(0,0,0,0)');r.addColorStop(1,`rgba(0,0,0,${G.vig})`);x.fillStyle=r;x.fillRect(0,0,W_,H_)}}
const TH={
 pop:{up:1,on:'#ffd23f',off:'#fff'},
 clean:{on:'#fff',off:'#ffffffa0'},
 neon:{up:1,on:'#3ef2c1',off:'#fff',glow:'#3ef2c1'},
 box:{up:1,on:'#fff',off:'#fff',box:'#ff5c93'},
 comic:{up:1,on:'#fff',off:'#ffd23f',hard:'#ff5c93'},
 fire:{up:1,on:'#ff9a1f',off:'#fff',glow:'#ff3d00'},
 ice:{on:'#8fe3ff',off:'#fff',glow:'#4cc9f0'},
 type:{font:'"Courier New",monospace',on:'#3ef2c1',off:'#fff',bar:'#000000b8'}};
function caps(x,ws,t){if(!ws.length)return;let i=-1;for(let k=0;k<ws.length;k++){if(ws[k].s<=t+.05)i=k;else break}if(i<0||t>ws[i].e+.35)return;const g=Math.floor(i/3)*3,seg=ws.slice(g,g+3),T=TH[S.cap]||TH.pop;
 const txt=w=>T.up?w.w.toUpperCase():w.w,fam=T.font||'"Bricolage Grotesque",sans-serif',wt=T.font?700:800;const K=Math.min(W_,H_)/540,lim=W_*.87;let fs=62*K,sp=16*K,tw;
 const set=()=>{x.font=`${wt} ${fs}px ${fam}`;tw=seg.reduce((a,w)=>a+x.measureText(txt(w)).width,0)+sp*(seg.length-1)};
 set();if(tw>lim){fs*=lim/tw;sp*=lim/tw;set()}
 x.textBaseline='middle';x.textAlign='left';x.lineJoin='round';x.lineWidth=fs/5;let px=(W_-tw)/2;const y=H_*(W_>H_?.84:W_===H_?.8:.72);
 if(T.bar){x.fillStyle=T.bar;x.beginPath();x.roundRect((W_-tw)/2-18,y-fs*.75,tw+36,fs*1.5,16);x.fill()}
 seg.forEach((w,k)=>{const on=g+k===i,s=txt(w),ww=x.measureText(s).width;x.shadowBlur=0;
  if(T.box&&on){x.fillStyle=T.box;x.beginPath();x.roundRect(px-12,y-fs*.66,ww+24,fs*1.32,18);x.fill()}
  if(T.hard){x.fillStyle=T.hard;x.fillText(s,px+5,y+5)}
  if(!T.bar){x.strokeStyle='#000';x.strokeText(s,px,y)}
  x.fillStyle=on?T.on:T.off;if(T.glow&&on){x.shadowColor=T.glow;x.shadowBlur=24}x.fillText(s,px,y);x.shadowBlur=0;px+=ww+sp})}
/* file input */
const drop=$('#drop'),inp=$('#f');
drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inp.click()}});
['dragenter','dragover'].forEach(n=>drop.addEventListener(n,e=>{e.preventDefault();drop.classList.add('over')}));
['dragleave','drop'].forEach(n=>drop.addEventListener(n,e=>{e.preventDefault();drop.classList.remove('over')}));
drop.addEventListener('drop',e=>load(e.dataTransfer.files[0]));inp.onchange=()=>load(inp.files[0]);
async function load(f){if(!f||!f.type.startsWith('video/'))return msg('That file is not a video. Choose an MP4, MOV or WebM file.');
 file=f;vid.src=URL.createObjectURL(f);await once(vid,'loadeddata');vid.currentTime=Math.min(1,vid.duration/2);
 $('#dt').textContent=f.name;$('#ds').textContent=`${(f.size/1048576).toFixed(0)} MB, ${fmt(vid.duration)} long. Choose another file to replace it.`;$('#go').disabled=false;msg(mobile&&vid.duration>600?'Ready. On a phone, videos under 10 minutes work best.':'Ready. Pick your look, then make the clips.')}
const msg=t=>$('#msg').textContent=t,fmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;

/* AI steps */
async function initFace(){try{const v='0.10.14',m=await import(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${v}/+esm`);const fs=await m.FilesetResolver.forVisionTasks(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${v}/wasm`);
 face=await m.FaceDetector.createFromOptions(fs,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite'},runningMode:'VIDEO',minDetectionConfidence:.3})}catch(e){face=null}}
function crumb(x){try{x?localStorage.setItem('snipreel:crumb',x+'|'+Date.now()):localStorage.removeItem('snipreel:crumb')}catch(e){}}
let t0=0,tk=0;
function log(t){const li=document.createElement('li');li.textContent=`${fmt((Date.now()-t0)/1000)}  ${t}`;const l=$('#log');l.prepend(li);while(l.children.length>60)l.lastChild.remove()}
function setM(id,p){$('#m-'+id).textContent=Math.round(p*100)+'%';$('#b-'+id).style.width=Math.round(p*100)+'%'}
function summary(W){const stop=new Set('the and but with this that was are have has had does did what which who how can will just like then there their about into more very your our its them than also when out all one because they would could should really going know think want right yeah okay'.split(' ')),f={};
 W.forEach(x=>{const k=x.w.toLowerCase().replace(/[^a-z']/g,'');if(k.length>3&&!stop.has(k))f[k]=(f[k]||0)+1});
 const top=Object.entries(f).sort((a,b)=>b[1]-a[1]).slice(0,6).map(e=>e[0]),el=$('#sum');el.hidden=false;
 el.textContent=`Transcript summary: ${W.length} words over ${fmt(W.at(-1).e)}. Main topics: ${top.join(', ')||'none detected'}. It starts with: “${W.slice(0,14).map(x=>x.w).join(' ')}…”`}
async function loadASR(){const {pipeline}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2/+esm'),F={};
 const cb=p=>{if(p.status==='initiate')log('Fetching '+String(p.file).split('/').pop());
  if(p.status==='progress'&&p.total){F[p.file]={l:p.loaded,t:p.total};const v=Object.values(F);setM('model',v.reduce((a,x)=>a+x.l,0)/v.reduce((a,x)=>a+x.t,0))}};
 const mk=o=>pipeline('automatic-speech-recognition',MODEL,{...o,progress_callback:cb});let r;
 if(mobile)r=await mk({device:'wasm',dtype:'q8'});else{try{r=await mk(navigator.gpu?{device:'webgpu',dtype:{encoder_model:'fp32',decoder_model_merged:'q4'}}:{device:'wasm',dtype:'q8'})}catch(e){log('GPU mode failed, switching to CPU');r=await mk({device:'wasm',dtype:'q8'})}}
 setM('model',1);log('Speech model ready ('+MODEL.split('/')[1]+')');return r}
/* fast path: decode the audio track straight from the file (seconds, no playback) */
async function decodeAll(){if(file.size>300*1048576)throw Error('file too large for direct decoding');
 let buf;try{buf=await file.arrayBuffer()}catch(e){buf=await new Response(file).arrayBuffer()}
 const ac=new AudioContext({sampleRate:16000});let d;try{d=await ac.decodeAudioData(buf)}finally{buf=null;ac.close&&ac.close()}
 const L=d.getChannelData(0);if(d.numberOfChannels<2)return L;const R=d.getChannelData(1),m=new Float32Array(L.length);for(let i=0;i<L.length;i++)m[i]=(L[i]+R[i])/2;return m}
/* fallback: plays the file silently and records 16 kHz mono, placing samples by media time so stalls cannot shift captions */
async function audioStream(rate,bar){const av=document.createElement('video');av.src=vid.src;av.playsInline=true;av.preload='auto';
 av.style.cssText='position:fixed;left:0;top:0;width:2px;height:2px;opacity:0;pointer-events:none';document.body.append(av);
 await once(av,'loadedmetadata');log(`Audio source opened, ${fmt(av.duration)} long, reading at ${rate}x speed`);
 const need=Math.ceil(av.duration*16000/rate),buf=new Float32Array(need+32000);
 const ac=new AudioContext({sampleRate:16000}),src=ac.createMediaElementSource(av),sp=ac.createScriptProcessor(4096,1,1),z=ac.createGain();z.gain.value=0;
 sp.onaudioprocess=e=>{const d=e.inputBuffer.getChannelData(0),i=Math.max(0,Math.round(av.currentTime*16000/rate)-d.length);if(i+d.length<=buf.length)buf.set(d,i)};
 src.connect(sp);sp.connect(z);z.connect(ac.destination);
 av.playbackRate=rate;await ac.resume();await av.play();log('Playback started');
 await new Promise(res=>{let last=-1,still=0,lg=0;const fin=w=>{clearInterval(iv);log(w);res()};
  const iv=setInterval(()=>{const p=Math.min(1,av.currentTime/av.duration);setM('audio',p);bar(.02+p*.3);msg(`Listening to the audio, ${Math.round(p*100)}%.`);
   if(Math.floor(p*5)>lg){lg=Math.floor(p*5);log(`Listening, ${lg*20}%`)}
   if(av.ended||av.duration-av.currentTime<.3)return fin('Audio captured');
   if(av.currentTime===last){still++;if(still===6||still===14){log('Playback stalled, restarting it');av.currentTime=av.currentTime+.05;av.play().catch(()=>{})}if(still>=30)return fin('Playback stopped early, using the audio captured so far')}else{still=0;last=av.currentTime}},500)});
 setM('audio',1);ac.close();av.remove();return buf.subarray(0,need)}
/* removes words the model invented: loops, and words spoken over silence */
function clean(W,a,rate){const out=[];let run=0,prev='';
 for(const x of W){const k=x.w.toLowerCase().replace(/[^a-z0-9']/g,''),i0=Math.max(0,Math.floor(x.s*16000)),i1=Math.min(a.length,Math.max(i0+2,Math.floor(Math.min(x.e,x.s+1)*16000)));
  let sum=0,c=0;for(let i=i0;i<i1;i+=8){sum+=Math.abs(a[i]);c++}if(c&&sum/c<.004)continue;
  run=k===prev?run+1:1;prev=k;if(run>3)continue;
  let e=x.e;if(e-x.s>1.5)e=x.s+.6;if(e<=x.s)e=x.s+.2;out.push({w:x.w,s:x.s*rate,e:e*rate})}
 if(out.length<W.length)log(`Removed ${W.length-out.length} doubtful words (loops or silence)`);return out}
/* split audio into <=30 s parts, cutting at the quietest moment so words are not sliced */
function splits(a){const R=16000,out=[];let p=0;while(p<a.length){let q=Math.min(a.length,p+30*R);
 if(q<a.length){let best=q,bv=1e9;for(let i=q-6*R;i<q-1600;i+=1600){let t=0;for(let j=i;j<i+1600;j+=8)t+=Math.abs(a[j]);if(t<bv){bv=t;best=i+800}}q=best}out.push([p,q]);p=q}return out}
const nap=ms=>new Promise(r=>setTimeout(r,ms));
async function transcribe(bar){
 const key=`snipreel:v2:${file.name}:${file.size}:${MODEL}`;
 try{const c=JSON.parse(localStorage.getItem(key)||'null');if(c&&c.length>10){log('Found a saved transcript for this video, skipping the audio and transcription steps');['audio','model','txt'].forEach(k=>setM(k,1));return c}}catch(e){}
 crumb('listening');const lp=loadASR();let a,rate=1;
 try{log('Decoding the audio straight from the file');a=await decodeAll();setM('audio',1);bar(.3);log(`Audio decoded, ${fmt(a.length/16000)} of sound`)}catch(e){rate=vid.duration>300?1.5:1;log(`Direct decoding failed (${e.name||e.message}). Listening in real time instead.`);a=await audioStream(rate,bar)}
 msg('Loading the speech model.');const asr=await lp;
 crumb('transcribing');const segs=splits(a),words=[];log(`Transcribing in ${segs.length} parts`);
 for(let i=0;i<segs.length;i++){const [p,q]=segs[i];msg(`Writing the transcript, part ${i+1} of ${segs.length}.`);bar(.32+.3*i/segs.length);
  let o;try{o=await asr(a.slice(p,q),{return_timestamps:'word',no_repeat_ngram_size:4})}catch(e){try{o=await asr(a.slice(p,q),{return_timestamps:'word'})}catch(e2){log(`Part ${i+1} failed, skipping it`);continue}}
  const off=p/16000;(o.chunks||[]).forEach(c=>{const w=c.text.trim();if(w)words.push({w,s:c.timestamp[0]+off,e:(c.timestamp[1]??c.timestamp[0]+.3)+off})});
  setM('txt',(i+1)/segs.length);log(`Transcribed part ${i+1} of ${segs.length}, ${words.length} words so far`);await nap(40)}
 try{await asr.dispose()}catch(e){}log('Speech model released to free memory');const out=clean(words,a,rate);try{localStorage.setItem(key,JSON.stringify(out))}catch(e){}return out}
function pick(W,len){const n=W.length;if(n<5)return[];
 const E=/[.?!]$/,gp=i=>(W[i+1]?W[i+1].s-W[i].e:3),gb=i=>(i>0?W[i].s-W[i-1].e:3);
 const sOK=i=>i===0||E.test(W[i-1].w)||gb(i)>.45,eOK=i=>i===n-1||E.test(W[i].w)||gp(i)>.5;
 const Q=[0],X=[0],D=[0];W.forEach(w=>{Q.push(Q.at(-1)+(/\?/.test(w.w)?1:0));X.push(X.at(-1)+(/!/.test(w.w)?1:0));D.push(D.at(-1)+(/\d/.test(w.w)?1:0))});
 const hook=/\b(secret|never|always|why|how|mistake|truth|biggest|best|worst|actually|imagine|stop|learn|money|free|nobody|everyone|important|contest|rules?|win|prize|challenge)\b/i,conn=/^(and|but|so|because|which|then|also|or|well|like|yeah|yes|no|okay|ok|right|exactly|oh|anyway)\b/i,cand=[];
 for(let i=0;i<n;i++){if(!sOK(i))continue;const h=hook.test(W.slice(i,i+14).map(x=>x.w).join(' '))?2:0,c0=conn.test(W[i].w)?1.5:0;
  for(let j=i+3;j<n;j++){const d=W[j].e-W[i].s;if(d>len*1.5)break;if(d<len*.6||!eOK(j))continue;
   const nx=W[j+1],end=Math.min(gp(j),1.2)*1.5+(E.test(W[j].w)?1.5:0),
    sc=(j-i+1)/d+(Q[j+1]-Q[i])*.6+(X[j+1]-X[i])*.5+(D[j+1]-D[i])*.3+h+end-(/\?$/.test(W[j].w)?1.5:0)-(nx&&conn.test(nx.w)&&gp(j)<.9?1.2:0)-c0-Math.abs(d-len)/len*1.5;
   cand.push({i,j,sc})}}
 cand.sort((a,b)=>b.sc-a.sc);const out=[];
 for(const c of cand){if(out.length>=5)break;const s0=W[c.i].s,e0=W[c.j].e;if(out.every(k=>e0<=k.s0||s0>=k.e0)){const w=W.slice(c.i,c.j+1),pre=Math.min(.25,gb(c.i)*.5),post=Math.min(.9,Math.max(.35,gp(c.j)*.7));
   out.push({s0,e0,s:Math.max(0,s0-pre),e:Math.min(vid.duration||1e9,e0+post),sc:c.sc,w,title:w.slice(0,8).map(x=>x.w).join(' ')+'…'})}}
 if(!out.length)return out;const hi=Math.max(...out.map(c=>c.sc)),lo=Math.min(...out.map(c=>c.sc));out.forEach(c=>c.score=Math.round(62+37*(c.sc-lo)/((hi-lo)||1)));return out}

/* render one clip in real time */
/* ---------- speaker path: scan the clip first, then glide the camera along a smoothed path ---------- */
function buildPath(pts,s0,e0){if(pts.length<3)return null;const fps=30,n=Math.ceil((e0-s0)*fps)+2,raw=new Float32Array(n);
 let k=0;for(let i=0;i<n;i++){const t=s0+i/fps;while(k<pts.length-2&&pts[k+1][0]<t)k++;const a=pts[k],b=pts[k+1];raw[i]=t<=a[0]?a[1]:t>=b[0]?b[1]:a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0])}
 const med=(arr,r)=>{const o=new Float32Array(arr.length);for(let i=0;i<arr.length;i++){const w=[];for(let j=Math.max(0,i-r);j<=Math.min(arr.length-1,i+r);j++)w.push(arr[j]);w.sort((p,q)=>p-q);o[i]=w[w.length>>1]}return o};
 const avg=(arr,r)=>{const o=new Float32Array(arr.length),pre=[0];for(let i=0;i<arr.length;i++)pre.push(pre[i]+arr[i]);for(let i=0;i<arr.length;i++){const a=Math.max(0,i-r),b=Math.min(arr.length-1,i+r);o[i]=(pre[b+1]-pre[a])/(b-a+1)}return o};
 const sm=avg(med(raw,Math.round(fps*.5)),Math.round(fps*.6));
 return t=>{const f=(t-s0)*fps,i=Math.max(0,Math.min(n-2,Math.floor(f))),u=Math.max(0,Math.min(1,f-i));return sm[i]+(sm[i+1]-sm[i])*u}}
async function scanFace(c,onp){setSize();const noRoom=S.frm==='fit'||vid.videoWidth/vid.videoHeight<=W_/H_+.02;if(!face||noRoom)return null;
 vid.currentTime=c.s;await once(vid,'seeked');vid.muted=true;vid.playbackRate=mobile?2:3;
 const pts=[];let last=-1,lk=performance.now(),stop=null;
 const wd=setInterval(()=>{const q=performance.now()-lk;if(q>4000&&q<12000)vid.play().catch(()=>{});if(q>=12000&&stop)stop()},1500);
 try{await vid.play();await new Promise(res=>{stop=res;const go=cb=>vid.requestVideoFrameCallback?vid.requestVideoFrameCallback(cb):requestAnimationFrame(()=>cb(0,{mediaTime:vid.currentTime}));
  const st=(_,md)=>{lk=performance.now();const t=md&&md.mediaTime!=null?md.mediaTime:vid.currentTime;if(t>=c.e||vid.ended){res();return}
   if(t-last>=.12){last=t;try{const d=face.detectForVideo(vid,performance.now()).detections;if(d.length){const b=d.sort((p,q)=>q.boundingBox.width-p.boundingBox.width)[0].boundingBox;pts.push([t,(b.originX+b.width/2)/vid.videoWidth])}}catch(e){}onp&&onp((t-c.s)/(c.e-c.s))}go(st)};go(st)})}
 finally{clearInterval(wd);vid.pause();vid.playbackRate=1;vid.muted=false}
 log(`Speaker seen ${pts.length} times in this clip`);return buildPath(pts,c.s,c.e)}

/* ---------- brain: titles, captions, hashtags and the intro script ---------- */
const keyEl=$('#key'),ctxEl=$('#ctx');try{keyEl.value=localStorage.getItem('snipreel:key')||''}catch(e){}if(keyEl.value.trim()){S.brain='gemini';sync()}
keyEl.addEventListener('change',()=>{try{localStorage.setItem('snipreel:key',keyEl.value.trim())}catch(e){}if(keyEl.value.trim()){S.brain='gemini';sync()}});
const STOPW=new Set('the and but with this that was are have has had does did what which who how can will just like then there their about into more very your our its them than also when out all one because they would could should really going know think want right yeah okay thats dont youre'.split(' '));
const topWords=(ws,n)=>{const f={};ws.forEach(x=>{const k=x.w.toLowerCase().replace(/[^a-z]/g,'');if(k.length>3&&!STOPW.has(k))f[k]=(f[k]||0)+1});return Object.entries(f).sort((a,b)=>b[1]-a[1]).slice(0,n).map(e=>e[0])};
const norm=t=>(Array.isArray(t)?t:String(t||'').split(/\s+/)).map(x=>String(x).trim()).filter(Boolean).map(x=>x[0]==='#'?x:'#'+x.replace(/\s+/g,''));
/* Smart basic: finds rule-like sentences across the whole video and builds the intro from them, no model needed */
const RULEW=/\b(rules?|must|cannot|can't|need to|have to|only|first to|last one|win|wins|winner|prize|prizes|dollars?|million|thousand|every|each|if you|until|eliminated|challenge|contest|compete|deadline|allowed|points?)\b|\$/i;
let SENTS=[];
function sentencesOf(W){const out=[];let cur=[];const push=()=>{if(cur.length)out.push({s:cur[0].s,e:cur.at(-1).e,t:cur.map(y=>y.w).join(' ')});cur=[]};
 W.forEach((x,i)=>{cur.push(x);const nx=W[i+1];if(/[.?!]$/.test(x.w)||(nx&&nx.s-x.e>.8)||cur.length>34)push()});push();return out}
const ruleScore=t=>{const m=t.match(new RegExp(RULEW.source,'gi'));return m?m.length:0};
const okLine=x=>{const k=x.t.split(/\s+/).length;return k>=5&&k<=30&&!/\?$/.test(x.t)&&!/^(and|but|so|then|yeah|yes|no|okay|well|oh)\b/i.test(x.t)&&ruleScore(x.t)>0};
const keyLines=()=>SENTS.map((x,i)=>({x,i,sc:ruleScore(x.t)})).filter(o=>okLine(o.x)).sort((a,b)=>b.sc-a.sc).slice(0,6).sort((a,b)=>a.i-b.i).map(o=>o.x);
const spoken=t=>{let r=t.replace(/\b(um+|uh+|you know)\b[,.]?\s*/gi,'').replace(/\s+/g,' ').trim();r=r.charAt(0).toUpperCase()+r.slice(1);return /[.!?]$/.test(r)?r:r+'.'};
let SUBJ={name:'',topic:''};
const TOPICS=['contest','challenge','competition','tournament','giveaway','game','race','experiment','bet'];
function detectSubject(W){const f={},t={},bad=new Set("I I'm I'll I've The And But So Then Yeah Yes No Okay Oh Well Today This That These Those It He She They We You What When Where Why How Who Now Here There Please Thank Thanks Welcome Let If My Our Your One Two Three".split(' '));
 for(let i=0;i<W.length;i++){const raw=W[i].w.replace(/[^A-Za-z']/g,''),k=raw.toLowerCase();if(TOPICS.includes(k))t[k]=(t[k]||0)+1;
  if(!raw||!/^[A-Z]/.test(raw)||(raw.length<3&&!/^(Mr|Mrs|Dr)$/.test(raw))||bad.has(raw))continue;const pv=W[i-1];if(pv&&/[.?!]$/.test(pv.w)&&!/^(Mr|Mrs|Dr)$/.test(raw))continue;
  let nm=raw;const nx=W[i+1];if(/^(Mr|Mrs|Dr)$/.test(raw)&&nx&&/^[A-Z]/.test(nx.w)){nm=raw+' '+nx.w.replace(/[^A-Za-z']/g,'');i++}
  f[nm]=(f[nm]||0)+1}
 const top=o=>Object.entries(o).sort((a,b)=>b[1]-a[1])[0];const n=top(f),p=top(t);return{name:n&&n[1]>=2?n[0]:'',topic:p&&p[1]>=2?p[0]:''}}
function smartIntro(c,note){let head='';
 if(note)head=note.replace(/[.!?]+$/,'')+'. ';
 else if(SUBJ.name&&SUBJ.topic)head=`${SUBJ.name} has made a new ${SUBJ.topic}. `;
 else if(SUBJ.topic)head=`This is a new ${SUBJ.topic}. `;
 else if(SUBJ.name)head=`This video features ${SUBJ.name}. `;
 const cands=SENTS.filter(okLine).map(x=>{const before=x.e<=c.s?c.s-x.e:(x.s-c.s<30?0:9999);return{x,sc:ruleScore(x.t)*2-Math.min(3,before/90)}}).filter(o=>o.sc>1).sort((a,b)=>b.sc-a.sc);
 const picked=[];let words=0;for(const o of cands){const k=o.x.t.split(/\s+/).length;if(words+k>38)continue;picked.push(o.x);words+=k;if(picked.length>=2)break}
 picked.sort((a,b)=>a.s-b.s);if(!head&&!picked.length)return'';
 return head+(picked.length?'Here are the rules. '+picked.map(x=>spoken(x.t)).join(' ')+' ':'')+'And here is what happened in it.'}
/* On-device AI: a small free language model that runs in the browser, no key (desktop, about 0.5 GB once) */
let llm=null;
async function loadLLM(){if(llm)return llm;const {pipeline}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2/+esm');
 const gpu=!!navigator.gpu&&!mobile,id='onnx-community/Qwen2.5-0.5B-Instruct',cb=p=>{if(p.status==='progress')msg(`Downloading the on-device brain, ${Math.round(p.progress)}%`)};
 log(`Loading the on-device brain, about ${gpu?'480':'740'} MB the first time`);
 try{llm=await pipeline('text-generation',id,gpu?{device:'webgpu',dtype:'q4f16',progress_callback:cb}:{device:'wasm',dtype:'q4',progress_callback:cb})}
 catch(e){if(!gpu)throw e;log('GPU mode failed, trying CPU mode');llm=await pipeline('text-generation',id,{device:'wasm',dtype:'q4',progress_callback:cb})}
 log('On-device brain ready');return llm}
async function localLLM(c,note,kt){const m=await loadLLM(),text=c.w.map(x=>x.w).join(' ').slice(0,900);
 const msgs=[{role:'system',content:'You write short, honest social media copy for video clips. Use only facts from the text you are given. Never invent rules, prizes or names.'},
  {role:'user',content:`${note?'About the video: '+note+'\n':''}${kt?'Lines from elsewhere in the video: '+kt+'\n':''}Clip transcript: ${text}\n\nReply in exactly this format, one item per line:\nTITLE: (max 60 characters)\nHOOK: (one short line for Instagram)\nINTRO: (25 to 40 spoken words that explain what is going on, mention any stated rules, start like a narrator, for example: MrBeast has made a new contest, and end with: And here is what happened in it.)\nTAGS: (8 hashtags separated by spaces)`}];
 const o=await m(msgs,{max_new_tokens:200,do_sample:true,temperature:.6,top_p:.9,repetition_penalty:1.1}),t=String(o[0].generated_text.at(-1).content||'');
 const g=k=>((t.match(new RegExp('^\\s*'+k+':\\s*(.+)$','mi'))||[])[1]||'').trim();
 return{title_youtube:g('TITLE'),title_instagram:g('HOOK'),caption_instagram:g('HOOK')?g('HOOK')+'\n\nFollow for more.':'',hashtags_youtube:g('TAGS'),hashtags_instagram:g('TAGS'),intro_script:g('INTRO')}}
function localBrain(c,note){const t=c.w.map(x=>x.w).join(' '),first=(t.match(/[^.!?]+[.!?]?/)||[t])[0].trim();
 let title=first.replace(/[^\w\s'’?!-]/g,'').split(/\s+/).slice(0,10).join(' ');for(let i=0;i<4;i++)title=title.replace(/\s+(the|a|an|and|or|but|of|to|in|on|at|for|with|is|are|was|that|this)$/i,'');title=title.charAt(0).toUpperCase()+title.slice(1);
 const tags=topWords(c.w,5).map(k=>'#'+k);
 return{title_youtube:title+' #shorts',title_instagram:title,description_youtube:t.slice(0,170)+'…\n\nSubscribe for more clips like this.',caption_instagram:title+'\n\nFollow for more.',
  hashtags_youtube:[...tags,'#shorts','#viral'],hashtags_instagram:[...tags,'#reels','#viral','#fyp'],intro_script:smartIntro(c,note)}}
function brainPrompt(cl,note,kt){return `You write social media copy for short video clips cut from a longer video.
${note?'Context from the creator about the full video: '+note+'\n':''}${kt?'Lines from elsewhere in the same video that may explain the setup or rules: '+kt+'\n':''}For EACH clip below return one object. Use ONLY facts stated in the clip transcript or the creator context. Never invent names, prizes, rules, numbers or events.
Fields:
- title_youtube: max 70 characters, curiosity-driven, honest
- title_instagram: a short hook line, max 60 characters
- description_youtube: 2 to 3 sentences
- caption_instagram: 1 to 3 short lines with a call to action
- hashtags_youtube: 5 to 8 hashtags, each starting with #
- hashtags_instagram: 8 to 12 hashtags, each starting with #
- intro_script: a spoken intro of 25 to 45 words that plays BEFORE the clip. First say what is going on (use the creator context for names). If the clip states rules, conditions, prizes or how it works, summarise them briefly and accurately. Open the way a narrator would, for example: MrBeast has made a new contest. End by leading into the clip with: And here is what happened in it. If nothing about rules is stated, do not mention rules. Plain spoken English, no hashtags, no emojis.
Return ONLY JSON in this shape: {"clips":[{...}]} with exactly ${cl.length} objects in the same order as the clips.

${cl.map((c,i)=>'CLIP '+(i+1)+':\n'+c.w.map(x=>x.w).join(' ').slice(0,1800)).join('\n\n')}`}
async function gemini(key,prompt){const base='https://generativelanguage.googleapis.com/v1beta',K=encodeURIComponent(key);
 const lm=await fetch(`${base}/models?pageSize=200&key=${K}`);if(!lm.ok)throw Error(lm.status===400||lm.status===403?'The Gemini key was not accepted.':`Gemini returned ${lm.status}.`);
 const all=((await lm.json()).models||[]).filter(m=>(m.supportedGenerationMethods||[]).includes('generateContent')&&/flash/.test(m.name)&&!/image|tts|live|audio|embed|robotics|computer/.test(m.name));
 const good=all.filter(m=>!/lite|preview|exp/.test(m.name)),pool=(good.length?good:all).map(m=>m.name).sort().reverse();
 for(const n of pool.slice(0,3)){const r=await fetch(`${base}/${n}:generateContent?key=${K}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',temperature:.6}})});
  if(!r.ok){log(`Brain model ${n.split('/')[1]} answered ${r.status}, trying the next one`);continue}
  const d=await r.json(),t=(d.candidates?.[0]?.content?.parts||[]).map(p=>p.text||'').join('');try{return JSON.parse(t.replace(/^\s*```(?:json)?|```\s*$/g,'').trim())}catch(e){log('Brain answer was not valid JSON, trying the next model')}}
 throw Error('The brain could not produce an answer.')}
async function runBrain(cl,W){SENTS=sentencesOf(W);SUBJ=detectSubject(W);if(S.brain==='local'&&(mobile||(navigator.deviceMemory||8)<4)){log('On-device AI is too heavy for this device. Using Smart basic instead.');S.brain='smart';sync()}if(SUBJ.name||SUBJ.topic)log(`Brain: the video seems to be about ${[SUBJ.name,SUBJ.topic].filter(Boolean).join(' and ')}`);const note=ctxEl.value.trim(),key=keyEl.value.trim(),kt=keyLines().map(x=>x.t).join(' ').slice(0,700);let res=null;
 if(S.brain==='gemini'){if(!key)log('Brain: Gemini needs a key. Using Smart basic instead.');else{try{log('Brain: asking Gemini for titles, captions, hashtags and intro scripts');const j=await gemini(key,brainPrompt(cl,note,kt));const arr=Array.isArray(j)?j:j.clips;if(Array.isArray(arr))res=arr}catch(e){log('Brain: '+e.message+' Using Smart basic instead.')}}}
 else if(S.brain==='local'){crumb('brainlocal');try{res=[];for(let i=0;i<cl.length;i++){msg(`The on-device brain is writing for clip ${i+1} of ${cl.length}.`);log(`On-device brain: writing for clip ${i+1}`);res.push(await localLLM(cl[i],note,kt));await nap(30)}}catch(e){log('On-device brain failed ('+(e.message||e)+'). Using Smart basic instead.');res=null}}
 else log('Brain: Smart basic, instant and no download');
 cl.forEach((c,i)=>{const L=localBrain(c,note),R=(res&&res[i])||{};c.meta={};for(const k in L){const v=R[k];c.meta[k]=(v&&(Array.isArray(v)?v.length:String(v).trim()))?v:L[k]}c.meta.smart=!!(res&&res[i])})}
function fillMeta(c){const m=c.meta,H=t=>norm(t).join(' ');
 const blocks=[['YouTube title',String(m.title_youtube)],['YouTube description',String(m.description_youtube)+'\n\n'+H(m.hashtags_youtube)],['Instagram caption',String(m.caption_instagram)+'\n\n'+H(m.hashtags_instagram)]];
 if(m.intro_script)blocks.push(['Intro voice script',String(m.intro_script)]);
 const d=document.createElement('details');d.className='copy';const sm=document.createElement('summary');sm.textContent='Titles, captions and hashtags';d.append(sm);
 blocks.forEach(([h,t])=>{const b=document.createElement('div');b.className='cb';const hd=document.createElement('b');hd.textContent=h;const p=document.createElement('p');p.textContent=t;
  const bt=document.createElement('button');bt.type='button';bt.className='chip';bt.textContent='Copy';bt.onclick=async()=>{try{await navigator.clipboard.writeText(t);bt.textContent='Copied'}catch(e){bt.textContent='Select and copy'}setTimeout(()=>bt.textContent='Copy',1500)};b.append(hd,p,bt);d.append(b)});
 c.el.querySelector('.meta').append(d);c.el.querySelector('h4').textContent=String(m.title_youtube).replace(/\s*#shorts$/i,'')}

/* ---------- intro voice (free, runs in the browser) ---------- */
let tts=null,ttsKind='';
async function loadTTS(){if(tts)return;
 if(!mobile){try{log('Loading the natural voice model, about 90 MB the first time');const {KokoroTTS}=await import('https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm');
  tts=await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX',{dtype:'q8',device:'wasm'});ttsKind='kokoro';log('Natural voice ready');return}catch(e){log('Natural voice could not load, switching to the light voice')}}
 log('Loading the light voice model');const {pipeline}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2/+esm');try{tts=await pipeline('text-to-speech','Xenova/mms-tts-eng',{dtype:'q8'})}catch(e){tts=await pipeline('text-to-speech','Xenova/mms-tts-eng')}ttsKind='mms';log('Light voice ready')}
async function speak(text){await loadTTS();const o=ttsKind==='kokoro'?await tts.generate(text,{voice:'af_heart'}):await tts(text);
 const d=o.audio||o.data,sr=o.sampling_rate||o.sr||24000;return{data:d instanceof Float32Array?d:Float32Array.from(d),sr}}

/* ---------- sound effects: the plan is read from the transcript, the sounds are synthesised in the browser ---------- */
const SFXV={subtle:{gap:8,v:.5},normal:{gap:5,v:.8},hype:{gap:3,v:1}};
function sfxPlan(c,level){const L=SFXV[level]||SFXV.normal,ev=[{t:c.s+.02,type:'whoosh',v:L.v*.8}];let last=c.s;
 c.w.forEach((w,i)=>{const k=w.w.toLowerCase().replace(/[^a-z0-9$]/g,''),nx=c.w[i+1];if(!k||w.s<c.s+1||w.s>c.e-.6||w.s-last<L.gap)return;let type=null,tt=w.s-.05;
  if(/^\$?\d|million|thousand|hundred|dollars?|cash|\$/.test(k))type='cash';
  else if(/^(win|wins|won|winner|prize|champion|congrat\w*|victory|record|amazing)$/.test(k))type='cheer';
  else if(/^(fail|failed|lost|lose|eliminated|quit|crying|cried|broke|wrong|mistake|gave)$/.test(k))type='fail';
  else if(/^(wow|crazy|insane|unbelievable|impossible|whoa|damn|huge|massive|seriously|shocking|nobody)$/.test(k))type='boom';
  else if(/\?$/.test(w.w))type='ding';
  else if(nx&&nx.s-w.e>1.1){type='whoosh';tt=nx.s-.25}
  if(level==='subtle'&&(type==='ding'||type==='whoosh'))type=null;
  if(type){ev.push({t:Math.max(c.s,tt),type,v:L.v});last=tt}});
 return ev.sort((a,b)=>a.t-b.t)}
function noiseBuf(ac,sec){const b=ac.createBuffer(1,Math.ceil(ac.sampleRate*sec),ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b}
function playSfx(ac,dest,type,when,vol=.8,dur=1){const T=when;
 const noise=(sec,ft,f0,f1,q,peak,att)=>{const sr=ac.createBufferSource();sr.buffer=noiseBuf(ac,sec+.1);const f=ac.createBiquadFilter();f.type=ft;f.frequency.setValueAtTime(f0,T);f.frequency.exponentialRampToValueAtTime(f1,T+sec);f.Q.value=q;
  const e=ac.createGain();e.gain.setValueAtTime(.0001,T);e.gain.exponentialRampToValueAtTime(peak*vol,T+att);e.gain.exponentialRampToValueAtTime(.0001,T+sec);sr.connect(f);f.connect(e);e.connect(dest);sr.start(T);sr.stop(T+sec+.1)};
 const tone=(f0,f1,sec,peak,wave='sine',delay=0)=>{const o=ac.createOscillator();o.type=wave;o.frequency.setValueAtTime(f0,T+delay);if(f1)o.frequency.exponentialRampToValueAtTime(f1,T+delay+sec);
  const e=ac.createGain();e.gain.setValueAtTime(.0001,T+delay);e.gain.exponentialRampToValueAtTime(peak*vol,T+delay+.01);e.gain.exponentialRampToValueAtTime(.0001,T+delay+sec);o.connect(e);e.connect(dest);o.start(T+delay);o.stop(T+delay+sec+.05)};
 switch(type){
  case 'whoosh':noise(.55,'bandpass',250,3500,1.2,.6,.28);break;
  case 'riser':noise(dur,'bandpass',200,5000,2,.45,dur*.9);break;
  case 'pop':tone(700,160,.12,.7);break;
  case 'ding':tone(1320,0,.7,.35);tone(1760,0,.5,.2);break;
  case 'cash':tone(1568,0,.5,.3);tone(2093,0,.7,.3,'sine',.09);noise(.25,'highpass',5000,7000,.5,.25,.02);break;
  case 'boom':tone(120,38,.9,1);noise(.5,'lowpass',900,120,.8,.7,.01);break;
  case 'cheer':noise(1.5,'bandpass',1400,2600,.7,.5,.15);noise(1.2,'bandpass',900,1800,.8,.3,.1);break;
  case 'fail':[392,370,349,294].forEach((f,i)=>tone(f,f*.97,.28,.3,'sawtooth',i*.26));break}}

/* render one clip in real time, with an optional spoken intro */
async function render(c,prog,pathFn,voice){setSize();const cv=document.createElement('canvas');cv.width=W_;cv.height=H_;const x=cv.getContext('2d'),K=Math.min(W_,H_)/540;x.imageSmoothingQuality='high';
 vid.muted=false;vid.currentTime=c.s;await once(vid,'seeked');
 let st=cv.captureStream(0),vt=st.getVideoTracks()[0];if(!vt||!vt.requestFrame){st=cv.captureStream(30);vt=null}
 const vs=vid.captureStream?vid.captureStream():null,at=vs?vs.getAudioTracks():[];let ac=null,nar=null,intro=0,iw=[],dest=null,ei=0;const sfx=S.sfx!=='off'?sfxPlan(c,S.sfx):[];
 if(voice||sfx.length){try{ac=new AudioContext();await ac.resume();dest=ac.createMediaStreamDestination();if(at.length)ac.createMediaStreamSource(new MediaStream(at)).connect(dest);dest.stream.getAudioTracks().forEach(t=>st.addTrack(t))}
  catch(e){log('Audio mixing is not available here, so this clip is exported without the intro voice and sound effects');try{ac&&ac.close()}catch(e2){}ac=null;dest=null;voice=null;at.forEach(t=>st.addTrack(t))}}
 else at.forEach(t=>st.addTrack(t));
 if(voice){const b=ac.createBuffer(1,voice.data.length,voice.sr);b.copyToChannel(voice.data,0);nar=ac.createBufferSource();nar.buffer=b;nar.connect(dest);
  intro=Math.min(b.duration,18)+.5;const ws=c.meta.intro_script.split(/\s+/).filter(Boolean),tot=ws.reduce((a,w)=>a+w.length+1,0);let acc=0;iw=ws.map(w=>{const s0=acc/tot*b.duration;acc+=w.length+1;return{w,s:s0,e:acc/tot*b.duration}})}
 const mime=['video/mp4;codecs=avc1.640028,mp4a.40.2','video/mp4;codecs=avc1,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm'].find(m=>MediaRecorder.isTypeSupported(m));
 const rec=new MediaRecorder(st,{mimeType:mime,videoBitsPerSecond:Math.round(W_*H_*15),audioBitsPerSecond:192000}),chunks=[];rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
 const done=new Promise(r=>rec.onstop=r);let cx=pathFn?pathFn(c.s):.5,tx=.5,n=0,last=-1;const hist=[];
 pv.style.display='block';rec.start();
 if(voice){nar.start();if(sfx.length&&ac)playSfx(ac,dest,'riser',ac.currentTime,.4,Math.max(1,intro-.3));const t0=performance.now();
  await new Promise(res=>{const lp=()=>{const el=(performance.now()-t0)/1000;if(el>=intro){res();return}
   const z=1+.07*el/intro;x.save();x.translate(W_/2,H_/2);x.scale(z,z);x.translate(-W_/2,-H_/2);frame(x,cx);x.restore();x.fillStyle='rgba(0,0,0,.4)';x.fillRect(0,0,W_,H_);
   x.save();x.font=`800 ${22*K}px "DM Sans",sans-serif`;const lab='THE CONTEXT',bw=x.measureText(lab).width+40*K;x.fillStyle='#ff5c93';x.beginPath();x.roundRect((W_-bw)/2,80*K,bw,46*K,23*K);x.fill();x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';x.fillText(lab,W_/2,103*K);x.restore();
   caps(x,iw,el);pc.drawImage(cv,0,0);if(vt)vt.requestFrame();prog(0);requestAnimationFrame(lp)};lp()})}
 await vid.play();if(voice&&sfx.length&&ac)playSfx(ac,dest,'boom',ac.currentTime,.7);
 let lk=performance.now(),stop=null;const wd=setInterval(()=>{const q=performance.now()-lk;if(q>5000&&q<20000)vid.play().catch(()=>{});if(q>=20000&&stop){log('Playback stalled, ending this clip early');stop()}},2000);
 await new Promise(res=>{stop=res;const go=cb=>vid.requestVideoFrameCallback?vid.requestVideoFrameCallback(cb):requestAnimationFrame(()=>cb(0,{mediaTime:vid.currentTime}));
  const step=(_,md)=>{lk=performance.now();const t=md&&md.mediaTime!=null?md.mediaTime:vid.currentTime;if(t>=c.e||vid.ended){res();return}
   while(ac&&ei<sfx.length&&sfx[ei].t<=t+.3){playSfx(ac,dest,sfx[ei].type,ac.currentTime+Math.max(0,sfx[ei].t-t),sfx[ei].v);ei++}
   if(t-last<(mobile?.03:.015)){go(step);return}last=t;
   if(pathFn)cx=pathFn(t);else{
    if(face&&n++%3===0){try{const d=face.detectForVideo(vid,performance.now()).detections;if(d.length){const b=d.sort((p,q)=>q.boundingBox.width-p.boundingBox.width)[0].boundingBox;
     hist.push((b.originX+b.width/2)/vid.videoWidth);if(hist.length>7)hist.shift();const m=[...hist].sort((p,q)=>p-q)[hist.length>>1];if(Math.abs(m-tx)>.035)tx=m}}catch(e){}}
    cx+=Math.max(-.01,Math.min(.01,(tx-cx)*.07))}
   frame(x,cx);caps(x,c.w,t);pc.drawImage(cv,0,0);if(vt)vt.requestFrame();prog((t-c.s)/(c.e-c.s));go(step)};go(step)});
 clearInterval(wd);vid.pause();rec.stop();await done;ac&&ac.close();pv.style.display='none';return{url:URL.createObjectURL(new Blob(chunks,{type:mime})),ext:mime.includes('mp4')?'mp4':'webm'}}

/* main flow */
const STG=['Listening and transcribing','Choosing the best moments','Writing titles and scripts','Finding the speaker','Rendering clips','All done'];
const step=i=>{$('#stage').textContent=STG[i];log(STG[i]);[...$('#steps').children].forEach((li,k)=>li.className=k<i?'done':k==i?'on':'')};
$('#go').onclick=async()=>{if(!file||busy)return;if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)return msg('This browser cannot export video. Use Chrome on Android or a desktop browser.');busy=true;$('#go').disabled=true;$('#steps').hidden=$('#barw').hidden=$('#live').hidden=false;$('#sum').hidden=true;$('#log').innerHTML='';['model','audio','txt','clips'].forEach(k=>setM(k,0));t0=Date.now();clearInterval(tk);tk=setInterval(()=>$('#elapsed').textContent=fmt((Date.now()-t0)/1000),1000);log('Started');$('#grid').innerHTML='';
 const bar=v=>$('#bar').style.width=Math.round(v*100)+'%';
 try{const fp=initFace();step(0);bar(.02);const W=await transcribe(bar);if(W.length<10)throw Error('No clear speech was found. If the video has talking, run it again.');
  log(`Transcript ready, ${W.length} words`);summary(W);step(1);msg('Choosing the best moments.');let cl=pick(W,S.len);if(!cl.length)cl=pick(W,S.len/2);if(!cl.length)cl=pick(W,S.len/4);if(!cl.length)throw Error('Could not find a moment of that length. Try a shorter clip length.');
  setSize();cl.forEach((c,i)=>{c.el=document.createElement('article');c.el.className='card';c.el.innerHTML='<div class="vp sk"></div><div class="meta"><span class="score"></span><h4></h4><p></p></div>';
   c.el.querySelector('.vp').style.aspectRatio=`${W_} / ${H_}`;c.el.querySelector('.score').textContent=`Hook score ${c.score}`;c.el.querySelector('h4').textContent=c.title;c.el.querySelector('p').textContent=`${fmt(c.s)} to ${fmt(c.e)}`;$('#grid').append(c.el)});
  step(2);msg('The brain is writing titles, captions and hashtags.');await runBrain(cl,W);cl.forEach(fillMeta);log('Titles, captions and hashtags are ready under each clip');
  if(S.voice==='on'&&!cl.some(c=>c.meta.intro_script))log('Intro voice skipped: add a Gemini key or fill in "About this video" to enable it');
  step(3);msg('Loading face tracking.');await fp;log(face?'Face tracking ready':'Face tracking unavailable, using a centered crop');step(4);
  const voices=[];
  if(S.voice==='on'&&cl.some(c=>c.meta.intro_script)){crumb('voice');
   for(let i=0;i<cl.length;i++){if(!cl[i].meta.intro_script){voices.push(null);continue}
    try{msg(`Recording the intro voice, clip ${i+1} of ${cl.length}.`);log(`Generating the intro voice for clip ${i+1}`);voices.push(await speak(cl[i].meta.intro_script))}catch(e){voices.push(null);log('Intro voice failed ('+(e.message||e)+'). Rendering without it.')}}
   try{tts&&tts.dispose&&await tts.dispose()}catch(e){}tts=null;log('Voice model released to free memory');crumb('')}
  for(let i=0;i<cl.length;i++){const c=cl[i];let voice=null,path=null;
   voice=voices[i]||null;
   crumb('scan');try{msg(`Tracking the speaker in clip ${i+1}.`);log(`Scanning clip ${i+1} for the speaker`);path=await scanFace(c,p=>bar((i+p*.3)/cl.length))}catch(e){log('Speaker scan failed, using live tracking')}
   crumb('render');msg(`Rendering clip ${i+1} of ${cl.length}. Keep this tab open and in front.`);log(`Rendering clip ${i+1} of ${cl.length}`);
   const r=await render(c,p=>{bar((i+p)/cl.length);setM('clips',(i+p)/cl.length)},path,voice);log(`Clip ${i+1} ready`);const vp=c.el.querySelector('.vp');vp.classList.remove('sk');vp.innerHTML=`<video src="${r.url}" controls playsinline></video>`;
   const a=document.createElement('a');a.className='btn sm';a.textContent='Download';a.href=r.url;a.download=`snipreel-clip-${i+1}.${r.ext}`;c.el.append(a)}
  step(5);bar(1);setM('clips',1);log('Finished');confetti();msg(face?'All clips are ready. Download the ones you like.':'Clips are ready, centered because face tracking could not load.')}
 catch(e){log('Stopped: '+(e.message||e.name));msg(e.name==='NotReadableError'?'The browser lost access to the file. Choose it again from your phone storage (not Google Photos or Drive) and retry.':'Something went wrong: '+e.message)}
 busy=false;clearInterval(tk);crumb('');$('#go').disabled=false};

/* ---------- motion: scroll reveals, panel spotlight, confetti ---------- */
function confetti(){if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;const box=document.createElement('div');box.className='confetti';const cols=['#7c5cff','#ff5c93','#ffd23f','#3ef2c1'];
 for(let i=0;i<44;i++){const p=document.createElement('i');p.style.cssText=`left:${Math.random()*100}%;background:${cols[i%4]};--dx:${Math.round((Math.random()-.5)*160)}px;--r:${Math.round(Math.random()*720-360)}deg;animation-delay:${(Math.random()*.4).toFixed(2)}s;animation-duration:${(1.8+Math.random()*1.2).toFixed(2)}s`;box.append(p)}
 document.body.append(box);setTimeout(()=>box.remove(),3600)}
(()=>{const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12}):null;
 document.querySelectorAll('.studio>h2,.studio>.opts,.studio>.brain,.how h2,.how li,footer').forEach((el,i)=>{el.classList.add('rv');el.style.setProperty('--d',(i%4)*80+'ms');io?io.observe(el):el.classList.add('in')});
 if(matchMedia('(hover:hover)').matches)document.addEventListener('pointermove',e=>{const p=e.target.closest&&e.target.closest('.panel');if(p){const r=p.getBoundingClientRect();p.style.setProperty('--mx',(e.clientX-r.left)+'px');p.style.setProperty('--my',(e.clientY-r.top)+'px')}})})();

/* tap-to-hear sound effect buttons */
(()=>{const box=$('#prev');if(!box)return;let pa=null;['whoosh','pop','ding','cash','boom','cheer','fail','riser'].forEach(t=>{const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=t[0].toUpperCase()+t.slice(1);
 b.onclick=()=>{try{pa=pa||new (window.AudioContext||window.webkitAudioContext)();pa.resume();playSfx(pa,pa.destination,t,pa.currentTime+.03,.8,1.2)}catch(e){}};box.append(b)})})();

/* crash recovery: explain where the last run stopped and switch off the heavy option */
(()=>{let c=null;try{c=localStorage.getItem('snipreel:crumb')}catch(e){}if(!c)return;const k=c.split('|')[0];
 const M={listening:['reading the audio','Try a shorter video.'],transcribing:['writing the transcript','Try a shorter video.'],brainlocal:['running the on-device brain','I switched the brain to Smart basic.'],voice:['making the intro voice','I turned the intro voice off. You can switch it back on.'],scan:['tracking the speaker','I switched to Fast quality.'],render:['exporting a clip','I switched to Fast quality.']}[k];
 try{localStorage.removeItem('snipreel:crumb')}catch(e){}if(!M)return;
 if(k==='brainlocal')S.brain='smart';if(k==='voice')S.voice='off';if(k==='scan'||k==='render')S.q='fast';sync();
 const el=$('#crash');if(el){el.textContent=`The page stopped unexpectedly last time while ${M[0]}. ${M[1]} (Closing the tab during a run also shows this.) Tap to dismiss.`;el.hidden=false;el.onclick=()=>{el.hidden=true}}})();

/* the on-device model is far too big for phones and low-memory devices, so it is switched off there */
(()=>{if(!mobile&&(navigator.deviceMemory||8)>=4)return;const b=[...$('#c-brain').children].find(x=>x.dataset.v==='local');
 if(b){b.disabled=true;b.title='Needs a desktop computer with enough memory';b.textContent='On-device AI (desktop only)';b.style.opacity='.45';b.style.cursor='not-allowed'}
 if(S.brain==='local'){S.brain='smart';sync()}})();
