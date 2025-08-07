# Sistema de Agendamento - Frontend

## 📋 Descrição
Frontend do sistema de agendamento telefônico desenvolvido com Angular 18 e Bootstrap 5.

## 🚀 Tecnologias Utilizadas
- **Angular 18**
- **Bootstrap 5.3.2**
- **Bootstrap Icons**
- **TypeScript**
- **RxJS**

## 📦 Pré-requisitos
- Node.js 20.x ou superior
- npm 10.x ou superior

## 🛠️ Configuração do Ambiente

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar em modo de desenvolvimento
```bash
npm start
```

A aplicação estará disponível em `http://localhost:4200`

## 🏗️ Estrutura do Projeto

```
src/app/
├── components/
│   ├── contato-list/          # Listagem de contatos
│   └── contato-form/          # Formulário de cadastro/edição
├── models/
│   └── contato.model.ts       # Interface do contato
├── services/
│   └── contato.service.ts     # Serviço de comunicação com API
├── guards/
│   └── auth.guard.ts          # Guard de autenticação
└── app.routes.ts              # Configuração de rotas
```

## 📚 Funcionalidades

### ✅ Implementadas
- **Listagem de contatos** com busca e filtros
- **Cadastro de novos contatos** com validação
- **Edição de contatos** existentes
- **Inativação de contatos** (exclusão lógica)
- **Marcar/desmarcar favoritos**
- **Busca por nome ou celular**
- **Interface responsiva** com Bootstrap
- **Guards para proteção de rotas**
- **Validação de formulários**
- **Tratamento de erros**

### 🎨 Interface
- Design moderno e responsivo
- Ícones Bootstrap
- Cards com hover effects
- Formulários com validação visual
- Loading states
- Mensagens de erro/sucesso

## 🔧 Configurações

### API Backend
O frontend está configurado para se comunicar com o backend na URL:
```
http://localhost:8080/api
```

### Validações
- **Nome**: obrigatório, máximo 100 caracteres
- **Email**: formato válido, máximo 255 caracteres
- **Celular**: obrigatório, exatamente 11 dígitos
- **Telefone**: opcional, exatamente 10 dígitos

## 🧪 Testes

```bash
# Executar testes unitários
npm test

# Executar testes com coverage
npm run test:coverage
```

## 🚀 Build de Produção

```bash
# Gerar build de produção
npm run build

# Preview do build
npm run preview
```

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔒 Segurança

- Guards implementados para proteção de rotas
- Validação de formulários no frontend
- Sanitização de dados
- CORS configurado no backend

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**
   - Verificar se o backend está rodando
   - Verificar se o CORS está configurado no backend

2. **Erro de conexão com API**
   - Verificar se o backend está na porta 8080
   - Verificar se a URL da API está correta

3. **Erro de validação**
   - Verificar formato do celular (11 dígitos)
   - Verificar formato do telefone (10 dígitos)
   - Verificar se o email é válido

## 📝 Logs

Os logs de desenvolvimento podem ser vistos no console do navegador (F12).
