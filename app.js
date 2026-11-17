const $=s=>document.querySelector(s),once=(e,n)=>new Promise(r=>e.addEventListener(n,r,{once:true}));
const GR={natural:'none',cinema:'contrast(1.18) saturate(1.25) sepia(.18) hue-rotate(-10deg) brightness(.97)',vivid:'saturate(1.6) contrast(1.1)',warm:'sepia(.3) saturate(1.3) brightness(1.04)',cool:'hue-rotate(12deg) saturate(1.1) contrast(1.08) brightness(1.02)',noir:'grayscale(1) contrast(1.35)'};
const DOT={natural:'#bbb',cinema:'#c9744a',vivid:'#ff3d81',warm:'#ffb347',cool:'#4cc9f0',noir:'#444'};
const S={grade:'cinema',cap:'pop',len:30};let file=null,busy=false,face=null;
const vid=document.createElement('video');vid.playsInline=true;vid.preload='auto';
const mobile=/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)||matchMedia('(pointer:coarse)').matches;
const W_=mobile?432:540,H_=mobile?768:960,pv=$('#pv'),pc=pv.getContext('2d');pv.width=W_;pv.height=H_;

/* chips */
function chips(id,key,items){const el=$(id);items.forEach(([v,l,d])=>{const b=document.createElement('button');b.className='chip';b.type='button';b.innerHTML=(d?`<i style="background:${d}"></i>`:'')+l;b.onclick=()=>{S[key]=v;sync()};b.dataset.v=v;el.append(b)});
 el.sync=()=>[...el.children].forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v==S[key])));return el}
const cs=[chips('#c-grade','grade',Object.keys(GR).map(k=>[k,k[0].toUpperCase()+k.slice(1),DOT[k]])),chips('#c-cap','cap',[['pop','Pop'],['clean','Clean'],['neon','Neon'],['box','Highlight box'],['comic','Comic'],['fire','Fire'],['ice','Ice'],['type','Typewriter']]),chips('#c-len','len',[[15,'15s'],[30,'30s'],[45,'45s'],[60,'60s']])];
const sync=()=>cs.forEach(c=>c.sync());sync();

/* drawing */
function frame(x,cx){const vw=vid.videoWidth,vh=vid.videoHeight;let ch=vh,cw=vh*9/16;if(cw>vw){cw=vw;ch=vw*16/9}
 const sx=Math.min(Math.max(cx*vw-cw/2,0),vw-cw),sy=(vh-ch)/2;x.filter=GR[S.grade];x.drawImage(vid,sx,sy,cw,ch,0,0,W_,H_);x.filter='none'}
const TH={
 pop:{up:1,on:'#ffd23f',off:'#fff'},
 clean:{on:'#fff',off:'#ffffffa0'},
 neon:{up:1,on:'#3ef2c1',off:'#fff',glow:'#3ef2c1'},
 box:{up:1,on:'#fff',off:'#fff',box:'#ff5c93'},
 comic:{up:1,on:'#fff',off:'#ffd23f',hard:'#ff5c93'},
 fire:{up:1,on:'#ff9a1f',off:'#fff',glow:'#ff3d00'},
 ice:{on:'#8fe3ff',off:'#fff',glow:'#4cc9f0'},
 type:{font:'"Courier New",monospace',on:'#3ef2c1',off:'#fff',bar:'#000000b8'}};
function caps(x,ws,t){if(!ws.length)return;let i=ws.findIndex(w=>t<w.e);if(i<0)i=ws.length-1;const g=Math.floor(i/3)*3,seg=ws.slice(g,g+3),T=TH[S.cap]||TH.pop;
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
const DW='Hook them in the first three seconds'.split(' ').map((w,i)=>({w,s:i*.5,e:i*.5+.5}));
let lt=0;function tick(n){if(!busy&&n-lt>(mobile?90:30)){lt=n;const t=n/1000;if(!file){const g=pc.createLinearGradient(0,0,W_,H_);g.addColorStop(0,`hsl(${250+Math.sin(t)*25} 70% 28%)`);g.addColorStop(1,`hsl(${330+Math.cos(t*.8)*25} 75% 38%)`);pc.fillStyle=g;pc.fillRect(0,0,W_,H_);
 pc.fillStyle='#ffffff22';pc.beginPath();pc.arc(W_/2,330+Math.sin(t*1.3)*14,110,0,7);pc.fill();pc.fillRect(W_/2-150,450,300,420)}else if(vid.readyState>1)frame(pc,.5);caps(pc,DW,t%3.5)}requestAnimationFrame(tick)}
requestAnimationFrame(tick);

/* tilt */
const ph=$('#phone');addEventListener('pointermove',e=>{ph.style.setProperty('--ry',((e.clientX/innerWidth-.5)*16-8)+'deg');ph.style.setProperty('--rx',((.5-e.clientY/innerHeight)*10)+'deg')});

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
 const mk=o=>pipeline('automatic-speech-recognition','Xenova/whisper-tiny.en',{...o,progress_callback:cb});let r;
 if(mobile)r=await mk({device:'wasm',dtype:'q8'});else{try{r=await mk({device:navigator.gpu?'webgpu':'wasm'})}catch(e){log('GPU mode failed, switching to CPU');r=await mk({device:'wasm',dtype:'q8'})}}
 setM('model',1);log('Speech model ready');return r}
