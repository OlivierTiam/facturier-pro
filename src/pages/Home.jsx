import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import useInvoiceStore from '../store/useInvoiceStore';
import useAuthStore from '../store/useAuthStore';
import { usePlanPermissions } from '../config/plans';
import ExpiryBanner from '../components/ExpiryBanner';
import usePaymentStore from '../store/usePaymentStore';

export default function Home() {
  const [step, setStep] = useState('form');
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  
  const resetInvoice = useInvoiceStore((state) => state.resetInvoice);
  const loadSellerFromProfile = useInvoiceStore((state) => state.loadSellerFromProfile);
  const fetchMonthlyCount = useInvoiceStore((state) => state.fetchMonthlyCount);
  const loadFrequentItems = useInvoiceStore((state) => state.loadFrequentItems);
  const getMaxInvoices = useInvoiceStore((state) => state.getMaxInvoices);
  const { user, profile, signOut } = useAuthStore();
  const permissions = usePlanPermissions(profile);
  const checkSubscription = usePaymentStore((state) => state.checkSubscription);

  useEffect(() => {
    if (user) {
      loadSellerFromProfile();
      loadFrequentItems();
      fetchMonthlyCount().then(count => {
        setMonthlyCount(count);
        setLimitReached(count >= permissions.maxInvoicesPerMonth);
      });
      checkSubscription();
    }
  }, [user]);

  const handleGoToForm = () => {
    resetInvoice();
    setStep('form');
    fetchMonthlyCount().then(count => {
      setMonthlyCount(count);
      setLimitReached(count >= permissions.maxInvoicesPerMonth);
    });
  };

  const remaining = permissions.hasUnlimitedInvoices 
    ? '∞' 
    : Math.max(0, permissions.maxInvoicesPerMonth - monthlyCount);

  if (!profile && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Link to="/app" className="text-2xl font-bold text-green-700"> Facturier Pro</Link>
            {permissions.canAccessHistory && (
              <Link to="/dashboard" className="text-sm text-gray-500 hover:text-green-600 transition hidden sm:block">
                 Dashboard
              </Link>
            )}
            {permissions.canManageStock && (
                <Link to="/stock" className="text-sm text-gray-500 hover:text-purple-600 transition hidden sm:block">
                     Stock
                </Link>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {permissions.isFree && (
              <Link to="/pricing" className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full hover:bg-yellow-100 transition">
                 Upgrade
              </Link>
            )}
            <span className={`text-sm px-3 py-1 rounded-full ${
              permissions.isPro
                ? 'bg-purple-100 text-purple-700'
                : permissions.isStarter
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {permissions.planName} 
              ({remaining} restante{remaining !== 1 ? 's' : ''})
            </span>
            <Link to="/profile" className="text-sm text-gray-500 hover:text-gray-700">
               Profil
            </Link>
            <button onClick={signOut} className="text-sm text-gray-500 hover:text-gray-700">
               Déconnexion
            </button>
          </div>
        </div>
      </header>
      <ExpiryBanner />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {limitReached && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
            <span className="text-xl"></span>
            <div className="flex-1">
              <p className="text-red-700 font-semibold text-sm mb-1">
                Limite de factures atteinte ce mois-ci
              </p>
              <p className="text-red-600 text-sm mb-3">
                Vous avez créé {monthlyCount}/{permissions.maxInvoicesPerMonth} factures.
                {permissions.isFree && ' Passez au plan Starter pour 50 factures/mois.'}
              </p>
              {permissions.isFree && (
                <Link to="/pricing" className="inline-block bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition">
                   Passer au plan Starter (1 500 FCFA)
                </Link>
              )}
            </div>
          </div>
        )}

        {step === 'form' ? (
          <InvoiceForm 
            onGenerate={() => setStep('preview')} 
            limitReached={limitReached}
          />
        ) : (
          <InvoicePreview onBack={handleGoToForm} />
        )}
      </main>
    </div>
  );
}