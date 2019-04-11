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
以 `redis-5.0.3` 为例。

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
├── aof.c               AOF（Append Only File）持久化实现，方法定义在 server.h
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
├── modules             模块化示例？
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
├── pqsort.c            NetBSD libc qsort 的可指定范围的实现
├── pqsort.h            NetBSD libc qsort 的可指定范围的实现
├── pubsub.c            订阅发布的底层 API 实现，定义于 server.h
├── quicklist.c         一种通用双向链表实现
├── quicklist.h         一种通用双向链表实现
├── rand.c              随机数
├── rand.h              随机数
├── rax.c               基数树实现
├── rax.h               基数树实现（header 文件有详细介绍）
├── rax_malloc.h        决定基数树内存分配器的选取
├── rdb.c               RDB（Redis Database File）持久化实现
├── rdb.h               RDB（Redis Database File）持久化实现
├── redis-benchmark.c   性能测试工具，可以独立运行的
├── redis-check-aof.c   AOF 检查工具，可独立运行
├── redis-check-rdb.c   RDB 检查工具，可独立运行
├── redis-cli.c         Redis 命令行工具，可独立运行
├── redis-trib.rb       WARNING: redis-trib.rb is not longer available
├── redisassert.h       断言库
├── redismodule.h       模块化头文件？
├── release.c
├── release.h           这个好像是编译时产生的版本信息文件
├── replication.c       异步复制
├── rio.c               rio ，是一种简单的面向流的 IO 抽象，提供 read write tell 三种基础方法。
├── rio.h
├── scripting.c         Lua 脚本支持，定义于 server.h
├── sds.c               Simple Dynamic String
├── sds.h
├── sdsalloc.h          决定 sds 内存分配器的选取
├── sentinel.c          Redis 烧饼实现
├── server.c            （东西太多）
├── server.h            （东西太多）
├── setproctitle.c      Linux/Darwin setproctitle
├── sha1.c
├── sha1.h
├── siphash.c           SipHash 一种 Hash 算法，在 HashTable （dict.c）中有用到
├── slowlog.c           慢日志实现，就是如果你执行时间长了就把你记录起来的机制
├── slowlog.h
├── solarisfixes.h      Solaris 系统专用
├── sort.c              SORT 指令的实现，与一些辅助功能，定义在 server.h
├── sparkline.c         ASCII 折线图？
├── sparkline.h         ASCII 折线图？
├── stream.h            流 数据结构定义
├── syncio.c            很常用的同步 IO 读写实现
├── t_hash.c            Hash 类型相关操作实现
├── t_list.c            List 类型数据相关操作实现
├── t_set.c             Set 类型
├── t_stream.c          Stream 实现 （stream.h）
├── t_string.c          各种指令实现
├── t_zset.c            排序 Set API 实现
├── testhelp.h          This is a really minimal testing framework for C
├── util.c
├── util.h              一些有关 sds 的工具类
├── valgrind.sup
├── version.h           版本号
├── ziplist.c           一种内存利用率很高的双向链表
├── ziplist.h           一种内存利用率很高的双向
├── zipmap.c            String -> String Map data structure optimized for size
├── zipmap.h
├── zmalloc.c
└── zmalloc.h           total amount of allocated memory aware version of malloc()
```

## Server.h
`Server.h` 是 `Redis Server` 主要流程、功能、数据结构、命令 的定义都在里面。

它都包括啥？
- 引入必要的头文件
- 各种静态常量，起到枚举的作用
- 服务默认配置，部分功能的静态配置
- 声明一些数据类型
    - `RedisModule` 模块系统基本数据结构
    - `redisObject` Redis 存储内容外层封装？
