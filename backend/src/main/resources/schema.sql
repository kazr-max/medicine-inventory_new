-- 薬在庫管理アプリ DDL
-- DBMS: PostgreSQL

-- データベース作成（必要に応じて実行）
-- CREATE DATABASE medicine_inventory;

-- usersテーブル
CREATE TABLE IF NOT EXISTS users (
    id         BIGSERIAL    PRIMARY KEY,
    name       VARCHAR(50)  NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- medicinesテーブル
CREATE TABLE IF NOT EXISTS medicines (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL REFERENCES users(id),
    name            VARCHAR(100)    NOT NULL,
    usage_type      VARCHAR(20)     NOT NULL DEFAULT 'REGULAR',
    quantity        INTEGER         NOT NULL DEFAULT 0,
    expiration_date DATE,
    alert_threshold INTEGER         NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT medicines_quantity_check        CHECK (quantity >= 0),
    CONSTRAINT medicines_alert_threshold_check CHECK (alert_threshold >= 0),
    CONSTRAINT medicines_usage_type_check      CHECK (usage_type IN ('REGULAR', 'AS_NEEDED'))
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_medicines_user_id ON medicines (user_id);
CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines (name);
