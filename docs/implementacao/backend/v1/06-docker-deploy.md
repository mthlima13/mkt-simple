# 6. Dockerização Completa da Aplicação

Atendendo ao requisito de rodar o aplicativo de duas maneiras (ou via Docker Compose integrado, ou com API direto no terminal apontando para um DB de Compose), configuramos o `Dockerfile` e o `.yml` principal.

## 6.1. O Dockerfile da Aplicação

Na raiz do projeto do Spring Boot, crie o arquivo `Dockerfile`. Assumiremos a utilização mais limpa rodando o projeto a partir do Jar compilado.

```dockerfile
# Imagem base
FROM eclipse-temurin:21-jre-alpine

# Pasta de ambiente do container
WORKDIR /app

# Copia o Build JAR existente do projeto compilado e renomeia
# Dica: rode "mvn clean package -DskipTests" antes de buildar a imagem docker.
COPY target/*.jar app.jar

# Expõe porta clássica do Spring Web
EXPOSE 8080

# Aciona a aplicação Java
ENTRYPOINT ["java", "-jar", "app.jar"]
```

## 6.2. O Docker Compose Definitivo

Atualize o `docker-compose.yml` raiz, vinculando Mongo e API. Utilizaremos variáveis de ambiente no container para repassar a "URI" de modo que o app saiba a diferença de rodar empacotado e rodar no terminal.

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: mkt_mongodb
    ports:
      - "27017:27017" # Expõe também para localhost
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=secret
      - MONGO_INITDB_DATABASE=marketplace

  api-backend:
    build: .  # Aponta para o Dockerfile da mesma raiz
    container_name: mkt_api
    ports:
      - "8080:8080"
    depends_on:
      - mongodb
    environment:
      # FORÇA a URL do db apontar pro alias 'mongodb' na rede Docker, substituindo o localhost do application.properties
      - SPRING_DATA_MONGODB_URI=mongodb://root:secret@mongodb:27017/marketplace?authSource=admin

volumes:
  mongo_data:
```

---

## 6.3. Modos de Uso Estipulados no Requisito

### Opção A: Rodar Diretamente na Máquina (via Terminal)

Este é o modo ágil para quem quer *Debug* com o servidor embutido ao codificar.

1. Suba APENAS o sistema de banco:
   ```bash
   docker-compose up -d mongodb
   ```
2. No seu terminal (apontando via Maven), execute a aplicação (que puxará a string URI `localhost:27017` injetada padrão do `application.properties`):
   ```bash
   ./mvnw spring-boot:run
   ```

### Opção B: Rodar o Pacote Completo no Docker Compose

Modo demonstrativo do sistema "tudo em um passo":

1. Faça obrigatoriamente um build que gerará a pasta `target` atualizada:
   ```bash
   ./mvnw clean package -DskipTests
   ```
2. Derrube estruturas antigas e instancie tudo pedindo permissão de build da Imagem:
   ```bash
   docker-compose down
   docker-compose up --build -d
   ```
3. Para validar que tudo correu conforme, acesse seu browser em `localhost:8080`.
