---
layout: post
title:  "CentOS 7 配置zk与kafka服务脚本"
categories: Java
date: +0800 2018-06-26 14:36:47
tag: zookeeper systemd kafka
---

# Systemd配置
当前配置基于CentOS 7，ZooKeeper 3.4.10，Kafka 1.0.0 scala 2.12：

```ini
[Unit]
Description=ZooKeeper Service
Documentation=http://zookeeper.apache.org
Requires=network.target
After=network.target

[Service]
Type=forking
User=data
Group=data
Environment=JAVA_HOME=/opt/jdk1.8.0_172
ExecStart=/home/data/zk/zookeeper-3.4.10/bin/zkServer.sh start /home/data/zk/zookeeper-3.4.10/conf/zoo.cfg
ExecStop=/home/data/zk/zookeeper-3.4.10/bin/zkServer.sh stop /home/data/zk/zookeeper-3.4.10/conf/zoo.cfg
ExecReload=/home/data/zk/zookeeper-3.4.10/bin/zkServer.sh restart /home/data/zk/zookeeper-3.4.10/conf/zoo.cfg
WorkingDirectory=/home/data/zk

[Install]
WantedBy=default.target
```

```ini
[Unit]
Description=Apache Kafka server (broker)
Documentation=http://kafka.apache.org/documentation.html
Requires=network.target remote-fs.target
After=network.target remote-fs.target kafka-zookeeper.service

[Service]
Type=simple
User=data
Group=data
Environment=JAVA_HOME=/opt/jdk1.8.0_172
ExecStart=/home/data/kafka/kafka_2.12-1.0.0/bin/kafka-server-start.sh /home/data/kafka/kafka_2.12-1.0.0/config/server.properties
ExecStop=/home/data/kafka/kafka_2.12-1.0.0/bin/kafka-server-stop.sh

[Install]
WantedBy=multi-user.target
```
