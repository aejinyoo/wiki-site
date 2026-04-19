# wiki-site

`aejinyoo/wiki` 의 데일리 브리프 + 위키 아이템을 렌더하는 정적 사이트. Astro + Tailwind v4.

## 개발

```sh
# 최초 클론
git clone --recurse-submodules https://github.com/aejinyoo/wiki-site
cd wiki-site
pnpm install

# 콘텐츠 repo 만 최신화
git submodule update --remote src/content/wiki-data

# 로컬 서버 (localhost:4321)
pnpm dev

# 프로덕션 빌드
pnpm build
```

## 배포 (Cloudflare Pages)

- Framework preset: **Astro**
- Build command: `pnpm build`
- Build output directory: `dist`
- Root directory: `/`
- **Submodule 체크아웃 활성화 필요** (Settings → Build & deployments → Build configuration → Include submodules)
- Environment variable: `NODE_VERSION = 22`

## 구조

```
src/
├── content/
│   ├── wiki-data/       # submodule → aejinyoo/wiki
│   └── ...
├── content.config.ts    # Astro collections schema
├── components/          # Nav, Footer, Card, Chip, WikiSidebar, ...
├── layouts/             # Base, Wiki
├── lib/                 # collections, dates, categories, daily-content
├── pages/               # 라우트
└── styles/global.css    # Tailwind v4 + 토큰
```

자세한 스펙은 `docs/wiki-site-spec.md` 참고.
