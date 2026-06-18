# タスク管理アプリ（Trello風）

個人のタスクをフォルダ・グループで整理できる Trello 風タスク管理アプリ。  
講義の課題として作成し、将来的にチーム向けへの拡張も視野に入れている。

---

## 機能一覧

| カテゴリ | 機能 |
|---------|------|
| フォルダ | 作成・編集・削除 |
| グループ | 作成・編集・削除・ドラッグ&ドロップ並び替え |
| タスク | 作成・編集・削除・グループ間移動・並び替え |
| タグ | 作成・削除・タスクへの付与 |
| 期限 | 設定・アラート表示（1週間以内：黄、期限切れ：赤） |
| 優先度 | 色による手動設定 |
| ゴミ箱 | 削除タスクの一覧・復元・完全削除 |
| 検索 | キーワードによるタスク絞り込み |

---

## 技術スタック

### フロントエンド
| 項目 | 技術 | バージョン |
|------|------|-----------|
| フレームワーク | React | 19.2.x |
| 言語 | TypeScript | 5.9.x |
| ビルドツール | Vite | 7.3.x |
| ドラッグ&ドロップ | dnd-kit | - |
| スタイリング | Tailwind CSS | 4.2.x |
| パッケージ管理 | npm | 10.9.x |
| Web サーバー | nginx | alpine |

### バックエンド
| 項目 | 技術 | バージョン |
|------|------|-----------|
| 言語 | Java | 25 |
| フレームワーク | Spring Boot | 4.0.6 |
| ビルドツール | Gradle | 9.5.1 |
| ORM | Spring Data JPA / Hibernate | - |
| API 形式 | REST API | - |

### データベース
| 項目 | 技術 | バージョン |
|------|------|-----------|
| RDBMS | PostgreSQL | 15 |

### インフラ
| 項目 | 技術 | バージョン |
|------|------|-----------|
| コンテナ | Docker | 29.5.3 |
| コンテナ管理 | Docker Compose | 5.1.4 |

---

## 画面構成

| 画面 | 内容 |
|------|------|
| フォルダ一覧 | フォルダの一覧表示・作成・編集・削除 |
| ボード画面 | タスクのカンバン表示・検索・ドラッグ&ドロップ |
| タスク詳細 | タスクの詳細表示・編集 |
| 設定 | タグ管理・ゴミ箱 |

### 画面遷移

```
アプリを開く
    └── フォルダ一覧画面
            └── フォルダをクリック → ボード画面
                    └── タスクをクリック → タスク詳細画面
            └── 設定ボタン → 設定画面
```

---

## ポート構成

| サービス | ポート |
|---------|--------|
| nginx（フロントエンド・本番） | 80 |
| Spring Boot（バックエンド） | 8080 |
| PostgreSQL | 5432 |
| Vite dev server（開発時のみ） | 5173 |

---

## 起動方法

### 前提条件
- Docker / Docker Compose がインストールされていること
- Java 25 がインストールされていること
- Node.js / npm がインストールされていること

### 開発時の起動手順

**1. PostgreSQL を起動する**
```bash
docker-compose up -d postgres
```

**2. Spring Boot を起動する**
```bash
cd backend
./gradlew bootRun   # Mac / Linux
gradlew.bat bootRun # Windows
```

**3. フロントエンド開発サーバーを起動する**
```bash
cd frontend
npm install   # 初回のみ
npm run dev
```

**4. ブラウザでアクセスする**
```
http://localhost:5173
```

### 本番確認（nginx でビルド済みファイルを配信）

**1. フロントエンドをビルドする**
```bash
cd frontend
npm run build
```

**2. PostgreSQL・nginx を起動する**
```bash
docker-compose up -d
```

**3. Spring Boot を起動する**
```bash
cd backend
./gradlew bootRun
```

**4. ブラウザでアクセスする**
```
http://localhost/
```

---

## API エンドポイント

| メソッド | エンドポイント | 内容 |
|---------|--------------|------|
| GET | `/api/tasks` | タスク全件取得 |
| GET | `/api/tasks/{id}` | タスク1件取得 |
| GET | `/api/tasks/search?q={keyword}` | キーワードでタスク検索 |
| GET | `/api/folders` | フォルダ全件取得 |
| POST | `/api/folders` | フォルダ作成 |

---

## ディレクトリ構成

```
Tasukumanejimento/
├── backend/                  # Spring Boot バックエンド
│   └── src/main/java/com/taskmanager/
│       ├── controller/       # REST API コントローラー
│       ├── entity/           # エンティティ（Task, Folder）
│       └── repository/       # データアクセス層
├── frontend/                 # React フロントエンド
│   ├── src/
│   │   ├── components/       # React コンポーネント
│   │   ├── types/            # TypeScript 型定義
│   │   ├── App.tsx           # ボード画面
│   │   └── main.tsx          # エントリポイント
│   ├── package.json
│   └── vite.config.ts        # Vite 設定（API プロキシ含む）
├── nginx/
│   └── nginx.conf            # nginx 設定（API プロキシ）
├── docs/                     # 要件定義書
│   ├── 01_purpose-usecase.md
│   ├── 02_non-functional.md
│   ├── 03_structure.md
│   ├── 04_functional.md
│   ├── 05_environment.md
│   ├── 06_prototype-design.md
│   └── 07_prototype-review.md
└── docker-compose.yml
```

---

## 対応環境

- ブラウザ：Google Chrome（最新版）
- デバイス：PC（デスクトップ・ノート）
