# ☕ Sistema de Inventário Oliver Coffee

Sistema completo de gerenciamento de inventário para cafeterias, desenvolvido com Next.js 15 e Supabase.

## 🚀 Funcionalidades

- **📊 Dashboard Completo** - Visão geral do inventário e métricas
- **📦 Gestão de Inventário** - CRUD completo de produtos
- **🏢 Gestão de Fornecedores** - Controle de fornecedores e avaliações
- **🛒 Pedidos de Compra** - Sistema completo de pedidos
- **📱 Scanner de Código de Barras** - Interface de escaneamento simulada
- **📧 Notificações por Email** - Alertas automáticos configuráveis
- **📊 Relatórios e Exportação** - Dados em JSON, CSV e Excel
- **🔐 Autenticação** - Sistema de usuários e permissões
- **📱 Interface Mobile** - Aplicativo mobile simulado
- **🌙 Modo Escuro/Claro** - Temas personalizáveis

## 🛠️ Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Supabase** - Backend as a Service (PostgreSQL) - Opcional
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI modernos
- **Lucide React** - Ícones SVG otimizados

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (opcional - sistema funciona com dados simulados)

## ⚡ Instalação Rápida

1. **Clone e instale**
\`\`\`bash
git clone <repository-url>
cd coffee-inventory-system
npm install
npm run dev
\`\`\`

2. **Acesse o sistema**
Abra [http://localhost:3000](http://localhost:3000)

O sistema funcionará imediatamente com dados simulados! 🎉

## 🔧 Configuração Supabase (Opcional)

Para usar dados reais persistentes:

### 1. Criar Projeto Supabase
- Acesse [supabase.com](https://supabase.com)
- Crie um novo projeto
- Anote a URL e chave anônima

### 2. Configurar Banco
Execute o script SQL no editor do Supabase:
\`\`\`sql
-- Ver arquivo scripts/create-tables.sql
\`\`\`

### 3. Configurar Variáveis
Crie `.env.local`:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
\`\`\`

### 4. Reiniciar
\`\`\`bash
npm run dev
\`\`\`

## 🎯 Modos de Operação

### 📱 Modo Simulado (Padrão)
- ✅ Funciona imediatamente
- ✅ Dados realistas pré-carregados
- ✅ Todas as funcionalidades ativas
- ⚠️ Dados não persistem entre sessões

### 🗄️ Modo Supabase
- ✅ Dados persistentes
- ✅ Sincronização em tempo real
- ✅ Backup automático
- ✅ Escalabilidade

## 📊 Funcionalidades Principais

### Dashboard
- Métricas em tempo real
- Alertas de produtos em falta
- Itens próximos ao vencimento
- Gráficos de performance

### Inventário
- Adicionar/editar/remover produtos
- Controle de estoque mínimo/máximo
- Histórico de movimentações
- Previsão de estoque
- Scanner de código de barras

### Fornecedores
- Cadastro completo
- Sistema de avaliações
- Histórico de pedidos
- Termos de pagamento

### Pedidos de Compra
- Criação automática
- Controle de status
- Recebimento parcial/total
- Relatórios detalhados

## 🔧 Scripts Disponíveis

\`\`\`bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run start    # Servidor de produção
npm run lint     # Verificar código
\`\`\`

## 📊 Estrutura do Projeto

\`\`\`
coffee-inventory-system/
├── app/                 # Next.js App Router
├── components/          # Componentes React
├── contexts/           # Context providers
├── lib/                # Configurações e utilitários
├── public/             # Assets estáticos
├── scripts/            # Scripts SQL
└── types/              # Definições TypeScript
\`\`\`

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente (se usar Supabase)
3. Deploy automático

### Outras plataformas
- Configure as variáveis de ambiente
- Execute `npm run build`
- Sirva os arquivos da pasta `.next`

## 🎨 Personalização

O sistema é totalmente personalizável:
- Temas claro/escuro
- Cores e estilos via Tailwind
- Componentes modulares
- Dados simulados editáveis

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 📞 Suporte

Para suporte, abra uma issue no GitHub.

---

Desenvolvido com ❤️ para a comunidade de desenvolvedores
