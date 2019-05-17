---
layout: post
title:  "初识 Spring Security"
categories: Spring
date: +0800 2019-05-16 13:25:33
tag: redis
---

* content
{:toc}

# 前言
本文根据 `Spring` 官网提供的入门教程，提供一个 `Spring Security` 的入门讲解；
整篇文章大部分由该教程的直接翻译组成，在某些章节中加入了自己的一些理解。

教程链接：<https://spring.io/guides/topicals/spring-security-architecture>

`Spring` 的这个教程面向 `Spring Security` 初学者，介绍了 `Spring Security` 的框架设计。
想要了解高层的应用安全机制原理、安全框架定制方法，或者仅仅想要学习如何做应用安全方面工作的，
都可以阅读这篇教程。

# Spring Security 简介
`Spring Security` 是一款非常复杂，同时又非常强大的 `认证` 与 `权限控制` 框架。

`Spring Security` 具有高度可定制性，可以完成 Java 应用中绝大多数认证与授权方面的功能。

## 功能特性
- 对身份验证和授权的全面和可扩展支持
- 防御常见的攻击手段，如会话固定、点击劫持、跨站点请求伪造（CORS）等
- 与 `Servlet API` 集成
- 可选的 `Spring MVC` 集成
- 还有很多...

# Spring Security 架构

在进行之前，先明确几个名词：
- Principal 主体：表示一个抽象主体，例如个人、组织、登录 ID
- credentials 凭证：用于验证所表示的主体是正确的，一般是一个密码，但可以是任何东西

## 认证与授权
应用安全归根结底是不多不少两个问题：`认证`（你谁啊）和 `授权` （允许你干啥）。
有时使用 `权限控制` 这个说法代替可能有点难以理解的 `授权` 的说法。
`Spring Security` 拥有一个分离 `认证` 与 `授权` 的架构，并对两者都有策略与扩展点的支持。

### 认证
`认证` 功能的主要策略接口类是 `AuthenticationManager` 接口，它只有一个方法：
```java
public interface AuthenticationManager {

  Authentication authenticate(Authentication authentication)
    throws AuthenticationException;

}
```

在 `authenticate()` 方法中可以做 3 种事情：
1. 返回一个 `Authentication` 对象（一般包含 `authenticated = true`），
   表示可以确定输入的信息代表有效的主体
2. 抛出一个 `AuthenticationException` ，表示可以 **确定** 输入信息提供了无效的主体，
   例如用户被禁用等
3. 返回 `null` 表示该认证策略针对本认证实例无法确定任何事情

`AuthenticationException` 是一个 `RuntimeException` ，一般框架不期望用户捕获这个异常，
而是框架来处理，例如显示登录失败界面，返回一个 401 响应码，或返回一段登录失败 Json。

`AuthenticationManager` 接口的最常用实现是 `ProviderManager` ，
它代理了一个 `AuthenticationProvider` 组成的链。一个 `AuthenticationProvider`
与 `AuthenticationManager` 是比较像的，就是多了一个 `supports()` 函数。

一个 `ProviderManager` 可以在一个应用中支持多种不同的认证机制，
就是通过代理 `AuthenticationProviders` 长链实现的。

如果一个 `ProviderManager` 没法识别某个 `Authentication` 实例，则会跳过处理。

`ProviderManager` 有一个可空的 parent，若里面所有 `AuthenticationProvider` 都返回 `null`，
则会向上级 `ProviderManager` 请求认证；若此时没有上级，则抛出 `AuthenticationExcepiton`。

很多情况下，应用中受保护的资源都有逻辑分组（例如所有 `/api/*` 的都要认证），
而每组资源有它们专用的 `AuthenticationManager` 。
通常情况下它们每一个都是一个 `ProvicerManager` ，并且彼此之间共享 parent。
此时 Parent 类似一种“全局”资源，只作为一种 fallback 后备处理方案。

![An AuthenticationManager hierarchy using ProviderManager](/images/spring-security-1-authentication.png)
（图片来自教程）