/* low-memory audio capture: plays the file silently and records 16 kHz mono, never loads the whole file into RAM */
async function audioStream(rate,bar){const av=document.createElement('video');av.src=vid.src;av.playsInline=true;av.preload='auto';
 av.style.cssText='position:fixed;left:0;top:0;width:2px;height:2px;opacity:0;pointer-events:none';document.body.append(av);
 await once(av,'loadedmetadata');log(`Audio source opened, ${fmt(av.duration)} long, reading at ${rate}x speed`);
 const ac=new AudioContext({sampleRate:16000}),src=ac.createMediaElementSource(av),sp=ac.createScriptProcessor(4096,1,1),z=ac.createGain();z.gain.value=0;
 const parts=[];sp.onaudioprocess=e=>parts.push(new Float32Array(e.inputBuffer.getChannelData(0)));src.connect(sp);sp.connect(z);z.connect(ac.destination);
 av.playbackRate=rate;await ac.resume();await av.play();log('Playback started');
 await new Promise(res=>{let last=-1,still=0,lg=0;const fin=w=>{clearInterval(iv);log(w);res()};
  const iv=setInterval(()=>{const p=Math.min(1,av.currentTime/av.duration);setM('audio',p);bar(.02+p*.3);msg(`Listening to the audio, ${Math.round(p*100)}%.`);
   if(Math.floor(p*5)>lg){lg=Math.floor(p*5);log(`Listening, ${lg*20}%`)}
   if(av.ended||av.duration-av.currentTime<.3)return fin('Audio captured');
   if(av.currentTime===last){still++;if(still===6){log('Playback stalled, nudging it');av.play().catch(()=>{})}if(still>=30)return fin('Playback stopped early, using the audio captured so far')}else{still=0;last=av.currentTime}},500)});
 setM('audio',1);ac.close();av.remove();const n=parts.reduce((t,q)=>t+q.length,0),out=new Float32Array(n);let o=0;parts.forEach(q=>{out.set(q,o);o+=q.length});return out}
async function transcribe(bar){const lp=loadASR();let a,rate=1;
 try{if(mobile)throw 0;log('Decoding audio on this device');const ac=new AudioContext({sampleRate:16000}),buf=await ac.decodeAudioData(await file.arrayBuffer());a=buf.getChannelData(0);setM('audio',1)}catch(e){rate=2;log('Using low-memory audio capture');a=await audioStream(rate,bar)}
 msg('Loading the speech model.');const asr=await lp;const ib=$('#b-txt').parentElement;ib.classList.add('ind');
 log('Transcribing speech. This is the slowest step and has no percentage, but the timer above keeps running.');msg('Writing the transcript. This can take a few minutes.');
 const o=await asr(a,{return_timestamps:'word',chunk_length_s:30,stride_length_s:5});ib.classList.remove('ind');setM('txt',1);
 return o.chunks.map(c=>({w:c.text.trim(),s:c.timestamp[0]*rate,e:(c.timestamp[1]??c.timestamp[0]+.3)*rate})).filter(w=>w.w)}
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
 const st=cv.captureStream(30);(vid.captureStream?vid.captureStream():{getAudioTracks:()=>[]}).getAudioTracks().forEach(t=>st.addTrack(t));
 const mime=['video/mp4;codecs=avc1,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm'].find(m=>MediaRecorder.isTypeSupported(m));
 const rec=new MediaRecorder(st,{mimeType:mime,videoBitsPerSecond:5e6}),chunks=[];rec.ondataavailable=e=>e.data.size&&chunks.push(e.data);
 const done=new Promise(r=>rec.onstop=r);let cx=.5,n=0;rec.start();await vid.play();
 await new Promise(res=>{const loop=()=>{const t=vid.currentTime;if(t>=c.e||vid.ended){res();return}
  if(face&&n++%5===0){try{const d=face.detectForVideo(vid,performance.now()).detections;if(d.length){const b=d.sort((p,q)=>q.boundingBox.width-p.boundingBox.width)[0].boundingBox;cx+=((b.originX+b.width/2)/vid.videoWidth-cx)*.6}}catch(e){}}
  frame(x,cx);caps(x,c.w,t);pc.drawImage(cv,0,0);prog((t-c.s)/(c.e-c.s));requestAnimationFrame(loop)};loop()});
 vid.pause();rec.stop();await done;return{url:URL.createObjectURL(new Blob(chunks,{type:mime})),ext:mime.includes('mp4')?'mp4':'webm'}}

