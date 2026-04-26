import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const plans = [
  {
    name: 'Gratuit',
    price: '0',
    period: 'mois',
    color: 'gray',
    features: [
      '3 factures par mois',
      'Filigrane "Fait avec Facturier Pro"',
      'QR Code WhatsApp',
      'Design professionnel',
      'Téléchargement PDF',
    ],
    notIncluded: [
      'Sans filigrane',
      'Historique illimité',
      'Gestion de stock',
      'Stats avancées',
    ],
    cta: 'Commencez gratuitement',
    popular: false,
  },
  {
    name: 'Starter',
    price: '1 500',
    period: 'mois',
    color: 'blue',
    features: [
      '50 factures par mois',
      'Sans filigrane',
      'Logo personnalisé',
      'QR Code WhatsApp',
      'Historique des factures',
      'Design professionnel',
      'Support prioritaire',
    ],
    notIncluded: [
      'Gestion de stock',
      'Stats avancées',
    ],
    cta: 'Choisir Starter',
    popular: true,
  },
  {
    name: 'Pro',
    price: '3 000',
    period: 'mois',
    color: 'purple',
    features: [
      'Factures illimitées',
      'Sans filigrane',
      'Logo personnalisé',
      'QR Code WhatsApp',
      'Historique illimité',
      'Gestion de stock simple',
      'Stats ventes détaillées',
      'Support WhatsApp 24/7',
      'Export CSV',
    ],
    notIncluded: [],
    cta: 'Choisir Pro',
    popular: false,
  },
];

export default function Pricing() {
  const { user, profile } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const currentPlan = profile?.plan || 'free';

  const handleSelectPlan = (plan) => {
    if (!user) {
      // Rediriger vers l'inscription
      window.location.href = '/auth';
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
    setPaymentError('');
    setPaymentSuccess(false);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    setPaymentError('');

    // Simuler l'appel à Campay
    // Dans la vraie vie, on ferait un appel API à Campay ici
    setTimeout(() => {
      // Simulation réussie
      setPaymentSuccess(true);
      setPaymentLoading(false);
      
      // Mettre à jour le plan localement (en vrai, ce serait via webhook)
      const updatedProfile = { ...profile, plan: selectedPlan.name.toLowerCase() };
      useAuthStore.setState({ profile: updatedProfile });
    }, 3000);
  };

  const getColorClasses = (color) => {
    const classes = {
      gray: 'border-gray-200 bg-white',
      blue: 'border-blue-500 bg-white ring-2 ring-blue-500',
      purple: 'border-purple-200 bg-white',
    };
    return classes[color] || classes.gray;
  };

  const getButtonClasses = (color) => {
    const classes = {
      gray: 'bg-gray-800 hover:bg-gray-900 text-white',
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      purple: 'bg-purple-600 hover:bg-purple-700 text-white',
    };
    return classes[color] || classes.gray;
  };

  const getBadgeClasses = (color) => {
    const classes = {
      gray: 'bg-gray-100 text-gray-700',
      blue: 'bg-blue-100 text-blue-700',
      purple: 'bg-purple-100 text-purple-700',
    };
    return classes[color] || classes.gray;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">📄 Facturier Pro</h1>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
                  📊 Dashboard
                </Link>
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                  📝 Nouvelle facture
                </Link>
              </>
            ) : (
              <Link to="/auth" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                Se connecter
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Titre */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Des tarifs simples, sans surprise
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Choisissez le plan qui correspond à votre activité. 
            Passez à un plan supérieur quand vous voulez.
          </p>
        </div>

        {/* Grille des plans */}
        {!showPayment ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border-2 relative ${getColorClasses(plan.color)} ${
                  plan.popular ? 'scale-105 shadow-xl' : 'shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Le plus populaire
                  </div>
                )}

                {currentPlan === plan.name.toLowerCase() && (
                  <div className="absolute top-3 right-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    Plan actuel
                  </div>
                )}

                <div className="text-center mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getBadgeClasses(plan.color)}`}>
                    {plan.name}
                  </span>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500"> FCFA</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 mt-0.5">✅</span>
                      {feature}
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
                    <li key={`no-${i}`} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-gray-300 mt-0.5">❌</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={currentPlan === plan.name.toLowerCase() || plan.name === 'Gratuit'}
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    currentPlan === plan.name.toLowerCase()
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : plan.name === 'Gratuit'
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : getButtonClasses(plan.color)
                  }`}
                >
                  {currentPlan === plan.name.toLowerCase() 
                    ? '✓ Plan actuel' 
                    : plan.name === 'Gratuit' 
                    ? 'Plan par défaut' 
                    : plan.cta}
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Formulaire de paiement */
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setShowPayment(false)}
              className="text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-2"
            >
              ← Retour aux offres
            </button>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Paiement {selectedPlan?.name}
              </h3>
              <p className="text-gray-500 mb-6">
                {selectedPlan?.price} FCFA/{selectedPlan?.period}
              </p>

              {paymentSuccess ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h4 className="text-xl font-bold text-green-700 mb-2">Paiement réussi !</h4>
                  <p className="text-gray-500 mb-6">
                    Vous êtes maintenant sur le plan {selectedPlan?.name} !
                  </p>
                  <Link
                    to="/"
                    className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                  >
                    Commencer à créer des factures
                  </Link>
                </div>
              ) : (
                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro Mobile Money
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Ex: 6 00 00 00 00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      MTN Mobile Money ou Orange Money
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                    <p className="text-yellow-800 text-sm">
                      📱 Une notification de paiement sera envoyée sur votre téléphone. 
                      Validez le paiement en entrant votre code secret.
                    </p>
                  </div>

                  {paymentError && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
                      {paymentError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={paymentLoading}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {paymentLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        En attente du paiement...
                      </span>
                    ) : (
                      `Payer ${selectedPlan?.price} FCFA`
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Paiement sécurisé via MTN Mobile Money et Orange Money
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}