### 自定义 AuthenticationManager
`Spring Security` 提供一些辅助配置方法，使用户快速在应用中配置认证管理相关功能。
最常用的辅助工具是 `AuthenticationManagerBuilder` 类，它可以很方便地设置内存、
JDBC，LDAP，或自定义的 `UserDetailsService`，来提供用户信息存取机制。
下面的例子展示了一个 `AuthenticationManagerBuilder` 如何配置了全局的 `AuthenticationManager`：
```java
@Configuration
public class ApplicationSecurity extends WebSecurityConfigurerAdapter {

   ... // web stuff here

  @Autowired
  public initialize(AuthenticationManagerBuilder builder, DataSource dataSource) {
    builder.jdbcAuthentication().dataSource(dataSource).withUser("dave")
      .password("secret").roles("USER");
  }
}
```
此示例涉及一个 Web 应用程序，但 `AuthenticationManagerBuilder` 的用途更加广泛
（有关 Web 应用程序安全性的实现方面的更多详细信息，请参阅下文）。
注意，只有当 `AuthenticationManagerBuilder` 是通过 `@Autowired` 的方式注入到一个 `@Bean` 标记的方法时，
才会构造全局的 `AuthenticationManager` 。相反，如果这样写的话：
```java
@Configuration
public class ApplicationSecurity extends WebSecurityConfigurerAdapter {

  @Autowired
  DataSource dataSource;

   ... // web stuff here

  @Override
  public configure(AuthenticationManagerBuilder builder) {
    builder.jdbcAuthentication().dataSource(dataSource).withUser("dave")
      .password("secret").roles("USER");
  }
}
```
注意之前的示例将 `AuthenticationManagerBuilder` 通过 `@Autowired`
注入到实现类中自定义的 `initialize()` 方法中，
而这个示例是通过 `@Override` 重写了父类 `WebSecurityConfigurerAdapter`中的 `configure()` 方法。
此时，这里的 `AuthenticationManagerBuilder` 只会构建一个“本地的” `AuthenticationManager`，
作为“全局的”管理其的一字儿子。
在一个 `Spring Boot` 应用中，用户可以使用 `@Autowired` 将那个“全局的”注入到其他 bean 中，
但无法注入“本地的”那些，除非显式地把它公开出去。

`Spring Boot` 默认提供了一个 `AuthenticationManager` （仅有一个用户），
除非你通过自己的 `AuthenticationManager` 覆盖它。
这个默认的全局的东西已经比较安全，除非用户自己配置了 `AuthenticationManager` 。
如果用户配置了一个 `AuthenticationManager` ，一般通过“本地的”方式来保护所需保护的资源，
而全局采用默认配置无需担心。


### 授权（访问控制）
一旦认证成功，我们进入授权阶段，授权阶段的核心策略接口是 `AccessDecisionManager` 。
框架提供了 3 个实现，它们都代理了一个 `AccessDecisionVoter` 链，
有点类似 `ProviderManager` 代理了一堆 `AuthenticationProvider` 。

一个 `AccessDecisionVoter` 关注一个 `Authentication` 实例（表示身份），
和一个被 `ConfigAttributes` 装饰的安全对象 `Object`。
```java
boolean supports(ConfigAttribute attribute);

boolean supports(Class<?> clazz);

int vote(Authentication authentication, S object, Collection<ConfigAttribute> attributes);
```
`Object` 是一个通用类型，在 `AccessDecisionManager` 和 `AccessDecisionVoter` 中定义了范型。
它表示用户任何用户想要访问的东西（比如一个 Web 资源、Java 方法等）。
`ConfigAttributes` 也是相当通用的，表示安全对象的装饰，其中包含一些元数据，
用于确定访问它所需的权限级别。
`ConfigAttributes` 是一个接口，但它只包含一个通用的，返回一个 `String` 的方法，
这些字符串以某种方式编码资源所有者的意图，表达“谁允许访问该资源”。

```java
interface ConfigAttribute {
  String getAttribute();
}
```

一个典型的 `ConfigAttribute` 可能是一个用户角色名（例如 `ROLE_ADMIN`，`ROLE_AUDIT`），
而且它们通常有共同的特殊规则（例如 `ROLE_` 前缀），还有可能提供一个可以执行表达式。

