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
const S={grade:'cinema',cap:'pop',len:30};let file=null,busy=false,face=null;
const vid=document.createElement('video');vid.playsInline=true;vid.preload='auto';
const mobile=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)||matchMedia('(pointer:coarse)').matches;
const MODEL=mobile?'Xenova/whisper-tiny.en':'Xenova/whisper-base.en';
const W_=mobile?432:540,H_=mobile?768:960,pv=$('#pv'),pc=pv.getContext('2d');pv.width=W_;pv.height=H_;

/* chips */
function chips(id,key,items){const el=$(id);items.forEach(([v,l,d])=>{const b=document.createElement('button');b.className='chip';b.type='button';b.innerHTML=(d?`<i style="background:${d}"></i>`:'')+l;b.onclick=()=>{S[key]=v;sync()};b.dataset.v=v;el.append(b)});
 el.sync=()=>[...el.children].forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v==S[key])));return el}
const cs=[chips('#c-grade','grade',Object.keys(GR).map(k=>[k,k[0].toUpperCase()+k.slice(1),DOT[k]])),chips('#c-cap','cap',[['pop','Pop'],['clean','Clean'],['neon','Neon'],['box','Highlight box'],['comic','Comic'],['fire','Fire'],['ice','Ice'],['type','Typewriter']]),chips('#c-len','len',[[15,'15s'],[30,'30s'],[45,'45s'],[60,'60s']])];
const sync=()=>cs.forEach(c=>c.sync());sync();

