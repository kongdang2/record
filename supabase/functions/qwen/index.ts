// 통번역 앱 → Alibaba DashScope(싱가포르) Qwen 글 모델 중계 (v10.39)
// 앱은 claude 함수와 같은 모양으로 부른다: {prompt, system, model, max_tokens} → {text, model, usage:{input_tokens, output_tokens}}
// 비밀: DASHSCOPE_API_KEY (livetranslate 함수가 쓰는 Alibaba 키와 같은 값. 이름이 다르면 아래 목록에 있는 이름으로 하나 더 넣으면 된다)
// Supabase 대시보드에서 Verify JWT를 켜 두면 로그인한 사용자만 부를 수 있다(claude 함수와 같게)
const KEY = Deno.env.get('DASHSCOPE_API_KEY') || Deno.env.get('ALIBABA_API_KEY') || Deno.env.get('QWEN_API_KEY') || Deno.env.get('ALI_API_KEY') || '';
const HOST = Deno.env.get('DASHSCOPE_HOST') || 'https://dashscope-intl.aliyuncs.com';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const j = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, 'content-type': 'application/json' } });
  if (!KEY) return j({ error: '서버에 DASHSCOPE_API_KEY 비밀이 없습니다' }, 500);
  let b: any; try { b = await req.json(); } catch { return j({ error: '요청 모양이 잘못됐습니다' }, 400); }
  const model = String(b.model || 'qwen3.5-flash');
  const messages: any[] = [];
  if (b.system) messages.push({ role: 'system', content: String(b.system) });
  messages.push({ role: 'user', content: String(b.prompt || '') });
  const body: any = { model, messages, max_tokens: Math.min(8000, Number(b.max_tokens) || 1500), stream: false };
  if (/^qwen3/.test(model)) body.enable_thinking = false;   // 생각 모드 끄기 — 자막은 빨라야 하고 생각 토큰은 돈만 든다
  let r: Response;
  try {
    r = await fetch(HOST + '/compatible-mode/v1/chat/completions', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + KEY }, body: JSON.stringify(body) });
  } catch (e) { return j({ error: 'Alibaba 연결 실패: ' + (e as Error).message }, 502); }
  const t = await r.text(); let d: any;
  try { d = JSON.parse(t); } catch { return j({ error: 'Alibaba 응답 오류 ' + r.status + ': ' + t.slice(0, 200) }, 502); }
  if (!r.ok) return j({ error: (d.error && d.error.message) || ('Alibaba ' + r.status) }, r.status === 429 ? 429 : 502);
  const text = d.choices?.[0]?.message?.content || '';
  const u = d.usage || {};
  return j({ text, model: d.model || model, usage: { input_tokens: u.prompt_tokens || 0, output_tokens: u.completion_tokens || 0 } });
});