很多人使用默认的 `AccessDecisionManager` 实现，也就是 `AffimativeBased` 实现；
这种实现方式只要有一个 `AccessDecisionVoter` 通过，就算通过。
一般的定制都发生在 voters 中，比如增加，修改其中某个实现等。

在 `ConfigAttributes` 中使用 `Spring Expression Language (SpEL)` 表达式是一种很常用的做法，
例如 `isFullyAuthenticated() && hasRole('FOO')`。
这是由一个可以处理表达式并为它们创建上下文的 `AccessDecisionVoter` 所支持的方法。
要扩展可处理的表达式范围，需要自定义实现 `SecurityExpressionRoot`，有时还需要 `SecurityExpressionHandler`。

## Web 安全
`Spring Security` 在 Web 层的实现基于 Servlet `Filter` ，所以先看一下 `Filters` 的作用对我们理解有帮助。
下图展示一个 HTTP 请求的各处理器的典型分层机构。

![Filters](/images/spring-security-1-filters.png)
（图片来自教程）

客户端向应用发送请求，应用容器根据请求的 `URI` 决定哪些 `Filter` 和 `Servlet` 来处理该请求。
一个请求最多有一个 `Servlet` 处理，但 `Filter` 以链的形式出现，他们是有顺序的，
并且实际上如果某过滤器想要处理请求本身，它可以中断链的其余部分。
一个过滤器还可以修改下游过滤器与 Servlet 中的请求类和响应类。
过滤器的顺序很重要， `Spring Boot` 提供两种机制来管理过滤器的顺序：
- `Filter` 类型的 `@Bean` ，可以拥有一个 `@Order` 注解，或实现 `Ordered` 接口
- 用 `FilterRegistrationBean` 套起来， `FilterRegistrationBean` 拥有 `getOrder()` 方法

一些现成的过滤器定义了它们自己的顺序常数，以方便表示它们希望彼此之间的相对顺序
（例如，`Spring Session` 中的 `SessionRepositoryFilter` 定义了 `DEFAULT_ORDER`，值为 `MIN_VALUE + 50`，
说明这个过滤器希望较早执行，但想先于它执行其他过滤器也是可以的）。

`Spring Security` 作为 `Servlet` 过滤器链中的一个 `Filter` 存在，具体类型为 `FilterChainProxy`。
在 `Spring Boot` 应用中，安全过滤器是个 `@Bean` 存在于 `ApplicationContext` ，默认会装载，并应用于所有请求。
默认过滤器安装未知是 `SecurityProperties.DEFAULT_FILTER_ORDER` ，该数值相对
`OrderedFilter.REQUEST_WRAPPER_FILTER_MAX_ORDER` 来定义
（`Spring Boot` 应用中，会造成请求对象修改的过滤器的最大顺序）。

从应用容器角度来看，`Spring Security` 只有一个过滤器，但其实它内部还有很多别的过滤器，共同完成安全功能。

![Spring Security is a single physical Filter but delegates processing to a chain of internal filters](/images/spring-security-1-filters-inner.png)
（图片来自教程）

事实上，安全过滤器中甚至还有一层代理，一个没有标记 Spring `@Bean` 的 `DelegatingFilterProxy` 类，
用来直接在应用容器中挂载。
这个代理类代理一个 `FilterChainProxy` 实例，这个实例是标记了 `@Bean` 的，而且经常有个固定的名字
`springSecurityFilterChain` 。
这个 `FilterChainProxy` 实例就包含了 spring security 中的安全逻辑。

一个顶级的 `FilterChainProxy` 可能包含多个子链，实现类可能是 `SecurityFilterChain`，
子链对容器也是不可见的。
请求过来时，匹配到第一个能够处理该资源的子链，将请求分发到匹配的子链进行处理。
下图展示分发过程的一个例子（`/foo/**` 比 `/**` 更早被匹配）。
这种匹配方式很常用，但不是唯一一种。
分发程序最重要的特点就是一个请求必须只分配给一个链。

![The Spring Security FilterChainProxy dispatches requests to the first chain that matches](/images/spring-security-1-filters-inner-chains.png)
（图片来自教程）




### 创建与自定义过滤链

### 调度和授权中的请求匹配

### 将应用程序安全规则与 Actuator 规则结合

## 方法安全性

## 线程

### 异步执行安全方法
