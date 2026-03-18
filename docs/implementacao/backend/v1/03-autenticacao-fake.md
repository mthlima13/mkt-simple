# 3. Interceptor (Filtro) de Autenticação

Como foi definido que **não haverá autenticação de fato (login, tokens JWT complexos próprios)**, mas que a autenticação foi feita por outro serviço (ex: API Gateway) que injeta o usuário como um **UUID no Header** da requisição, precisamos configurar um `Filter` ou `HandlerInterceptor` para capturar essa informação.

## 3.1. Contexto do Usuário Logado

Crie um bean local para guardar o contexto atual (utilizando `ThreadLocal`).

```java
package com.antarez.mktsimple.security;

public class UserContext {
    private static final ThreadLocal<String> currentUser = new ThreadLocal<>();

    public static void setUserId(String userId) {
        currentUser.set(userId);
    }

    public static String getUserId() {
        return currentUser.get();
    }

    public static void clear() {
        currentUser.remove();
    }
}
```

## 3.2. Filtro Spring MVC para Captura de Header

Crie um filtro que sempre leia o Header `X-User-Id` (ou equivalente) em toda requisição:

```java
package com.antarez.mktsimple.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthHeaderFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String userId = request.getHeader("X-User-Id");
        
        // Em um sistema real, validaríamos no MongoDB se o usuário existe, 
        // mas aqui só injetamos o ID no contexto.
        if (userId != null && !userId.isBlank()) {
            UserContext.setUserId(userId);
        }
        
        try {
            filterChain.doFilter(request, response);
        } finally {
            UserContext.clear(); // Limpa para não vazar contexto para outras requisições da mesma thread
        }
    }
}
```

Com isso, os seus Services (ex: `ProductService`, `OrderService`) podem chamar `UserContext.getUserId()` a qualquer momento para saber quem é o comprador ou vendedor realizando a ação, sem depender do body da requisição.
