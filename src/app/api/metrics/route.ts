import { register, collectDefaultMetrics, Counter } from 'prom-client';

// Collecte des métriques par défaut
collectDefaultMetrics();

// Compteur pour suivre le nombre de requêtes HTTP
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'status'],
});

export async function GET(req: Request) {
  const method = req.method;
  const statusCode = 200; // Utilise 200 ici comme code de statut par défaut (ou utilise une logique différente si nécessaire)

  // Incrémente le compteur avec la méthode et le statut de la réponse
  httpRequestsTotal.inc({ method, status: statusCode.toString() });

  // Renvoie les métriques sous forme de texte brut
  const metrics = await register.metrics();

  // Utilisation de la classe Response pour renvoyer les métriques avec l'en-tête approprié
  return new Response(metrics, {
    headers: {
      'Content-Type': 'text/plain', // Assurer le type de contenu correct
    },
  });
}
