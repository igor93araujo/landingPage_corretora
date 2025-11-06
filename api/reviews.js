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
  // Tenta os nomes novos primeiro (GOOGLE_PLACES_API_KEY, GOOGLE_PLACE_ID)
  // Depois tenta os nomes antigos (API_KEY, PLACE_ID) para compatibilidade
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.API_KEY;
  const PLACE_ID = process.env.GOOGLE_PLACE_ID || process.env.PLACE_ID;

  // Debug: listar todas as variáveis de ambiente relacionadas
  const allEnvKeys = Object.keys(process.env);
  const googleEnvKeys = allEnvKeys.filter(
    (k) =>
      k.toUpperCase().includes("GOOGLE") ||
      k.toUpperCase().includes("PLACE") ||
      k.toUpperCase().includes("API")
  );

  console.log("🔍 Debug - Variáveis de ambiente encontradas:");
  console.log("Total de variáveis:", allEnvKeys.length);
  console.log("Variáveis relacionadas a Google/Place/API:", googleEnvKeys);
  console.log("GOOGLE_PLACES_API_KEY existe?", !!API_KEY);
  console.log("GOOGLE_PLACE_ID existe?", !!PLACE_ID);
  console.log("Valores:", {
    API_KEY_length: API_KEY ? API_KEY.length : 0,
    PLACE_ID_length: PLACE_ID ? PLACE_ID.length : 0,
  });

  // Verificar se estão configuradas
  if (!API_KEY || !PLACE_ID) {
    console.error("❌ Variáveis de ambiente não configuradas:", {
      hasApiKey: !!API_KEY,
      hasPlaceId: !!PLACE_ID,
      envKeys: googleEnvKeys,
      allEnvKeys: allEnvKeys.slice(0, 20), // Primeiras 20 para debug
    });
    return res.status(500).json({
      error: "API não configurada",
      message:
        "API_KEY/GOOGLE_PLACES_API_KEY ou PLACE_ID/GOOGLE_PLACE_ID não configuradas no Vercel",
      debug: {
        hasApiKey: !!API_KEY,
        hasPlaceId: !!PLACE_ID,
        relatedEnvKeys: googleEnvKeys,
      },
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
