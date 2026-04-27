import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import useAuthStore from './useAuthStore';
import { PLANS } from '../config/plans';

const useInvoiceStore = create((set, get) => ({
  seller: { name: '', phone: '', logo: null },
  client: { name: '', phone: '' },
  items: [{ description: '', quantity: 1, price: 0 }],
  invoiceNumber: 1,
  invoices: [],
  frequentItems: [],
  limitReached: false,
  template: 'classic',

  setSeller: (seller) => set({ seller }),
  setClient: (client) => set({ client }),
  setTemplate: (template) => set({ template }),

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

  loadFrequentItems: () => {
    const profile = useAuthStore.getState().profile;
    if (profile?.frequent_items) {
      set({ frequentItems: profile.frequent_items });
    }
  },

  applyFrequentItems: () => {
    const { frequentItems } = get();
    if (frequentItems.length > 0) {
      set({ items: frequentItems.map(item => ({ ...item })) });
    }
  },

  saveInvoice: async () => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('Non connecté');

    const { client, items, invoiceNumber } = get();
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const profile = useAuthStore.getState().profile;
    if (profile?.plan === 'free') {
      const count = await get().fetchMonthlyCount();
      if (count >= 3) {
        set({ limitReached: true });
        throw new Error('Limite de 3 factures par mois atteinte. Passez au plan Starter !');
      }
    }

    const { error } = await supabase.rpc('save_invoice', {
      p_user_id: user.id,
      p_invoice_number: invoiceNumber,
      p_client_name: client.name,
      p_client_phone: client.phone || '',
      p_items: items,
      p_total_amount: total,
    });

    if (error) throw error;

    set((state) => ({
      invoiceNumber: state.invoiceNumber + 1,
      limitReached: false,
    }));
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
  canCreateInvoice: () => {
  const profile = useAuthStore.getState().profile;
  const plan = PLANS[profile?.plan] || PLANS.free;
  
  if (plan.hasUnlimitedInvoices) return true;
  
  // Vérifier le compteur mensuel
  return get().fetchMonthlyCount().then(count => count < plan.maxInvoicesPerMonth);
},

// Obtenir le nombre maximum de factures
getMaxInvoices: () => {
  const profile = useAuthStore.getState().profile;
  const plan = PLANS[profile?.plan] || PLANS.free;
  return plan.hasUnlimitedInvoices ? '∞' : plan.maxInvoicesPerMonth;
},

// Vérifier si le filigrane est nécessaire
hasWatermark: () => {
  const profile = useAuthStore.getState().profile;
  const plan = PLANS[profile?.plan] || PLANS.free;
  return plan.hasWatermark;
},

// Templates disponibles selon le plan
getAvailableTemplates: () => {
  const profile = useAuthStore.getState().profile;
  const plan = PLANS[profile?.plan] || PLANS.free;
  return plan.templates;
},
}));

export default useInvoiceStore;