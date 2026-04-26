import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { profile, user, signOut } = useAuthStore();
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

    const { error } = await supabase
      .from('profiles')
      .update({
        shop_name: shopName,
        phone: phone,
        logo_url: logo,
      })
      .eq('id', user.id);

    if (error) {
      setMessage('❌ Erreur lors de la sauvegarde');
    } else {
      setMessage('✅ Profil mis à jour avec succès !');
      useAuthStore.setState({
        profile: { ...profile, shop_name: shopName, phone: phone, logo_url: logo }
      });
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-700">👤 Mon Profil</h1>
          <Link to="/app" className="text-sm text-gray-500 hover:text-gray-700">
            ← Retour
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border">
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-2xl text-gray-400">🏪</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo de la boutique</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-green-50 file:text-green-700"
              />
            </div>
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
            📧 Email : {user?.email}
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
            {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
          </button>
        </form>

        <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-2">Plan actuel</h3>
          <p className="text-gray-500 mb-3">
            {profile?.plan === 'free' ? 'Gratuit (3 factures/mois)' :
             profile?.plan === 'starter' ? 'Starter (50 factures/mois)' :
             'Pro (Illimité)'}
          </p>
          {profile?.plan !== 'pro' && (
            <Link to="/pricing" className="text-green-600 hover:underline text-sm">
              💎 Changer de plan
            </Link>
          )}
        </div>

        <button
          onClick={signOut}
          className="mt-4 w-full bg-red-50 text-red-600 py-2.5 rounded-lg font-medium hover:bg-red-100"
        >
          🚪 Déconnexion
        </button>
      </main>
    </div>
  );
}