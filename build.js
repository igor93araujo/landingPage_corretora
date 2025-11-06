/**
 * Script de Build para gerar config.js a partir de variáveis de ambiente
 *
 * Este script é executado durante o build no Vercel e cria o arquivo
 * config.js com as credenciais das variáveis de ambiente.
 *
 * Variáveis de ambiente necessárias:
 * - GOOGLE_PLACES_API_KEY
 * - GOOGLE_PLACE_ID
 */

const fs = require("fs");
const path = require("path");

// Ler variáveis de ambiente
// Tenta os nomes novos primeiro (GOOGLE_PLACES_API_KEY, GOOGLE_PLACE_ID)
// Depois tenta os nomes antigos (API_KEY, PLACE_ID) para compatibilidade
const API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.API_KEY || "";
const PLACE_ID = process.env.GOOGLE_PLACE_ID || process.env.PLACE_ID || "";

// Criar objeto de configuração
const GOOGLE_CONFIG = {
  API_KEY: API_KEY,
  PLACE_ID: PLACE_ID,
};

// Conteúdo do arquivo config.js
const configContent = `/**
 * Arquivo de Configuração - Gerado automaticamente pelo build
 * 
 * ⚠️ ATENÇÃO: Este arquivo é gerado automaticamente durante o build.
 * Não edite manualmente. Para alterar as configurações, use variáveis
 * de ambiente no Vercel ou no seu ambiente local.
 * 
 * Este arquivo contém dados que ficam expostos no navegador.
 * Em sites estáticos (HTML/CSS/JS), não há como esconder completamente
 * a API key do código JavaScript.
 * 
 * PROTEÇÃO RECOMENDADA:
 * 1. Configure restrições rigorosas no Google Cloud Console:
 *    - Restrições de referenciadores HTTP (apenas seu domínio)
 *    - Restrições de API (apenas Places API)
 * 2. Monitore o uso no Google Cloud Console
 * 3. Para máxima segurança, use um backend que faça as requisições
 */

// Configurações do Google Places API
const GOOGLE_CONFIG = ${JSON.stringify(GOOGLE_CONFIG, null, 2)};

// Verificar se está configurado
const isConfigured = () => {
  return (
    GOOGLE_CONFIG.API_KEY &&
    GOOGLE_CONFIG.API_KEY !== "" &&
    GOOGLE_CONFIG.PLACE_ID &&
    GOOGLE_CONFIG.PLACE_ID !== ""
  );
};

// Exportar configuração (compatível com módulos ES6 e script tradicional)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { GOOGLE_CONFIG, isConfigured };
}
`;

// Caminho do arquivo de saída
const outputPath = path.join(__dirname, "config.js");

try {
  // Escrever o arquivo config.js
  fs.writeFileSync(outputPath, configContent, "utf8");

  // Verificar se as variáveis foram fornecidas
  if (!API_KEY || !PLACE_ID) {
    console.warn(
      "⚠️  AVISO: GOOGLE_PLACES_API_KEY ou GOOGLE_PLACE_ID não foram configuradas."
    );
    console.warn("   O arquivo config.js foi criado, mas estará vazio.");
    console.warn(
      "   Configure as variáveis de ambiente no Vercel ou no seu ambiente local."
    );
  } else {
    console.log("✅ Arquivo config.js gerado com sucesso!");
    console.log("   API_KEY: " + API_KEY.substring(0, 10) + "...");
    console.log("   PLACE_ID: " + PLACE_ID.substring(0, 20) + "...");
  }
} catch (error) {
  console.error("❌ Erro ao gerar config.js:", error);
  process.exit(1);
}
