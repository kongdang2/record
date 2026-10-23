/* 통번역 앱 오프라인 열람(v10.74) — 앱 파일을 기기에 저장해 두고, 인터넷이 없으면 저장본으로 연다.
   같은 사이트 파일은 인터넷 우선(새 버전이 바로 반영되게, 6초 안에 답이 없거나 끊기면 저장본),
   라이브러리·글꼴(CDN)은 저장본 우선 + 뒤에서 새로 받아 둔다. 서버(Supabase·Claude) 요청과 version.json은 건드리지 않는다 */
const CACHE='tb-offline-v1';
const SHELL=['./','./index.html','./pms.config.js','./manifest.json','./icon-180.png','./icon-192.png'];
const CDN=/^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//;
const LIBS=['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js'];   /* 로그인·저장에 쓰는 라이브러리 — 처음 열 때 미리 받아 둔다 */
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all([
  ...SHELL.map(u=>c.add(u).catch(()=>{})),
  ...LIBS.map(u=>fetch(u).then(res=>res.ok&&c.put(u,res)).catch(()=>{}))])));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===self.location.origin){
    if(/version\.json$|sw\.js$/.test(u.pathname)||/\.(webm|m4a|mp3|wav|ogg)$/i.test(u.pathname))return;
    e.respondWith(netFirst(r));return;}
  if(CDN.test(r.url))e.respondWith(cacheFirst(r,e));
});
async function netFirst(r){
  const c=await caches.open(CACHE);
  const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r.mode==='navigate'?'./index.html':r,res.clone()).catch(()=>{});return res;});
  const saved=()=>c.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?c.match('./index.html'):null));
  try{return await Promise.race([net,new Promise((_,no)=>setTimeout(()=>no(new Error('timeout')),6000))]);}
  catch(err){const m=await saved();if(m)return m;return net;}
}
async function cacheFirst(r,e){
  const c=await caches.open(CACHE);const m=await c.match(r);
  const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone()).catch(()=>{});return res;});
  if(m){e.waitUntil(net.catch(()=>{}));return m;}
  return net;
}
