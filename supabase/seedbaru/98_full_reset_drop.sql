-- ============================================
-- FULL RESET CONTENT (DROP TABLES)
-- ============================================
-- Script ini MENGHAPUS (DROP) tabel konten agar bisa dibuat ulang
-- dengan struktur terbaru (misal: penambahan kolom category_id).
-- Tabel user/admin TETAP AMAN.

BEGIN;

-- 1. Hapus Tabel Roadmap (Anak)
DROP TABLE IF EXISTS learning_topic_kanji CASCADE;
DROP TABLE IF EXISTS learning_topic_kosakata CASCADE;
DROP TABLE IF EXISTS learning_topic_bunpo CASCADE;
DROP TABLE IF EXISTS learning_day_topics CASCADE;
DROP TABLE IF EXISTS learning_days CASCADE;

-- 2. Hapus Tabel Konten (Induk)
DROP TABLE IF EXISTS kanji CASCADE;
DROP TABLE IF EXISTS kosakata CASCADE;
DROP TABLE IF EXISTS bunpo CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE; -- Terpaksa hapus progress karena referensi ke konten hilang

-- 3. Hapus Tabel Referensi (Kategori)
-- Hapus ini agar tabel categories dibuat ulang dengan struktur baru (jika ada perubahan)
DROP TABLE IF EXISTS categories CASCADE;

COMMIT;

-- Setelah menjalankan ini, ANDA WAJIB menjalakan:
-- 1. schema.sql (Untuk CREATE TABLE ulang)
-- 2. Jalankan file seed berurutan (01_... hingga 10_... untuk INSERT Data)
