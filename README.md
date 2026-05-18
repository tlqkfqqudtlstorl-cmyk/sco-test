# banrye

온라인 저지

## 개발

```bash
npm install
npm run dev
```

## 구조

```
src/
├── app/
│   ├── page.tsx          # 홈
│   └── problems/
│       ├── page.tsx      # 목록
│       └── [id]/page.tsx # 상세
├── components/
│   ├── Navbar.tsx
│   └── CodeEditor.tsx
└── lib/
    └── problems.ts
```

## 기술

- Next.js 16
- TypeScript
- Tailwind CSS
- Monaco Editor
