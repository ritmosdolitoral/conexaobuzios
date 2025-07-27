#!/bin/bash

echo "🚀 TESTE AUTOMATIZADO - Conexão Búzios"
echo "========================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar se servidor está rodando
check_server() {
    echo -e "${BLUE}📡 Verificando servidor...${NC}"
    if curl -s http://localhost:8000 > /dev/null; then
        echo -e "${GREEN}✅ Servidor ativo na porta 8000${NC}"
        return 0
    else
        echo -e "${RED}❌ Servidor não está rodando${NC}"
        return 1
    fi
}

# Função para verificar arquivos
check_files() {
    echo -e "${BLUE}📁 Verificando arquivos...${NC}"
    
    if [ -f "index.html" ]; then
        echo -e "${GREEN}✅ index.html encontrado${NC}"
        echo "   📊 Linhas: $(wc -l < index.html)"
    else
        echo -e "${RED}❌ index.html não encontrado${NC}"
    fi
    
    if [ -f "dashboard.html" ]; then
        echo -e "${GREEN}✅ dashboard.html encontrado${NC}"
        echo "   📊 Linhas: $(wc -l < dashboard.html)"
    else
        echo -e "${RED}❌ dashboard.html não encontrado${NC}"
    fi
    
    if [ -f "codigo.gs" ]; then
        echo -e "${GREEN}✅ codigo.gs encontrado${NC}"
    else
        echo -e "${RED}❌ codigo.gs não encontrado${NC}"
    fi
}

# Função para verificar dependências externas
check_dependencies() {
    echo -e "${BLUE}🔗 Verificando dependências externas...${NC}"
    
    # TailwindCSS
    if curl -s --head https://cdn.tailwindcss.com | head -n 1 | grep -q "200 OK"; then
        echo -e "${GREEN}✅ TailwindCSS disponível${NC}"
    else
        echo -e "${YELLOW}⚠️  TailwindCSS pode estar indisponível${NC}"
    fi
    
    # Lucide Icons
    if curl -s --head https://unpkg.com/lucide@latest | head -n 1 | grep -q "200"; then
        echo -e "${GREEN}✅ Lucide Icons disponível${NC}"
    else
        echo -e "${YELLOW}⚠️  Lucide Icons pode estar indisponível${NC}"
    fi
    
    # Google Fonts
    if curl -s --head https://fonts.googleapis.com | head -n 1 | grep -q "200"; then
        echo -e "${GREEN}✅ Google Fonts disponível${NC}"
    else
        echo -e "${YELLOW}⚠️  Google Fonts pode estar indisponível${NC}"
    fi
}

# Função para testar páginas
test_pages() {
    echo -e "${BLUE}🌐 Testando páginas...${NC}"
    
    # Testar index.html
    if curl -s http://localhost:8000/index.html | grep -q "Conexão Búzios"; then
        echo -e "${GREEN}✅ index.html carrega corretamente${NC}"
    else
        echo -e "${RED}❌ Erro ao carregar index.html${NC}"
    fi
    
    # Testar dashboard.html
    if curl -s http://localhost:8000/dashboard.html | grep -q "Vitrine de Oportunidades"; then
        echo -e "${GREEN}✅ dashboard.html carrega corretamente${NC}"
    else
        echo -e "${RED}❌ Erro ao carregar dashboard.html${NC}"
    fi
}

# Função para verificar melhorias específicas
check_improvements() {
    echo -e "${BLUE}✨ Verificando melhorias aplicadas...${NC}"
    
    # Verificar se glassmorphism foi aplicado
    if grep -q "glassmorphism\|backdrop-filter\|blur" index.html; then
        echo -e "${GREEN}✅ Efeitos glassmorphism presentes no index.html${NC}"
    else
        echo -e "${YELLOW}⚠️  Efeitos glassmorphism podem não estar aplicados${NC}"
    fi
    
    if grep -q "glassmorphism\|backdrop-filter\|blur" dashboard.html; then
        echo -e "${GREEN}✅ Efeitos glassmorphism presentes no dashboard.html${NC}"
    else
        echo -e "${YELLOW}⚠️  Efeitos glassmorphism podem não estar aplicados${NC}"
    fi
    
    # Verificar animações
    if grep -q "animate\|transition\|@keyframes" index.html; then
        echo -e "${GREEN}✅ Animações presentes no index.html${NC}"
    else
        echo -e "${YELLOW}⚠️  Animações podem não estar aplicadas${NC}"
    fi
    
    if grep -q "animate\|transition\|@keyframes" dashboard.html; then
        echo -e "${GREEN}✅ Animações presentes no dashboard.html${NC}"
    else
        echo -e "${YELLOW}⚠️  Animações podem não estar aplicadas${NC}"
    fi
    
    # Verificar gradientes
    if grep -q "gradient" index.html; then
        echo -e "${GREEN}✅ Gradientes presentes no index.html${NC}"
    else
        echo -e "${YELLOW}⚠️  Gradientes podem não estar aplicados${NC}"
    fi
    
    if grep -q "gradient" dashboard.html; then
        echo -e "${GREEN}✅ Gradientes presentes no dashboard.html${NC}"
    else
        echo -e "${YELLOW}⚠️  Gradientes podem não estar aplicados${NC}"
    fi
}

# Função principal
main() {
    echo ""
    check_server
    echo ""
    check_files
    echo ""
    check_dependencies
    echo ""
    test_pages
    echo ""
    check_improvements
    echo ""
    
    echo -e "${BLUE}🎯 RESUMO DO TESTE:${NC}"
    echo "================================"
    echo -e "${GREEN}✅ Testes concluídos!${NC}"
    echo ""
    echo -e "${YELLOW}📋 PRÓXIMOS PASSOS:${NC}"
    echo "1. Abra http://localhost:8000/index.html no navegador"
    echo "2. Abra http://localhost:8000/dashboard.html no navegador"
    echo "3. Use o CHECKLIST_VALIDACAO.md para teste manual"
    echo "4. Verifique a responsividade (F12 → Toggle Device)"
    echo ""
    echo -e "${BLUE}🚀 URLs para teste:${NC}"
    echo "Portal: http://localhost:8000/index.html"
    echo "Dashboard: http://localhost:8000/dashboard.html"
}

# Executar teste
main