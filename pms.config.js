// 통번역 앱 — 호스팅용 기본 설정
// 이 파일을 index.html 과 같은 폴더에 두면 어느 PC/브라우저에서 열어도 아래 값이 자동 적용됩니다.
// 브라우저에 직접 저장한 값이 있으면 그쪽이 우선합니다.
// 여기에는 "공개돼도 되는 값"만 넣습니다. Anthropic API 키 같은 비밀은 절대 넣지 마세요.
window.PMS_CONFIG = {
  supabaseUrl: "https://vowvnkxqzmizicvubipy.supabase.co",
  supabaseKey: "sb_publishable_oAaEyETDjrhxXu8VcWeCBw_BBjeeRwf",
  claudeVia: "edge",              // Claude 호출: "edge"(Supabase Edge Function 경유) 또는 "direct"
  claudeModel: "claude-sonnet-5"  // 기본 모델
};
