-- ============================================
-- RPC Functions for Nihongoin
-- Optimized database-level search and filtering
-- Run this in Supabase SQL Editor
-- ============================================

-- ===================
-- SEARCH KANJI
-- ===================
-- Search kanji by character, meaning, or reading
CREATE OR REPLACE FUNCTION search_kanji(
  search_term TEXT,
  level_filter TEXT DEFAULT NULL,
  result_limit INT DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  kanji_char TEXT,
  meaning TEXT,
  onyomi TEXT,
  kunyomi TEXT,
  stroke_count INT,
  jlpt_level TEXT,
  sort_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    k.id,
    k.character AS kanji_char,
    k.meaning,
    k.onyomi,
    k.kunyomi,
    k.stroke_count,
    k.jlpt_level,
    k.sort_id
  FROM kanji k
  WHERE 
    (search_term IS NULL OR search_term = '' OR 
      k.character ILIKE '%' || search_term || '%' OR
      k.meaning ILIKE '%' || search_term || '%' OR
      k.onyomi ILIKE '%' || search_term || '%' OR
      k.kunyomi ILIKE '%' || search_term || '%'
    )
    AND (level_filter IS NULL OR k.jlpt_level = level_filter)
  ORDER BY k.sort_id ASC
  LIMIT result_limit;
END;
$$;


-- ===================
-- SEARCH KOSAKATA
-- ===================
-- Search vocabulary by kanji, hiragana, romaji, or meaning
CREATE OR REPLACE FUNCTION search_kosakata(
  search_term TEXT,
  level_filter TEXT DEFAULT NULL,
  category_filter UUID DEFAULT NULL,
  result_limit INT DEFAULT 100
)
RETURNS TABLE (
  id UUID,
  kanji TEXT,
  hiragana TEXT,
  romaji TEXT,
  meaning TEXT,
  jlpt_level TEXT,
  category_id UUID,
  sort_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    k.id,
    k.kanji,
    k.hiragana,
    k.romaji,
    k.meaning,
    k.jlpt_level,
    k.category_id,
    k.sort_id
  FROM kosakata k
  WHERE 
    (search_term IS NULL OR search_term = '' OR 
      k.kanji ILIKE '%' || search_term || '%' OR
      k.hiragana ILIKE '%' || search_term || '%' OR
      k.romaji ILIKE '%' || search_term || '%' OR
      k.meaning ILIKE '%' || search_term || '%'
    )
    AND (level_filter IS NULL OR k.jlpt_level = level_filter)
    AND (category_filter IS NULL OR k.category_id = category_filter)
  ORDER BY k.sort_id ASC
  LIMIT result_limit;
END;
$$;


-- ===================
-- SEARCH BUNPO
-- ===================
-- Search grammar by pattern or meaning
CREATE OR REPLACE FUNCTION search_bunpo(
  search_term TEXT,
  level_filter TEXT DEFAULT NULL,
  type_filter TEXT DEFAULT NULL,
  result_limit INT DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  pattern TEXT,
  meaning TEXT,
  bunpo_type TEXT,
  jlpt_level TEXT,
  note TEXT,
  sort_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.pattern,
    b.meaning,
    b.bunpo_type,
    b.jlpt_level,
    b.note,
    b.sort_id
  FROM bunpo b
  WHERE 
    (search_term IS NULL OR search_term = '' OR 
      b.pattern ILIKE '%' || search_term || '%' OR
      b.meaning ILIKE '%' || search_term || '%'
    )
    AND (level_filter IS NULL OR b.jlpt_level = level_filter)
    AND (type_filter IS NULL OR b.bunpo_type = type_filter)
  ORDER BY b.sort_id ASC
  LIMIT result_limit;
END;
$$;


-- ===================
-- GET ROADMAP DAY WITH DETAILS
-- ===================
-- Efficiently fetch a complete learning day with all nested data
CREATE OR REPLACE FUNCTION get_roadmap_day(
  p_level TEXT,
  p_day INT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'day', row_to_json(ld.*),
    'topics', (
      SELECT json_agg(
        json_build_object(
          'id', t.id,
          'title', t.title,
          'content_type', t.content_type,
          'sort_order', t.sort_order,
          'items', CASE t.content_type
            WHEN 'kanji' THEN (
              SELECT json_agg(json_build_object(
                'id', tk.id,
                'note', tk.note,
                'sort_order', tk.sort_order,
                'kanji', json_build_object(
                  'id', k.id,
                  'character', k.character,
                  'meaning', k.meaning,
                  'onyomi', k.onyomi,
                  'kunyomi', k.kunyomi
                )
              ) ORDER BY tk.sort_order)
              FROM learning_topic_kanji tk
              JOIN kanji k ON k.id = tk.kanji_id
              WHERE tk.topic_id = t.id
            )
            WHEN 'kosakata' THEN (
              SELECT json_agg(json_build_object(
                'id', tv.id,
                'note', tv.note,
                'sort_order', tv.sort_order,
                'kosakata', json_build_object(
                  'id', v.id,
                  'kanji', v.kanji,
                  'hiragana', v.hiragana,
                  'meaning', v.meaning
                )
              ) ORDER BY tv.sort_order)
              FROM learning_topic_kosakata tv
              JOIN kosakata v ON v.id = tv.kosakata_id
              WHERE tv.topic_id = t.id
            )
            WHEN 'bunpo' THEN (
              SELECT json_agg(json_build_object(
                'id', tb.id,
                'note', tb.note,
                'sort_order', tb.sort_order,
                'bunpo', json_build_object(
                  'id', g.id,
                  'pattern', g.pattern,
                  'meaning', g.meaning
                )
              ) ORDER BY tb.sort_order)
              FROM learning_topic_bunpo tb
              JOIN bunpo g ON g.id = tb.bunpo_id
              WHERE tb.topic_id = t.id
            )
          END
        ) ORDER BY t.sort_order
      )
      FROM learning_day_topics t
      WHERE t.learning_day_id = ld.id
    )
  ) INTO result
  FROM learning_days ld
  WHERE ld.jlpt_level = p_level AND ld.day_number = p_day;
  
  RETURN result;
END;
$$;


-- ===================
-- GET LEARNING STATS
-- ===================
-- Get statistics for dashboard
CREATE OR REPLACE FUNCTION get_learning_stats()
RETURNS JSON
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN json_build_object(
    'kanji', json_build_object(
      'total', (SELECT COUNT(*) FROM kanji),
      'by_level', (
        SELECT json_object_agg(jlpt_level, cnt)
        FROM (SELECT jlpt_level, COUNT(*) as cnt FROM kanji GROUP BY jlpt_level) x
      )
    ),
    'kosakata', json_build_object(
      'total', (SELECT COUNT(*) FROM kosakata),
      'by_level', (
        SELECT json_object_agg(jlpt_level, cnt)
        FROM (SELECT jlpt_level, COUNT(*) as cnt FROM kosakata GROUP BY jlpt_level) x
      )
    ),
    'bunpo', json_build_object(
      'total', (SELECT COUNT(*) FROM bunpo),
      'by_level', (
        SELECT json_object_agg(jlpt_level, cnt)
        FROM (SELECT jlpt_level, COUNT(*) as cnt FROM bunpo GROUP BY jlpt_level) x
      )
    ),
    'learning_days', (SELECT COUNT(*) FROM learning_days)
  );
END;
$$;


-- ============================================
-- GRANT PERMISSIONS (for anon/authenticated access)
-- ============================================
GRANT EXECUTE ON FUNCTION search_kanji TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_kosakata TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_bunpo TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_roadmap_day TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_learning_stats TO anon, authenticated;
