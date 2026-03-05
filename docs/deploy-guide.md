# デプロイ手順書（Vercel + Render）

## 前提条件
- GitHubアカウント
- このプロジェクトがGitHubリポジトリにpush済み

---

## Step 1: GitHubリポジトリの準備

```bash
cd medicine-inventory_new
git init
git add .
git commit -m "Initial commit"
```

GitHubで新しいリポジトリを作成し、pushする：
```bash
git remote add origin https://github.com/<your-username>/medicine-inventory.git
git branch -M main
git push -u origin main
```

---

## Step 2: Backend を Render にデプロイ

1. https://render.com にアクセスしてサインアップ（GitHub連携推奨）
2. ダッシュボードで **「New +」→「Web Service」** をクリック
3. GitHubリポジトリ `medicine-inventory` を選択
4. 以下を設定：

| 項目 | 値 |
|---|---|
| Name | `medicine-inventory-api` |
| Region | `Singapore (Southeast Asia)` |
| Root Directory | `backend` |
| Runtime | `Java` |
| Java Version | `17` |
| Build Command | `./gradlew bootJar` |
| Start Command | `java -jar build/libs/medicine-inventory-0.0.1-SNAPSHOT.jar` |
| Instance Type | `Free` |

5. **Environment Variables** を設定：

| Key | Value |
|---|---|
| `DATABASE_URL` | `jdbc:postgresql://db.ynbjkqnyqncvliykwjbp.supabase.co:5432/postgres` |
| `DATABASE_USERNAME` | `postgres` |
| `DATABASE_PASSWORD` | （Supabaseのパスワード） |
| `CORS_ALLOWED_ORIGINS` | （Step 3完了後にVercelのURLを設定） |
| `LINE_CHANNEL_TOKEN` | （LINE Messaging APIのトークン） |
| `LINE_USER_ID` | （LINEのユーザーID） |

6. **「Create Web Service」** をクリック
7. デプロイ完了後、RenderのURL（例: `https://medicine-inventory-api.onrender.com`）をメモ

---

## Step 3: Frontend を Vercel にデプロイ

1. https://vercel.com にアクセスしてサインアップ（GitHub連携推奨）
2. **「Add New Project」** をクリック
3. GitHubリポジトリ `medicine-inventory` をインポート
4. 以下を設定：

| 項目 | 値 |
|---|---|
| Project Name | `medicine-inventory` |
| Framework Preset | `Vite` |
| Root Directory | `frontend` |

5. **Environment Variables** を設定：

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://medicine-inventory-api.onrender.com`（Step 2のRender URL） |

6. **「Deploy」** をクリック
7. デプロイ完了後、VercelのURL（例: `https://medicine-inventory.vercel.app`）をメモ

---

## Step 4: CORS設定を更新

1. Renderのダッシュボードに戻る
2. `medicine-inventory-api` サービスの **Environment** を開く
3. `CORS_ALLOWED_ORIGINS` に VercelのURLを設定：
   ```
   https://medicine-inventory.vercel.app
   ```
4. 保存するとRenderが自動で再デプロイ

---

## Step 5: Render Cron Job の環境変数設定

毎朝8時（JST）に常用薬を自動減算するCron Jobの設定。

### 5-1. シークレット値を生成

```bash
openssl rand -hex 32
# 例: a3f8c2e1d4b7a9f0e2c5d8b1a4f7c3e6...
```

### 5-2. Web Service（`medicine-inventory-api`）に設定

1. Renderダッシュボードで `medicine-inventory-api` をクリック
2. 左メニュー **「Environment」** → **「Add Environment Variable」**
3. 以下を追加して **「Save Changes」**：

| Key | Value |
|---|---|
| `SCHEDULER_SECRET` | （5-1で生成した値） |

### 5-3. Cron Job（`medicine-inventory-scheduler`）に設定

1. ダッシュボードで `medicine-inventory-scheduler` をクリック
2. 左メニュー **「Environment」** → **「Add Environment Variable」**
3. 以下を追加して **「Save Changes」**（5-2と**まったく同じ値**）：

| Key | Value |
|---|---|
| `SCHEDULER_SECRET` | （5-1で生成した値） |

### 5-4. 動作確認

```bash
curl -X POST \
  -H "X-Scheduler-Token: <5-1で生成した値>" \
  https://medicine-inventory-api.onrender.com/api/internal/scheduler/run
# "OK" が返れば成功
```

Renderダッシュボードの **Logs** タブで `常用薬の自動減算開始` のログが出ることを確認する。

---

## Step 6: 動作確認

1. VercelのURL（`https://medicine-inventory.vercel.app`）にアクセス
2. 薬の一覧表示、登録、編集、削除が正常に動作するか確認
3. LINE通知が届くか確認

---

## ローカル開発時の起動方法

### Backend
```bash
cd backend
./gradlew bootRun -Dspring.profiles.active=local
```

### Frontend
```bash
cd frontend
npm run dev
```
（`vite.config.ts` のproxyにより `localhost:8080` に転送されます）

---

## 注意事項

- **Render無料枠の制限**: 15分間アクセスがないとスリープします。再アクセス時に30秒程度の起動時間がかかります。
- **application-local.properties**: このファイルはDB認証情報を含むため `.gitignore` に追加済みです。**絶対にGitHubにpushしないでください。**
- **環境変数の管理**: 本番のDB認証情報はRenderの環境変数でのみ管理します。
