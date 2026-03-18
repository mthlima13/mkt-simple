# 1. Setup Inicial do Projeto (Spring Boot + MongoDB)

Este passo a passo foca em criar a fundação do backend do Marketplace em Java 21 e Spring Boot, com MongoDB como banco de dados.

## 1.1. Gerando o Projeto no Spring Initializr

Acesse [start.spring.io](https://start.spring.io/) e configure as seguintes opções:
- **Project:** Maven ou Gradle
- **Language:** Java
- **Spring Boot:** 3.x.x
- **Packaging:** Jar
- **Java:** 21

**Dependências:**
- **Spring Web** (`spring-boot-starter-web`)
- **Spring Data MongoDB** (`spring-boot-starter-data-mongodb`)
- **Validation** (`spring-boot-starter-validation`)
- **Lombok** (`lombok`)

Faça o download, descompacte e abra na sua IDE.

## 1.2. Configurando o MongoDB (Docker Compose)

Na raiz do projeto (ou numa pasta de `infra`), crie o arquivo `docker-compose.yml` apenas para subir o banco de dados temporário.

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: mkt_mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=secret
      - MONGO_INITDB_DATABASE=marketplace

volumes:
  mongo_data:
```

Rode o comando:
```bash
docker-compose up -d mongodb
```

## 1.3. Configuração do `application.properties`

Configure a conexão com o banco no seu `src/main/resources/application.properties` (ou `.yaml`):

```properties
spring.application.name=mkt-simple

# Configuração do MongoDB
spring.data.mongodb.uri=mongodb://root:secret@localhost:27017/marketplace?authSource=admin
```

> Com isso, a base principal da aplicação estará pronta para rodar no terminal através do comando `mvn spring-boot:run` ou `gradle bootRun`.
