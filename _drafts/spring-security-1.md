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
本文根据 `Spring` 官网提供的入门教程，提供一个 `Spring Security` 的入门讲解。
教程链接：<https://spring.io/guides/topicals/spring-security-architecture>

`Spring` 的那个教程面向 `Spring Security` 初学者，介绍了 `Spring Security` 的框架设计。
若要了解高层的应用安全机制原理、安全框架定制方法，或者仅仅想要学习如何做应用安全方面工作的，
都可以阅读那篇教程。

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
   表示可以确定输入信息代表有效的主体
2. 抛出一个 `AuthenticationException` ，表示可以确定输入信息提供了无效的主体
3. 返回 `null` 表示没法确定任何事情

`AuthenticationException` 是一个 `RuntimeException` ，一般框架不期望用户捕获这个异常，
而是框架来处理，例如显示登录失败界面，或返回一个 401 响应码，或一段登录失败 Json。



### 授权
