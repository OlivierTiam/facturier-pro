import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import useInvoiceStore from '../store/useInvoiceStore';
import useAuthStore from '../store/useAuthStore';

export default function Home() {
  const [step, setStep] = useState('form');
  const [monthlyCount, setMonthlyCount] = useState(0);
  const resetInvoice = useInvoiceStore((state) => state.resetInvoice);
  const loadSellerFromProfile = useInvoiceStore((state) => state.loadSellerFromProfile);
  const fetchMonthlyCount = useInvoiceStore((state) => state.fetchMonthlyCount);
  const { user, profile, signOut } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadSellerFromProfile();
      fetchMonthlyCount().then(setMonthlyCount);
    }
  }, [user]);

  const handleGoToForm = () => {
    resetInvoice();
    setStep('form');
    fetchMonthlyCount().then(setMonthlyCount);
  };

  const remaining = profile?.plan === 'free' ? 3 - monthlyCount : '∞';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">📄 Facturier Pro</h1>
           <Link
                to="/dashboard"
                className="text-sm text-gray-500 hover:text-green-600 transition hidden sm:block"
            >
                📊 Dashboard
            </Link>
            <Link
                to="/pricing"
                className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full hover:bg-yellow-100 transition"
                >
                💎 Upgrade
            </Link>
          <div className="flex items-center gap-4">
            <span className={`text-sm px-3 py-1 rounded-full ${
              profile?.plan === 'pro'
                ? 'bg-purple-100 text-purple-700'
                : profile?.plan === 'starter'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {profile?.plan === 'free' ? `Gratuit (${remaining} restantes)` : profile?.plan}
            </span>
            <button
              onClick={signOut}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {step === 'form' ? (
          <InvoiceForm onGenerate={() => setStep('preview')} />
        ) : (
          <InvoicePreview onBack={handleGoToForm} />
        )}
      </main>
    </div>
  );
}