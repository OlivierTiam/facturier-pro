import { Link } from 'react-router-dom';
import { usePlanPermissions } from '../config/plans';

export default function PlanGuard({ 
  children, 
  requiredPlan = 'starter', // 'free', 'starter', 'pro'
  feature = null, // Nom de la permission à vérifier
  fallback = null // Composant alternatif à afficher
}) {
  const profile = usePlanPermissions(profile);
  
  // Vérifier si l'utilisateur a accès
  let hasAccess = false;
  
  if (requiredPlan === 'free') hasAccess = true;
  else if (requiredPlan === 'starter') hasAccess = profile.isStarter || profile.isPro;
  else if (requiredPlan === 'pro') hasAccess = profile.isPro;
  else if (feature) hasAccess = profile[feature] || false;
  
  if (hasAccess) return children;
  
  if (fallback) return fallback;
  
  // Fallback par défaut : message de upgrade
  return (
    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-center">
      <p className="text-yellow-800 text-sm mb-3">
         Cette fonctionnalité nécessite le plan <strong>{requiredPlan === 'pro' ? 'Pro' : 'Starter'}</strong>.
      </p>
      <Link 
        to="/pricing" 
        className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition"
      >
         Passer au plan supérieur
      </Link>
    </div>
  );
}