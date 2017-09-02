---
layout: post
title:  "Thinking In Java 前五章记录"
categories: 阅读记录
date: 2017-06-19 16:21:53 +0800
tag: reading java
---

* content
{:toc}

# 杂
`transient`关键字，意思是不参与序列化

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

## 14 类型信息
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

## 17 容器
-------------------

### list
`LinkedList`底层是**双向链表**，而且支持栈的行为。

### hashCode()
-------------------
**对于良好的编程风格而言，应该在覆盖`equals()`方法是，总是同时覆盖`hashCode()`方法。**

因为在`HashMap`中，是通过hash值、地址、equals 三者判断一个元素是否与另一个相同。
详情见`HashMap#putVal(int, K, V, boolean, boolean)`方法。

所以当使用一个自定义对象作为Map的key的时候，必须同时重写`hasnCode()`方法与`equals(Object)`方法。

**注意`hashCode()`最好不要是容易改变的值！**

`hashCode()`方法不必独一无二，但必须保证`hashCode`与`equals`两方法可以确定一个对象的身份。

### HashSet
-------------------
`HashSet`同理，如果我们的类的`equals`逻辑与默认不同，那么一定要同时重写`hashCode()`与`equals(Object)`方法，
才可以保证放入`HashSet`中的对象是按照我们的`equals`逻辑不重复的。

因为`HashSet`的底层实现就是一个`HashMap`，调用`add`方法时就是以传入对象为KEY、
以一个静态空对象为Value，`put`到map中。

下面就是`HashSet`的`add`方法：
```java
public boolean add(E e) {
    return map.put(e, PRESENT)==null;
}
```
其中`PRESENT`的定义为：
```java
private static final Object PRESENT = new Object();
```

### 其余容器
---------------
`LinkedHashMap`与`HashMap`一样会散列化所有元素，但遍历时会按照插入顺序返回！666。
可以用于需要定期清理旧元素的场景或有序Map场景！

### 旧容器
----------------------
新代码中最好不要使用以下容器：
- HashTable
- Stack
- Vector
