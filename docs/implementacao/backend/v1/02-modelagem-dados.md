# 2. Modelagem de Dados no Spring Data MongoDB

Implementaremos as classes de domínio correspondentes às coleções do banco de dados (User, Product, Order).

## 2.1. Entidade User (Usuário)

```java
package com.antarez.mktsimple.domain.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id; // O UUID vindo do outro sistema de autenticação via Header
    private String name;
    private String email;
    private String role; // "BUYER" ou "SELLER"
    private LocalDateTime createdAt = LocalDateTime.now();
}
```

## 2.2. Entidade Product (Produto)

Importante usar as anotações corretas de texto para permitir uma busca textual eficiente futura.

```java
package com.antarez.mktsimple.domain.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String sellerId;
    
    @TextIndexed(weight = 2)
    private String title;
    
    @TextIndexed(weight = 1)
    private String description;
    
    private Double price;
    private String category;
    private Integer stock;
    private List<String> images;
    private String status; // "ACTIVE" ou "INACTIVE"
    private LocalDateTime createdAt = LocalDateTime.now();
}
```

## 2.3. Entidade Order (Pedido) e OrderItem

```java
package com.antarez.mktsimple.domain.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String buyerId;
    private String sellerId;
    private List<OrderItem> items;
    private Double totalValue;
    private String status; // "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Data
    public static class OrderItem {
        private String productId;
        private Integer quantity;
        private Double price;
    }
}
```

O `Review` segue a mesma estrutura base e pode ser implementado caso necessário na v1.
