import { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import useInvoiceStore from '../store/useInvoiceStore';
import useAuthStore from '../store/useAuthStore';

export default function InvoicePreview({ onBack }) {
  const {
    seller, client, items, invoiceNumber, nextInvoiceNumber, template,
    saveInvoice, limitReached,
  } = useInvoiceStore();
  const profile = useAuthStore((state) => state.profile);

  const [showViewer, setShowViewer] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const hasWatermark = profile?.plan === 'free';

  const handleSaveAndDownload = async () => {
    if (saved) {
      setDownloaded(true);
      return;
    }

    setSaving(true);
    setSaveError('');
    try {
      await saveInvoice();
      setSaved(true);
      setDownloaded(true);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleNewInvoice = () => {
    nextInvoiceNumber();
    onBack();
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
      >
        ← Retour au formulaire
      </button>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Aperçu de votre facture</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Facture N°</p>
            <p className="font-bold text-lg">#{String(invoiceNumber).padStart(4, '0')}</p>
          </div>
          <div>
            <p className="text-gray-500">Montant total</p>
            <p className="font-bold text-lg text-green-700">{total.toLocaleString()} FCFA</p>
          </div>
          <div>
            <p className="text-gray-500">Client</p>
            <p className="font-semibold">{client.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Nombre d'articles</p>
            <p className="font-semibold">{items.length}</p>
          </div>
        </div>

        {saved && (
          <div className="mt-3 flex items-center gap-2 text-green-600 text-sm">
            <span>✅</span>
            <span>Facture sauvegardée dans votre historique</span>
          </div>
        )}

        {limitReached && (
          <div className="mt-3 bg-red-50 text-red-600 text-sm p-3 rounded-lg">
            🚫 Vous avez atteint la limite de 3 factures ce mois-ci.
            Passez au plan Starter pour continuer !
          </div>
        )}
      </div>

      {saveError && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
          {saveError}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {!saved ? (
          <button
            onClick={handleSaveAndDownload}
            disabled={saving || limitReached}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold text-center hover:bg-green-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Sauvegarde en cours...
              </span>
            ) : (
              '💾 Sauvegarder & Télécharger'
            )}
          </button>
        ) : (
          <PDFDownloadLink
            document={
              <InvoicePDF
                seller={seller}
                client={client}
                items={items}
                invoiceNumber={invoiceNumber}
                watermark={hasWatermark}
                template={template}
              />
            }
            fileName={`Facture_${String(invoiceNumber).padStart(4, '0')}_${client.name.replace(/\s/g, '_')}.pdf`}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-semibold text-center hover:bg-green-700 transition shadow-lg"
            onClick={() => setDownloaded(true)}
          >
            {({ loading }) => (loading ? 'Préparation du PDF...' : '📥 Télécharger la facture PDF')}
          </PDFDownloadLink>
        )}

        <button
          onClick={() => setShowViewer(!showViewer)}
          className="flex-1 bg-white text-green-700 border-2 border-green-600 py-3 px-6 rounded-xl font-semibold text-center hover:bg-green-50 transition"
        >
          {showViewer ? '🙈 Cacher l\'aperçu' : '👁️ Voir l\'aperçu'}
        </button>

        {downloaded && (
          <button
            onClick={handleNewInvoice}
            className="flex-1 bg-gray-800 text-white py-3 px-6 rounded-xl font-semibold text-center hover:bg-gray-900 transition"
          >
            ✨ Nouvelle facture
          </button>
        )}
      </div>

      {showViewer && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
          <PDFViewer width="100%" height="100%" className="border-0">
            <InvoicePDF
              seller={seller}
              client={client}
              items={items}
              invoiceNumber={invoiceNumber}
              watermark={hasWatermark}
              template={template}
            />
          </PDFViewer>
        </div>
      )}

      {profile?.plan === 'free' ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
          <p className="text-yellow-800 text-sm">
            💡 <strong>Version gratuite :</strong> 3 factures/mois avec filigrane "Fait avec Facturier Pro".
            Passez au plan <strong>Starter à 1 500 FCFA/mois</strong> pour supprimer le filigrane et créer jusqu'à 50 factures !
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
          <p className="text-green-800 text-sm">
            ✅ <strong>Plan {profile?.plan === 'starter' ? 'Starter' : 'Pro'} :</strong> Factures sans filigrane et sauvegarde automatique dans votre historique !
          </p>
        </div>
      )}
    </div>
  );
}