# 薬在庫管理アプリ DB設計書

## 1. データベース概要

| 項目 | 値 |
|---|---|
| DBMS | PostgreSQL |
| データベース名 | medicine_inventory |
| 文字コード | UTF-8 |

## 2. テーブル一覧

| # | テーブル名 | 説明 |
|---|---|---|
| T1 | users | ユーザー情報 |
| T2 | medicines | 薬の基本情報・在庫情報 |

## 3. テーブル定義

### T1: users（ユーザー）

家族など利用者を管理するテーブル。認証なし（ログイン不要）。

| # | カラム名 | データ型 | NOT NULL | デフォルト | 説明 |
|---|---|---|---|---|---|
| 1 | id | BIGSERIAL | YES | 自動採番 | 主キー |
| 2 | name | VARCHAR(50) | YES | - | ユーザー名 |
| 3 | created_at | TIMESTAMP | YES | CURRENT_TIMESTAMP | 登録日時 |
| 4 | updated_at | TIMESTAMP | YES | CURRENT_TIMESTAMP | 更新日時 |

#### 制約

| 制約名 | 種類 | 対象カラム | 内容 |
|---|---|---|---|
| users_pkey | PRIMARY KEY | id | 主キー |

### T2: medicines（薬）

薬の基本情報と在庫数を管理するテーブル。ユーザーごとに薬を管理する。

| # | カラム名 | データ型 | NOT NULL | デフォルト | 説明 |
|---|---|---|---|---|---|
| 1 | id | BIGSERIAL | YES | 自動採番 | 主キー |
| 2 | user_id | BIGINT | YES | - | ユーザーID（外部キー） |
| 3 | name | VARCHAR(100) | YES | - | 薬名 |
| 4 | usage_type | VARCHAR(20) | YES | 'REGULAR' | 種別（REGULAR: 常用 / AS_NEEDED: 頓服） |
| 5 | quantity | INTEGER | YES | 0 | 現在の在庫数 |
| 6 | expiration_date | DATE | NO | NULL | 使用期限 |
| 7 | daily_dose | INTEGER | YES | 0 | 1日の服用数（常用薬の自動減算に使用） |
| 8 | alert_threshold | INTEGER | YES | 0 | アラート閾値（この数以下でLINE通知） |
| 9 | created_at | TIMESTAMP | YES | CURRENT_TIMESTAMP | 登録日時 |
| 10 | updated_at | TIMESTAMP | YES | CURRENT_TIMESTAMP | 更新日時 |

#### 制約

| 制約名 | 種類 | 対象カラム | 内容 |
|---|---|---|---|
| medicines_pkey | PRIMARY KEY | id | 主キー |
| medicines_user_id_fkey | FOREIGN KEY | user_id | users(id) を参照 |
| medicines_quantity_check | CHECK | quantity | quantity >= 0（負数禁止） |
| medicines_alert_threshold_check | CHECK | alert_threshold | alert_threshold >= 0（負数禁止） |
| medicines_usage_type_check | CHECK | usage_type | 'REGULAR' または 'AS_NEEDED' のみ許可 |

#### インデックス

| インデックス名 | 対象カラム | 用途 |
|---|---|---|
| idx_medicines_user_id | user_id | ユーザーごとの薬一覧取得の高速化 |
| idx_medicines_name | name | 薬名検索（F4）の高速化 |

## 4. ER図

```
+------------------------+       +----------------------------+
|        users           |       |        medicines           |
+------------------------+       +----------------------------+
| PK  id      BIGSERIAL  |──1:N──| PK  id          BIGSERIAL  |
|     name    VARCHAR(50) |       | FK  user_id     BIGINT     |
|     created_at TIMESTAMP|       |     name        VARCHAR    |
|     updated_at TIMESTAMP|       |     usage_type  VARCHAR    |
+------------------------+       |     quantity    INTEGER     |
                                 |     expiration_date DATE   |
                                 |     daily_dose  INTEGER    |
                                 |     alert_threshold INTEGER|
                                 |     created_at  TIMESTAMP  |
                                 |     updated_at  TIMESTAMP  |
                                 +----------------------------+
```

## 5. 機能とテーブルの対応

| 機能 | 対応する操作 |
|---|---|
| F1: 薬の登録 | INSERT into medicines (user_id指定) |
| F2: 薬の編集・削除 | UPDATE / DELETE on medicines WHERE user_id = ? |
| F3: 在庫一覧表示 | SELECT from medicines WHERE user_id = ? |
| F4: 検索 | SELECT from medicines WHERE user_id = ? AND name LIKE ... |
| F5: 在庫数の増減 | UPDATE medicines SET quantity = ... WHERE user_id = ? |
| F6: 在庫数アラート | SELECT where user_id = ? AND quantity <= alert_threshold |
| F7: ユーザー登録 | INSERT into users |
| F8: 常用薬の自動減算 | SELECT from medicines WHERE usage_type = 'REGULAR' AND quantity > 0 AND daily_dose > 0 → UPDATE quantity |
