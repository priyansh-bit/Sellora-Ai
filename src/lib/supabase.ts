import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://nmozwhhzwctblxkcgega.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_yrea3Z6VK8V22UIIF_8WiA_GCxJyMvN';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
