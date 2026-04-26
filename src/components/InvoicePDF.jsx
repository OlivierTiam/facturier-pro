import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import QRCode from 'qrcode';

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: 'contain',
  },
  companyInfo: {
    flex: 1,
    marginLeft: 15,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#166534', // green-800
  },
  whatsapp: {
    fontSize: 9,
    color: '#4b5563',
    marginTop: 3,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15803d', // green-700
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 5,
  },
  date: {
    fontSize: 9,
    color: '#9ca3af',
    textAlign: 'right',
  },
  line: {
    borderBottom: '2px solid #16a34a',
    borderBottomWidth: 2,
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  clientBox: {
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#166534',
    padding: 6,
    borderRadius: 2,
  },
  tableHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
    paddingVertical: 5,
  },
  colDesc: { width: '45%', paddingHorizontal: 4 },
  colQty: { width: '15%', textAlign: 'center', paddingHorizontal: 4 },
  colPrice: { width: '20%', textAlign: 'right', paddingHorizontal: 4 },
  colTotal: { width: '20%', textAlign: 'right', paddingHorizontal: 4 },
  totalSection: {
    marginTop: 15,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#166534',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #d1d5db',
    paddingTop: 10,
  },
  watermark: {
    position: 'absolute',
    top: '45%',
    left: '15%',
    fontSize: 40,
    color: '#f0fdf4',
    transform: 'rotate(-30deg)',
    zIndex: -1,
  },
  qrCode: {
    width: 50,
    height: 50,
  },
  qrLabel: {
    fontSize: 7,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 3,
  },
  footerText: {
    fontSize: 8,
    color: '#9ca3af',
  },
});

// Composant PDF
const InvoicePDF = ({ seller, client, items, invoiceNumber, watermark }) => {
  const today = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  // Générer le QR code
  const [qrDataUrl, setQrDataUrl] = React.useState('');

  React.useEffect(() => {
    const generateQR = async () => {
      if (seller.phone) {
        // Lien WhatsApp avec message pré-rempli
        const whatsappUrl = `https://wa.me/${seller.phone.replace(/[^0-9]/g, '')}?text=Bonjour%2C%20je%20viens%20pour%20ma%20commande%20N%C2%B0${invoiceNumber}`;
        const dataUrl = await QRCode.toDataURL(whatsappUrl, {
          width: 100,
          margin: 1,
          color: { dark: '#166534', light: '#ffffff' },
        });
        setQrDataUrl(dataUrl);
      }
    };
    generateQR();
  }, [seller.phone, invoiceNumber]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Filigrane version gratuite */}
        {watermark && (
          <Text style={styles.watermark}>Fait avec Facturier Pro</Text>
        )}

        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            {seller.logo && (
              <Image src={seller.logo} style={styles.logo} />
            )}
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{seller.name || 'Ma Boutique'}</Text>
              <Text style={styles.whatsapp}>📱 WhatsApp : {seller.phone}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>FACTURE</Text>
            <Text style={styles.invoiceNumber}>N° {String(invoiceNumber).padStart(4, '0')}</Text>
            <Text style={styles.date}>Date : {today}</Text>
          </View>
        </View>

        <View style={styles.line} />

        {/* Client */}
        <View style={styles.clientBox}>
          <Text style={styles.sectionTitle}>Client</Text>
          <Text>Nom : {client.name}</Text>
          {client.phone && <Text>Téléphone : {client.phone}</Text>}
        </View>

        {/* Tableau des produits */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colDesc]}>Description</Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>Qté</Text>
            <Text style={[styles.tableHeaderText, styles.colPrice]}>Prix unit.</Text>
            <Text style={[styles.tableHeaderText, styles.colTotal]}>Sous-total</Text>
          </View>

          {items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{item.price.toLocaleString()} FCFA</Text>
              <Text style={styles.colTotal}>
                {(item.quantity * item.price).toLocaleString()} FCFA
              </Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalText}>
            TOTAL : {total.toLocaleString()} FCFA
          </Text>
        </View>

        {/* Footer avec QR Code */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerText}>Facture générée avec Facturier Pro</Text>
            <Text style={styles.footerText}>Merci pour votre confiance !</Text>
          </View>
          {qrDataUrl && (
            <View style={{ alignItems: 'center' }}>
              <Image src={qrDataUrl} style={styles.qrCode} />
              <Text style={styles.qrLabel}>Scannez pour WhatsApp</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;