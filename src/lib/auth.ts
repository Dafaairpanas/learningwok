import { supabase } from './supabase';

export async function isAdmin(): Promise<boolean> {
  if (!supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('id', user.id)
    .single();

  return !!data && !error;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
  window.location.href = '/admin/login';
}
