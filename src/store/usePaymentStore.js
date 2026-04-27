import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import useAuthStore from './useAuthStore';

const usePaymentStore = create((set, get) => ({
  loading: false,
  error: '',
  success: false,
  subscription: null,
  showExpiryWarning: false,
  daysRemaining: 0,

  // Version simplifiée SANS appel RPC
  checkSubscription: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      // 1. Rafraîchir le profil depuis la base
      const { data: freshProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (freshProfile) {
        useAuthStore.setState({ profile: freshProfile });
      }

      // 2. Vérifier l'abonnement actif
      const { data: activeSub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('end_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (activeSub) {
        const endDate = new Date(activeSub.end_date);
        const now = new Date();
        const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

        // Si expiré, rétrograder
        if (daysRemaining <= 0) {
          await supabase
            .from('subscriptions')
            .update({ status: 'expired' })
            .eq('id', activeSub.id);

          await supabase
            .from('profiles')
            .update({ plan: 'free' })
            .eq('id', user.id);

          useAuthStore.setState({
            profile: { ...freshProfile, plan: 'free' }
          });
          set({ subscription: null, daysRemaining: 0, showExpiryWarning: false });
        } else {
          set({
            subscription: activeSub,
            daysRemaining: daysRemaining,
            showExpiryWarning: daysRemaining <= 3,
          });
        }
      } else {
        // Pas d'abonnement actif
        const currentProfile = freshProfile || useAuthStore.getState().profile;
        if (currentProfile && currentProfile.plan !== 'free') {
          await supabase
            .from('profiles')
            .update({ plan: 'free' })
            .eq('id', user.id);

          useAuthStore.setState({
            profile: { ...currentProfile, plan: 'free' }
          });
        }
        set({ subscription: null, daysRemaining: 0, showExpiryWarning: false });
      }
    } catch (err) {
      console.error('checkSubscription error:', err);
    }
  },

  processPayment: async (plan, phoneNumber) => {
    set({ loading: true, error: '', success: false });

    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('Non connecté');

      const prices = {
        starter: 1500,
        pro: 3000,
      };

      const amount = prices[plan];
      if (!amount) throw new Error('Plan invalide');

      const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

      // Désactiver les anciens abonnements
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id)
        .eq('status', 'active');

      // Créer le nouvel abonnement
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan: plan,
          amount: amount,
          phone_number: phoneNumber,
          transaction_id: transactionId,
          status: 'active',
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });

      if (subError) throw subError;

      // Mettre à jour le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ plan: plan })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Rafraîchir le profil
      const { data: freshProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (freshProfile) {
        useAuthStore.setState({ profile: freshProfile });
      }

      await get().checkSubscription();

      set({ success: true, loading: false });
      return true;
    } catch (err) {
      console.error('processPayment error:', err);
      set({ error: err.message, loading: false });
      return false;
    }
  },

  reset: () => set({ loading: false, error: '', success: false }),
}));

export default usePaymentStore;