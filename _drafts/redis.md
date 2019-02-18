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
├── defrag.c
├── dict.c
├── dict.h
├── endianconv.c
├── endianconv.h
├── evict.c
├── expire.c
├── fmacros.h
├── geo.c
├── geo.h
├── geohash.c
├── geohash.h
├── geohash_helper.c
├── geohash_helper.h
├── help.h
├── hyperloglog.c
├── intset.c
├── intset.h
├── latency.c
├── latency.h
├── lazyfree.c
├── listpack.c
├── listpack.h
├── listpack_malloc.h
├── localtime.c
├── lolwut5.c
├── lolwut.c
├── lzf_c.c
├── lzf_d.c
├── lzf.h
├── lzfP.h
├── Makefile
├── Makefile.dep
├── memtest.c
├── mkreleasehdr.sh
├── module.c
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
├── multi.c
├── networking.c
├── notify.c
├── object.c
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
