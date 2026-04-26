import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useInvoiceStore from '../store/useInvoiceStore';
import useAuthStore from '../store/useAuthStore';

export default function Dashboard() {
  const { invoices, fetchInvoices } = useInvoiceStore();
  const { profile } = useAuthStore();
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
            <Link to="/pricing" className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full hover:bg-yellow-100 transition">
              💎 Upgrade
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/app" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
              ➕ Nouvelle facture
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Factures ce mois</p>
            <p className="text-3xl font-bold text-green-700">{monthlyCount}</p>
            {profile?.plan === 'free' && (
              <p className="text-xs text-gray-400 mt-1">
                Limite : 3/mois • {3 - monthlyCount} restantes
              </p>
            )}
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

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Rechercher par client ou N° facture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm"
          />
        </div>

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
                      <span className="text-lg">📄</span>
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
      </main>
    </div>
  );
}