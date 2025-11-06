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
    // Incluindo mais campos para garantir que reviews sejam retornados
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews,user_ratings_total,formatted_address&key=${API_KEY}`;

    console.log("🔍 Chamando Google Places API");
    console.log("Place ID completo:", PLACE_ID || "NÃO CONFIGURADO");
    console.log(
      "Place ID (primeiros 30 chars):",
      PLACE_ID ? `${PLACE_ID.substring(0, 30)}...` : "NÃO CONFIGURADO"
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
    console.log("📊 Estrutura da resposta:", {
      hasResult: !!data.result,
      hasReviews: !!data.result?.reviews,
      reviewsCount: data.result?.reviews?.length || 0,
      placeName: data.result?.name || "N/A",
      placeRating: data.result?.rating || "N/A",
      totalReviews: data.result?.user_ratings_total || 0,
    });

    // Log adicional para debug
    if (data.result) {
      console.log("📍 Local encontrado:", data.result.name);
      console.log("📍 Endereço:", data.result.formatted_address || "N/A");
      console.log("⭐ Avaliação média:", data.result.rating || "N/A");
      console.log(
        "📝 Total de avaliações no Google Maps:",
        data.result.user_ratings_total || 0
      );
      console.log(
        "📋 Reviews disponíveis via API:",
        data.result.reviews?.length || 0
      );

      // Log detalhado das reviews se existirem
      if (data.result.reviews && data.result.reviews.length > 0) {
        console.log(
          "📄 Primeiras 3 reviews:",
          data.result.reviews.slice(0, 3).map((r) => ({
            author: r.author_name,
            rating: r.rating,
            textPreview: r.text?.substring(0, 50) + "...",
          }))
        );
      } else if (data.result.user_ratings_total > 0) {
        console.warn(
          "⚠️  ATENÇÃO: O local tem",
          data.result.user_ratings_total,
          "avaliações no Google Maps mas a API não retornou nenhuma review."
        );
        console.warn("   Possíveis causas:");
        console.warn(
          "   1. O Place ID não corresponde exatamente ao local no Google Maps"
        );
        console.warn(
          "   2. As reviews são muito antigas e a API não as retorna"
        );
        console.warn("   3. Há um problema com os campos solicitados na API");
        console.warn("   Place ID usado:", PLACE_ID);
      }
    }

    // Verificar se a resposta foi bem-sucedida
    if (data.status === "OK") {
      // Verificar se há reviews
      if (!data.result?.reviews || data.result.reviews.length === 0) {
        console.warn("⚠️  Place encontrado mas sem reviews");
        return res.status(200).json({
          reviews: [],
          error: null,
          message: "Nenhuma avaliação disponível para este local",
        });
      }

      // Processar reviews
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

      if (reviews.length === 0) {
        console.warn("⚠️  Nenhuma review com 3+ estrelas após filtro");
        return res.status(200).json({
          reviews: [],
          error: null,
          message: "Nenhuma avaliação com 3 ou mais estrelas encontrada",
        });
      }

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
