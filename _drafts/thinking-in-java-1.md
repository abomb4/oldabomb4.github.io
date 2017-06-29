---
layout: post
title:  "Thinking In Java 前五章记录"
categories: 阅读记录
date: 2017-06-19 16:21:53 +0800
tag: reading java
---

* content
{:toc}

# 第四章
----------------------
finalize()一般只用在native代码，其余场景都不会使用到

static初始化，只有在必要的时候才会进行，当引用了静态变量，或new了那个对象之后才会创建。

# 第六章
----------------------
需要回收资源的东西，要注意一定要在生命周期最后面用finally代码块手动回收！

# 第七章
----------------------
如果子类要重写finalise()方法，则一定要在**最后面**，明确调用父类的finalize()

# 第九章
----------------------
如果在finally块中发生了异常，会覆盖掉try块中的异常信息，使之前的异常完全丢失。需要避免这种情况。

## 类型信息
----------------------
如果访问一个static final类型的成员，类加载器不一定会加载那个类。取决于被访问的static final变量的类型：
- 如果是一个编译期静态常量，则不会载入类；
- 如果不是编译器静态常量，而是调用函数什么的，则会载入类。

例如这个类：
```java
public class S1 {

    static final int a = 1234;
    static final String b = "asdf";
    static final int c = new Random().nextInt();
    static final int d = getD();

    static final int getD() {
        return 123123;
    }

    static {
        System.out.println("s1");
    }
}
```
该类中，如果外部函数访问`a`和`b`，是不会加载`S1`类的。访问`c`和`d`的时候就会加载`S1`类。
