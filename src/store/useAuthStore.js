import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  init: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({ user: session.user });
        await get().fetchProfile(session.user.id);
      }
    } catch (err) {
      console.error('Init error:', err);
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password, shopName, phone) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      set({ user: data.user });

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: email,
          shop_name: shopName,
          phone: phone,
          plan: 'free',
        });

      if (insertError) {
        console.warn('Insert profile error:', insertError.message);
      }

      set({ profile: { id: data.user.id, email, shop_name: shopName, phone, plan: 'free' } });
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    set({ user: data.user });
    await get().fetchProfile(data.user.id);
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },

  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        set({ profile: data });
      } else {
        console.log('Profil non trouvé, création...');
        const user = get().user;

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: user?.email,
            shop_name: 'Ma Boutique',
            phone: '',
            plan: 'free',
          })
          .select()
          .single();

        if (newProfile) {
          set({ profile: newProfile });
        } else if (insertError) {
          console.warn('Création profil échouée, utilisation profil local:', insertError.message);
          set({ profile: { id: userId, email: user?.email, shop_name: 'Ma Boutique', plan: 'free' } });
        }
      }
    } catch (err) {
      console.error('fetchProfile error:', err);
      const user = get().user;
      set({ profile: { id: userId, email: user?.email, shop_name: 'Ma Boutique', plan: 'free' } });
    }
  },
}));

export default useAuthStore;