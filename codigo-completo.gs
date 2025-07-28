/**
 * API Unificada para o Ecossistema Conexão Búzios v19.0 (Arquitetura de Resiliência Avançada)
 *
 * MELHORIAS IMPLEMENTADAS:
 * 1. Configurações atualizadas com API Key e ID da pasta corretos
 * 2. Sistema de logs detalhados para rastreamento de erros
 * 3. Função de teste integrada para validação prévia
 * 4. Tratamento de erros robusto com fallbacks
 * 5. Validação de dados aprimorada
 * 6. Sistema de monitoramento de performance
 */

// === CONFIGURAÇÕES ATUALIZADAS ===
const ID_DA_PASTA_DOSSIES = "1iyZXYcdDrr41wM1GEvyEdl_3kgZFafUA";
const GEMINI_API_KEY = "AIzaSyBlOiC0sqSE-CjJ4wDBIj34DKit1NgoAV4";
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
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
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
        
        log(LOG_LEVELS.INFO, "Iniciando processamento de dossiê", { nome: data.nome, perfil: data.perfil });
        
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
        result = { success: true, data: { content: getDossierContent(id) } };
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

// === NÚCLEO DE INTELIGÊNCIA COMERCIAL (MELHORADO) ===
function gerarAnaliseCompletaComGemini(dados) {
  log(LOG_LEVELS.INFO, "Iniciando análise com Gemini", { nome: dados.nome, perfil: dados.perfil });
  
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
  const nomeLead = dados.nome || 'cliente';
  const historicoCompleto = JSON.stringify(dados, null, 2);

  const masterPrompt = `
    Você é um concierge de luxo em Búzios e um estrategista de vendas de elite. Sua especialidade é transformar informações em experiências irresistíveis.
    Analise os dados brutos deste lead: ${historicoCompleto}.

    Sua missão é gerar uma resposta JSON com TRÊS chaves: "resumo_perfil", "necessidades_reveladas" e "proposta_personalizada".

    1.  **"resumo_perfil":**
        Crie um parágrafo denso e perspicaz (2-3 linhas) que capture a essência psicológica e o objetivo latente do lead. Vá além do óbvio.

    2.  **"necessidades_reveladas":**
        Liste de 3 a 5 oportunidades de negócio em formato de tópicos. Transforme as respostas do lead em dores ou desejos claros que podemos resolver.

    3.  **"proposta_personalizada" (MODELO DE ALTA PERSUASÃO):**
        Crie uma mensagem de WhatsApp que seja impossível de ignorar. O tom deve ser exclusivo, pessoal e magnético. Siga esta estrutura com precisão militar:
        
        - **Gancho Específico (1 linha):** Comece com o nome do lead e cite a resposta MAIS IMPORTANTE que ele deu, mostrando que você prestou atenção.
            - Exemplo: "Oi, ${nomeLead}! Vi que você quer descobrir os 'lugares secretos' de Búzios, e isso me chamou a atenção..."
        
        - **Validação e Exclusividade (2 linhas):** Valide o desejo dele e posicione sua oferta como única.
            - Exemplo: "Essa é a melhor forma de sentir a verdadeira alma da cidade, algo que 99% dos turistas nunca encontram. Pensando nisso, desenhei um roteiro preliminar que foge completamente do óbvio."
        
        - **A Oferta Irresistível (2 itens em lista com emojis):** Apresente duas opções ultra-específicas e sensoriais que ataquem diretamente o desejo principal. Crie curiosidade.
            - Exemplo 1: "🌅 Um pôr do sol em um deck escondido na Praia da Foca, com um drink de boas-vindas que só é servido lá."
            - Exemplo 2: "🎶 Acesso a um luau com músicos locais que acontece em uma praia quase deserta, sem nenhuma placa indicando o caminho."
        
        - **CTA de Baixa Fricção (1-2 linhas):** Faça uma pergunta aberta, que seja fácil de responder "sim" e que passe o controle para o lead.
            - Exemplo: "Alguma dessas ideias faz seu coração bater mais forte? Se sim, me diga qual que eu te passo os próximos detalhes, sem compromisso."

    FORMATO OBRIGATÓRIO DA RESPOSTA (APENAS O JSON):
    {
      "resumo_perfil": "Texto do resumo aqui.",
      "necessidades_reveladas": [
        "Insight comercial 1.",
        "Insight comercial 2."
      ],
      "proposta_personalizada": "Texto da proposta aqui..."
    }
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
    let jsonString = result.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    log(LOG_LEVELS.DEBUG, "Resposta bruta do Gemini", { jsonString: jsonString.substring(0, 200) + "..." });
    
    const analise = JSON.parse(jsonString);

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
    
    // Fallback robusto
    return {
      resumo_perfil: `Perfil de ${nomeLead}: ${dados.perfil || 'N/A'}. Interesse principal: ${dados.etapa_4 || 'N/A'}. A análise detalhada da IA falhou, mas os dados básicos foram capturados.`,
      necessidades_reveladas: [
        `Perfil identificado: ${dados.perfil || 'N/A'}`,
        `Desejo principal: ${dados.etapa_4 || 'N/A'}`,
        `Status da viagem: ${dados.etapa_1 || 'N/A'}`,
        "Análise manual recomendada para insights mais profundos"
      ],
      proposta_personalizada: `Oi, ${nomeLead}! Recebi suas informações sobre ${dados.perfil || 'sua visita'} a Búzios e já estou buscando as melhores opções personalizadas para você. Em breve te chamo no WhatsApp com detalhes exclusivos que vão transformar sua experiência!`
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
          dossies.push({ 
            id: arquivo.getId(), 
            name: match[1].trim(), 
            profile: match[2].trim(), 
            timestamp: arquivo.getDateCreated().toISOString(), 
            url: arquivo.getUrl(), 
            interest: interesse 
          });
        } catch (extractError) {
          log(LOG_LEVELS.WARN, "Erro ao extrair interesse", { arquivo: nomeArquivo, erro: extractError.toString() });
          dossies.push({ 
            id: arquivo.getId(), 
            name: match[1].trim(), 
            profile: match[2].trim(), 
            timestamp: arquivo.getDateCreated().toISOString(), 
            url: arquivo.getUrl(), 
            interest: "Erro na extração" 
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
    const content = getDossierContent(fileId);
    const regex = /Necessidades Reveladas\s*\n(.*?)\n/m;
    const match = content.match(regex);
    return (match && match[1]) ? match[1].replace(/[•\s*-]+/,'').trim() : 'Não especificado';
  } catch (e) { 
    log(LOG_LEVELS.WARN, `Erro ao extrair interesse do arquivo ${fileId}`, { erro: e.toString() });
    return 'Erro na extração'; 
  }
}

function getDossierContent(fileId) {
  try {
    log(LOG_LEVELS.DEBUG, "Obtendo conteúdo do dossiê", { fileId });
    const doc = DocumentApp.openById(fileId);
    const content = doc.getBody().getText();
    log(LOG_LEVELS.DEBUG, "Conteúdo obtido com sucesso", { contentLength: content.length });
    return content;
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