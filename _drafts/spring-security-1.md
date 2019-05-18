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
- Principal 主体：表示一个抽象主体，例如个人、组织、登录 ID、用户对象等
- Credentials 凭证：用于验证所表示的主体是正确的，一般是一个密码，但可以是任何东西

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

没有进行安全配置的 `Spring Boot` 应用，默认会有 n 个过滤链，一般 n = 6 。
第一个（n - 1）链用于跳过静态资源，如 `/css/**`, `/images/**`，还错误页面 `/error`
（可以通过 `SecurityProperties` 中的 `security.ignored` 配置来排除更多 url）。
最后的链处理所有 URL `/**` ，并且功能很丰富，包括认证、授权、一场处理、会话处理、HTTP 头处理等。
这个链中默认有 11 个过滤器，一般情况下用户无需关心它们谁生效、何时生效等。

> 注意
> > Spring安全内部的所有过滤器都在应用容器（如 Tomcat）中都是不可见的，这一点很重要。
> > 尤其是在 `Spring Boot` 应用程序中，默认情况下，所有类型为 `Filter` 的 `@Bean`s 都会自动注册到容器中。
> > 因此，如果要向安全链添加自定义筛选器，则不能将其设置为 `@Bean` ，
> > 或使用 `FilterRegistrationBean` 进行包装而显式地禁用容器注册。

### 创建与自定义过滤链
`Spring Boot` 程序中的默认链（匹配 `/**` 的链）拥有一个默认顺序 `SecurityProperties.BASIC_AUTH_ORDER`。
用户可以通过设置 `security.basic.enabled = false` 将默认链完全关闭，
或者将其用作 fallback 并使用较低的顺序定义其他规则。
实现自定义顺序只需要在 `WebSecurityConfigurerAdapter`（或 `WebSecurityConfigurer` ）上标记一个 `@Bean`，
并使用 `@Order` 标记该类。
示例：
```java
@Configuration
@Order(SecurityProperties.BASIC_AUTH_ORDER - 10)
public class ApplicationConfigurerAdapter extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.antMatcher("/foo/**")
     ...;
  }
}
```
这个 Bean 会使 `Sprnig Security` 添加一个新的过滤链，并且顺序在 fallback 链之前。

很多应用中都包含很多不同的访问规则。
例如，一个提供了 Web UI 界面和后段 API 的程序，可能在 UI 方面使用基于 `Cookie` 的登录页面认证方式，
而在 `API`方面使用基于 `Token` 的认证手段，未认证则返回 401 。
每个资源的过滤链都可以通过一个不同顺序的独立的 `WebSecurityConfigurerAdapter` 来配置。
若多个过滤链都匹配到一个请求，顺序靠前的会被执行。

### 请求匹配
一个安全过滤链（等同于一个 `WebSecurityConfigurerAdapter`）拥有一个请求匹配器，
决定何种 HTTP 请求需要处理。一个请求会被一条安全过滤器链独占处理，不会有其他的安全过滤链再处理。
不过在过滤器链中，您可以通过在 `HttpSecurity` 配置器中设置其他匹配器来对权限进行更精细的控制。
例如：
```java
@Configuration
@Order(SecurityProperties.BASIC_AUTH_ORDER - 10)
public class ApplicationConfigurerAdapter extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.antMatcher("/foo/**")
      .authorizeRequests()
        .antMatchers("/foo/bar").hasRole("BAR")
        .antMatchers("/foo/spam").hasRole("SPAM")
        .anyRequest().isAuthenticated();
  }
}
```
配置 `Spring Security` 最容易犯的错误之一就是忘记这些匹配器适用于不同的进程，
第一个是整个过滤器链的请求匹配器，其他的仅仅选择需要的访问规则。

### 将应用程序安全规则与 Actuator 规则结合
如果使用了 `Spring Boot Actuator` 进行端点管理（？），你一定希望它是安全的，默认情况下本来就会安全。
实际上，如果在一个配置了 `Spring Security` 的应用中引入了 `Actuator` ，
就会自动配置一条 `Actuator` 专用的过滤链。
详情可以看下 `ManagementWebSecurityConfigurerAdapter` 类（`Spring Boot` `2.1.3.RELEASE`）。

