# Sistema de Agendamento

Sistema de gerenciamento de contatos desenvolvido com Angular (Frontend) e Spring Boot (Backend).

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Java 17** ou superior
- **Node.js 18** ou superior
- **PostgreSQL** instalado e rodando
- **Gradle** (opcional, o projeto usa Gradle Wrapper)

### 📋 Configuração do Banco de Dados

1. **Crie um banco PostgreSQL**:
   ```sql
   CREATE DATABASE sistema_agendamento;
   ```

2. **Configure as credenciais** no arquivo `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/sistema_agendamento
   spring.datasource.username=seu_usuario
   spring.datasource.password=sua_senha
   ```

### 🔧 Backend (Spring Boot)

1. **Navegue para a pasta do backend**:
   ```bash
   cd backend
   ```

2. **Execute o projeto**:
   ```bash
   # Windows
   .\gradlew bootRun

   # Linux/Mac
   ./gradlew bootRun
   ```

3. **O backend estará disponível em**: `http://localhost:8080`

### 🎨 Frontend (Angular)

1. **Navegue para a pasta do frontend**:
   ```bash
   cd frontend
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Execute o projeto**:
   ```bash
   npm start
   ```

4. **O frontend estará disponível em**: `http://localhost:4200`

## 📱 Funcionalidades

- ✅ **Cadastro de Contatos**: Nome, email, celular e telefone
- ✅ **Máscaras de Telefone**: Formatação automática (11 9 9999 9999 / 11 9999 9999)
- ✅ **Filtros**: Busca por nome, telefone ou email
- ✅ **Favoritos**: Marcar/desmarcar contatos favoritos
- ✅ **Validações**: Campos obrigatórios e formatos
- ✅ **Notificações**: Toast messages para feedback
- ✅ **Responsivo**: Interface adaptável para mobile

## 🛠️ Tecnologias Utilizadas

### Backend
- **Spring Boot 3.x**
- **Spring Data JPA**
- **PostgreSQL**
- **Gradle**
- **Java 17**

### Frontend
- **Angular 18**
- **Bootstrap 5**
- **ngx-toastr**
- **TypeScript**

## 📁 Estrutura do Projeto

```
sistema-agendamento/
├── backend/                 # API Spring Boot
│   ├── src/main/java/
│   │   └── sistema_agendamento/
│   │       ├── controller/  # Controllers REST
│   │       ├── service/     # Lógica de negócio
│   │       ├── repository/  # Acesso a dados
│   │       ├── entity/      # Entidades JPA
│   │       └── dto/         # Data Transfer Objects
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/                # Aplicação Angular
    ├── src/app/
    │   ├── components/      # Componentes
    │   ├── services/        # Serviços
    │   ├── models/          # Modelos TypeScript
    │   └── guards/          # Guards de rota
    └── src/styles.css       # Estilos globais
```

## 🔍 Endpoints da API

- `GET /contatos` - Listar todos os contatos
- `GET /contatos/{id}` - Buscar contato por ID
- `POST /contatos` - Criar novo contato
- `PUT /contatos/{id}` - Atualizar contato
- `DELETE /contatos/{id}` - Inativar contato
- `PATCH /contatos/{id}/favorito` - Alternar favorito
- `GET /contatos/buscar?termo=...` - Buscar por termo

## 🎯 Campos Obrigatórios

- **Nome**: Campo obrigatório (máx. 100 caracteres)
- **Celular**: Campo obrigatório (11 dígitos)
- **Email**: Opcional (formato válido se preenchido)
- **Telefone**: (10 dígitos)

## 🚨 Solução de Problemas

### Backend não inicia
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `application.properties`
- Verifique se a porta 8080 está livre

### Frontend não inicia
- Execute `npm install` para instalar dependências
- Verifique se a porta 4200 está livre
- Confirme se o Node.js está instalado

### Erro de CORS
- O backend já está configurado com `@CrossOrigin(origins = "*")`
- Se persistir, verifique se o backend está rodando na porta 8080
