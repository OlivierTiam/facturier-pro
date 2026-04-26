import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import useAuthStore from './useAuthStore';

const usePaymentStore = create((set, get) => ({
  loading: false,
  error: '',
  success: false,

  // Simuler un paiement (à remplacer par Campay)
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
      
      // TODO: Remplacer par l'appel API Campay
      // Simulation d'un paiement réussi
      const transactionId = 'SIMU_' + Date.now();
      
      // Enregistrer dans Supabase
      const { error: dbError } = await supabase.rpc('record_payment', {
        p_user_id: user.id,
        p_plan: plan,
        p_amount: amount,
        p_phone_number: phoneNumber,
        p_transaction_id: transactionId,
      });

      if (dbError) throw dbError;

      // Mettre à jour le profil local
      const profile = useAuthStore.getState().profile;
      useAuthStore.setState({
        profile: { ...profile, plan: plan }
      });

      set({ success: true, loading: false });
      return true;
    } catch (err) {
      set({ error: err.message, loading: false });
      return false;
    }
  },

  reset: () => set({ loading: false, error: '', success: false }),
}));

export default usePaymentStore;