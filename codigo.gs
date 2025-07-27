/**
 * API Unificada para o Ecossistema Conexão Búzios v18.0 (Arquitetura de Resiliência)
 *
 * Melhorias Estruturais Implementadas:
 * 1.  **Validação de Histórico no Dossiê:** A função `criarDossieFormatado` agora valida
 * cada item do histórico recebido. Se `pergunta` ou `resposta` estiverem ausentes,
 * insere um fallback claro ("[Não registrado]") em vez de "undefined", garantindo a
 * integridade do documento.
 * 2.  **Limpeza de Formatação:** Removido o caractere "—" extra na célula de resposta para
 * garantir um formato limpo de "Pergunta \t Resposta", crucial para o parser do dashboard.
 * 3.  **Manutenção da IA de Alta Conversão:** O prompt da IA permanece otimizado para gerar
 * propostas de alto impacto.
 */

const ID_DA_PASTA_DOSSIES = "1iyZXYcdDrr41wM1GEvyEdl_3kgZFafUA";
const GEMINI_API_KEY = "AIzaSyBlOiC0sqSE-CjJ4wDBIj34DKit1NgoAV4";

// --- PONTO DE ENTRADA PRINCIPAL (BLINDADO) ---
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Requisição POST inválida: o corpo da requisição (e.postData.contents) está ausente.");
    }
    
    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseError) {
      throw new Error("Falha ao analisar o corpo da requisição. Verifique se é um JSON válido.");
    }

    if (!payload.action) {
        throw new Error("Ação não especificada no payload da requisição.");
    }

    const { action, data, id } = payload;
    Logger.log("Ação recebida: " + action);

    switch (action) {
      case 'processAndSaveDossier':
        if (!data) throw new Error("Dados do lead ausentes para a ação 'processAndSaveDossier'.");
        
        const analiseCompleta = gerarAnaliseCompletaComGemini(data);
        data.resumo_perfil = analiseCompleta.resumo_perfil;
        data.necessidades_reveladas = analiseCompleta.necessidades_reveladas;
        data.proposta_personalizada = analiseCompleta.proposta_personalizada;

        const urlDoDossie = criarDossieFormatado(data);
        salvarResumoNaPlanilha(data, urlDoDossie);

        return createJsonResponse({ 
            success: true, 
            data: {
                url: urlDoDossie,
                proposta_personalizada: data.proposta_personalizada
            } 
        });

      case 'listDossies':
        return createJsonResponse({ success: true, data: listDossies() });
      
      case 'getDossierContent':
        if (!id) throw new Error("ID do arquivo não fornecido para 'getDossierContent'.");
        return createJsonResponse({ success: true, data: { content: getDossierContent(id) } });

      default:
        throw new Error(`Ação inválida ou não reconhecida: ${action}`);
    }
  } catch (error) {
    Logger.log("ERRO GERAL no doPost: " + error.toString());
    return createJsonResponse({ success: false, error: error.toString() });
  }
}

// --- NÚCLEO DE INTELIGÊNCIA COMERCIAL ---
function gerarAnaliseCompletaComGemini(dados) {
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
  const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload), muteHttpExceptions: true };

  try {
    const response = UrlFetchApp.fetch(GEMINI_API_URL, options);
    if (response.getResponseCode() !== 200) throw new Error(`Erro na API Gemini: ${response.getContentText()}`);
    
    const result = JSON.parse(response.getContentText());
    let jsonString = result.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
    const analise = JSON.parse(jsonString);

    if (analise.resumo_perfil && analise.necessidades_reveladas && analise.proposta_personalizada) {
      return analise;
    }
    throw new Error("Resposta da IA em formato inesperado.");
  } catch (error) {
    Logger.log("Erro ao gerar análise com IA: " + error.toString());
    return {
      resumo_perfil: "A análise de perfil da IA falhou. É recomendado revisar as respostas manualmente para entender o contexto do lead.",
      necessidades_reveladas: ["Análise de necessidades falhou.", `Perfil: ${dados.perfil || 'N/A'}`, `Desejo: ${dados.etapa_4 || 'N/A'}`],
      proposta_personalizada: `Oi, ${nomeLead}! Recebi suas informações e já estou buscando as melhores opções para você em Búzios. Em breve te chamo no WhatsApp com os detalhes!`
    };
  }
}

