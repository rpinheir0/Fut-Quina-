import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hjiqcdlqrsbfvvyrkamw.supabase.co';
// @ts-ignore
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_rBOGS1eAawB8V4VSd24y4g_D2GxD70X';

export const supabase = createClient(supabaseUrl, supabaseKey);
