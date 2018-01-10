---
layout: post
title:  "Java 网络编程"
categories: Java
date: 2017-12-3 18:56:56 +0800
tag: java network
---

* content
{:toc}

# 综述
目前Java网络编程主要有三大类API。BIO、NIO和NIO.2(AIO)。

# BIO
BIO就是常见的那种网络编程方法，创建一个Socket，一个Socket对应一个线程，
优点是实时性好，编程简单，故障少；
缺点是太多阻塞造成线程资源浪费，处理大量连接时有点不好使。

BIO相关操作位于java.io.*包。

编程方法就是典型的Socket编程，作为服务端的编程方法：
1. 创建`ServerSocket`
2. `bind()`
3. `accept()`
4. 获取`InputStream` `OutputStream` 进行数据传送

客户端流程：
1. 通过`connect()` 创建`Socket`对象
2. 获取`InputStream` `OutputStream` 进行数据传送

搞个简单示例看一下：

服务端：
```java
public static void main(String[] args) {
    final String host = "0.0.0.0";
    final int port = 12345;
    try (ServerSocket server = new ServerSocket()) {
        server.bind(new InetSocketAddress(host, port));
        System.out.println("Bind " + host + ":" + port + " success.");
        while (true) {
            System.out.println("Accepting...");
            final Socket socket = server.accept();
            System.out.println("Accepted. " + socket.getRemoteSocketAddress().toString());
            Runnable r = new Runnable() {
                @Override
                public void run() {
                    try {
                        InputStream is = socket.getInputStream();
                        BufferedReader rd = new BufferedReader(new InputStreamReader(is));

                        java.io.OutputStream os = socket.getOutputStream();

                        System.out.println("Receiving...");
                        String line;
                        while ((line = rd.readLine()) != null && !line.isEmpty()) {
                            os.write((line + "\n").getBytes("UTF-8"));
                            System.out.println(line);
                        }
                        System.out.println("Client closes connection.");
                    } catch (IOException e) {
                        e.printStackTrace();
                    } finally {
                        try {
                            socket.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            };
            new Thread(r).start();
        }

    } catch (IOException e) {
        e.printStackTrace();
    }
}
```
客户端：
```java
public static void main(String[] args) throws IOException {
    final String host = "localhost";
    final int port = 12345;
    Socket socket = new Socket();
    System.out.println("Connectiing "+host+":"+port+" .....");
    socket.connect(new InetSocketAddress(host, port), 1000);
    System.out.println("Connected.");

    System.out.println("Sending data..");
    OutputStream os = socket.getOutputStream();
    os.write("试试看咋回事\n".getBytes("UTF-8"));
    os.flush();
    System.out.println("Data sent.");

    System.out.println("Reading server response..");
    InputStream is = socket.getInputStream();
    BufferedReader r = new BufferedReader(new InputStreamReader(is));
    String line = r.readLine();

    System.out.println("服务端说：" + line);
    System.out.println("Closing connection..");
    socket.close();
    System.out.println("Closed.");
}
```
示例就是一种典型的BIO服务端流程，一个线程对应一个连接，处理大量连接时会造成很大的线程资源浪费。

运行结果，
服务端：
```
Bind 0.0.0.0:12345 success.
Accepting...
Accepted. /127.0.0.1:64605
Accepting...
Receiving...
试试看咋回事
Client closes connection.

```
客户端：
```
Connectiing localhost:12345 .....
Connected.
Sending data..
Data sent.
Reading server response..
服务端说：试试看咋回事
Closing connection..
Closed.
```

# NIO
## NIO干啥地啊
-------------------
据说NIO与BIO最大的区别是，BIO以流的方式处理数据，而NIO以块的形式处理数据。
面向流的处理方式是系统一次处理一个字节；面向块的处理方式一次产生或消费一个块。

据说按块处理的方式比单字节处理要快，据说BIO的库中也集成了面向块的速度优点，
所以NIO比BIO在速度上没多少优势。

NIO的主要优势还是网络异步IO方面，这个文章也在讲网络编程而不是其他IO。

## 主要概念
-------------------
`Channel`和`Buffer`是NIO中的核心概念，异步IO会用到核心对象`Selector`。

### 通道`Channel`
-------------------
`Channel` 抽象了各种可以做IO操作的东西，包括硬件、文件、Socket等。
通道有关闭和开启两个状态，一旦通道关闭，则任何IO操作函数都会爆异常。

### 缓冲区`Buffer`
-------------------
`Buffer` 是一种指定原始类型的数据的容器。`巴佛`里面有3个主要参数：
1. 容量`capacity`
    一个`巴佛`的容量是固定的，代表容器的最大大小，无法修改。
    如果感觉不够大，只能重新创建

1. 位置`position`
    `破贼神`是当前读取或写入的**下一个**位置。发生`filp()`、`rewind()`和`clear()`之后，`破贼神`置为0。

1. 大小`limit`
    `李米特`是第一个不能读取或写入的数据的位置，`limit`非负，`position`不会大于等于这个值。
    在`巴佛`写状态时发生了`flip()`之后，这个值修改为当前位置`position`的值，以便读取而不会超出；
    在读状态发生`clear()`之后，这个值修改为容量`capacity`的值，以便写入。

## 主要API
-----------------------
`

# NIO.2(AIO)

