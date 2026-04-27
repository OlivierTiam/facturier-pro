import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import usePaymentStore from '../store/usePaymentStore';
import useAuthStore from '../store/useAuthStore';

export default function ExpiryBanner() {
  const { showExpiryWarning, daysRemaining, checkSubscription } = usePaymentStore();
  const { profile } = useAuthStore();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (profile && profile.plan !== 'free') {
      checkSubscription();
    }
  }, [profile]);

  if (!showExpiryWarning || dismissed || !profile || profile.plan === 'free') {
    return null;
  }

  return (
    <div className={`px-4 py-3 text-center text-sm font-medium ${
      daysRemaining <= 1 
        ? 'bg-red-600 text-white' 
        : 'bg-yellow-500 text-yellow-900'
    }`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <p className="flex-1">
          {daysRemaining <= 1 ? (
            <> <strong>Votre abonnement expire aujourd'hui !</strong> Passez au plan gratuit. </> 
          ) : (
            <> <strong>Votre abonnement expire dans {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}.</strong> Pensez à le renouveler.</>
          )}
          <Link 
            to="/pricing" 
            className={`inline-block ml-4 px-4 py-1 rounded-lg font-bold text-sm ${
              daysRemaining <= 1 
                ? 'bg-white text-red-600 hover:bg-red-50' 
                : 'bg-yellow-900 text-yellow-100 hover:bg-yellow-800'
            } transition`}
          >
            Renouveler maintenant →
          </Link>
        </p>
        <button 
          onClick={() => setDismissed(true)} 
          className="ml-4 text-lg opacity-70 hover:opacity-100 flex-shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
}