import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "Comment ça marche ?",
      answer: "Vous remplissez un formulaire simple avec vos infos, les produits et le client. En un clic, vous téléchargez une facture PDF professionnelle avec votre logo et un QR code WhatsApp."
    },
    {
      question: "C'est gratuit ?",
      answer: "Oui ! Le plan gratuit vous permet de créer 3 factures par mois avec un petit filigrane. Pour aller plus loin, le plan Starter est à 1 500 FCFA/mois (50 factures)."
    },
    {
      question: "Mes factures sont-elles sauvegardées ?",
      answer: "Absolument. Toutes vos factures sont stockées en sécurité. Vous pouvez les retrouver à tout moment depuis votre dashboard."
    },
    {
      question: "Puis-je personnaliser mes factures ?",
      answer: "Oui ! Ajoutez votre logo, votre numéro WhatsApp, et choisissez parmi 4 templates de couleurs selon votre activité."
    },
    {
      question: "Comment on paie ?",
      answer: "Par Mobile Money (MTN MoMo ou Orange Money). Vous recevez une notification sur votre téléphone pour valider le paiement."
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl"></span>
              <span className="text-xl font-bold text-green-700">Facturier Pro</span>
            </Link>
            <div className="hidden sm:flex items-center gap-6">
              <a href="#features" className="text-gray-500 hover:text-gray-900 transition">Fonctionnalités</a>
              <a href="#pricing" className="text-gray-500 hover:text-gray-900 transition">Tarifs</a>
              <a href="#faq" className="text-gray-500 hover:text-gray-900 transition">FAQ</a>
              <Link to="/auth" className="text-gray-600 hover:text-gray-900 font-medium">
                Se connecter
              </Link>
              <Link to="/auth" className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition shadow-md hover:shadow-lg">
                Essai gratuit
              </Link>
            </div>
            {/* Mobile menu button */}
            <Link to="/auth" className="sm:hidden bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              Essayer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20 lg:py-28">
        {/* Cercles décoratifs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-60 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Déjà 500+ vendeurs satisfaits
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Des factures <span className="text-green-600">professionnelles</span> en 30 secondes
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-500 mb-4 max-w-xl">
                Fini les factures sur papier ou bloc-note. Créez des factures PDF propres avec votre logo, numéro, et QR code WhatsApp.
              </p>
              
              <p className="text-base text-gray-400 mb-8 max-w-xl">
                Spécialement conçu pour les <strong>vendeurs Facebook, WhatsApp & Instagram</strong> qui veulent passer au niveau supérieur.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/auth" className="group bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5">
                  Commencer gratuitement
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <a href="#demo" className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-2xl font-bold text-lg hover:border-green-300 hover:text-green-600 transition-all">
                  Voir une démo
                </a>
              </div>

              <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start text-sm text-gray-400">
                <span className="flex items-center gap-1">✅ Gratuit</span>
                <span className="flex items-center gap-1">✅ Sans CB</span>
                <span className="flex items-center gap-1">✅ 3 factures/mois</span>
              </div>
            </div>

            {/* Image / Mockup */}
            <div className="hidden lg:block relative">
              <div className="bg-white rounded-2xl shadow-2xl border-4 border-gray-100 p-3 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl"></span>
                    </div>
                    <div className="h-3 w-32 bg-gray-200 rounded mx-auto mb-2"></div>
                    <div className="h-2 w-24 bg-gray-100 rounded mx-auto mb-6"></div>
                    
                    <table className="w-full text-left text-sm mb-6">
                      <thead>
                        <tr className="bg-green-600 text-white rounded-lg">
                          <th className="p-2 rounded-tl-lg">Article</th>
                          <th className="p-2">Qté</th>
                          <th className="p-2 rounded-tr-lg">Prix</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="p-2 text-gray-700">Perruque Bob</td>
                          <td className="p-2 text-gray-500">1</td>
                          <td className="p-2 text-green-700 font-bold">15 000</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="p-2 text-gray-700">Lissage</td>
                          <td className="p-2 text-gray-500">1</td>
                          <td className="p-2 text-green-700 font-bold">5 000</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-bold inline-block">
                      TOTAL : 20 000 FCFA
                    </div>

                    <div className="mt-4 flex justify-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs">QR Code</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Badge flottant */}
              <div className="absolute -top-6 -right-6 bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-bold shadow-lg transform rotate-6 animate-bounce-slow">
                 30 secondes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-green-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Vendeurs actifs' },
              { number: '10 000+', label: 'Factures générées' },
              { number: '2 min', label: 'Temps moyen' },
              { number: '4.9/5', label: 'Note utilisateurs' },
            ].map((stat, i) => (
              <div key={i} className="text-white">
                <p className="text-3xl sm:text-4xl font-extrabold">{stat.number}</p>
                <p className="text-green-100 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Fonctionnalités</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Tout ce qu'il vous faut pour facturer comme un pro
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Plus besoin de bloc-note ni de Word. Un outil simple, rapide et adapté à votre business.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                emoji: '',
                title: 'Ultra rapide',
                desc: 'Créez une facture en 30 secondes. Remplissez les champs, générez le PDF, envoyez au client.',
                color: 'bg-yellow-50 text-yellow-600',
              },
              {
                emoji: '',
                title: 'QR Code WhatsApp',
                desc: 'Ajoutez un QR code qui ouvre directement une conversation WhatsApp avec le numéro de commande.',
                color: 'bg-green-50 text-green-600',
              },
              {
                emoji: '',
                title: '4 templates pros',
                desc: 'Classique, Mode & Beauté, Food, Tech. Choisissez le style qui correspond à votre activité.',
                color: 'bg-purple-50 text-purple-600',
              },
              {
                emoji: '',
                title: 'Logo personnalisé',
                desc: 'Ajoutez le logo de votre boutique. Vos factures reflètent votre marque.',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                emoji: '',
                title: 'Dashboard & stats',
                desc: 'Suivez vos ventes, retrouvez toutes vos factures, filtrez par client ou date.',
                color: 'bg-pink-50 text-pink-600',
              },
              {
                emoji: '',
                title: 'Sauvegarde sécurisée',
                desc: 'Toutes vos factures sont stockées en ligne. Plus jamais de perte de carnet.',
                color: 'bg-indigo-50 text-indigo-600',
              },
              {
                emoji: '',
                title: 'Paiement Mobile Money',
                desc: 'Passez au plan payant par MoMo ou Orange Money. Simple et rapide.',
                color: 'bg-orange-50 text-orange-600',
              },
              {
                emoji: '',
                title: 'Produits fréquents',
                desc: 'Sauvegardez vos articles récurrents. Gagnez encore plus de temps.',
                color: 'bg-teal-50 text-teal-600',
              },
              {
                emoji: '',
                title: 'Zéro pub, zéro distraction',
                desc: 'Une interface propre et claire. Concentrez-vous sur l\'essentiel : vos factures.',
                color: 'bg-red-50 text-red-600',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.emoji}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Regardez comme c'est simple
            </h2>
            <p className="text-gray-500 text-lg">
              3 étapes et c'est fait. Pas de blabla.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', emoji: '', title: 'Remplissez', desc: 'Nom du client, articles, prix. 30 secondes.' },
              { step: '2', emoji: '', title: 'Vérifiez', desc: 'Aperçu en direct. Modifiez si besoin.' },
              { step: '3', emoji: '', title: 'Téléchargez', desc: 'PDF propre. Envoyez sur WhatsApp direct.' },
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-20 h-20 bg-green-600 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                  {step.emoji}
                </div>
                <div className="absolute top-10 left-[60%] hidden md:block">
                  {i < 2 && <span className="text-2xl text-gray-300">→</span>}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Tarifs</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Simple et transparent
            </h2>
            <p className="text-gray-500 text-lg">
              Commencez gratuitement. Passez au plan supérieur quand vous voulez.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Gratuit */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gratuit</h3>
              <p className="text-gray-500 text-sm mb-6">Pour démarrer</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">0</span>
                <span className="text-gray-500"> FCFA/mois</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2 text-gray-600">✅ 3 factures/mois</li>
                <li className="flex items-center gap-2 text-gray-600">✅ QR Code WhatsApp</li>
                <li className="flex items-center gap-2 text-gray-600">✅ Templates de base</li>
                <li className="flex items-center gap-2 text-gray-400">❌ Filigrane présent</li>
                <li className="flex items-center gap-2 text-gray-400">❌ Pas d'historique</li>
              </ul>
              <Link to="/auth" className="block text-center bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                Commencer
              </Link>
            </div>

            {/* Starter - Populaire */}
            <div className="bg-white rounded-2xl p-8 border-2 border-green-500 shadow-xl relative scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-1.5 rounded-full text-sm font-bold">
                Le plus populaire
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
              <p className="text-gray-500 text-sm mb-6">Pour les pros actifs</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">1 500</span>
                <span className="text-gray-500"> FCFA/mois</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2 text-gray-600">✅ 50 factures/mois</li>
                <li className="flex items-center gap-2 text-gray-600">✅ Sans filigrane</li>
                <li className="flex items-center gap-2 text-gray-600">✅ Logo personnalisé</li>
                <li className="flex items-center gap-2 text-gray-600">✅ Historique complet</li>
                <li className="flex items-center gap-2 text-gray-600">✅ Tous les templates</li>
              </ul>
              <Link to="/pricing" className="block text-center bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg">
                Choisir Starter
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 shadow-xl text-white">
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-purple-200 text-sm mb-6">Pour les machines</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">3 000</span>
                <span className="text-purple-200"> FCFA/mois</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2">✅ Factures illimitées</li>
                <li className="flex items-center gap-2">✅ Sans filigrane</li>
                <li className="flex items-center gap-2">✅ Gestion de stock</li>
                <li className="flex items-center gap-2">✅ Stats avancées</li>
                <li className="flex items-center gap-2">✅ Export CSV</li>
                <li className="flex items-center gap-2">✅ Support WhatsApp</li>
              </ul>
              <Link to="/pricing" className="block text-center bg-white text-purple-700 py-3 rounded-xl font-semibold hover:bg-purple-50 transition">
                Devenir Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos utilisateurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Avant je faisais mes factures sur un carnet. Maintenant mes clientes me prennent au sérieux. Le QR code WhatsApp, c'est magique !",
                name: "Gloria M.",
                shop: "Gloria Hair",
                emoji: "",
              },
              {
                quote: "Je vends des téléphones sur Facebook. Facturier Pro m'aide à garder une trace de toutes mes ventes. Dashboard utile !",
                name: "Ibrahim T.",
                shop: "Tonton Phone",
                emoji: "",
              },
              {
                quote: "Simple, rapide, professionnel. Je l'ai recommandé à toutes mes amies vendeuses de jus. 1500 FCFA c'est rien pour ce que ça apporte.",
                name: "Christelle K.",
                shop: "Jus Naturel Pro",
                emoji: "",
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="text-3xl mb-4">{testimonial.emoji}</div>
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-400">{testimonial.shop}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-4 sm:p-5 text-left hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <span className={`text-xl transition-transform flex-shrink-0 ${activeFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {activeFaq === i && (
                  <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Prêt à passer professionnel ?
          </h2>
          <p className="text-green-100 text-lg mb-10 max-w-xl mx-auto">
            Rejoignez les centaines de vendeurs qui facturent comme des pros.
            Commencez gratuitement, aucun engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth" className="bg-white text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-50 transition shadow-xl hover:shadow-2xl">
              Créer mon compte gratuit →
            </Link>
            <a href="#pricing" className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition">
              Voir les tarifs
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div>
              <h3 className="text-white font-bold text-lg mb-3"> Facturier Pro</h3>
              <p className="text-gray-400 text-sm">
                L'outil de facturation simple pour les vendeurs WhatsApp au Cameroun.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Liens rapides</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Tarifs</a></li>
                <li><Link to="/auth" className="hover:text-white transition">Se connecter</Link></li>
                <li><Link to="/auth" className="hover:text-white transition">S'inscrire</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>WhatsApp : +237 6 00 00 00 00</li>
                <li>Email : contact@facturierpro.com</li>
                <li>Douala, Cameroun</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>© 2024 Facturier Pro. Tous droits réservés.</p>
            <p className="mt-1">Made with ❤️ for WhatsApp sellers</p>
          </div>
        </div>
      </footer>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </div>
  );
}