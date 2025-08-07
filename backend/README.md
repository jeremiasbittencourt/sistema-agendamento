# Sistema de Agendamento - Backend

## 📋 Descrição
Backend do sistema de agendamento telefônico desenvolvido com Spring Boot, Java 21 e PostgreSQL.

## 🚀 Tecnologias Utilizadas
- **Java 21**
- **Spring Boot 3.5.4**
- **Spring Data JPA**
- **PostgreSQL**
- **Lombok**
- **OpenAPI/Swagger**
- **JUnit 5 + Mockito**

## 📦 Pré-requisitos
- Java 21 ou superior
- PostgreSQL 12 ou superior
- Gradle 8.x

## 🛠️ Configuração do Ambiente

### 1. Instalar PostgreSQL
```bash
# Windows (usando chocolatey)
choco install postgresql

# Ou baixar diretamente do site oficial
# https://www.postgresql.org/download/windows/
```

### 2. Criar Banco de Dados
```sql
-- Conectar ao PostgreSQL
psql -U postgres

-- Criar banco de dados
CREATE DATABASE sistema_agendamento;

-- Conectar ao banco criado
\c sistema_agendamento

-- Executar o script de criação das tabelas
\i src/main/resources/schema.sql
```

### 3. Configurar Aplicação
Editar o arquivo `src/main/resources/application.properties` com suas credenciais do PostgreSQL:

```properties
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

## 🏃‍♂️ Executando a Aplicação

### Usando Gradle
```bash
# Na pasta backend
./gradlew bootRun
```

### Usando IDE
Executar a classe `SistemaAgendamentoApplication.java`

## 📚 Endpoints da API

### Base URL
```
http://localhost:8080/api
```

### Endpoints Disponíveis

#### Contatos
- `GET /contatos` - Listar todos os contatos ativos
- `GET /contatos/favoritos` - Listar contatos favoritos
- `GET /contatos/{id}` - Buscar contato por ID
- `GET /contatos/buscar?termo={termo}` - Buscar contatos por termo
- `POST /contatos` - Criar novo contato
- `PUT /contatos/{id}` - Atualizar contato
- `DELETE /contatos/{id}` - Inativar contato
- `PATCH /contatos/{id}/favorito` - Alternar status de favorito

### Documentação da API
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/api-docs

## 🧪 Executando Testes

```bash
# Executar todos os testes
./gradlew test

# Executar testes com relatório
./gradlew test --info
```

## 📁 Estrutura do Projeto

```
src/main/java/sistema_agendamento/
├── controller/          # Controllers REST
├── service/            # Lógica de negócio
├── repository/         # Acesso a dados
├── entity/            # Entidades JPA
├── dto/               # Data Transfer Objects
└── exception/         # Tratamento de exceções

src/test/java/sistema_agendamento/
└── service/           # Testes unitários

src/main/resources/
├── application.properties  # Configurações
└── schema.sql            # Script do banco
```

## 🔧 Configurações Importantes

### Validações
- Nome: obrigatório, máximo 100 caracteres
- Email: formato válido, máximo 255 caracteres
- Celular: obrigatório, exatamente 11 dígitos, único
- Telefone: opcional, exatamente 10 dígitos

### Regras de Negócio
- Não permite duplicidade de celular
- Contatos inativos não aparecem nas listagens
- Favoritos são marcados com 'S' ou 'N'
- Data de cadastro é preenchida automaticamente

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com PostgreSQL**
   - Verificar se o PostgreSQL está rodando
   - Verificar credenciais no application.properties
   - Verificar se o banco existe

2. **Erro de schema não encontrado**
   - Executar o script schema.sql
   - Verificar se o schema 'desafio' foi criado

3. **Erro de validação**
   - Verificar formato do celular (11 dígitos)
   - Verificar formato do telefone (10 dígitos)
   - Verificar se o email é válido

## 📝 Logs
Os logs estão configurados para mostrar:
- Requisições HTTP
- Queries SQL
- Erros de validação
- Operações de negócio

Para ver logs detalhados, verificar o console da aplicação. 