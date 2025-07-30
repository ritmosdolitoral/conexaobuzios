/**
 * API Unificada para o Ecossistema Conexão Búzios v20.0 (Sistema de Histórico Completo)
 *
 * MELHORIAS IMPLEMENTADAS:
 * 1. Sistema completo de histórico de conversa
 * 2. Salvamento estruturado do chat completo
 * 3. Função getDossierContent corrigida
 * 4. Integração perfeita entre frontend e backend
 * 5. Estrutura de dados consistente
 * 6. Sistema de logs aprimorado
 */

// === CONFIGURAÇÕES ATUALIZADAS ===
const ID_DA_PASTA_DOSSIES = "1iyZXYcdDrr41wM1GEvyEdl_3kgZFafUA";

// Configuração segura da API Key - deve ser definida nas propriedades do script
function getGeminiApiKey() {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada. Configure usando PropertiesService.getScriptProperties().setProperty("GEMINI_API_KEY", "sua_chave_aqui")');
  }
  return apiKey;
}

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwHC3bAoL_c5rscJV2xbwVi9KMedM3QHbWCZ3bo64w0DbiMGOtnahL9BynJ5ADao63I/exec";

// === SISTEMA DE LOGS AVANÇADO ===
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  CRITICAL: 4
};

let currentLogLevel = LOG_LEVELS.INFO;

function log(level, message, data = null) {
  if (level >= currentLogLevel) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${Object.keys(LOG_LEVELS)[level]}] ${message}`;
    
    if (data) {
      Logger.log(logMessage + " | Data: " + JSON.stringify(data));
    } else {
      Logger.log(logMessage);
    }
  }
}

// === FUNÇÃO DE TESTE INTEGRADA ===
function testarAPI() {
  log(LOG_LEVELS.INFO, "Iniciando teste completo da API");
  
  try {
    // Teste 1: Verificar acesso à pasta
    log(LOG_LEVELS.DEBUG, "Teste 1: Verificando acesso à pasta de dossiês");
    const pasta = DriveApp.getFolderById(ID_DA_PASTA_DOSSIES);
    log(LOG_LEVELS.INFO, "✅ Acesso à pasta confirmado", { pastaNome: pasta.getName() });
    
    // Teste 2: Verificar API Key do Gemini
    log(LOG_LEVELS.DEBUG, "Teste 2: Verificando API Key do Gemini");
    const testPrompt = "Responda apenas com 'OK' se esta mensagem foi recebida.";
    const testResponse = testarGeminiAPI(testPrompt);
    log(LOG_LEVELS.INFO, "✅ API Key do Gemini funcionando", { resposta: testResponse });
    
    // Teste 3: Verificar planilha ativa
    log(LOG_LEVELS.DEBUG, "Teste 3: Verificando planilha ativa");
    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    log(LOG_LEVELS.INFO, "✅ Planilha ativa encontrada", { planilhaNome: planilha.getName() });
    
    // Teste 4: Simular criação de dossiê
    log(LOG_LEVELS.DEBUG, "Teste 4: Simulando criação de dossiê");
    const dadosTeste = {
      nome: "Teste Automático",
      perfil: "Turista",
      telefone: "21999999999",
      historico: [
        { pergunta: "Qual seu perfil?", resposta: "Turista" },
        { pergunta: "Como está sua viagem?", resposta: "Chego nos próximos dias" }
      ]
    };
    
    const resultadoTeste = processarDadosTeste(dadosTeste);
    log(LOG_LEVELS.INFO, "✅ Teste de processamento concluído", resultadoTeste);
    
    return {
      success: true,
      message: "Todos os testes passaram com sucesso!",
      detalhes: {
        pasta: pasta.getName(),
        gemini: "Funcionando",
        planilha: planilha.getName(),
        processamento: "OK"
      }
    };
    
  } catch (error) {
    log(LOG_LEVELS.ERROR, "❌ Falha no teste da API", { erro: error.toString() });
    return {
      success: false,
      message: "Falha no teste da API",
      erro: error.toString()
    };
  }
}

function testarGeminiAPI(prompt) {
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${getGeminiApiKey()}`;
  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  const options = { 
    method: 'post', 
    contentType: 'application/json', 
    payload: JSON.stringify(payload), 
    muteHttpExceptions: true 
  };
  
  try {
    const response = UrlFetchApp.fetch(GEMINI_API_URL, options);
    if (response.getResponseCode() !== 200) {
      throw new Error(`Erro na API Gemini: ${response.getContentText()}`);
    }
    
    const result = JSON.parse(response.getContentText());
    
    // Validate response structure before accessing nested properties
    if (!result.candidates || !result.candidates[0] || 
        !result.candidates[0].content || !result.candidates[0].content.parts ||
        !result.candidates[0].content.parts[0] || !result.candidates[0].content.parts[0].text) {
      throw new Error('Resposta da API Gemini em formato inesperado');
    }
    
    return result.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    log(LOG_LEVELS.ERROR, "Erro ao testar Gemini API", { erro: error.toString() });
    throw error;
  }
}

