// src/store/useInvoiceStore.js
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import useAuthStore from './useAuthStore';

const useInvoiceStore = create((set, get) => ({
  // Infos vendeur
  seller: {
    name: '',
    phone: '',
    logo: null,
  },
  
  client: {
    name: '',
    phone: '',
  },
  
  items: [
    { description: '', quantity: 1, price: 0 }
  ],
  
  invoiceNumber: 1,
  invoices: [], // Historique des factures
  limitReached: false,

  // Actions
  setSeller: (seller) => set({ seller }),
  setClient: (client) => set({ client }),
  
  addItem: () => set((state) => ({
    items: [...state.items, { description: '', quantity: 1, price: 0 }]
  })),
  
  removeItem: (index) => set((state) => ({
    items: state.items.filter((_, i) => i !== index)
  })),
  
  updateItem: (index, field, value) => set((state) => {
    const newItems = [...state.items];
    newItems[index] = { ...newItems[index], [field]: value };
    return { items: newItems };
  }),
  
  resetInvoice: () => set({
    client: { name: '', phone: '' },
    items: [{ description: '', quantity: 1, price: 0 }],
  }),

  // Charger les infos vendeur depuis le profil
  loadSellerFromProfile: () => {
    const profile = useAuthStore.getState().profile;
    if (profile) {
      set({
        seller: {
          name: profile.shop_name || '',
          phone: profile.phone || '',
          logo: profile.logo_url || null,
        }
      });
    }
  },

  // Sauvegarder une facture dans Supabase
 // Dans useInvoiceStore, remplace ces 3 fonctions :

saveInvoice: async () => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('Non connecté');

  const { client, items, invoiceNumber } = get();
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  // Vérifier la limite pour les gratuits
  const profile = useAuthStore.getState().profile;
  if (profile?.plan === 'free') {
    const count = await get().fetchMonthlyCount();
    if (count >= 3) {
      set({ limitReached: true });
      throw new Error('Limite de 3 factures par mois atteinte. Passez au plan Starter !');
    }
  }

  const { data, error } = await supabase.rpc('save_invoice', {
    p_user_id: user.id,
    p_invoice_number: invoiceNumber,
    p_client_name: client.name,
    p_client_phone: client.phone || '',
    p_items: items,
    p_total_amount: total,
  });

  if (error) throw error;

  // Incrémenter le numéro de facture
  set((state) => ({
    invoiceNumber: state.invoiceNumber + 1,
  }));

  return data;
},

fetchInvoices: async () => {
  const user = useAuthStore.getState().user;
  if (!user) return;

  const { data, error } = await supabase.rpc('get_my_invoices', {
    p_user_id: user.id,
  });

  if (!error && data) {
    set({ invoices: data });
  }
},

fetchMonthlyCount: async () => {
  const user = useAuthStore.getState().user;
  if (!user) return 0;

  const { data, error } = await supabase.rpc('get_monthly_count', {
    p_user_id: user.id,
  });

  if (!error && data !== null) {
    return data;
  }
  return 0;
},
}));

export default useInvoiceStore;