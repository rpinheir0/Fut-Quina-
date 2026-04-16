import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yishywtvmcxduuieyyja.supabase.co';
// @ts-ignore
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_66jHkyrxjtQnvKdPDeVqvg_Xd6uh5NK';

export const supabase = createClient(supabaseUrl, supabaseKey);
