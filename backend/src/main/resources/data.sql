-- シードデータ: ユーザー（既存データがなければ挿入）
INSERT INTO users (name)
SELECT 'お父さん' WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'お父さん');
INSERT INTO users (name)
SELECT 'お母さん' WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'お母さん');
INSERT INTO users (name)
SELECT '太郎' WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = '太郎');
