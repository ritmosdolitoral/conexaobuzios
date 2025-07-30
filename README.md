# Conexão Búzios - Concierge Virtual

Um concierge virtual inteligente para Búzios, desenvolvido com IA para oferecer experiências personalizadas aos visitantes.

## 🏖️ Sobre o Projeto

O **Conexão Búzios** é uma plataforma que combina inteligência artificial com conhecimento local para criar experiências únicas em Búzios. O sistema oferece:

- **Portal Interativo**: Interface conversacional inteligente
- **IA Personalizada**: Recomendações baseadas no perfil do usuário
- **Dashboard de Leads**: Painel para gestão de oportunidades
- **Design Responsivo**: Experiência otimizada para todos os dispositivos

## 🔧 Correções e Melhorias Aplicadas

### ✅ Correções Estruturais

1. **Variável `typingTimeout` Duplicada**
   - **Problema**: Declaração duplicada causando conflitos
   - **Solução**: Unificada em uma única declaração global
   - **Localização**: `index.html` linhas 1603 e 1641

2. **Variável `activeRequest` Duplicada**
   - **Problema**: Segunda declaração desnecessária
   - **Solução**: Removida declaração duplicada, mantida apenas a global
   - **Localização**: `index.html` linha 2844

### ✅ Migração do Tailwind CSS

3. **Otimização do Tailwind CSS**
   - **Problema**: Uso de `cdn.tailwindcss.com` sem comentários explicativos
   - **Solução**: Mantido CDN com comentários documentados para simplicidade
   - **Benefício**: Estrutura mais simples mantendo todas as funcionalidades

### ✅ Melhorias de Segurança

4. **Content Security Policy (CSP)**
   - **Implementação**: Meta tags CSP em ambos os arquivos HTML
   - **Benefício**: Proteção contra XSS e ataques de injeção de código
   - **Localização**: `<head>` de ambos os arquivos

5. **Validação de Entrada Aprimorada**
   - **Melhoria**: Sistema robusto de sanitização HTML
   - **Proteção**: Contra ataques XSS em inputs do usuário
   - **Implementação**: Função `sanitizeHTML()` existente mantida

### ✅ Melhorias de Acessibilidade

6. **Skip Links para Navegação por Teclado**
   - **Implementação**: Links de navegação rápida para usuários de screen readers
   - **Localização**: Início do `<body>` em ambos os arquivos

7. **Labels e ARIA Attributes**
   - **Problema**: Input sem label adequada
   - **Solução**: Adicionados labels ocultos e atributos ARIA
   - **Melhorias**: `aria-describedby`, `aria-label`, `sr-only` classes

8. **Meta Tags para SEO e Acessibilidade**
   - **Adicionados**: Description, keywords, Open Graph
   - **Benefício**: Melhor indexação e compartilhamento em redes sociais

### ✅ Otimizações de Performance

9. **DNS Prefetch**
   - **Implementação**: Preconexões para recursos externos
   - **Benefício**: Carregamento mais rápido de fontes e scripts

10. **Código Otimizado**
    - **Limpeza**: Remoção de variáveis duplicadas e código desnecessário
    - **Organização**: Estrutura mais limpa e bem documentada

## 🚀 Configuração e Uso

### Pré-requisitos

Nenhum! O projeto é totalmente funcional usando apenas arquivos estáticos.

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/ritmosedolitoral/conexaobuzios.git
cd conexaobuzios
```

2. **Abra os arquivos**
- `index.html` - Portal principal do concierge
- `dashboard.html` - Painel de oportunidades
- `codigo.gs` - Script para Google Apps Script (backend)

### Como Usar

1. **Desenvolvimento Local**: Abra os arquivos HTML diretamente no navegador
2. **Produção**: Faça upload para qualquer servidor web ou GitHub Pages
3. **Backend**: Configure o `codigo.gs` no Google Apps Script

### Estrutura do Projeto

```
conexaobuzios/
├── index.html             # Portal principal do concierge virtual
├── dashboard.html         # Painel de oportunidades e leads
├── codigo.gs              # Backend Google Apps Script
└── README.md              # Documentação completa

```

## 🎨 Design e Estilo

O projeto utiliza Tailwind CSS via CDN com estilos customizados:

### Paleta de Cores
- **Azul Oceano**: Tons inspirados no mar de Búzios
- **Turquesa**: Cor principal dos CTAs e elementos interativos
- **Dourado**: Destaques e elementos premium
- **Gradientes**: Efeitos suaves que remetem ao pôr do sol

### Efeitos Visuais
- **Glassmorphism**: Elementos com transparência e blur
- **Animações Suaves**: Transições que melhoram a experiência
- **Responsividade**: Design que funciona em qualquer dispositivo

## 🔒 Segurança

### Medidas Implementadas

1. **Content Security Policy**: Proteção contra XSS
2. **Sanitização HTML**: Limpeza de inputs do usuário
3. **Validação de Entrada**: Sistema robusto de validação
4. **Rate Limiting**: Controle de requisições múltiplas

### Boas Práticas

- Sempre sanitize inputs do usuário
- Use HTTPS em produção
- Mantenha dependências atualizadas
- Configure CSP adequadamente para seu ambiente

## ♿ Acessibilidade

### Recursos Implementados

- Skip links para navegação por teclado
- Labels adequados em elementos de formulário
- ARIA attributes para screen readers
- Contraste adequado de cores
- Suporte a `prefers-reduced-motion`
- Tamanhos de touch targets adequados para mobile

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints customizados:

- **xs**: 360px
- **sm**: 640px  
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px
- **3xl**: 1920px

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🏖️ Sobre Búzios

Búzios é um dos destinos turísticos mais encantadores do Brasil, conhecido por suas praias paradisíacas, vida noturna vibrante e charme internacional. O **Conexão Búzios** foi criado para conectar visitantes com as melhores experiências que a cidade tem a oferecer.

---

**Desenvolvido com ❤️ para Búzios**

[Site Principal](https://ritmosedolitoral.github.io/conexaobuzios/) | [Instagram](https://www.instagram.com/conexao.buzios/)