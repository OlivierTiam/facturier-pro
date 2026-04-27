import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useInvoiceStore from '../store/useInvoiceStore';
import useAuthStore from '../store/useAuthStore';
import { usePlanPermissions } from '../config/plans';

export default function Dashboard() {
  const { invoices, fetchInvoices } = useInvoiceStore();
  const { profile } = useAuthStore();
  const permissions = usePlanPermissions(profile);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    await fetchInvoices();
    setLoading(false);
  };

  // Bloquer l'accès si le plan ne le permet pas
  if (!loading && !permissions.canAccessHistory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border max-w-md">
          <span className="text-6xl mb-4 block"></span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Fonctionnalité Premium</h2>
          <p className="text-gray-500 text-sm mb-2">
            L'historique et le dashboard sont disponibles à partir du plan <strong>Starter</strong>.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            Consultez toutes vos factures passées, vos revenus et statistiques.
          </p>
          <div className="space-y-3">
            <Link
              to="/pricing"
              className="block w-full bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-md"
            >
               Voir les offres (à partir de 1 500 FCFA)
            </Link>
            <Link
              to="/app"
              className="block w-full text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              ← Retour au formulaire
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredInvoices = invoices.filter(inv =>
    inv.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(inv.invoice_number).includes(searchTerm)
  );

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const monthlyInvoices = invoices.filter(inv => {
    const d = new Date(inv.created_at);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const monthlyRevenue = monthlyInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const monthlyCount = monthlyInvoices.length;

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-500">Chargement de vos factures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-green-700">📊 Tableau de bord</h1>
            {permissions.isFree && (
              <Link to="/pricing" className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full hover:bg-yellow-100 transition">
                 Upgrade
              </Link>
            )}
            {permissions.isStarter && (
              <Link to="/pricing" className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full hover:bg-purple-100 transition">
                ⬆ Passer Pro
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/app" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
               Nouvelle facture
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Factures ce mois</p>
            <p className="text-3xl font-bold text-green-700">{monthlyCount}</p>
            <p className="text-xs text-gray-400 mt-1">
              Limite : {permissions.hasUnlimitedInvoices ? '∞' : `${permissions.maxInvoicesPerMonth}/mois`}
              {!permissions.hasUnlimitedInvoices && ` • ${Math.max(0, permissions.maxInvoicesPerMonth - monthlyCount)} restantes`}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Revenu ce mois</p>
            <p className="text-3xl font-bold text-blue-700">
              {monthlyRevenue.toLocaleString()} <span className="text-sm">FCFA</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Total généré</p>
            <p className="text-3xl font-bold text-purple-700">
              {totalRevenue.toLocaleString()} <span className="text-sm">FCFA</span>
            </p>
          </div>
        </div>

        {/* Stats avancées (Pro uniquement) */}
        {permissions.canAccessStats && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <p className="text-xs text-purple-600 font-medium">Panier moyen</p>
              <p className="text-2xl font-bold text-purple-700">
                {monthlyCount > 0 ? Math.round(monthlyRevenue / monthlyCount).toLocaleString() : 0} FCFA
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <p className="text-xs text-blue-600 font-medium">Total factures</p>
              <p className="text-2xl font-bold text-blue-700">{invoices.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <p className="text-xs text-green-600 font-medium">Meilleur mois</p>
              <p className="text-2xl font-bold text-green-700">{monthlyRevenue.toLocaleString()} FCFA</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <p className="text-xs text-orange-600 font-medium">Plan actuel</p>
              <p className="text-lg font-bold text-orange-700">{permissions.planName}</p>
            </div>
          </div>
        )}

        {/* Recherche */}
        <div className="mb-6">
          <input
            type="text"
            placeholder=" Rechercher par client ou N° facture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm"
          />
        </div>

        {/* Liste des factures */}
        {filteredInvoices.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-500 text-lg mb-4">
              {invoices.length === 0
                ? "Vous n'avez pas encore créé de factures"
                : "Aucune facture ne correspond à votre recherche"}
            </p>
            {invoices.length === 0 && (
              <Link to="/app" className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                Créer ma première facture
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 text-green-700 p-3 rounded-lg">
                      <span className="text-lg"></span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Facture N°{String(invoice.invoice_number).padStart(4, '0')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Client : {invoice.client_name}
                        {invoice.client_phone && ` • ${invoice.client_phone}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(invoice.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-700">
                        {invoice.total_amount?.toLocaleString()} FCFA
                      </p>
                      <p className="text-xs text-gray-400">
                        {invoice.items?.length || 0} article{invoice.items?.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredInvoices.length > 0 && (
          <div className="mt-4 text-right text-sm text-gray-500">
            {filteredInvoices.length} facture{filteredInvoices.length > 1 ? 's' : ''} affichée{filteredInvoices.length > 1 ? 's' : ''}
            {searchTerm && ` sur ${invoices.length} au total`}
          </div>
        )}

        {/* Export CSV (Pro uniquement) */}
        {permissions.canExportCSV && invoices.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                const csv = [
                  ['N° Facture', 'Client', 'Téléphone', 'Date', 'Montant', 'Articles'],
                  ...invoices.map(inv => [
                    inv.invoice_number,
                    inv.client_name,
                    inv.client_phone || '',
                    new Date(inv.created_at).toLocaleDateString('fr-FR'),
                    inv.total_amount,
                    inv.items?.length || 0,
                  ])
                ].map(row => row.join(',')).join('\n');
                
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `factures_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
              className="text-sm bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition"
            >
               Exporter en CSV
            </button>
          </div>
        )}
      </main>
    </div>
  );
}