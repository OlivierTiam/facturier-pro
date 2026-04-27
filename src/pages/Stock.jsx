import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/useAuthStore';
import { usePlanPermissions } from '../config/plans';

export default function Stock() {
  const { user, profile } = useAuthStore();
  const permissions = usePlanPermissions(profile);
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stock'); // 'stock' ou 'movements'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Formulaire ajout/modification
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_name: '',
    quantity: 0,
    min_quantity: 5,
    price: 0,
    category: 'Général',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Alerte stock bas
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  useEffect(() => {
    if (user) {
      loadStock();
      loadMovements();
      checkLowStock();
    }
  }, [user]);

  const loadStock = async () => {
    const { data, error } = await supabase
      .from('stock')
      .select('*')
      .eq('user_id', user.id)
      .order('category')
      .order('product_name');

    if (!error) setProducts(data || []);
    setLoading(false);
  };

  const loadMovements = async () => {
    const { data } = await supabase
      .from('stock_movements')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) setMovements(data);
  };

  const checkLowStock = async () => {
    const { data } = await supabase.rpc('get_low_stock_alerts', {
      p_user_id: user.id,
    });
    if (data) setLowStockAlerts(data);
  };

  // Bloquer l'accès si pas Pro
  if (!permissions.canManageStock) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border max-w-md">
          <span className="text-6xl mb-4 block">📦</span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Gestion de stock</h2>
          <p className="text-gray-500 text-sm mb-2">
            Fonctionnalité exclusive au plan <strong>Pro</strong>.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            Suivez vos produits, recevez des alertes quand le stock est bas, gérez vos approvisionnements.
          </p>
          <Link
            to="/pricing"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition shadow-md"
          >
            ⬆️ Passer au plan Pro (3 000 FCFA/mois)
          </Link>
          <Link to="/app" className="block mt-3 text-sm text-gray-500 hover:text-gray-700">
            ← Retour
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');
    setSaving(true);

    if (!formData.product_name.trim()) {
      setFormError('Le nom du produit est obligatoire');
      setSaving(false);
      return;
    }

    try {
      if (editingProduct) {
        // Modification
        const { error } = await supabase
          .from('stock')
          .update({
            product_name: formData.product_name,
            quantity: formData.quantity,
            min_quantity: formData.min_quantity,
            price: formData.price,
            category: formData.category,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
        setSuccessMsg('✅ Produit mis à jour !');
      } else {
        // Ajout
        const { error } = await supabase
          .from('stock')
          .insert({
            user_id: user.id,
            product_name: formData.product_name,
            quantity: formData.quantity,
            min_quantity: formData.min_quantity,
            price: formData.price,
            category: formData.category,
          });

        if (error) throw error;
        setSuccessMsg('✅ Produit ajouté !');
      }

      resetForm();
      loadStock();
      checkLowStock();
    } catch (err) {
      setFormError('Erreur : ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      product_name: product.product_name,
      quantity: product.quantity,
      min_quantity: product.min_quantity,
      price: product.price,
      category: product.category,
    });
    setShowForm(true);
    setSuccessMsg('');
    setFormError('');
  };

  const handleDelete = async (productId) => {
    if (!confirm('Supprimer ce produit du stock ?')) return;

    const { error } = await supabase
      .from('stock')
      .delete()
      .eq('id', productId);

    if (!error) {
      loadStock();
      checkLowStock();
    }
  };

  const handleQuickAdd = async (productId, amount) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newQty = Math.max(0, product.quantity + amount);

    const { error } = await supabase
      .from('stock')
      .update({ quantity: newQty, updated_at: new Date().toISOString() })
      .eq('id', productId);

    if (!error) {
      // Enregistrer le mouvement
      await supabase
        .from('stock_movements')
        .insert({
          user_id: user.id,
          product_id: productId,
          type: amount > 0 ? 'in' : 'out',
          quantity: Math.abs(amount),
          reason: amount > 0 ? 'Réapprovisionnement' : 'Ajustement manuel',
        });

      loadStock();
      loadMovements();
      checkLowStock();
    }
  };

  const resetForm = () => {
    setFormData({
      product_name: '',
      quantity: 0,
      min_quantity: 5,
      price: 0,
      category: 'Général',
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  // Filtrer les produits
  const categories = ['all', ...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalStockValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
  const totalProducts = products.length;
  const lowStockCount = lowStockAlerts.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-500">Chargement du stock...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-700">📦 Gestion de stock</h1>
          <Link to="/app" className="text-sm text-gray-500 hover:text-gray-700">
            ← Retour
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats rapides */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-xs text-gray-500">Produits</p>
            <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-xs text-gray-500">Valeur stock</p>
            <p className="text-2xl font-bold text-green-700">{totalStockValue.toLocaleString()} FCFA</p>
          </div>
          <div className={`bg-white p-4 rounded-xl shadow-sm border ${lowStockCount > 0 ? 'border-red-300' : ''}`}>
            <p className="text-xs text-gray-500">Alertes stock bas</p>
            <p className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {lowStockCount}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <p className="text-xs text-gray-500">Catégories</p>
            <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
          </div>
        </div>

        {/* Alertes stock bas */}
        {lowStockAlerts.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl">
            <h3 className="font-bold text-red-800 mb-2">⚠️ Alertes stock bas</h3>
            <div className="space-y-2">
              {lowStockAlerts.map((alert, i) => (
                <div key={i} className="flex justify-between items-center text-sm text-red-700">
                  <span>📦 {alert.product_name} ({alert.category})</span>
                  <span className="font-bold">{alert.quantity} restant{alert.quantity > 1 ? 's' : ''} (min: {alert.min_quantity})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'stock' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📦 Stock
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'movements' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            🔄 Mouvements
          </button>
        </div>

        {activeTab === 'stock' && (
          <>
            {/* Barre d'actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                placeholder="🔍 Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-white border rounded-lg text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? 'Toutes catégories' : cat}</option>
                ))}
              </select>
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
              >
                ➕ Ajouter
              </button>
            </div>

            {/* Formulaire ajout/modification */}
            {showForm && (
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border mb-6 space-y-4">
                <h3 className="font-bold text-gray-900">
                  {editingProduct ? '✏️ Modifier le produit' : '➕ Nouveau produit'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nom du produit *</label>
                    <input
                      type="text"
                      value={formData.product_name}
                      onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Quantité</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Alerte stock bas</label>
                    <input
                      type="number"
                      value={formData.min_quantity}
                      onChange={(e) => setFormData({ ...formData, min_quantity: parseInt(e.target.value) || 5 })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Prix unitaire (FCFA)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Catégorie</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      placeholder="ex: Perruques, Téléphones..."
                    />
                  </div>
                </div>

                {formError && <p className="text-red-600 text-sm">{formError}</p>}
                {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

                <div className="flex gap-2">
                  <button type="submit" disabled={saving} className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50">
                    {saving ? 'Sauvegarde...' : editingProduct ? '💾 Modifier' : '💾 Ajouter'}
                  </button>
                  <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300">
                    Annuler
                  </button>
                </div>
              </form>
            )}

            {/* Liste des produits */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-xl shadow-sm border text-center">
                <p className="text-4xl mb-4">📭</p>
                <p className="text-gray-500">Aucun produit en stock</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-medium text-gray-600">Produit</th>
                        <th className="text-left p-3 font-medium text-gray-600">Catégorie</th>
                        <th className="text-center p-3 font-medium text-gray-600">Stock</th>
                        <th className="text-right p-3 font-medium text-gray-600">Prix</th>
                        <th className="text-center p-3 font-medium text-gray-600">Actions rapides</th>
                        <th className="text-right p-3 font-medium text-gray-600"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(product => (
                        <tr key={product.id} className={`border-t ${product.quantity <= product.min_quantity ? 'bg-red-50' : ''}`}>
                          <td className="p-3 font-medium text-gray-900">
                            {product.product_name}
                            {product.quantity <= product.min_quantity && (
                              <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Bas</span>
                            )}
                          </td>
                          <td className="p-3 text-gray-500">{product.category}</td>
                          <td className="p-3 text-center">
                            <span className={`font-bold ${product.quantity <= product.min_quantity ? 'text-red-600' : 'text-gray-900'}`}>
                              {product.quantity}
                            </span>
                          </td>
                          <td className="p-3 text-right text-gray-700">{product.price.toLocaleString()} FCFA</td>
                          <td className="p-3">
                            <div className="flex justify-center gap-1">
                              <button onClick={() => handleQuickAdd(product.id, -1)} className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200">-1</button>
                              <button onClick={() => handleQuickAdd(product.id, 1)} className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200">+1</button>
                              <button onClick={() => handleQuickAdd(product.id, 5)} className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200">+5</button>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 mr-2">✏️</button>
                            <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Mouvements de stock */}
        {activeTab === 'movements' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {movements.length === 0 ? (
              <div className="p-12 text-center text-gray-500">Aucun mouvement enregistré</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-medium text-gray-600">Date</th>
                      <th className="text-left p-3 font-medium text-gray-600">Type</th>
                      <th className="text-center p-3 font-medium text-gray-600">Quantité</th>
                      <th className="text-left p-3 font-medium text-gray-600">Raison</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map(m => (
                      <tr key={m.id} className="border-t">
                        <td className="p-3 text-gray-500">
                          {new Date(m.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            m.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {m.type === 'in' ? '📥 Entrée' : '📤 Sortie'}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold">{m.quantity}</td>
                        <td className="p-3 text-gray-500">{m.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}