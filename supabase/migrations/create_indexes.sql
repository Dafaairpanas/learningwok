-- ============================================
-- Database Indexes for Nihongoin
-- Run this in Supabase SQL Editor
-- ============================================

-- ===================
-- KANJI TABLE
-- ===================

-- Index for JLPT level filtering (most common filter)
CREATE INDEX IF NOT EXISTS idx_kanji_jlpt_level ON kanji(jlpt_level);

-- Index for character search
CREATE INDEX IF NOT EXISTS idx_kanji_character ON kanji(character);

-- Index for sort_id ordering
CREATE INDEX IF NOT EXISTS idx_kanji_sort_id ON kanji(sort_id);

-- Composite index for level + sort (common query pattern)
CREATE INDEX IF NOT EXISTS idx_kanji_level_sort ON kanji(jlpt_level, sort_id);


-- ===================
-- KOSAKATA TABLE
-- ===================

-- Index for JLPT level filtering
CREATE INDEX IF NOT EXISTS idx_kosakata_jlpt_level ON kosakata(jlpt_level);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_kosakata_category_id ON kosakata(category_id);

-- Index for kanji text search
CREATE INDEX IF NOT EXISTS idx_kosakata_kanji ON kosakata(kanji);

-- Index for hiragana text search
CREATE INDEX IF NOT EXISTS idx_kosakata_hiragana ON kosakata(hiragana);

-- Index for sort_id ordering
CREATE INDEX IF NOT EXISTS idx_kosakata_sort_id ON kosakata(sort_id);

-- Composite index for level + category + sort
CREATE INDEX IF NOT EXISTS idx_kosakata_level_category_sort ON kosakata(jlpt_level, category_id, sort_id);


-- ===================
-- BUNPO TABLE
-- ===================

-- Index for JLPT level filtering
CREATE INDEX IF NOT EXISTS idx_bunpo_jlpt_level ON bunpo(jlpt_level);

-- Index for bunpo type filtering
CREATE INDEX IF NOT EXISTS idx_bunpo_type ON bunpo(bunpo_type);

-- Index for pattern search
CREATE INDEX IF NOT EXISTS idx_bunpo_pattern ON bunpo(pattern);

-- Index for sort_id ordering
CREATE INDEX IF NOT EXISTS idx_bunpo_sort_id ON bunpo(sort_id);

-- Composite index for level + type + sort
CREATE INDEX IF NOT EXISTS idx_bunpo_level_type_sort ON bunpo(jlpt_level, bunpo_type, sort_id);


-- ===================
-- LEARNING_DAYS TABLE (Roadmap)
-- ===================

-- Index for JLPT level filtering
CREATE INDEX IF NOT EXISTS idx_learning_days_jlpt_level ON learning_days(jlpt_level);

-- Index for day number ordering
CREATE INDEX IF NOT EXISTS idx_learning_days_day_number ON learning_days(day_number);

-- Composite index for level + day (primary roadmap access pattern)
CREATE INDEX IF NOT EXISTS idx_learning_days_level_day ON learning_days(jlpt_level, day_number);


-- ===================
-- LEARNING_DAY_TOPICS TABLE
-- ===================

-- Index for learning day foreign key
CREATE INDEX IF NOT EXISTS idx_topics_learning_day_id ON learning_day_topics(learning_day_id);

-- Index for content type filtering
CREATE INDEX IF NOT EXISTS idx_topics_content_type ON learning_day_topics(content_type);

-- Index for sort order
CREATE INDEX IF NOT EXISTS idx_topics_sort_order ON learning_day_topics(sort_order);


-- ===================
-- JUNCTION TABLES
-- ===================

-- learning_topic_kanji
CREATE INDEX IF NOT EXISTS idx_topic_kanji_topic_id ON learning_topic_kanji(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_kanji_kanji_id ON learning_topic_kanji(kanji_id);

-- learning_topic_kosakata
CREATE INDEX IF NOT EXISTS idx_topic_kosakata_topic_id ON learning_topic_kosakata(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_kosakata_kosakata_id ON learning_topic_kosakata(kosakata_id);

-- learning_topic_bunpo
CREATE INDEX IF NOT EXISTS idx_topic_bunpo_topic_id ON learning_topic_bunpo(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_bunpo_bunpo_id ON learning_topic_bunpo(bunpo_id);


-- ===================
-- TEXT SEARCH INDEXES (Optional - untuk pencarian lebih cepat)
-- ===================

-- GIN index for full-text search on kanji meaning (if needed)
-- CREATE INDEX IF NOT EXISTS idx_kanji_meaning_gin ON kanji USING gin(to_tsvector('indonesian', meaning));

-- GIN index for kosakata meaning
-- CREATE INDEX IF NOT EXISTS idx_kosakata_meaning_gin ON kosakata USING gin(to_tsvector('indonesian', meaning));


-- ============================================
-- VERIFY INDEXES
-- ============================================
-- Run this to see all indexes:
-- SELECT tablename, indexname, indexdef FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;
