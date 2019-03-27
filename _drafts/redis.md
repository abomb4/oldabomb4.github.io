---
layout: post
title:  "Redis 源代码长什么样子？"
categories: Source
date: +0800 2019-02-18 12:00:00
tag: redis
---

* content
{:toc}

# 简介
--------------
`Redis` Everyone know this. How to read it's codebase?

# 代码结构
--------------
来看下主要程序源代码的部分，就是src目录：
```
.
├── adlist.c            种双向链表函数实现
├── adlist.h            提供了一种双向链表数据结构与实现
├── ae.c                事件驱动编程库实现，根据宏确定使用哪种系统机制
├── ae_epoll.c          ae.c epoll 实现
├── ae_evport.c         ae.c evport 实现
├── ae_kqueue.c         ae.c keueue 实现
├── ae_select.c         ae.c select 实现
├── ae.h                一种事件驱动编程库
├── anet.c
├── anet.h              一种网络封装库
├── aof.c               Append Only File 实现，方法定义在 server.h
├── asciilogo.h         Logo
├── atomicvar.h         原子数字增减宏定义，调用 GCC 内置 _atomic 方法实现
├── bio.c
├── bio.h               后台任务 IO 功能，在 aof.c 和 lazyfree.c 中主要使用
├── bitops.c            二进制位操作函数实现，定义在 server.h
├── blocked.c           阻塞实现，定义在 server.h
├── childinfo.c         可能是用于 Redis 主子进程通信的实现，定义在 server.h
├── cluster.c
├── cluster.h           Reids Cluster 数据结构、静态定义、API
├── config.c            配置文件相关功能实现，定义在 server.h
├── config.h            基于操作系统的一些宏定义
├── crc16.c             crc 实现
├── crc64.c             crc 实现
├── crc64.h             crc 定义，被 server.h 引入
├── db.c                所有 keyspace 相关的操作实现
├── debug.c             debug 相关
├── debugmacro.h
├── defrag.c            内存碎片整理？
├── dict.c
├── dict.h              Hash Table 定义，每个在 Redis 中的数据都是一个 dictEntry
├── endianconv.c
├── endianconv.h        大小端处理工具
├── evict.c             内存过大处理（LRU 和其他策略），server.h
├── expire.c            过期处理 server.h
├── fmacros.h           一些关于文件的宏定义
├── geo.c               地理坐标操作实现
├── geo.h               地理坐标数据结构
├── geohash.c
├── geohash.h           四等分地理坐标库
├── geohash_helper.c
├── geohash_helper.h    四等分地理坐标
├── help.h              帮扶文件，描述所有指令的用法和用途
├── hyperloglog.c       HyperLogLog 算法实现（用于统计重复数据？），实现 server.h 的一些方法
├── intset.c
├── intset.h            一种 value 值编码方式，用更少的空间和确定的数据结构来存储数字
├── latency.c           后台监控功能
├── latency.h           后台监控功能
├── lazyfree.c          实现 server.h 中各种异步回收功能
├── listpack.c
├── listpack.h          一种包含几个 String 列表的数据结构
├── listpack_malloc.h   defines
├── localtime.c         本地日期函数
├── lolwut5.c           LOLWUT 指令的实现，定义在 server.h，玩艺术的
├── lolwut.c            LOLWUT 指令的实现，定义在 server.h，玩艺术的
├── lzf_c.c             LZF 压缩算法实现
├── lzf_d.c             LZF 解压算法实现
├── lzf.h               LZF 算法头定义
├── lzfP.h              LZF 算法预定义常量，影响算法实现
├── Makefile
├── Makefile.dep
├── memtest.c           内存检测实现，定义在 server.c 中
├── mkreleasehdr.sh     生成 release.h 的脚本
├── module.c            模块框架实现？
├── modules
│   ├── gendoc.rb
│   ├── helloblock.c
│   ├── hellocluster.c
│   ├── hellodict.c
│   ├── hellotimer.c
│   ├── hellotype.c
│   ├── helloworld.c
│   ├── Makefile
│   └── testmodule.c
├── multi.c             MULTI/EXEC/WATCH 命令实现
├── networking.c        所有网络与客户端相关的操作实现
├── notify.c            This file implements keyspace events notification via Pub/Sub and described at https://redis.io/topics/notifications.
├── object.c            Redis object implementation
├── pqsort.c
├── pqsort.h
├── pubsub.c
├── quicklist.c
├── quicklist.h
├── rand.c
├── rand.h
├── rax.c
├── rax.h
├── rax_malloc.h
├── rdb.c
├── rdb.h
├── redisassert.h
├── redis-benchmark
├── redis-benchmark.c
├── redis-check-aof
├── redis-check-aof.c
├── redis-check-rdb
├── redis-check-rdb.c
├── redis-cli
├── redis-cli.c
├── redismodule.h
├── redis-sentinel
├── redis-server
├── redis-trib.rb
├── release.c
├── release.h
├── replication.c
├── rio.c
├── rio.h
├── scripting.c
├── sdsalloc.h
├── sds.c
├── sds.h
├── sentinel.c
├── server.c
├── server.h
├── setproctitle.c
├── sha1.c
├── sha1.h
├── siphash.c
├── slowlog.c
├── slowlog.h
├── solarisfixes.h
├── sort.c
├── sparkline.c
├── sparkline.h
├── stream.h
├── syncio.c
├── testhelp.h
├── t_hash.c
├── t_list.c
├── t_set.c
├── t_stream.c
├── t_string.c
├── t_zset.c
├── util.c
├── util.h
├── valgrind.sup
├── version.h
├── ziplist.c
├── ziplist.h
├── zipmap.c
├── zipmap.h
├── zmalloc.c
└── zmalloc.h
```
