# 🏖️ Conexão Búzios - Sistema Completo

Sistema de IA para qualificação de leads e geração de propostas personalizadas para Búzios.

## 📋 Índice

- [Configurações](#configurações)
- [Instalação](#instalação)
- [Teste do Sistema](#teste-do-sistema)
- [Arquivos do Projeto](#arquivos-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Troubleshooting](#troubleshooting)

## ⚙️ Configurações

### Credenciais Atuais
```javascript
API Key Gemini: AIzaSyBlOiC0sqSE-CjJ4wDBIj34DKit1NgoAV4
ID da Pasta: 1iyZXYcdDrr41wM1GEvyEdl_3kgZFafUA
URL da API: https://script.google.com/macros/s/AKfycbwHC3bAoL_c5rscJV2xbwVi9KMedM3QHbWCZ3bo64w0DbiMGOtnahL9BynJ5ADao63I/exec
```

## 🚀 Instalação

### 1. Google Apps Script (Backend)

1. **Acesse o Google Apps Script:**
   - Vá para [script.google.com](https://script.google.com)
   - Faça login com sua conta Google

2. **Crie um novo projeto:**
   - Clique em "Novo projeto"
   - Renomeie para "Conexão Búzios API"

3. **Configure o código:**
   - Substitua todo o conteúdo pelo código do arquivo `codigo.gs`
   - Salve o projeto (Ctrl+S)

4. **Configure as permissões:**
   - Clique em "Deploy" > "New deployment"
   - Tipo: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Clique em "Deploy"

5. **Copie a URL:**
   - A URL gerada será usada nos arquivos frontend

### 2. Google Drive (Pasta de Dossiês)

1. **Crie uma pasta no Google Drive:**
   - Nome: "Dossiês Conexão Búzios"
   - Copie o ID da pasta da URL

2. **Configure as permissões:**
   - Clique com botão direito na pasta
   - "Compartilhar" > "Qualquer pessoa com o link pode visualizar"

### 3. Google Sheets (Dashboard)

1. **Crie uma nova planilha:**
   - Nome: "Dashboard Conexão Búzios"
   - A aba "Dashboard de Leads" será criada automaticamente

2. **Configure as permissões:**
   - Compartilhe com sua conta de Apps Script

### 4. Frontend (Arquivos HTML)

1. **Configure as URLs:**
   - Abra `index.html`, `dashboard.html` e `teste-api.html`
   - Substitua a constante `GOOGLE_APP_SCRIPT_URL` pela URL do seu Apps Script

2. **Hospede os arquivos:**
   - Use GitHub Pages, Netlify, Vercel ou qualquer servidor web
   - Ou teste localmente abrindo os arquivos no navegador

## 🧪 Teste do Sistema

### Teste Automático

1. **Abra o arquivo `teste-api.html`**
2. **Clique em "Executar Todos os Testes"**
3. **Verifique os resultados:**

   ✅ **Testes que devem passar:**
   - API do Gemini
   - Teste da API
   - Listagem de Dossiês
   - Criação de Dossiê

### Teste Manual

1. **Teste o Chat (`index.html`):**
   - Complete uma conversa completa
   - Verifique se a proposta é gerada
   - Confirme se o dossiê é criado

2. **Teste o Dashboard (`dashboard.html`):**
   - Verifique se os dossiês aparecem
   - Teste a visualização de detalhes
   - Confirme os filtros funcionam

## 📁 Arquivos do Projeto

### Frontend
- **`index.html`** - Chat principal com IA
- **`dashboard.html`** - Painel de gerenciamento de leads
- **`teste-api.html`** - Sistema de testes automatizados

### Backend
- **`codigo.gs`** - Google Apps Script (API)

### Documentação
- **`README.md`** - Este arquivo

## 🎯 Funcionalidades

### Chat com IA (`index.html`)
- ✅ **Status Bar Dinâmico** com PNL
- ✅ **Detecção de Perfil** (Turista/Morador/Divulgador)
- ✅ **Conversa Inteligente** com Gemini AI
- ✅ **Geração de Propostas** personalizadas
- ✅ **Criação Automática** de dossiês
- ✅ **Interface Responsiva** e moderna

### Dashboard (`dashboard.html`)
- ✅ **Listagem de Leads** com filtros
- ✅ **Visualização Detalhada** de dossiês
- ✅ **Análise de Perfil** e necessidades
- ✅ **Histórico Completo** de conversas
- ✅ **Interface Administrativa** profissional

### API (`codigo.gs`)
- ✅ **Processamento de Dados** com IA
- ✅ **Criação de Dossiês** no Google Docs
- ✅ **Salvamento na Planilha** automaticamente
- ✅ **Sistema de Logs** detalhado
- ✅ **Tratamento de Erros** robusto
- ✅ **Função de Teste** integrada

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro "CORS Policy"
```
❌ Erro: Access to fetch at 'URL' from origin 'URL' has been blocked by CORS policy
```
**Solução:**
- Verifique se a URL do Apps Script está correta
- Confirme que o deployment está configurado como "Web app"
- Teste com `mode: 'cors'` nas requisições

#### 2. Erro "API Key Invalid"
```
❌ Erro: API key not valid. Please pass a valid API key.
```
**Solução:**
- Verifique se a API Key do Gemini está correta
- Confirme se a conta tem créditos disponíveis
- Teste a API Key diretamente no console do Google

#### 3. Erro "Folder Not Found"
```
❌ Erro: Folder not found: 1iyZXYcdDrr41wM1GEvyEdl_3kgZFafUA
```
**Solução:**
- Verifique se o ID da pasta está correto
- Confirme as permissões da pasta
- Teste o acesso manualmente

#### 4. Erro "Spreadsheet Not Found"
```
❌ Erro: Spreadsheet not found
```
**Solução:**
- Verifique se a planilha está aberta no Apps Script
- Confirme as permissões da planilha
- Teste o acesso manualmente

### Logs e Debug

#### Ativar Logs Detalhados
No arquivo `codigo.gs`, altere:
```javascript
let currentLogLevel = LOG_LEVELS.DEBUG; // Para logs completos
```

#### Verificar Logs
1. Abra o Google Apps Script
2. Clique em "Execuções"
3. Veja os logs detalhados de cada requisição

### Performance

#### Otimizações Implementadas
- ✅ **Cache de Dados** para melhor performance
- ✅ **Validação Robusta** para evitar erros
- ✅ **Fallbacks Inteligentes** para cenários de falha
- ✅ **Logs Estruturados** para debugging
- ✅ **Tratamento de Timeout** para requisições longas

## 📊 Monitoramento

### Métricas Importantes
- **Taxa de Sucesso** das requisições
- **Tempo de Resposta** da API
- **Qualidade das Propostas** geradas
- **Conversão de Leads** no dashboard

### Alertas Automáticos
O sistema detecta automaticamente:
- ❌ Falhas na API do Gemini
- ❌ Problemas de permissão
- ❌ Erros de processamento
- ❌ Timeouts de requisição

## 🔄 Atualizações

### Versão Atual: v19.0
**Melhorias implementadas:**
- ✅ Sistema de logs avançado
- ✅ Função de teste integrada
- ✅ Tratamento de erros robusto
- ✅ Status bar dinâmico com PNL
- ✅ Interface responsiva melhorada
- ✅ Performance otimizada

### Próximas Atualizações
- 🔄 Integração com WhatsApp Business API
- 🔄 Sistema de notificações em tempo real
- 🔄 Analytics avançado de conversão
- 🔄 Machine Learning para otimização de propostas

## 📞 Suporte

### Para Problemas Técnicos
1. Execute o `teste-api.html` primeiro
2. Verifique os logs no Google Apps Script
3. Consulte a seção de troubleshooting
4. Teste cada componente individualmente

### Contato
- **Email:** suporte@conexaobuzios.com
- **WhatsApp:** +55 22 99999-9999
- **Instagram:** @conexao.buzios

---

**🎉 Sistema pronto para produção!**

Execute o `teste-api.html` para validar tudo antes de usar em produção.