/* main flow */
const STG=['Listening to the audio','Choosing the best moments','Finding the speaker','Rendering clips','All done'];
const step=i=>{$('#stage').textContent=STG[i];log(STG[i]);[...$('#steps').children].forEach((li,k)=>li.className=k<i?'done':k==i?'on':'')};
$('#go').onclick=async()=>{if(!file||busy)return;if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)return msg('This browser cannot export video. Use Chrome on Android or a desktop browser.');busy=true;$('#go').disabled=true;$('#steps').hidden=$('#barw').hidden=$('#live').hidden=false;$('#sum').hidden=true;$('#log').innerHTML='';['model','audio','txt','clips'].forEach(k=>setM(k,0));t0=Date.now();clearInterval(tk);tk=setInterval(()=>$('#elapsed').textContent=fmt((Date.now()-t0)/1000),1000);log('Started');$('#grid').innerHTML='';$('#recl').textContent='Rendering live';
 const bar=v=>$('#bar').style.width=Math.round(v*100)+'%';
 try{const fp=initFace();step(0);bar(.02);const W=await transcribe(bar);if(W.length<10)throw Error('No clear speech was found in this video.');
  log(`Transcript ready, ${W.length} words`);summary(W);step(1);msg('Choosing the best moments.');const cl=pick(W,S.len);if(!cl.length)throw Error('Could not find a moment of that length. Try a shorter clip length.');
  cl.forEach((c,i)=>{c.el=document.createElement('article');c.el.className='card';c.el.innerHTML='<div class="vp sk"></div><div class="meta"><span class="score"></span><h4></h4><p></p></div>';
   c.el.querySelector('.score').textContent=`Hook score ${c.score}`;c.el.querySelector('h4').textContent=c.title;c.el.querySelector('p').textContent=`${fmt(c.s)} to ${fmt(c.e)}`;$('#grid').append(c.el)});
  step(2);msg('Loading face tracking.');await fp;log(face?'Face tracking ready':'Face tracking unavailable, using a centered crop');step(3);
  for(let i=0;i<cl.length;i++){const c=cl[i];msg(`Rendering clip ${i+1} of ${cl.length}. Keep this tab open and in front.`);log(`Rendering clip ${i+1} of ${cl.length}`);
   const r=await render(c,p=>{bar((i+p)/cl.length);setM('clips',(i+p)/cl.length)});log(`Clip ${i+1} ready`);const vp=c.el.querySelector('.vp');vp.classList.remove('sk');vp.innerHTML=`<video src="${r.url}" controls playsinline></video>`;
   const a=document.createElement('a');a.className='btn sm';a.textContent='Download';a.href=r.url;a.download=`snipreel-clip-${i+1}.${r.ext}`;c.el.append(a)}
  step(4);bar(1);setM('clips',1);log('Finished');msg(face?'All clips are ready. Download the ones you like.':'Clips are ready, centered because face tracking could not load.')}
 catch(e){log('Stopped: '+(e.message||e.name));msg(e.name==='NotReadableError'?'The browser lost access to the file. Choose it again from your phone storage (not Google Photos or Drive) and retry.':'Something went wrong: '+e.message)}
 busy=false;clearInterval(tk);$('#go').disabled=false;$('#recl').textContent='Live preview'};
