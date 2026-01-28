export const materiService = {
  async getKanji(limit = 10000): Promise<KanjiWithLevel[]> {
    // Determine number of batches needed
    // Typically we don't know total count without a count query first.
    // For optimization, we can fetch count then parallel fetch batches.
    
    const { count } = await supabase.from('kanji').select('*', { count: 'exact', head: true });
    const total = Math.min(count || 0, limit);
    const batchSize = 1000;
    const batchCount = Math.ceil(total / batchSize);
    
    // Create array of promises
    const promises = Array.from({ length: batchCount }, (_, i) => {
        const from = i * batchSize;
        const to = from + batchSize - 1;
        return supabase
          .from('kanji')
          .select('*, jlpt_levels(name, color), categories(slug, name)')
          .range(from, to);
    });
    
    const results = await Promise.all(promises);
    
    // Flatten results
    return results.flatMap(r => r.data || []) as KanjiWithLevel[];
  },
  // Apply similar logic for getKosakata
};
