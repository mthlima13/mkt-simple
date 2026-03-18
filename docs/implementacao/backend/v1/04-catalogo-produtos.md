# 4. Criação e Catálogo de Produtos

Vamos implementar o repositório, serviço e os endpoints para que vendedores adicionem produtos e compradores possam buscá-los usando filtros dinâmicos e índices textuais do MongoDB.

## 4.1. Repositório com MongoTemplate (Criteria API)

Para filtros dinâmicos que variam dependendo da url (opcionais), o ideal é usar `MongoTemplate`.

```java
package com.antarez.mktsimple.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.antarez.mktsimple.domain.model.Product;

public interface ProductRepository extends MongoRepository<Product, String>, CustomProductRepository {
}
```

## 4.2. Busca Customizada (CustomProductRepository)

```java
package com.antarez.mktsimple.repository;

import com.antarez.mktsimple.domain.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.core.query.TextQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface CustomProductRepository {
    List<Product> searchProducts(String search, String category, Double minPrice, Double maxPrice);
}

@Repository
class CustomProductRepositoryImpl implements CustomProductRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<Product> searchProducts(String search, String category, Double minPrice, Double maxPrice) {
        Query query = new Query();

        // Busca textual com Text Index configurado no Model
        if (search != null && !search.isBlank()) {
            TextCriteria textCriteria = TextCriteria.forDefaultLanguage().matching(search);
            query = TextQuery.queryText(textCriteria);
        }

        if (category != null && !category.isBlank()) {
            query.addCriteria(Criteria.where("category").is(category));
        }

        // Filtro condicional por range de preços
        if (minPrice != null || maxPrice != null) {
            Criteria priceCriteria = Criteria.where("price");
            if (minPrice != null) priceCriteria.gte(minPrice);
            if (maxPrice != null) priceCriteria.lte(maxPrice);
            query.addCriteria(priceCriteria);
        }

        // Apenas produtos ativos e com estoque
        query.addCriteria(Criteria.where("status").is("ACTIVE").and("stock").gt(0));

        return mongoTemplate.find(query, Product.class);
    }
}
```

## 4.3. ProductController (Endpoints)

```java
package com.antarez.mktsimple.controller;

import com.antarez.mktsimple.domain.model.Product;
import com.antarez.mktsimple.repository.ProductRepository;
import com.antarez.mktsimple.security.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        // Pegando vendedor automaticamente do cabeçalho preenchido pelo Filtro
        String sellerId = UserContext.getUserId();
        product.setSellerId(sellerId);
        product.setStatus("ACTIVE");
        return productRepository.save(product);
    }

    @GetMapping
    public List<Product> getCatalog(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        
        return productRepository.searchProducts(search, category, minPrice, maxPrice);
    }
}
```
