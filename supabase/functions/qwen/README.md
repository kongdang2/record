# qwen Edge Function 배포 (Supabase 대시보드)
1. Supabase 프로젝트 › Edge Functions › Deploy a new function › 이름 `qwen`.
2. index.ts 내용을 붙여 넣고 Deploy.
3. 설정(Secrets)에 `DASHSCOPE_API_KEY` = Alibaba Model Studio(싱가포르) API 키. livetranslate 함수가 쓰는 키와 같은 값이면 된다(이미 같은 이름으로 있으면 그대로).
4. Verify JWT: claude 함수와 같게(켜 둠).
5. 앱 설정 › 모델에서 번역(통역) 또는 정리 모델을 Qwen으로 고르면 바로 쓴다. 배포 전에는 「서버 함수 qwen이 아직 배포되지 않았습니다」 안내가 뜬다.
