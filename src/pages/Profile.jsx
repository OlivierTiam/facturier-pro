import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import { usePlanPermissions } from '../config/plans';

export default function Profile() {
  const { profile, user, signOut } = useAuthStore();
  const permissions = usePlanPermissions(profile);
  const [shopName, setShopName] = useState(profile?.shop_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [logo, setLogo] = useState(profile?.logo_url || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setShopName(profile.shop_name || '');
      setPhone(profile.phone || '');
      setLogo(profile.logo_url || '');
    }
  }, [profile]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const updates = {
      shop_name: shopName,
      phone: phone,
    };

    // N'inclure le logo que si l'utilisateur a le droit
    if (permissions.canUploadLogo) {
      updates.logo_url = logo;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      setMessage(' Erreur lors de la sauvegarde');
    } else {
      setMessage(' Profil mis à jour avec succès !');
      useAuthStore.setState({
        profile: { ...profile, ...updates }
      });
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-green-700"> Mon Profil</h1>
            <span className={`text-xs px-2 py-1 rounded-full ${
              permissions.isPro ? 'bg-purple-100 text-purple-700' :
              permissions.isStarter ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {permissions.planName}
            </span>
          </div>
          <Link to="/app" className="text-sm text-gray-500 hover:text-gray-700">
            ← Retour
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border">
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-2xl text-gray-400">🏪</span>
              )}
            </div>
            {permissions.canUploadLogo ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo de la boutique</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-green-50 file:text-green-700"
                />
              </div>
            ) : (
              <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 flex-1">
                <p> Le logo personnalisé est disponible avec le plan <strong>Starter</strong>.</p>
                <Link to="/pricing" className="text-yellow-600 font-semibold hover:underline text-xs">
                  Voir les offres →
                </Link>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la boutique</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="+237 6 00 00 00 00"
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-500">
             Email : {user?.email}
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Sauvegarde...' : ' Sauvegarder'}
          </button>
        </form>

        {/* Plan actuel */}
        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Plan actuel</h3>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              permissions.isPro ? 'bg-purple-100 text-purple-700' :
              permissions.isStarter ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {permissions.planName}
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Factures par mois</span>
              <span className="font-semibold text-gray-700">
                {permissions.hasUnlimitedInvoices ? '∞ Illimité' : permissions.maxInvoicesPerMonth}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Filigrane</span>
              <span className={`font-semibold ${permissions.hasWatermark ? 'text-red-600' : 'text-green-600'}`}>
                {permissions.hasWatermark ? ' Présent' : ' Absent'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Logo personnalisé</span>
              <span className={`font-semibold ${permissions.canUploadLogo ? 'text-green-600' : 'text-red-600'}`}>
                {permissions.canUploadLogo ? ' Disponible' : ' Premium'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Dashboard & Historique</span>
              <span className={`font-semibold ${permissions.canAccessHistory ? 'text-green-600' : 'text-red-600'}`}>
                {permissions.canAccessHistory ? ' Disponible' : ' Premium'}
              </span>
            </div>
            {permissions.canAccessStats && (
              <div className="flex justify-between">
                <span>Stats avancées</span>
                <span className="font-semibold text-green-600"> Disponible</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Templates</span>
              <span className="font-semibold text-gray-700">
                {permissions.templates.length === 1 ? 'Classique uniquement' : `${permissions.templates.length} templates`}
              </span>
            </div>
          </div>

          {permissions.isFree && (
            <Link to="/pricing" className="block mt-4 text-center bg-yellow-600 text-white py-2 rounded-lg font-medium hover:bg-yellow-700 transition text-sm">
               Passer au plan Starter (1 500 FCFA/mois)
            </Link>
          )}
          {permissions.isStarter && (
            <Link to="/pricing" className="block mt-4 text-center bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition text-sm">
               Passer au plan Pro (3 000 FCFA/mois)
            </Link>
          )}
        </div>

        {/* Déconnexion */}
        <button
          onClick={signOut}
          className="mt-4 w-full bg-red-50 text-red-600 py-2.5 rounded-lg font-medium hover:bg-red-100 transition"
        >
           Déconnexion
        </button>
      </main>
    </div>
  );
}