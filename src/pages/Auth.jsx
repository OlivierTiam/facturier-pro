import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const { signUp, signIn, user } = useAuthStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // Pour l'inscription en 2 étapes

  useEffect(() => {
    if (user) {
      navigate('/app', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, shopName, phone);
      }
    } catch (err) {
      if (err.message?.includes('Email not confirmed')) {
        setError('📧 Veuillez vérifier votre email avant de vous connecter. Vérifiez vos spams !');
      } else if (err.message?.includes('Invalid login')) {
        setError('Email ou mot de passe incorrect.');
      } else if (err.message?.includes('already registered')) {
        setError('Cet email est déjà utilisé. Connectez-vous ou réinitialisez votre mot de passe.');
      } else {
        setError(err.message || 'Une erreur est survenue. Réessayez.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/auth',
    });

    if (error) {
      setError(error.message);
    } else {
      setResetSent(true);
    }
    setLoading(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setStep(1);
  };

  const nextStep = () => {
    if (!shopName.trim() || !phone.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setError('');
    setStep(2);
  };

  const prevStep = () => {
    setError('');
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-8">
      {/* Cercles décoratifs */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo & titre */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-bold text-green-700 hover:text-green-800 transition">
            <span className="bg-green-100 p-2 rounded-xl"></span>
            Facturier Pro
          </Link>
          <p className="text-gray-500 mt-3">
            {resetMode
              ? 'Mot de passe oublié ?'
              : isLogin
              ? 'Content de vous revoir ! '
              : 'Créez votre compte gratuit '}
          </p>
        </div>

        {/* Carte principale */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
          {!resetMode ? (
            <>
              {/* Toggle Connexion / Inscription */}
              <div className="flex mb-6 bg-gray-100 rounded-xl p-1.5">
                <button
                  onClick={() => { setIsLogin(true); setError(''); setStep(1); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isLogin
                      ? 'bg-white text-green-700 shadow-md font-semibold'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                   Connexion
                </button>
                <button
                  onClick={() => { setIsLogin(false); setError(''); setStep(1); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    !isLogin
                      ? 'bg-white text-green-700 shadow-md font-semibold'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                   Inscription
                </button>
              </div>

              {/* Indicateur d'étapes pour l'inscription */}
              {!isLogin && (
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step === 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
                  }`}>
                    1
                  </div>
                  <div className={`w-8 h-0.5 transition-all ${step === 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step === 2 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    2
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Étape 1 : Infos boutique (inscription) */}
                {!isLogin && step === 1 && (
                  <>
                    <div className="bg-green-50 p-3 rounded-xl text-sm text-green-700 mb-2">
                       Ces infos apparaîtront sur vos factures. Vous pourrez les modifier plus tard.
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                         Nom de la boutique
                      </label>
                      <input
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                        placeholder="ex: Gloria Hair, Tonton Phone..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                         WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                        placeholder="ex: +237 6 00 00 00 00"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">Vos clients pourront vous contacter via le QR code</p>
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl"
                    >
                      Continuer →
                    </button>
                  </>
                )}

                {/* Étape 2 : Email & mot de passe (inscription) OU Connexion directe */}
                {(isLogin || step === 2) && (
                  <>
                    {!isLogin && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                      >
                        ← Modifier les infos boutique
                      </button>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                         Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                        placeholder="ex: gloria@email.com"
                        required
                        autoComplete="email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                         Mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                          placeholder="••••••••"
                          required
                          minLength={6}
                          autoComplete={isLogin ? 'current-password' : 'new-password'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                          tabIndex={-1}
                        >
                          {showPassword ? '' : ''}
                        </button>
                      </div>
                      {!isLogin && (
                        <p className="text-xs text-gray-400 mt-1">Minimum 6 caractères</p>
                      )}
                    </div>

                    {/* Message d'erreur */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl flex items-start gap-3">
                        <span className="text-lg flex-shrink-0"></span>
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Message de succès */}
                    {!error && !isLogin && step === 2 && (
                      <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm p-4 rounded-xl flex items-start gap-3">
                        <span className="text-lg flex-shrink-0"></span>
                        <span>Un email de confirmation vous sera envoyé (vérifiez vos spams).</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Chargement...
                        </>
                      ) : isLogin ? (
                        ' Se connecter'
                      ) : (
                        ' Créer mon compte gratuit'
                      )}
                    </button>
                  </>
                )}
              </form>

              {/* Séparateur */}
              {isLogin && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setResetMode(true)}
                    className="w-full text-sm text-gray-500 hover:text-green-600 transition py-2"
                  >
                     Mot de passe oublié ?
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Mode réinitialisation */
            <div>
              {resetSent ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl"></span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email envoyé !</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Vérifiez votre boîte mail (et vos spams) pour réinitialiser votre mot de passe.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setResetMode(false); setResetSent(false); }}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition"
                  >
                    ← Retour à la connexion
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl"></span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Mot de passe oublié ?</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Entrez votre email pour recevoir un lien de réinitialisation.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">📧 Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Votre email"
                      required
                      autoComplete="email"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl flex items-start gap-3">
                      <span></span>
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Envoi en cours...
                      </>
                    ) : (
                      ' Envoyer le lien'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setResetMode(false); setResetSent(false); }}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 transition py-2"
                  >
                    ← Retour à la connexion
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          En vous inscrivant, vous acceptez nos conditions d'utilisation.
        </p>
      </div>
    </div>
  );
}