// --- FUNÇÃO DE CRIAÇÃO DE DOSSIÊ (ROBUSTA E CORRIGIDA) ---
function criarDossieFormatado(dados) {
  const pastaLeads = DriveApp.getFolderById(ID_DA_PASTA_DOSSIES);
  const agora = new Date();
  const dataFormatadaArquivo = Utilities.formatDate(agora, "GMT-3", "dd-MM-yyyy HH'h'mm");
  const dataFormatadaDoc = Utilities.formatDate(agora, "GMT-3", "dd 'de' MMMM 'de' yyyy, 'às' HH'h'mm");
  
  const nomeDoArquivo = `Dossiê: ${dados.nome || 'Lead Anônimo'} (${dados.perfil ? dados.perfil.replace(/🏖️|🏠|📢/g, '').trim() : 'N/A'}) - ${dataFormatadaArquivo}`;
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


  // --- SEÇÃO DE RESPOSTAS DO LEAD (COM VALIDAÇÃO) ---
  body.appendParagraph("🗂️ HISTÓRICO DE INTERAÇÕES (FUNIL COMPLETO)").setAttributes(estilos.tituloSecao);
  const tabelaRespostas = body.appendTable();
  if (dados.historico && dados.historico.length > 0) {
      dados.historico.forEach(item => {
          const row = tabelaRespostas.appendTableRow();
          // CORREÇÃO: Valida se 'item' e suas propriedades existem antes de usar
          const pergunta = item && item.pergunta ? item.pergunta : item && item.question ? item.question : "[Pergunta não registrada]";
          const resposta = item && item.resposta ? item.resposta : item && item.answer ? item.answer : "[Resposta não registrada]";
          
          row.appendTableCell(`❓ ${pergunta}`).setAttributes(estilos.label);
          // CORREÇÃO: Remove o "—" para manter o formato limpo
          row.appendTableCell(resposta).setAttributes(estilos.valor);
      });
  } else {
      tabelaRespostas.appendTableRow().appendTableCell("Nenhum histórico de interação foi registrado.").setAttributes(estilos.valor);
  }
  tabelaRespostas.setBorderWidth(0);

  // --- SEÇÃO DE CHAT COMPLETO (NOVA) ---
  if (dados.chatCompleto && dados.chatCompleto.length > 0) {
    body.appendParagraph("\n💬 CONVERSA COMPLETA COM A IA").setAttributes(estilos.tituloSecao);
    const tabelaChat = body.appendTable();
    
    dados.chatCompleto.forEach(mensagem => {
      if (mensagem && mensagem.text && mensagem.sender) {
        const row = tabelaChat.appendTableRow();
        const remetente = mensagem.sender === 'ai' ? '🤖 IA' : '👤 Visitante';
        const texto = mensagem.text;
        
        row.appendTableCell(remetente).setAttributes(estilos.label);
        row.appendTableCell(texto).setAttributes(estilos.valor);
      }
    });
    
    tabelaChat.setBorderWidth(0);
  }

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
  return doc.getUrl();
}


function salvarResumoNaPlanilha(dados, urlDoDossie) {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const cabecalhos = ["Timestamp", "Nome", "Contato", "Perfil", "Resumo da Oportunidade", "Necessidades Reveladas (IA)", "Link para o Dossiê", "Chat Completo"];
  const abaLeads = getOrCreateSheet(planilha, "Dashboard de Leads", cabecalhos);
  let resumo = (dados.historico && dados.historico.length > 0 && dados.historico[dados.historico.length - 1].resposta) ? dados.historico[dados.historico.length - 1].resposta : 'Não especificado';
  const linkFormatado = SpreadsheetApp.newRichTextValue().setText("Abrir Dossiê").setLinkUrl(urlDoDossie).build();
  const necessidadesString = (dados.necessidades_reveladas || []).join(' | ');
  
  // Formatar o chat completo para salvar na planilha
  const chatCompletoString = dados.chatCompleto ? JSON.stringify(dados.chatCompleto) : 'Não disponível';
  
  abaLeads.appendRow([new Date(), dados.nome || 'N/A', dados.telefone || 'N/A', dados.perfil ? dados.perfil.replace(/🏖️|🏠|📢/g, '').trim() : 'N/A', resumo, necessidadesString, linkFormatado, chatCompletoString]);
}