function processarDadosTeste(dados) {
  try {
    const analise = gerarAnaliseCompletaComGemini(dados);
    return {
      resumo_perfil: analise.resumo_perfil ? "Gerado com sucesso" : "Falhou",
      necessidades_reveladas: analise.necessidades_reveladas ? analise.necessidades_reveladas.length + " itens" : "Falhou",
      proposta_personalizada: analise.proposta_personalizada ? "Gerada com sucesso" : "Falhou"
    };
  } catch (error) {
    log(LOG_LEVELS.ERROR, "Erro ao processar dados de teste", { erro: error.toString() });
    throw error;
  }
}

// === PONTO DE ENTRADA PRINCIPAL (BLINDADO E MELHORADO) ===
function doPost(e) {
  const startTime = new Date().getTime();
  log(LOG_LEVELS.INFO, "=== NOVA REQUISIÇÃO RECEBIDA ===");
  
  try {
    // Validação da requisição
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Requisição POST inválida: o corpo da requisição (e.postData.contents) está ausente.");
    }
    
    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
      log(LOG_LEVELS.DEBUG, "Payload recebido", { action: payload.action, hasData: !!payload.data });
    } catch (parseError) {
      throw new Error("Falha ao analisar o corpo da requisição. Verifique se é um JSON válido.");
    }

    if (!payload.action) {
      throw new Error("Ação não especificada no payload da requisição.");
    }

    const { action, data, id } = payload;
    log(LOG_LEVELS.INFO, "Processando ação", { action, hasData: !!data, hasId: !!id });

    let result;
    switch (action) {
      case 'processAndSaveDossier':
        if (!data) throw new Error("Dados do lead ausentes para a ação 'processAndSaveDossier'.");
        
        log(LOG_LEVELS.INFO, "Iniciando processamento de dossiê", { 
          nome: data.nome, 
          perfil: data.perfil,
          temHistorico: !!data.historico,
          temChatCompleto: !!data.chatCompleto
        });
        
        const analiseCompleta = gerarAnaliseCompletaComGemini(data);
        data.resumo_perfil = analiseCompleta.resumo_perfil;
        data.necessidades_reveladas = analiseCompleta.necessidades_reveladas;
        data.proposta_personalizada = analiseCompleta.proposta_personalizada;

        log(LOG_LEVELS.INFO, "Análise da IA concluída", { 
          resumoLength: data.resumo_perfil?.length || 0,
          necessidadesCount: data.necessidades_reveladas?.length || 0,
          propostaLength: data.proposta_personalizada?.length || 0
        });

        const urlDoDossie = criarDossieFormatado(data);
        salvarResumoNaPlanilha(data, urlDoDossie);

        result = { 
          success: true, 
          data: {
            url: urlDoDossie,
            proposta_personalizada: data.proposta_personalizada
          } 
        };
        break;

      case 'listDossies':
        log(LOG_LEVELS.INFO, "Listando dossiês");
        result = { success: true, data: listDossies() };
        break;
      
      case 'getDossierContent':
        if (!id) throw new Error("ID do arquivo não fornecido para 'getDossierContent'.");
        log(LOG_LEVELS.INFO, "Obtendo conteúdo do dossiê", { id });
        const dossierData = getDossierContent(id);
        result = { success: true, data: { content: dossierData } };
        break;

      case 'test':
        log(LOG_LEVELS.INFO, "Executando teste da API");
        result = testarAPI();
        break;

      default:
        throw new Error(`Ação inválida ou não reconhecida: ${action}`);
    }
    
    const endTime = new Date().getTime();
    const duration = endTime - startTime;
    log(LOG_LEVELS.INFO, "Requisição processada com sucesso", { 
      action, 
      duration: duration + "ms",
      success: result.success 
    });
    
    return createJsonResponse(result);
    
  } catch (error) {
    const endTime = new Date().getTime();
    const duration = endTime - startTime;
    log(LOG_LEVELS.ERROR, "ERRO GERAL no doPost", { 
      erro: error.toString(), 
      duration: duration + "ms",
      stack: error.stack 
    });
    return createJsonResponse({ 
      success: false, 
      error: error.toString(),
      timestamp: new Date().toISOString()
    });
  }
}

