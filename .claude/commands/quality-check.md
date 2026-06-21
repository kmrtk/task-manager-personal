# Quality Check — Tasukumanejimento

このプロジェクトのフロントエンド・バックエンド・DBの品質を確認するコマンドです。
実装後のPR作成前に必ず実行してください。

## 実行フロー

以下を順番に確認し、カテゴリ別に結果をレポートしてください。

---

## 1. フロントエンド (React / TypeScript)

### 1-1. ESLint チェック
```bash
cd frontend && npm run lint
```
- エラー・警告を一覧表示する
- エラーがあれば修正してから先へ進む

### 1-2. TypeScript コンパイルチェック
```bash
cd frontend && npx tsc --noEmit
```
- 型エラーがないか確認する

### 1-3. コードパターンチェック（手動確認）
以下の観点で `src/` 配下のコードを確認する：

- **useEffect 依存配列**: 依存漏れがないか
- **リスト key prop**: `.map()` で `key` が設定されているか
- **console.log**: 本番コードに残っていないか
- **any 型**: TypeScript の `any` が使われていないか
- **直接 state 変更**: `state.xxx = ...` のような直接変更がないか

### 1-4. ビルドチェック
```bash
cd frontend && npm run build
```
- ビルドエラーがないことを確認する

---

## 2. バックエンド (Spring Boot / Java)

### 2-1. Checkstyle チェック
```bash
cd backend && ./gradlew checkstyleMain
```
- スタイル違反の一覧を表示する
- エラーがあれば修正してから先へ進む

### 2-2. コンパイルチェック
```bash
cd backend && ./gradlew compileJava
```
- コンパイルエラーがないことを確認する

### 2-3. コードパターンチェック（手動確認）
以下の観点で `src/` 配下のコードを確認する：

- **@ControllerAdvice**: グローバル例外ハンドラーが存在するか
- **@Valid**: 全 @RequestBody パラメーターに付いているか
- **バリデーションアノテーション**: エンティティの必須フィールドに `@NotBlank` 等が付いているか
- **@Transactional**: create/update/delete 系メソッドに付いているか
- **CORS**: `origins = "*"` になっていないか（`http://localhost` 等を指定）
- **HTTP ステータスコード**: POST が 201、DELETE が 204 を返しているか
- **ResponseEntity ラップ**: 全エンドポイントで一貫しているか
- **show-sql**: `application.yml` の `show-sql: true` が本番で有効になっていないか

### 2-4. ビルドチェック
```bash
cd backend && ./gradlew build -x test
```
- ビルドエラーがないことを確認する

---

## 3. DB (PostgreSQL)

### 3-1. スキーマ確認
```bash
docker exec -it $(docker ps -qf "name=postgres") psql -U taskuser -d taskmanager -c "\dt"
```
- テーブルが正常に存在するか確認する

### 3-2. application.yml 確認
`backend/src/main/resources/application.yml` を確認し以下をチェック：

- **ddl-auto**: `update` のまま運用していないか（開発時のみ許容）
- **show-sql**: ログが不必要に出力されていないか

---

## 4. レポート形式

チェック完了後、以下の形式で結果を出力してください：

```
## 品質チェック結果

### フロントエンド
| チェック項目 | 結果 | 備考 |
|---|---|---|
| ESLint | ✅ / ❌ | エラー件数や内容 |
| TypeScript | ✅ / ❌ | |
| ビルド | ✅ / ❌ | |
| コードパターン | ✅ / ⚠️ / ❌ | 問題点の概要 |

### バックエンド
| チェック項目 | 結果 | 備考 |
|---|---|---|
| Checkstyle | ✅ / ❌ | |
| コンパイル | ✅ / ❌ | |
| ビルド | ✅ / ❌ | |
| コードパターン | ✅ / ⚠️ / ❌ | 問題点の概要 |

### DB
| チェック項目 | 結果 | 備考 |
|---|---|---|
| スキーマ | ✅ / ❌ | |
| application.yml | ✅ / ⚠️ | |

### 問題点一覧（優先度順）
1. [Critical] ...
2. [High] ...
3. [Medium] ...
4. [Low] ...
```

問題点があれば、修正するか確認を取ってから進めてください。