// --- FUNÇÕES AUXILIARES ---
function listDossies() {
  const pasta = DriveApp.getFolderById(ID_DA_PASTA_DOSSIES);
  const arquivos = pasta.getFiles();
  const dossies = [];
  
  // Também buscar dados da planilha para ter informações mais completas
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const abaLeads = planilha.getSheetByName("Dashboard de Leads");
  let planilhaData = {};
  
  if (abaLeads) {
    const dados = abaLeads.getDataRange().getValues();
    const cabecalhos = dados[0];
    const indiceNome = cabecalhos.indexOf("Nome");
    const indiceContato = cabecalhos.indexOf("Contato");
    const indiceChatCompleto = cabecalhos.indexOf("Chat Completo");
    const indiceTimestamp = cabecalhos.indexOf("Timestamp");
    
    for (let i = 1; i < dados.length; i++) {
      const linha = dados[i];
      const nome = linha[indiceNome];
      const contato = linha[indiceContato];
      const chatCompleto = linha[indiceChatCompleto];
      const timestamp = linha[indiceTimestamp];
      
      if (nome) {
        planilhaData[nome] = {
          telefone: contato,
          chatCompleto: chatCompleto,
          timestampPlanilha: timestamp
        };
      }
    }
  }
  
  while (arquivos.hasNext()) {
    const arquivo = arquivos.next();
    const nomeArquivo = arquivo.getName();
    const match = nomeArquivo.match(/Dossiê:\s*(.*?)\s*\((.*?)\)\s*-\s*(.*)/);
    if (match) {
      const nome = match[1].trim();
      const dadosAdicionais = planilhaData[nome] || {};
      
      dossies.push({ 
        id: arquivo.getId(), 
        name: nome, 
        profile: match[2].trim(), 
        timestamp: arquivo.getDateCreated().toISOString(), 
        url: arquivo.getUrl(), 
        interest: extractInterest(arquivo.getId()),
        telefone: dadosAdicionais.telefone || 'N/A',
        chatCompleto: dadosAdicionais.chatCompleto || 'N/A'
      });
    }
  }
  dossies.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return dossies;
}

function extractInterest(fileId) {
    try {
        const dadosDossie = getDossierContent(fileId);
        const content = typeof dadosDossie === 'object' ? dadosDossie.conteudoOriginal : dadosDossie;
        const regex = /Necessidades Reveladas\s*\n(.*?)\n/m;
        const match = content.match(regex);
        return (match && match[1]) ? match[1].replace(/[•\s*-]+/,'').trim() : 'Não especificado';
    } catch (e) { 
        Logger.log(`Erro ao extrair interesse do arquivo ${fileId}: ${e.toString()}`);
        return 'Erro na extração'; 
    }
}

function getDossierContent(fileId) {
  try {
    const doc = DocumentApp.openById(fileId);
    const conteudoCompleto = doc.getBody().getText();
    
    // Buscar dados adicionais na planilha usando o nome do arquivo
    const nomeArquivo = DriveApp.getFileById(fileId).getName();
    const match = nomeArquivo.match(/Dossiê:\s*(.*?)\s*\((.*?)\)\s*-\s*(.*)/);
    
    if (match) {
      const nome = match[1].trim();
      const planilha = SpreadsheetApp.getActiveSpreadsheet();
      const abaLeads = planilha.getSheetByName("Dashboard de Leads");
      
      if (abaLeads) {
        const dados = abaLeads.getDataRange().getValues();
        const cabecalhos = dados[0];
        const indiceNome = cabecalhos.indexOf("Nome");
        const indiceContato = cabecalhos.indexOf("Contato");
        const indiceChatCompleto = cabecalhos.indexOf("Chat Completo");
        
        for (let i = 1; i < dados.length; i++) {
          const linha = dados[i];
          if (linha[indiceNome] === nome) {
            return {
              conteudoOriginal: conteudoCompleto,
              telefone: linha[indiceContato] || 'N/A',
              chatCompleto: linha[indiceChatCompleto] || 'N/A'
            };
          }
        }
      }
    }
    
    return {
      conteudoOriginal: conteudoCompleto,
      telefone: 'N/A',
      chatCompleto: 'N/A'
    };
  } catch (e) { 
    throw new Error("Não foi possível abrir ou ler o dossiê: " + fileId); 
  }
}

function getOrCreateSheet(planilha, nomeAba, cabecalhos) {
  let aba = planilha.getSheetByName(nomeAba);
  if (!aba) {
    aba = planilha.insertSheet(nomeAba);
    const rangeCabecalho = aba.getRange(1, 1, 1, cabecalhos.length);
    rangeCabecalho.setValues([cabecalhos]).setFontWeight("bold").setBackground("#e2e8f0");
    aba.setFrozenRows(1);
    aba.autoResizeColumns(1, cabecalhos.length);
  }
  return aba;
}

function createJsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
