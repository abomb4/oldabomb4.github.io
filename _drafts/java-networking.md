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


# NIO.2(AIO)