> Web 层中的 `Spring Security` 目前与 `Servlet API` 相关联，因此它仅在 `Servlet` 容器中适用。
> 但是，它不依赖于 `Spring MVC` 或 `Spring Web` 技术栈的其余部分，
> 因此可以在任何 `Servlet` 应用程序中使用，例如使用 `JAX-RS` 的应用程序。


## 方法安全性
除了支持保护 Web 应用程序外， `Spring Security` 还支持 Java 方法执行的访问控制。
在 `Spring Security` 中，这仅仅是一种不同的 “需要保护的资源”。
对用户来说就是用相同的格式定义 `ConfigAttribute` 字符串，只是定义的地方不同而已。
想要用这个功能，首先得开启：
```java
SpringBootApplication
@EnableGlobalMethodSecurity(securedEnabled = true)
public class SampleSecureApplication {
}
```

然后直接往方法上写注解：
```java
@Service
public class MyService {

  @Secured("ROLE_USER")
  public String secure() {
    return "Hello Security";
  }
}
```

这就是一个安全方法示例。若 `Spring` 创建了这个类的 `@Bean` ，则调用方调用的是一个代理，
被 `Spring Security` 代理。若没权限则抛出 `AccessDeniedException` 。

还有其他注解可用于强制执行安全约束的方法，尤其是 `@PreAuthorize` 和 `@PostAuthorize` ，
它们允许您编写包含对方法参数和返回值的引用的表达式

> 将 Web 安全性和方法安全性结合起来并不罕见。
> 过滤器链提供用户体验功能，如身份验证和重定向到登录页面等；方法安全性可在更细粒度的级别提供保护。


## 线程
`Spring Security` 基本上是线程绑定的，因为它需要使当前的认证信息可供各种下游代码使用。
基本依赖是 `SecurityContext`，它可能包含身份验证（当用户登录时，一个 `Authentication` 一定是 `authenticated`）。
您始终可以通过 `SecurityContextHolder` 中的静态方法访问和操作 `SecurityContext`，
而 `SecurityContextHolder` 又可以简单地操作 `TheadLocal`，例如：

```java
SecurityContext context = SecurityContextHolder.getContext();
Authentication authentication = context.getAuthentication();
assert(authentication.isAuthenticated);
```

这种玩法不常见，但可能对你有用，例如需要写一个定义认证过滤器时。

若能需要在 Web 环境访问一个已登录的用户信息，可以在 `@RequestMapping` 中使用一个参数来接收。
例如：
```java
@RequestMapping("/foo")
public String foo(@AuthenticationPrincipal User user) {
  ... // do stuff with user
}
```
这个注解从 `SecurityContext` 中提取 `Authentication` ，并将 `getPrincipal()` 的结果注入到参数中。
其类型与 `AuthenticationManager` 的认证有关，需要用户自行保证。

若使用了 `Spring Security` ，来自 `HttpServletRequest` 的 `Principal` 接口的类型就是 `Authentication`，
可以这样直接利用：
```java
@RequestMapping("/foo")
public String foo(Principal principal) {
  Authentication authentication = (Authentication) principal;
  User = (User) authentication.getPrincipal();
  ... // do stuff with user
}
```
如果您需要编写在不使用 `Spring Security` 时也可以使用的代码
（在加载 `Authentication` 类时需要更加具有防御性），
这种写法可能很有用。

### 异步执行安全方法
`SecurityContext` 是与线程绑定的，若需要异步调用安全方法，则必须确保这个 `Context` 传到了另一个线程。
也就是可以把 `SecurityContext` 套到异步任务中（如 `Runnable`， `Callable`），
`Spring` 提供了提供了一些 helper，如封装好的 `Runnable` 和 `Callable`。
要将 `SecurityContext` 传到 `@Async` 方法，您需要提供 `AsyncConfigurer` 并确保 `Executor` 的类型正确：
```java
@Configuration
public class ApplicationConfiguration extends AsyncConfigurerSupport {

  @Override
  public Executor getAsyncExecutor() {
    // 不建议在实际场景直接使用 Executors
    return new DelegatingSecurityContextExecutorService(Executors.newFixedThreadPool(5));
  }
}
```