/* drawing */
function frame(x,cx){const vw=vid.videoWidth,vh=vid.videoHeight;let ch=vh,cw=vh*9/16;if(cw>vw){cw=vw;ch=vw*16/9}
 const sx=Math.min(Math.max(cx*vw-cw/2,0),vw-cw),sy=(vh-ch)/2,G=GR[S.grade]||GR.natural;
 x.filter=G.f;x.drawImage(vid,sx,sy,cw,ch,0,0,W_,H_);x.filter='none';
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
 const txt=w=>T.up?w.w.toUpperCase():w.w,fam=T.font||'"Bricolage Grotesque",sans-serif',wt=T.font?700:800;const K=W_/540;let fs=62*K,sp=16*K,tw;
 const set=()=>{x.font=`${wt} ${fs}px ${fam}`;tw=seg.reduce((a,w)=>a+x.measureText(txt(w)).width,0)+sp*(seg.length-1)};
 set();if(tw>470*K){fs*=470*K/tw;sp*=470*K/tw;set()}
 x.textBaseline='middle';x.textAlign='left';x.lineJoin='round';x.lineWidth=fs/5;let px=(W_-tw)/2;const y=H_*.72;
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
 face=await m.FaceDetector.createFromOptions(fs,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite'},runningMode:'VIDEO'})}catch(e){face=null}}
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
 const lp=loadASR();let a,rate=1;
 try{log('Decoding the audio straight from the file');a=await decodeAll();setM('audio',1);bar(.3);log(`Audio decoded, ${fmt(a.length/16000)} of sound`)}catch(e){rate=vid.duration>300?1.5:1;log(`Direct decoding failed (${e.name||e.message}). Listening in real time instead.`);a=await audioStream(rate,bar)}
 msg('Loading the speech model.');const asr=await lp;
 const segs=splits(a),words=[];log(`Transcribing in ${segs.length} parts`);
 for(let i=0;i<segs.length;i++){const [p,q]=segs[i];msg(`Writing the transcript, part ${i+1} of ${segs.length}.`);bar(.32+.3*i/segs.length);
  let o;try{o=await asr(a.slice(p,q),{return_timestamps:'word',no_repeat_ngram_size:4})}catch(e){try{o=await asr(a.slice(p,q),{return_timestamps:'word'})}catch(e2){log(`Part ${i+1} failed, skipping it`);continue}}
  const off=p/16000;(o.chunks||[]).forEach(c=>{const w=c.text.trim();if(w)words.push({w,s:c.timestamp[0]+off,e:(c.timestamp[1]??c.timestamp[0]+.3)+off})});
  setM('txt',(i+1)/segs.length);log(`Transcribed part ${i+1} of ${segs.length}, ${words.length} words so far`);await nap(40)}
 const out=clean(words,a,rate);try{localStorage.setItem(key,JSON.stringify(out))}catch(e){}return out}
function pick(W,len){const Sx=[];let cur=[];W.forEach((x,i)=>{cur.push(x);const n=W[i+1];if(/[.?!]$/.test(x.w)||(n&&n.s-x.e>.7)){Sx.push(cur);cur=[]}});if(cur.length)Sx.push(cur);
 const hook=/\b(secret|never|always|why|how|mistake|truth|biggest|best|worst|actually|imagine|stop|learn|money|free|nobody|everyone|important)\b/i,cand=[];
 for(let i=0;i<Sx.length;i++){let w=[];for(let j=i;j<Sx.length;j++){w=w.concat(Sx[j]);const d=w.at(-1).e-w[0].s;if(d>len*1.25)break;if(d<len*.6)continue;
  const t=w.map(x=>x.w).join(' '),f=Sx[i].map(x=>x.w).join(' ');let sc=w.length/d+(t.match(/\?/g)||[]).length*.8+(t.match(/!/g)||[]).length*.5+(t.match(/\d+/g)||[]).length*.3+(hook.test(f)?2:0)+(/\?$/.test(Sx[i].at(-1).w)?1:0);
  cand.push({s:w[0].s,e:w.at(-1).e,sc,w,title:t.split(' ').slice(0,8).join(' ')+'…'})}}
 cand.sort((a,b)=>b.sc-a.sc);const out=[];for(const c of cand){if(out.length>=5)break;if(out.every(k=>c.e<=k.s||c.s>=k.e))out.push(c)}
 const hi=Math.max(...out.map(c=>c.sc)),lo=Math.min(...out.map(c=>c.sc));out.forEach(c=>c.score=Math.round(62+37*(c.sc-lo)/((hi-lo)||1)));return out}

/* render one clip in real time */
async function render(c,prog){const cv=document.createElement('canvas');cv.width=W_;cv.height=H_;const x=cv.getContext('2d');
 vid.currentTime=c.s;await once(vid,'seeked');
 let st=cv.captureStream(0),vt=st.getVideoTracks()[0];if(!vt||!vt.requestFrame){st=cv.captureStream(30);vt=null}
 (vid.captureStream?vid.captureStream():{getAudioTracks:()=>[]}).getAudioTracks().forEach(t=>st.addTrack(t));
 const mime=['video/mp4;codecs=avc1,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm'].find(m=>MediaRecorder.isTypeSupported(m));
 const rec=new MediaRecorder(st,{mimeType:mime,videoBitsPerSecond:6e6}),chunks=[];rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
 const done=new Promise(r=>rec.onstop=r);let cx=.5,tx=.5,n=0,last=-1;const hist=[];
 pv.style.display='block';rec.start();await vid.play();
 let lk=performance.now(),stop=null;const wd=setInterval(()=>{const q=performance.now()-lk;if(q>5000&&q<20000)vid.play().catch(()=>{});if(q>=20000&&stop){log('Playback stalled, ending this clip early');stop()}},2000);
 await new Promise(res=>{stop=res;const go=cb=>vid.requestVideoFrameCallback?vid.requestVideoFrameCallback(cb):requestAnimationFrame(()=>cb(0,{mediaTime:vid.currentTime}));
  const step=(_,md)=>{lk=performance.now();const t=md&&md.mediaTime!=null?md.mediaTime:vid.currentTime;if(t>=c.e||vid.ended){res();return}
   if(t-last<.03){go(step);return}last=t;
   if(face&&n++%3===0){try{const d=face.detectForVideo(vid,performance.now()).detections;if(d.length){const b=d.sort((p,q)=>q.boundingBox.width-p.boundingBox.width)[0].boundingBox;
    hist.push((b.originX+b.width/2)/vid.videoWidth);if(hist.length>7)hist.shift();const m=[...hist].sort((p,q)=>p-q)[hist.length>>1];if(Math.abs(m-tx)>.035)tx=m}}catch(e){}}
   cx+=Math.max(-.01,Math.min(.01,(tx-cx)*.07));
   frame(x,cx);caps(x,c.w,t);pc.drawImage(cv,0,0);if(vt)vt.requestFrame();prog((t-c.s)/(c.e-c.s));go(step)};go(step)});
 clearInterval(wd);vid.pause();rec.stop();await done;pv.style.display='none';return{url:URL.createObjectURL(new Blob(chunks,{type:mime})),ext:mime.includes('mp4')?'mp4':'webm'}}

/* main flow */
const STG=['Listening and transcribing','Choosing the best moments','Finding the speaker','Rendering clips','All done'];
const step=i=>{$('#stage').textContent=STG[i];log(STG[i]);[...$('#steps').children].forEach((li,k)=>li.className=k<i?'done':k==i?'on':'')};
$('#go').onclick=async()=>{if(!file||busy)return;if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)return msg('This browser cannot export video. Use Chrome on Android or a desktop browser.');busy=true;$('#go').disabled=true;$('#steps').hidden=$('#barw').hidden=$('#live').hidden=false;$('#sum').hidden=true;$('#log').innerHTML='';['model','audio','txt','clips'].forEach(k=>setM(k,0));t0=Date.now();clearInterval(tk);tk=setInterval(()=>$('#elapsed').textContent=fmt((Date.now()-t0)/1000),1000);log('Started');$('#grid').innerHTML='';
 const bar=v=>$('#bar').style.width=Math.round(v*100)+'%';
 try{const fp=initFace();step(0);bar(.02);const W=await transcribe(bar);if(W.length<10)throw Error('No clear speech was found. If the video has talking, run it again.');
  log(`Transcript ready, ${W.length} words`);summary(W);step(1);msg('Choosing the best moments.');const cl=pick(W,S.len);if(!cl.length)throw Error('Could not find a moment of that length. Try a shorter clip length.');
  cl.forEach((c,i)=>{c.el=document.createElement('article');c.el.className='card';c.el.innerHTML='<div class="vp sk"></div><div class="meta"><span class="score"></span><h4></h4><p></p></div>';
   c.el.querySelector('.score').textContent=`Hook score ${c.score}`;c.el.querySelector('h4').textContent=c.title;c.el.querySelector('p').textContent=`${fmt(c.s)} to ${fmt(c.e)}`;$('#grid').append(c.el)});
  step(2);msg('Loading face tracking.');await fp;log(face?'Face tracking ready':'Face tracking unavailable, using a centered crop');step(3);
  for(let i=0;i<cl.length;i++){const c=cl[i];msg(`Rendering clip ${i+1} of ${cl.length}. Keep this tab open and in front.`);log(`Rendering clip ${i+1} of ${cl.length}`);
   const r=await render(c,p=>{bar((i+p)/cl.length);setM('clips',(i+p)/cl.length)});log(`Clip ${i+1} ready`);const vp=c.el.querySelector('.vp');vp.classList.remove('sk');vp.innerHTML=`<video src="${r.url}" controls playsinline></video>`;
   const a=document.createElement('a');a.className='btn sm';a.textContent='Download';a.href=r.url;a.download=`snipreel-clip-${i+1}.${r.ext}`;c.el.append(a)}
  step(4);bar(1);setM('clips',1);log('Finished');msg(face?'All clips are ready. Download the ones you like.':'Clips are ready, centered because face tracking could not load.')}
 catch(e){log('Stopped: '+(e.message||e.name));msg(e.name==='NotReadableError'?'The browser lost access to the file. Choose it again from your phone storage (not Google Photos or Drive) and retry.':'Something went wrong: '+e.message)}
 busy=false;clearInterval(tk);$('#go').disabled=false};