// === NÚCLEO DE INTELIGÊNCIA COMERCIAL (MELHORADO E VALIDADO) ===
function gerarAnaliseCompletaComGemini(dados) {
  log(LOG_LEVELS.INFO, "Iniciando análise com Gemini", { nome: dados.nome, perfil: dados.perfil });
  
  // VALIDAÇÃO ROBUSTA DE ENTRADA - CORRIGIDA
  if (!dados || typeof dados !== 'object') {
    throw new Error('Dados de entrada inválidos: objeto esperado');
  }
  
  // Validação de campos obrigatórios
  const requiredFields = ['nome', 'perfil'];
  const missingFields = requiredFields.filter(field => !dados[field] || dados[field].trim().length === 0);
  
  if (missingFields.length > 0) {
    throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
  }
  
  // Validação de tamanho dos dados para evitar overflow na API
  const maxDataSize = 50000; // 50KB limite
  const dataString = JSON.stringify(dados);
  if (dataString.length > maxDataSize) {
    log(LOG_LEVELS.WARN, "Dados muito grandes, truncando", { size: dataString.length });
    
    // Trunca dados não essenciais
    if (dados.chatCompleto && Array.isArray(dados.chatCompleto)) {
      dados.chatCompleto = dados.chatCompleto.slice(-20); // Mantém apenas últimas 20 mensagens
    }
    if (dados.historico && Array.isArray(dados.historico)) {
      dados.historico = dados.historico.slice(-10); // Mantém apenas últimas 10 interações
    }
  }
  
  // Sanitização de dados para evitar injection
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[<>\"']/g, '').trim().substring(0, 500); // Remove caracteres perigosos e limita tamanho
  };
  
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${getGeminiApiKey()}`;
  const nomeLead = sanitizeString(dados.nome) || 'cliente';
  
  // Prepara dados completos para análise com validação
  const dadosCompletos = {
    nome: sanitizeString(dados.nome),
    telefone: sanitizeString(dados.telefone),
    perfil: sanitizeString(dados.perfil),
    historico: Array.isArray(dados.historico) ? dados.historico.map(item => ({
      pergunta: sanitizeString(item.pergunta || ''),
      resposta: sanitizeString(item.resposta || '')
    })) : [],
    chatCompleto: Array.isArray(dados.chatCompleto) ? dados.chatCompleto.map(msg => ({
      text: sanitizeString(msg.text || ''),
      sender: sanitizeString(msg.sender || 'unknown')
    })) : [],
    userData: typeof dados.userData === 'object' ? dados.userData : {}
  };
  
  // Validação final do tamanho dos dados processados
  const historicoCompleto = JSON.stringify(dadosCompletos, null, 2);
  if (historicoCompleto.length > maxDataSize) {
    log(LOG_LEVELS.ERROR, "Dados ainda muito grandes após sanitização", { size: historicoCompleto.length });
    throw new Error('Dados de entrada muito extensos para processamento');
  }

  const masterPrompt = `
INSTRUÇÕES PARA ANÁLISE DE LEAD - CONEXÃO BÚZIOS

CONTEXTO: Você é um concierge especialista em Búzios e estrategista de vendas. Analise os dados do lead e gere uma resposta JSON estruturada.

DADOS DO LEAD:
${historicoCompleto}

TAREFA: Gere um JSON válido com exatamente 3 chaves. Siga as especificações abaixo:

1. "resumo_perfil" (string):
   - Máximo 200 caracteres
   - Capture a essência psicológica do lead
   - Identifique motivações e objetivos principais

2. "necessidades_reveladas" (array de strings):
   - Exatamente 3 a 5 itens
   - Cada item: máximo 100 caracteres
   - Transforme respostas em oportunidades comerciais específicas

3. "proposta_personalizada" (string):
   - Mensagem de WhatsApp personalizada
   - Estrutura obrigatória:
     * Gancho pessoal com nome do lead
     * Validação do desejo principal
     * 2 ofertas específicas com emojis
     * Pergunta de baixa fricção
   - Máximo 500 caracteres
   - Tom: exclusivo, pessoal, magnético

FORMATO DE RESPOSTA OBRIGATÓRIO:
Responda APENAS com o JSON válido, sem markdown, sem explicações adicionais.

{
  "resumo_perfil": "Análise psicológica do lead em até 200 caracteres",
  "necessidades_reveladas": [
    "Oportunidade comercial 1",
    "Oportunidade comercial 2",
    "Oportunidade comercial 3"
  ],
  "proposta_personalizada": "Mensagem WhatsApp personalizada seguindo a estrutura especificada"
}

IMPORTANTE: Substitua ${nomeLead} pelo nome real do lead. Evite aspas duplas desnecessárias no conteúdo.
  `;

  const payload = { contents: [{ parts: [{ text: masterPrompt }] }] };
  const options = { 
    method: 'post', 
    contentType: 'application/json', 
    payload: JSON.stringify(payload), 
    muteHttpExceptions: true 
  };

  try {
    log(LOG_LEVELS.DEBUG, "Enviando requisição para Gemini API");
    const response = UrlFetchApp.fetch(GEMINI_API_URL, options);
    
    if (response.getResponseCode() !== 200) {
      const errorText = response.getContentText();
      log(LOG_LEVELS.ERROR, "Erro na API Gemini", { 
        statusCode: response.getResponseCode(), 
        errorText 
      });
      throw new Error(`Erro na API Gemini: ${errorText}`);
    }
    
    const result = JSON.parse(response.getContentText());
    
    // Validate Gemini response structure
    if (!result.candidates || !result.candidates[0] || 
        !result.candidates[0].content || !result.candidates[0].content.parts ||
        !result.candidates[0].content.parts[0] || !result.candidates[0].content.parts[0].text) {
      throw new Error('Resposta da API Gemini em formato inesperado');
    }
    
    let jsonString = result.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    log(LOG_LEVELS.DEBUG, "Resposta bruta do Gemini", { jsonString: jsonString.substring(0, 200) + "..." });
    
    let analise;
    try {
      analise = JSON.parse(jsonString);
    } catch (parseError) {
      log(LOG_LEVELS.ERROR, "Erro ao parsear JSON da resposta do Gemini", { 
        erro: parseError.toString(), 
        jsonString: jsonString.substring(0, 500) 
      });
      throw new Error('Falha ao interpretar resposta da IA: JSON inválido');
    }

    if (analise.resumo_perfil && analise.necessidades_reveladas && analise.proposta_personalizada) {
      log(LOG_LEVELS.INFO, "Análise Gemini gerada com sucesso", {
        resumoLength: analise.resumo_perfil.length,
        necessidadesCount: analise.necessidades_reveladas.length,
        propostaLength: analise.proposta_personalizada.length
      });
      return analise;
    }
    
    throw new Error("Resposta da IA em formato inesperado.");
    
  } catch (error) {
    log(LOG_LEVELS.ERROR, "Erro ao gerar análise com IA", { erro: error.toString() });
    
    // Sistema de fallback inteligente baseado nos dados disponíveis
    const perfilLimpo = dados.perfil ? dados.perfil.replace(/🏖️|🏠|📢/g, '').trim() : 'visitante';
    const interessePrincipal = dados.etapa_4 || dados.userData?.interesse || 'explorar a cidade';
    const statusViagem = dados.etapa_1 || 'planejando a visita';
    
    // Gera fallback contextualizado baseado no perfil
    let resumoInteligente, necessidadesContextuais, propostaRealista;
    
    if (perfilLimpo.toLowerCase().includes('turista')) {
      resumoInteligente = `${nomeLead} é um turista interessado em ${interessePrincipal}. Status atual: ${statusViagem}. Busca experiências autênticas em Búzios com foco em descobertas locais.`;
      necessidadesContextuais = [
        "Informações sobre pontos turísticos locais",
        "Recomendações de restaurantes e experiências gastronômicas",
        "Dicas de hospedagem adequadas ao perfil",
        "Orientações sobre atividades e passeios disponíveis"
      ];
      propostaRealista = `Oi, ${nomeLead}! Vi que você está interessado em ${interessePrincipal} aqui em Búzios. Posso te ajudar com informações locais, dicas de lugares especiais e sugestões personalizadas para sua visita. Vamos conversar sobre como tornar sua experiência em Búzios mais interessante?`;
    } else if (perfilLimpo.toLowerCase().includes('morador')) {
      resumoInteligente = `${nomeLead} é morador de Búzios interessado em ${interessePrincipal}. Busca conexões locais e oportunidades de engajamento na comunidade.`;
      necessidadesContextuais = [
        "Networking com outros moradores locais",
        "Informações sobre eventos e atividades comunitárias",
        "Oportunidades de negócios ou serviços locais",
        "Conexões para melhorar a experiência de viver em Búzios"
      ];
      propostaRealista = `Oi, ${nomeLead}! Como morador de Búzios, você tem uma perspectiva única da cidade. Que tal conectarmos você com outros locais que compartilham interesses similares? Posso te ajudar a descobrir oportunidades e eventos na nossa comunidade.`;
    } else {
      resumoInteligente = `${nomeLead} busca divulgar ${interessePrincipal} em Búzios. Procura canais eficazes de comunicação e networking local para promover seu negócio ou serviço.`;
      necessidadesContextuais = [
        "Estratégias de marketing local eficazes",
        "Conexões com outros empreendedores da região",
        "Canais de divulgação adequados ao público-alvo",
        "Orientações sobre regulamentações e melhores práticas locais"
      ];
      propostaRealista = `Oi, ${nomeLead}! Vi que você quer divulgar ${interessePrincipal} em Búzios. Posso te conectar com a rede local e compartilhar estratégias que funcionam aqui na região. Vamos conversar sobre como ampliar seu alcance de forma eficiente?`;
    }
    
    return {
      resumo_perfil: resumoInteligente,
      necessidades_reveladas: necessidadesContextuais,
      proposta_personalizada: propostaRealista
    };
  }
}

// === FUNÇÃO DE CRIAÇÃO DE DOSSIÊ (ROBUSTA E CORRIGIDA) ===
function criarDossieFormatado(dados) {
  log(LOG_LEVELS.INFO, "Iniciando criação de dossiê", { nome: dados.nome, perfil: dados.perfil });
  
  try {
    const pastaLeads = DriveApp.getFolderById(ID_DA_PASTA_DOSSIES);
    const agora = new Date();
    const dataFormatadaArquivo = Utilities.formatDate(agora, "GMT-3", "dd-MM-yyyy HH'h'mm");
    const dataFormatadaDoc = Utilities.formatDate(agora, "GMT-3", "dd 'de' MMMM 'de' yyyy, 'às' HH'h'mm");
    
    const nomeDoArquivo = `Dossiê: ${dados.nome || 'Lead Anônimo'} (${dados.perfil ? dados.perfil.replace(/🏖️|🏠|📢/g, '').trim() : 'N/A'}) - ${dataFormatadaArquivo}`;
    
    log(LOG_LEVELS.DEBUG, "Criando documento", { nomeArquivo: nomeDoArquivo });
    
    const doc = DocumentApp.create(nomeDoArquivo);
    const body = doc.getBody();
    body.clear();

    const estilos = {
      default: { [DocumentApp.Attribute.FONT_FAMILY]: 'Inter' },
      titulo: { [DocumentApp.Attribute.BOLD]: true, [DocumentApp.Attribute.FONT_SIZE]: 24, [DocumentApp.Attribute.FOREGROUND_COLOR]: "#2563eb" },
      subtitulo: { [DocumentApp.Attribute.FONT_SIZE]: 9, [DocumentApp.Attribute.FOREGROUND_COLOR]: "#6b7280" },
      tituloSecao: { [DocumentApp.Attribute.BOLD]: true, [DocumentApp.Attribute.FONT_SIZE]: 10, [DocumentApp.Attribute.FOREGROUND_COLOR]: "#6b7280", [DocumentApp.Attribute.SPACING_BEFORE]: 18, [DocumentApp.Attribute.SPACING_AFTER]: 6 },
      tituloInsights: { [DocumentApp.Attribute.BOLD]: true, [DocumentApp.Attribute.FONT_SIZE]: 10, [DocumentApp.Attribute.FOREGROUND_COLOR]: "#581c87", [DocumentApp.Attribute.SPACING_BEFORE]: 18, [DocumentApp.Attribute.SPACING_AFTER]: 6 },
      label: { [DocumentApp.Attribute.BOLD]: true, [DocumentApp.Attribute.FONT_SIZE]: 11, [DocumentApp.Attribute.FOREGROUND_COLOR]: "#000000" },
      valor: { [DocumentApp.Attribute.FONT_SIZE]: 11, [DocumentApp.Attribute.FOREGROUND_COLOR]: "#374151" },
      insight: { [DocumentApp.Attribute.FONT_SIZE]: 11, [DocumentApp.Attribute.FOREGROUND_COLOR]: "#374151", [DocumentApp.Attribute.ITALIC]: true },
      proposta: { [DocumentApp.Attribute.FONT_SIZE]: 11, [DocumentApp.Attribute.FOREGROUND_COLOR]: "#374151", [DocumentApp.Attribute.LINE_SPACING]: 1.5 },
      status: { [DocumentApp.Attribute.BOLD]: true, [DocumentApp.Attribute.FONT_SIZE]: 11, [DocumentApp.Attribute.FOREGROUND_COLOR]: "#059669" }
    };

    body.setAttributes(estilos.default);
    body.appendParagraph("✨ Dossiê de Qualificação de Lead ✨").setAttributes(estilos.titulo).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    body.appendParagraph(`Gerado em: ${dataFormatadaDoc}`).setAttributes(estilos.subtitulo).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    body.appendParagraph("\n").setFontSize(6);
    body.appendHorizontalRule();

    // --- SEÇÃO DE ANÁLISE DA IA ---
    body.appendParagraph("🧠 ANÁLISE COMERCIAL (IA)").setAttributes(estilos.tituloInsights);
    body.appendParagraph("Resumo do Perfil").setAttributes(estilos.label);
    body.appendParagraph(dados.resumo_perfil || "Não foi possível gerar o resumo do perfil.").setAttributes(estilos.insight);
    body.appendParagraph("\n");
    body.appendParagraph("Necessidades Reveladas").setAttributes(estilos.label);
    if (dados.necessidades_reveladas && dados.necessidades_reveladas.length > 0) {
      dados.necessidades_reveladas.forEach(insight => {
        body.appendListItem(" " + insight).setGlyphType(DocumentApp.GlyphType.BULLET).setAttributes(estilos.insight);
      });
    } else {
      body.appendParagraph("Nenhuma necessidade específica foi revelada.").setAttributes(estilos.insight);
    }
    body.appendParagraph("\n\n");

    // --- SEÇÃO DE RESPOSTAS DO LEAD (COM VALIDAÇÃO ROBUSTA) ---
    body.appendParagraph("🗂️ HISTÓRICO DE INTERAÇÕES (FUNIL COMPLETO)").setAttributes(estilos.tituloSecao);
    const tabelaRespostas = body.appendTable();
    
    if (dados.historico && Array.isArray(dados.historico) && dados.historico.length > 0) {
      dados.historico.forEach((item, index) => {
        const row = tabelaRespostas.appendTableRow();
        
        // Validação robusta de cada item
        const pergunta = (item && typeof item === 'object' && item.pergunta) ? item.pergunta : `[Pergunta ${index + 1} não registrada]`;
        const resposta = (item && typeof item === 'object' && item.resposta) ? item.resposta : `[Resposta ${index + 1} não registrada]`;
        
        row.appendTableCell(`❓ ${pergunta}`).setAttributes(estilos.label);
        row.appendTableCell(resposta).setAttributes(estilos.valor);
      });
    } else {
      // Fallback para dados não estruturados
      const dadosFallback = [
        { campo: "Perfil", valor: dados.perfil || "N/A" },
        { campo: "Status da Viagem", valor: dados.etapa_1 || "N/A" },
        { campo: "Companhia", valor: dados.etapa_2 || "N/A" },
        { campo: "Hospedagem", valor: dados.etapa_3 || "N/A" },
        { campo: "Desejo Principal", valor: dados.etapa_4 || "N/A" }
      ];
      
      dadosFallback.forEach(item => {
        const row = tabelaRespostas.appendTableRow();
        row.appendTableCell(`❓ ${item.campo}`).setAttributes(estilos.label);
        row.appendTableCell(item.valor).setAttributes(estilos.valor);
      });
    }
    
    tabelaRespostas.setBorderWidth(0);

    // --- SEÇÃO DA PROPOSTA ---
    body.appendParagraph("\n💡 PROPOSTA PERSONALIZADA (IA)").setAttributes(estilos.tituloSecao);
    const propostaContainer = body.appendTable([['']]);
    propostaContainer.setBorderWidth(1).setBorderColor("#d1d5db");
    propostaContainer.getCell(0, 0).appendParagraph(dados.proposta_personalizada || "Nenhuma proposta detalhada foi gerada.").setAttributes(estilos.proposta);

    body.appendParagraph("\n").setFontSize(6);
    body.appendHorizontalRule();
    body.appendParagraph("Status do Lead: ✅ Lead Qualificado | Potencial de Conversão: Alto").setAlignment(DocumentApp.HorizontalAlignment.CENTER).setAttributes(estilos.status);

    // --- SEÇÃO DE METADADOS E DADOS ESTRUTURADOS (NOVA) ---
    body.appendParagraph("\n🔧 DADOS ESTRUTURADOS DO SISTEMA").setAttributes(estilos.tituloSecao);
    
    // Adiciona dados estruturados para facilitar a extração posteriormente
    const metadados = {
      telefone: dados.telefone || 'N/A',
      chatCompleto: dados.chatCompleto || [],
      timestamp: agora.toISOString(),
      conteudoOriginal: body.getText()
    };
    
    // Salva os dados como uma seção oculta/comentário para recuperação posterior
    body.appendParagraph(`\n--- DADOS_ESTRUTURADOS_INICIO ---`).setAttributes(estilos.subtitulo);
    body.appendParagraph(JSON.stringify(metadados, null, 2)).setAttributes(estilos.subtitulo);
    body.appendParagraph(`--- DADOS_ESTRUTURADOS_FIM ---`).setAttributes(estilos.subtitulo);

    doc.saveAndClose();
    const arquivo = DriveApp.getFileById(doc.getId());
    pastaLeads.addFile(arquivo);
    DriveApp.getRootFolder().removeFile(arquivo);
    
    const url = doc.getUrl();
    log(LOG_LEVELS.INFO, "Dossiê criado com sucesso", { url, nomeArquivo: nomeDoArquivo });
    
    return url;
    
  } catch (error) {
    log(LOG_LEVELS.ERROR, "Erro ao criar dossiê", { erro: error.toString(), dados: { nome: dados.nome, perfil: dados.perfil } });
    throw new Error(`Falha ao criar dossiê: ${error.toString()}`);
  }
}

function salvarResumoNaPlanilha(dados, urlDoDossie) {
  try {
    log(LOG_LEVELS.INFO, "Salvando resumo na planilha", { nome: dados.nome });
    
    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    const cabecalhos = ["Timestamp", "Nome", "Contato", "Perfil", "Resumo da Oportunidade", "Necessidades Reveladas (IA)", "Link para o Dossiê"];
    const abaLeads = getOrCreateSheet(planilha, "Dashboard de Leads", cabecalhos);
    
    let resumo = "Não especificado";
    if (dados.historico && Array.isArray(dados.historico) && dados.historico.length > 0) {
      const ultimaResposta = dados.historico[dados.historico.length - 1];
      if (ultimaResposta && ultimaResposta.resposta) {
        resumo = ultimaResposta.resposta;
      }
    } else if (dados.etapa_4) {
      resumo = dados.etapa_4;
    }
    
    const linkFormatado = SpreadsheetApp.newRichTextValue().setText("Abrir Dossiê").setLinkUrl(urlDoDossie).build();
    const necessidadesString = (dados.necessidades_reveladas || []).join(' | ');
    
    abaLeads.appendRow([
      new Date(), 
      dados.nome || 'N/A', 
      dados.telefone || 'N/A', 
      dados.perfil ? dados.perfil.replace(/🏖️|🏠|📢/g, '').trim() : 'N/A', 
      resumo, 
      necessidadesString, 
      linkFormatado
    ]);
    
    log(LOG_LEVELS.INFO, "Resumo salvo na planilha com sucesso");
    
  } catch (error) {
    log(LOG_LEVELS.ERROR, "Erro ao salvar na planilha", { erro: error.toString() });
    throw new Error(`Falha ao salvar na planilha: ${error.toString()}`);
  }
}

// === FUNÇÕES AUXILIARES (MELHORADAS) ===
function listDossies() {
  try {
    log(LOG_LEVELS.INFO, "Listando dossiês");
    
    const pasta = DriveApp.getFolderById(ID_DA_PASTA_DOSSIES);
    const arquivos = pasta.getFiles();
    const dossies = [];
    
    while (arquivos.hasNext()) {
      const arquivo = arquivos.next();
      const nomeArquivo = arquivo.getName();
      const match = nomeArquivo.match(/Dossiê:\s*(.*?)\s*\((.*?)\)\s*-\s*(.*)/);
      
      if (match) {
        try {
          const interesse = extractInterest(arquivo.getId());
          const telefone = extractTelefone(arquivo.getId());
          
          dossies.push({ 
            id: arquivo.getId(), 
            name: match[1].trim(), 
            profile: match[2].trim(), 
            timestamp: arquivo.getDateCreated().toISOString(), 
            url: arquivo.getUrl(), 
            interest: interesse,
            telefone: telefone || 'N/A'
          });
        } catch (extractError) {
          log(LOG_LEVELS.WARN, "Erro ao extrair dados", { arquivo: nomeArquivo, erro: extractError.toString() });
          dossies.push({ 
            id: arquivo.getId(), 
            name: match[1].trim(), 
            profile: match[2].trim(), 
            timestamp: arquivo.getDateCreated().toISOString(), 
            url: arquivo.getUrl(), 
            interest: "Erro na extração",
            telefone: 'N/A'
          });
        }
      }
    }
    
    dossies.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    log(LOG_LEVELS.INFO, "Dossiês listados com sucesso", { count: dossies.length });
    return dossies;
    
  } catch (error) {
    log(LOG_LEVELS.ERROR, "Erro ao listar dossiês", { erro: error.toString() });
    throw new Error(`Falha ao listar dossiês: ${error.toString()}`);
  }
}

function extractInterest(fileId) {
  try {
    const content = getDossierContentRaw(fileId);
    // Fixed regex to capture multi-line content after "Necessidades Reveladas"
    const regex = /Necessidades Reveladas\s*\n([\s\S]*?)(?:\n\n|\n[A-Z]|$)/;
    const match = content.match(regex);
    
    if (match && match[1]) {
      // Extract the first meaningful line from the captured content
      const lines = match[1].split('\n').filter(line => line.trim());
      const firstMeaningfulLine = lines.find(line => 
        line.trim() && 
        !line.match(/^[•\s*-]+$/) && // Skip lines with only bullets/dashes
        line.length > 5 // Skip very short lines
      );
      
      if (firstMeaningfulLine) {
        return firstMeaningfulLine.replace(/^[•\s*-]+/, '').trim();
      }
    }
    
    return 'Não especificado';
  } catch (e) { 
    log(LOG_LEVELS.WARN, `Erro ao extrair interesse do arquivo ${fileId}`, { erro: e.toString() });
    return 'Erro na extração'; 
  }
}

function extractTelefone(fileId) {
  try {
    const content = getDossierContentRaw(fileId);
    const regex = /--- DADOS_ESTRUTURADOS_INICIO ---\s*([\s\S]*?)\s*--- DADOS_ESTRUTURADOS_FIM ---/;
    const match = content.match(regex);
    
    if (match && match[1]) {
      try {
        const dadosEstruturados = JSON.parse(match[1].trim());
        return dadosEstruturados.telefone || 'N/A';
      } catch (jsonError) {
        log(LOG_LEVELS.WARN, `Erro ao parsear dados estruturados para telefone ${fileId}`, { erro: jsonError.toString() });
        // Continue to fallback method
      }
    }
    
    // Fallback: busca por padrão de telefone no texto com regex mais robusta - CORRIGIDA
    // Regex aprimorada para números brasileiros com todas as variações
    const phoneRegexes = [
      // Formato completo com +55: +55 (11) 99999-9999 ou +55 11 999999999
      /\+55\s*\(?(?:1[1-9]|[2-9][0-9])\)?\s*9?\s*[1-9]\d{3}[-\s]?\d{4}/g,
      // Formato com código de área: (11) 99999-9999 ou 11 999999999
      /\(?(?:1[1-9]|[2-9][0-9])\)?\s*9?\s*[1-9]\d{3}[-\s]?\d{4}/g,
      // Formato celular com 9: 99999-9999
      /\b9[1-9]\d{3}[-\s]?\d{4}\b/g,
      // Formato fixo: 3333-4444
      /\b[2-5]\d{3}[-\s]?\d{4}\b/g
    ];
    
    let phoneMatch = null;
    for (const regex of phoneRegexes) {
      phoneMatch = content.match(regex);
      if (phoneMatch && phoneMatch.length > 0) {
        // Valida se o número encontrado é realmente um telefone brasileiro
        const phone = phoneMatch[0].replace(/\D/g, '');
        
        // Validações específicas para números brasileiros
        if (phone.length >= 10 && phone.length <= 13) {
          // Remove código do país se presente
          const cleanPhone = phone.startsWith('55') && phone.length > 10 ? phone.substring(2) : phone;
          
          // Verifica se tem código de área válido (11-99)
          if (cleanPhone.length >= 10) {
            const areaCode = cleanPhone.substring(0, 2);
            const areaCodeNum = parseInt(areaCode);
            
            if (areaCodeNum >= 11 && areaCodeNum <= 99) {
              // Verifica se é celular (9 dígitos após área) ou fixo (8 dígitos)
              const phoneNumber = cleanPhone.substring(2);
              if ((phoneNumber.length === 9 && phoneNumber.startsWith('9')) || 
                  (phoneNumber.length === 8 && !phoneNumber.startsWith('9'))) {
                break; // Número válido encontrado
              }
            }
          }
        }
        phoneMatch = null; // Reset se não passou na validação
      }
    }
    
    if (phoneMatch) {
      // Return the first valid phone number found
      return phoneMatch[0];
    }
    
    return 'N/A';
    
  } catch (e) { 
    log(LOG_LEVELS.WARN, `Erro ao extrair telefone do arquivo ${fileId}`, { erro: e.toString() });
    return 'N/A'; 
  }
}

function getDossierContentRaw(fileId) {
  try {
    const doc = DocumentApp.openById(fileId);
    return doc.getBody().getText();
  } catch (e) { 
    throw new Error("Não foi possível abrir ou ler o dossiê: " + fileId); 
  }
}

function getDossierContent(fileId) {
  try {
    log(LOG_LEVELS.DEBUG, "Obtendo conteúdo estruturado do dossiê", { fileId });
    const content = getDossierContentRaw(fileId);
    
    // Tenta extrair dados estruturados primeiro
    const regex = /--- DADOS_ESTRUTURADOS_INICIO ---\s*([\s\S]*?)\s*--- DADOS_ESTRUTURADOS_FIM ---/;
    const match = content.match(regex);
    
    if (match && match[1]) {
      try {
        const dadosEstruturados = JSON.parse(match[1].trim());
        log(LOG_LEVELS.DEBUG, "Dados estruturados encontrados", { 
          temTelefone: !!dadosEstruturados.telefone,
          temChatCompleto: !!dadosEstruturados.chatCompleto,
          chatLength: dadosEstruturados.chatCompleto?.length || 0
        });
        
        return {
          conteudoOriginal: content,
          telefone: dadosEstruturados.telefone || 'N/A',
          chatCompleto: dadosEstruturados.chatCompleto || [],
          timestamp: dadosEstruturados.timestamp
        };
      } catch (parseError) {
        log(LOG_LEVELS.WARN, "Erro ao parsear dados estruturados", { erro: parseError.toString() });
      }
    }
    
    // Fallback: retorna apenas o conteúdo original
    log(LOG_LEVELS.DEBUG, "Usando fallback para conteúdo", { contentLength: content.length });
    return {
      conteudoOriginal: content,
      telefone: extractTelefone(fileId),
      chatCompleto: [],
      timestamp: new Date().toISOString()
    };
    
  } catch (e) { 
    log(LOG_LEVELS.ERROR, "Erro ao obter conteúdo do dossiê", { fileId, erro: e.toString() });
    throw new Error("Não foi possível abrir ou ler o dossiê: " + fileId); 
  }
}

function getOrCreateSheet(planilha, nomeAba, cabecalhos) {
  try {
    let aba = planilha.getSheetByName(nomeAba);
    if (!aba) {
      log(LOG_LEVELS.INFO, "Criando nova aba", { nomeAba });
      aba = planilha.insertSheet(nomeAba);
      const rangeCabecalho = aba.getRange(1, 1, 1, cabecalhos.length);
      rangeCabecalho.setValues([cabecalhos]).setFontWeight("bold").setBackground("#e2e8f0");
      aba.setFrozenRows(1);
      aba.autoResizeColumns(1, cabecalhos.length);
    }
    return aba;
  } catch (error) {
    log(LOG_LEVELS.ERROR, "Erro ao criar/obter aba", { nomeAba, erro: error.toString() });
    throw error;
  }
}

function createJsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

// === FUNÇÃO DE DEPLOY E CONFIGURAÇÃO ===
function configurarAPI() {
  log(LOG_LEVELS.INFO, "=== CONFIGURAÇÃO DA API ===");
  
  try {
    // Testa todas as configurações
    const resultado = testarAPI();
    
    if (resultado.success) {
      log(LOG_LEVELS.INFO, "✅ API configurada e funcionando perfeitamente!");
      return resultado;
    } else {
      log(LOG_LEVELS.ERROR, "❌ Falha na configuração da API", resultado);
      return resultado;
    }
  } catch (error) {
    log(LOG_LEVELS.CRITICAL, "❌ Erro crítico na configuração", { erro: error.toString() });
    return {
      success: false,
      message: "Erro crítico na configuração",
      erro: error.toString()
    };
  }
}
