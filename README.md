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

3. **Substituição do CDN por Instalação Local**
   - **Problema**: Uso de `cdn.tailwindcss.com` inadequado para produção
   - **Solução**: Configuração completa com PostCSS e build local
   - **Arquivos criados**:
     - `package.json` - Dependências e scripts
     - `tailwind.config.js` - Configuração customizada
     - `postcss.config.js` - Processamento CSS
     - `src/input.css` - Arquivo fonte CSS
     - `dist/output.css` - CSS compilado e minificado

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

10. **CSS Minificado**
    - **Build**: CSS compilado e minificado para produção
    - **Redução**: Tamanho do arquivo CSS otimizado

## 🚀 Configuração e Uso

### Pré-requisitos

- Node.js 16+ 
- NPM ou Yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/ritmosedolitoral/conexaobuzios.git
cd conexaobuzios
```

2. **Instale as dependências**
```bash
npm install
```

3. **Compile o CSS para desenvolvimento**
```bash
npm run dev
```

4. **Compile o CSS para produção**
```bash
npm run build
```

### Scripts Disponíveis

- `npm run dev` - Compila CSS em modo watch para desenvolvimento
- `npm run build` - Compila CSS minificado para produção  
- `npm run build-css` - Compila CSS em modo watch
- `npm run build-css-prod` - Compila CSS minificado

### Estrutura do Projeto

```
conexaobuzios/
├── src/
│   └── input.css          # Arquivo fonte CSS com Tailwind
├── dist/
│   └── output.css         # CSS compilado e minificado
├── index.html             # Portal principal
├── dashboard.html         # Painel de oportunidades
├── codigo.gs              # Script Google Apps Script
├── package.json           # Dependências e scripts
├── tailwind.config.js     # Configuração Tailwind CSS
├── postcss.config.js      # Configuração PostCSS
└── README.md              # Documentação

```

## 🎨 Personalização CSS

O projeto utiliza um sistema de design customizado baseado no Tailwind CSS:

### Cores Customizadas
- **Oceano Búzios**: `buzios-ocean-{deep|medium|light}`
- **Turquesa**: `buzios-turquoise` 
- **Areia**: `buzios-sand-{warm|medium}`
- **Dourado**: `buzios-gold`
- **Verde**: `buzios-green`

### Componentes Reutilizáveis
- `.glass-card` - Efeito glassmorphism
- `.btn-primary`, `.btn-secondary` - Botões estilizados
- `.chat-bubble` - Bolhas de conversa
- `.status-tag` - Tags de status

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