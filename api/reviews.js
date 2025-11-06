/**
 * Serverless Function - Proxy para buscar reviews do Google
 *
 * Esta função resolve o problema de CORS, fazendo a requisição
 * no servidor (Vercel) e retornando os dados para o frontend.
 */

export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Apenas GET permitido
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Ler variáveis de ambiente
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  const PLACE_ID = process.env.GOOGLE_PLACE_ID;

  // Verificar se estão configuradas
  if (!API_KEY || !PLACE_ID) {
    console.error("❌ Variáveis de ambiente não configuradas:", {
      hasApiKey: !!API_KEY,
      hasPlaceId: !!PLACE_ID,
      envKeys: Object.keys(process.env).filter((k) => k.includes("GOOGLE")),
    });
    return res.status(500).json({
      error: "API não configurada",
      message:
        "GOOGLE_PLACES_API_KEY ou GOOGLE_PLACE_ID não configuradas no Vercel",
    });
  }

  try {
    // Buscar reviews do Google Places API
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews&key=${API_KEY}`;

    console.log("🔍 Chamando Google Places API");
    console.log(
      "Place ID:",
      PLACE_ID ? `${PLACE_ID.substring(0, 20)}...` : "NÃO CONFIGURADO"
    );

    // Usar fetch nativo (Node.js 18+ tem fetch nativo no Vercel)
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        "❌ Erro HTTP do Google:",
        response.status,
        response.statusText
      );
      return res.status(response.status).json({
        reviews: null,
        error: `Erro HTTP ${response.status}: ${response.statusText}`,
      });
    }

    const data = await response.json();
    console.log(
      "📥 Resposta do Google:",
      data.status,
      data.error_message || "OK"
    );

    // Se sucesso, retornar reviews formatadas
    if (data.status === "OK" && data.result?.reviews?.length > 0) {
      const reviews = data.result.reviews
        .map((review) => ({
          name: review.author_name || "Anônimo",
          rating: review.rating,
          text: review.text || "Avaliação sem texto",
          date: review.time
            ? new Date(review.time * 1000).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Data não disponível",
          initial: review.author_name
            ? review.author_name.charAt(0).toUpperCase()
            : "?",
          photo: review.profile_photo_url || null,
        }))
        .filter((review) => review.rating >= 3)
        .slice(0, 10);

      console.log(`✅ ${reviews.length} reviews filtradas e formatadas`);
      return res.status(200).json({ reviews, error: null });
    }

    // Erro da API do Google
    console.error("❌ Erro da API do Google:", data.status, data.error_message);
    return res.status(400).json({
      reviews: null,
      error: data.error_message || `Status: ${data.status}`,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar reviews:", error);
    console.error("Stack:", error.stack);
    return res.status(500).json({
      reviews: null,
      error: error.message || "Erro ao buscar avaliações",
    });
  }
}
