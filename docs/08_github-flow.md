# GitHub 運用ルール

## 基本方針

- **master ブランチへの直接プッシュは禁止**（GitHub 側でも設定済み）
- すべての変更は Issue → ブランチ → PR の流れで行う

---

## 作業フロー

```
Issue 作成
    ↓
ブランチ作成（feature/#番号-説明）
    ↓
実装・コミット
    ↓
Pull Request 作成
    ↓
master へマージ
    ↓
Issue 自動クローズ
```

---

## ブランチ命名規則

| 種別 | 形式 | 例 |
|---|---|---|
| 新機能 | `feature/#{番号}-説明` | `feature/#12-task-read-api` |
| バグ修正 | `fix/#{番号}-説明` | `fix/#7-folder-null-error` |
| ドキュメント | `docs/#{番号}-説明` | `docs/#3-api-spec` |

- 説明はハイフン区切りの英語（小文字）
- 日本語は使わない（パスとして扱われるため）

---

## Issue の作り方

### タイトル
何をするかを一言で書く。

```
タスク読み取りAPIを実装する
フォルダ削除時にNullPointerExceptionが発生する
```

### 本文テンプレート

```markdown
## 概要
なぜこの作業が必要か

## やること
- [ ] 〇〇を実装する
- [ ] 〇〇をテストする

## 完了条件
- 〇〇のAPIを叩いてデータが返ること
```

---

## コミットメッセージ

```
#{Issue番号} 変更内容の要約
```

例：
```
#12 Task エンティティとリポジトリを追加
#12 タスク一覧・詳細取得 API を実装
#12 テストデータを投入して動作確認
```

---

## Pull Request の作り方

- **タイトル**: `#12 タスク読み取りAPI実装`
- **本文**: `Closes #12` を書くと PR マージ時に Issue が自動クローズされる

```markdown
## 変更内容
- Task エンティティ追加
- TaskRepository 追加
- TaskController 追加（GET /api/tasks, GET /api/tasks/{id}）

## 確認方法
curl http://localhost:8080/api/tasks でタスク一覧が返ること

Closes #12
```

---

## GitHub 側のブランチ保護設定（設定済み）

- master への直接プッシュ：**禁止**
- force push：**禁止**
- ブランチ削除：**禁止**
- マージ方法：Pull Request 必須
