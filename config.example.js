/**
 * Arquivo de Exemplo de Configuração
 *
 * INSTRUÇÕES:
 * 1. Copie este arquivo para config.js
 * 2. Preencha com suas credenciais reais
 * 3. NUNCA commite o arquivo config.js no Git
 *
 * ⚠️ ATENÇÃO: Em sites estáticos, a API key fica exposta no código.
 * Configure restrições rigorosas no Google Cloud Console.
 *
 * Para máxima segurança, use um backend que faça as requisições.
 */

// Configurações do Google Places API
const GOOGLE_CONFIG = {
  // ⚠️ Substitua pelos valores reais
  API_KEY: "",
  PLACE_ID: "",
};

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
