# Guia de Integração com Google Places API

## 📋 Passo a Passo Completo

### 1. Acessar o Google Cloud Console

**URL:** https://console.cloud.google.com/

1. Faça login com sua conta Google (preferencialmente a conta do Google My Business)
2. Se não tiver um projeto, crie um novo projeto:
   - Clique no menu de projetos (topo da página)
   - Clique em "Novo Projeto"
   - Dê um nome (ex: "REIBACK Website")
   - Clique em "Criar"

### 2. Ativar a Google Places API

1. No menu lateral, vá em **"APIs e Serviços"** > **"Biblioteca"**
2. Procure por **"Places API"**
3. Clique em **"Places API"** (não confunda com "Places API (New)")
4. Clique em **"ATIVAR"**

### 3. Criar uma API Key

1. No menu lateral, vá em **"APIs e Serviços"** > **"Credenciais"**
2. Clique em **"+ CRIAR CREDENCIAIS"** > **"Chave de API"**
3. Uma API key será criada automaticamente
4. **IMPORTANTE:** Clique na chave criada para editar:
   - Em **"Restrições de aplicativo"**, selecione **"Referenciadores HTTP"**
   - Adicione os domínios permitidos:
     - `https://seudominio.com/*`
     - `https://www.seudominio.com/*`
     - `http://localhost/*` (para desenvolvimento)
   - Em **"Restrições de API"**, selecione **"Restringir chave"**
   - Selecione apenas **"Places API"**
   - Clique em **"Salvar"**

### 4. Encontrar o Place ID do seu negócio

Existem várias formas:

#### Opção 1: Via Google Maps

1. Acesse https://www.google.com/maps
2. Procure pelo seu negócio: "REIBACK Corretora de Seguros Campinas"
3. Clique no negócio quando aparecer
4. No painel lateral, role até encontrar a seção de informações
5. O Place ID geralmente aparece na URL ou você pode usar a ferramenta abaixo

#### Opção 2: Via Place ID Finder

1. Acesse: https://developers.google.com/maps/documentation/places/web-service/place-id
2. Use a ferramenta "Place ID Finder" no final da página
3. Digite o endereço: "Av José Pancetti, 729 - Campinas - SP"
4. Copie o Place ID retornado

#### Opção 3: Via API (se já tiver a API key)

```
https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=REIBACK%20Corretora%20Campinas&inputtype=textquery&fields=place_id&key=SUA_API_KEY
```

### 5. Configurar no Código

⚠️ **IMPORTANTE: Segurança da API Key**

A Google Places API tem custos associados. Para proteger sua chave:

**OPÇÃO A - Backend (Recomendado):**

- Crie um endpoint no seu servidor que busca as reviews
- A API key fica no servidor (não exposta no frontend)
- O frontend faz requisição para seu servidor

**OPÇÃO B - Frontend com restrições (Menos seguro):**

- Use restrições de referenciadores HTTP no Google Cloud Console
- Limite ao seu domínio específico
- Monitore o uso no Google Cloud Console

### 6. Implementação no Código

Abra o arquivo `script.js` e procure pela função `fetchGoogleReviews()` que está comentada.

Descomente e configure:

```javascript
const API_KEY = "SUA_API_KEY_AQUI";
const PLACE_ID = "SEU_PLACE_ID_AQUI";
```

### 7. Testar a Integração

1. Abra o console do navegador (F12)
2. Verifique se as reviews estão sendo carregadas
3. Se aparecer erro de CORS, você precisará usar um backend

## 🔧 Alternativas sem API Key

Se não quiser usar a API oficial, você pode:

1. **Widget do Google:** Alguns widgets permitem embed
2. **Serviços Terceiros:** Trustindex, EmbedSocial, etc. (alguns são pagos)
3. **Atualização Manual:** Manter as reviews atualizadas manualmente no código

## 💰 Custos da Google Places API

- **Primeiros $200/mês:** Gratuitos (crédito mensal)
- **Places API - Details:** $17 por 1.000 requisições
- **Places API - New:** $20 por 1.000 requisições

**Recomendação:** Cache as reviews por algumas horas/dias para reduzir requisições.

## 📝 Notas Importantes

1. A API retorna no máximo 5 reviews por requisição
2. Para buscar mais, você precisará fazer múltiplas requisições ou usar a nova Places API
3. Reviews são atualizadas periodicamente, mas não em tempo real
4. Alguns reviews podem não aparecer se o autor desabilitou compartilhamento público

## 🆘 Suporte

- Documentação oficial: https://developers.google.com/maps/documentation/places/web-service
- Fórum: https://developers.google.com/maps/support
