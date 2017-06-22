---
layout: post
title:  "Java IO学习(1)"
categories: Java
date: 2017-06-22 16:47:10 +0800
tag: java
---

# 引言
--------------------
在学校学习Java时，I/O给我留下了“很麻烦”的印象，比如读个文件要好几个类来实现，
需要Buffered什么Reader啊，什么FileInputStream啊，根本记不住。

觉得麻烦只不过这是当时没认真学而已。

现在阅读了《Thinking In Java》 中文翻译版（[链接](http://www.yq1012.com/ThinkingInJava/)），
看到IO章节时，感觉翻译版看起来太吃力了，很多名词翻译的和现在都有不同，
而且书中的Java版本略低（1.2 Beta）。
所以尝试Google一下，有没有更好理解的教程来学习一哈。

于是我找到了这篇教程 [Java IO Tutorial](http://tutorials.jenkov.com/java-io/index.html)。

现在刚刚阅读了两章，觉得有不少收获，先记录下来。

# Java I/O 概述
--------------------

很多时候，我们的程序做的事情，就是将某数据源作为输入，经过程序处理得到结果，并输出到指定目标。

一般来说，数据源与输出目标一般有这几类：
- 文件
- 管道
- 网络
- 内存（字符串、byte[]什么的）
- 标准输入输出

在Java中，最基础的处理方式就是

## Stream and Reader
-----------------

Java IO包装了对字节流与字符流的处理。

对字节流的处理基于`InputStream`/`OutputStream`接口，对字符流的处理基于`Reader`/`Writer`。
我们要根据实际要处理的数据类型，来选择合适的处理处理我们的输入输出。

# Java IO 类概览表
-----------------

| |Byte Based||Character Based| |
|--|--|--|--|--|
||**Input**|**Output**|**Input**|**Output**|
|**Basic**|InputStream|OutputStream|Reader<br>InputStreamReader|Writer<br>OutputStreamWriter|
|**Arrays**|ByteArrayInputStream|ByteArrayOutputStream|CharArrayReader|CharArrayWriter|
|**Files**|FileInputStream<br>RandomAccessFile|FileOutputStream<br>RandomAccessFile|FileReader|FileWriter|
|**Pipes**|PipedInputStream|PipedOutputStream|PipedReader|PipedWriter|
|**Buffering**|BufferedInputStream|BufferedOutputStream|BufferedReader|BufferedWriter|
|**Filtering**|FilterInputStream|FilterOutputStream|FilterReader|FilterWriter|
|**Parsing**|PushbackInputStream<br>StreamTokenizer||PushbackReader<br>LineNumberReader| |
|**Strings**| | |StringReader|StringWriter|
|**Data**|DataInputStream|DataOutputStream| | |
|**Data - Formatted**| |PrintStream| |PrintWriter|
|**Objects**|ObjectInputStream|ObjectOutputStream| | |
|**Utilities**|SequenceInputStream| | | |

我看了这个之后，有一种感觉：处理IO流的类**原来没那么多嘛**。想处理什么类型的数据，就找到对应的流的类就好了。

举个常用的场景，比如读取一个ASCII数据文件到String的场景。使用Java IO的处理方式就是：
1. 我的文件是ASCII文件，确定是基于字符的，所以用`Reader`来处理应该比较方便
1. `Reader`系列中有`FileReader`可以处理文件。
1. 其实用`FileReader`就可以满足读ASCII文件的要求了，但是不方便，再用`BufferedReader`包装一下比较好。

于是代码如下：
```java
try (BufferedReader true_r = new BufferedReader(new FileReader("/tmp/asdf.txt"))) {
    String line;
    while((line = true_r.readLine()) != null) {
        System.out.println(line);
    }

} catch (IOException e) {

    e.printStackTrace();
}
```

# 参考链接
--------------------

[Java IO Tutorial](http://tutorials.jenkov.com/java-io/index.html)
