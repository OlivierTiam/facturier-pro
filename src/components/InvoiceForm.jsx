import { useState } from 'react';
import useInvoiceStore from '../store/useInvoiceStore';

export default function InvoiceForm({ onGenerate }) {
  const { seller, client, items, setSeller, setClient, addItem, removeItem, updateItem } = useInvoiceStore();
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setSeller({ ...seller, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const total = items.reduce((sum, item) => sum + (item.quantity * item.price || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section Vendeur */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">🏪 Infos vendeur</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la boutique</label>
            <input
              type="text"
              value={seller.name}
              onChange={(e) => setSeller({ ...seller, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="ex: Gloria Hair"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input
              type="tel"
              value={seller.phone}
              onChange={(e) => setSeller({ ...seller, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="ex: +237 6 00 00 00 00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo (optionnel)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>
          {logoPreview && (
            <div className="flex items-center">
              <img src={logoPreview} alt="Logo preview" className="h-12 w-12 object-contain border rounded" />
            </div>
          )}
        </div>
      </div>

      {/* Section Client */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">👤 Client</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client</label>
            <input
              type="text"
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="ex: Marie Kouam"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone client</label>
            <input
              type="tel"
              value={client.phone}
              onChange={(e) => setClient({ ...client, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="ex: +237 6 00 00 00 00"
            />
          </div>
        </div>
      </div>

      {/* Section Produits */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">🛍️ Produits</h2>
          <button
            type="button"
            onClick={addItem}
            className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition"
          >
            + Ajouter un produit
          </button>
        </div>
        
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 mb-3 items-end">
            <div className="col-span-5">
              <label className="block text-xs text-gray-500 mb-1">Description</label>
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="ex: Perruque Bob 30cm"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Qté</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                min="1"
                required
              />
            </div>
            <div className="col-span-3">
              <label className="block text-xs text-gray-500 mb-1">Prix unitaire (FCFA)</label>
              <input
                type="number"
                value={item.price}
                onChange={(e) => updateItem(index, 'price', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                min="0"
                required
              />
            </div>
            <div className="col-span-2 flex items-center">
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕ Retirer
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Total */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800">Total</span>
          <span className="text-2xl font-bold text-green-700">{total.toLocaleString()} FCFA</span>
        </div>
      </div>

      {/* Bouton Générer */}
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-700 transition shadow-lg"
      >
        📥 Générer la facture PDF
      </button>
    </form>
  );
}