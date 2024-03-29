---
layout: post
title:  "日记"
categories: Personal
date: +0800 2019-01-30 12:00:00
tag: personal
---

* content
{:toc}

# 2019-01-30
--------------
- 把 `ibatis-to-mybatis-converter` 公开了，基本功能已经可以用了
- 完善了 `SMT` 框架？的注释
- 听说了 `Spring` 的一种用法： `<beans profile="xxx" ></beans>`
  可以动态配置一些东西（ `Spring` >= 3.1 ）

# 2019-02-13
--------------
- 弄虚拟机，本来想把 `mysqld_multi` 给 `systemd` 化，但是不会整放弃了，
  所以现在还是手动启动；
- 尝试部署了一下 `MyCat` ，没完成
- `MySQL` 更改密码： `set password password('new_password')`
- 听了小组内的 `Vue` 介绍，收获：
    - 箭头函数的 `this` 是调用方的 `this` ， `function` 函数的 `this` 是声明方的 `this`
    - 提到了 `Object.defineProperty` ，现在我还不明确其具体功能

# 2019-02-14
--------------
- 本地部署了 `easy-mock` (https://github.com/easy-mock/easy-mock)
    - 安装了 `MongoDB` `Redis` `NodeJS 8.15.0`
- 弄了半天 `Vue` ，就是搞搞页面，稍微弄弄框架，没啥意义
- 点豐立德

# 2019-02-15
--------------
- 点豐立德
- 做好了一个页面，交互功能，统一样式（ `scss` 真好用）

# 2019-02-18
--------------
- 点豐立德
- 做好了两个页面
- 了解了一下 `Android` `adb logcat` 调试神器
- 整理了约 10% 的 `Redis` 代码结构用途

# 2019-02-25
--------------
这几天为啥都没写呢？因为准时下班了。为啥准时下班呢？当然不是我想下班就下班。

期间做了啥？

- 做页面
- 用 `NodeJS` + `MongoDB` + `Docker` 弄了一个快速 CURD 工程 Demo
- 点豐立德（艹）

# 2019-05-20
--------------
果然我这个人难以持之以恒，记录了几天日志，然后就不记录了。

这期间又干了啥？

首先豐立德倒闭了，在 2019-04-15 左右吧；

然后我一个很少遇见的、可以交流技术的同事，离职了；

这期间参与了 `Vue` 界面改造，用 `vue-cli` 搭建了初始框架，实现了一些东西：
- 页面整体样式布局
- 基于相同一级域名的 `Cookie` 的登录验证
- 根据权限生成菜单
- `URL` 级别的权限校验
- 引入 `Typescript`
- 实现了一个基于 `Typescript` 的可以进行 `Mock` 的 `API` 层
- 部分表单页，分离控制层与展示层，展示层可以重复利用的

还尝试改造了一个很常用，但代码超级麻烦，效率又低的业务代码，有如下设计：
- 采用 `Context` 贯穿整个业务生命周期，防止多次无用查询，方便插件化
- 实现插件化，区分各个主要业务阶段，在每个阶段之间加入过滤链
- 利用策略模式（形如 `XxxFactory#getProvider(context)`）实现一些逻辑重用性不大、接口类似的业务部分

还稍微写了一下基于 `Powershell 5` 的脚本，和一套交互式的 `Shell` 部署脚本。

其余的工作，似乎就不值一提了。

期间发起了 `adbhnn-db` （一个数据库，没名字的） 个人项目，和 `Spring Security` 的翻译。
`Spring Security` 的翻译已经在这个博客发布了， `adbhnn-db` 目前没法进行，
因为其目标是写一个完整的关系型数据库，但现在我还完全不了解数据库，必须要学习了理论，才有编码依据。
故现在正在翻译 `MySQL` 官方文档，存储引擎部分（`InnoDB`），准备先学习以下存储、索引等偏底层的东西，
再处理 `SQL` 语法解析、缓存等部分。

希望我能把 `adbhnn-db` 做出一点样子。

我不喜欢在技术方面一直告诉别人如何如何，我希望有人能告诉我如何如何，并拿出有力证据。
- 别人问我 xxx 如何实现，我说根据 XXX 需求，要 yyy 设计，拆出 zzz 接口更合理；
  但别人就喜欢赶紧实现，`if else` 一把梭我有什么办法？
- 别人的代码不格式化，等号两边没空格，缩进 `Tab` `Space` 混用，我说正好遇见了，帮它格式化一下更好，
  别人说反正能用管它干啥，我有什么办法？
- 别人问我，什么 `NoSuchBeanException` 、 `ConnectionTimeoutException` 、 `ClassNotFoundException` 、
  `NoSuchMethodException` 之类的，如何处理；这些东西不是经常遇见吗！
  `NoSuchBean`，不就是 `Spring` 配置有问题，或者少引了某包，或者少加了 `@Service`；
  `ConnectionTimeout`，检查地址配置对不对，检查应用读的是不是你的配置，检查目标地址是否有效啊；
  `ClassNotFound`、`NoSuchMethod`，多半是 `maven` 依赖或者打包问题啊，验证以下 `WEB-INF/lib` 不就好了；
  作为 `Spring` 程序员，这些不是常见错误吗？
- 别人问我没见过的异常，找一下就好了啊，别找什么劳什子百度，找 `Google` 啊，找 `StackOverflow` 啊，
  别说不会 `Google` ，梯子我有；别说看不懂英文，程序员能遇见的英文有几句难懂？
- 前后端调用开始扯皮了，抓包啊，`F12` 看 `Network` 啊，实在不行远程调试啊；
  开发环境测试环境又不开 `HTTPS` ，随便抓啊，哪里用到几个小组扯皮：
    - 啊，你传的 `xxxYyy` 不对，要传 `xxx_yyy`；
    - 啊，我传的就是 `xxx_yyy` 啊；
    - 啊，不对，我们没收到；
    - 你看我就这么传的（发出一段 `Vue` 代码截图）
    - 我们还是没收到啊，你问问网关
    - ………………
- 上面这对话，何等低效！
    - 前端人员把开发工具 `Network` 部分截个图，只要不是带有重定向的场景，那不就是铁证？
    - 说什么“找网关的人啊”，你们后端，或者说研发经理，干什么吃的，
      网关不就是登录校验、协议转换、流控这堆东西，现成产品有的是，这种网关自己搞不定吗？
    - “你没传啊”、“我没收到啊”，拿出铁证啊！谁知道你的业务代码后面有什么框架，
      抓包和 `Network` 标签要用起来啊！很难吗？
- 抓包：用 `root` 账户，执行 `tcpdump -s 0 -w xxx.pcap`，抓完了 `Ctrl-C` 退出，
  然后弄下来用 `Wireshark` 看一下
- `Network`：我不觉得存在前端人员不会用 `F12` 的，但这个标签在扯皮时记得利用啊。
  后端要是说“我不知道，我就没收到”这种，让他自己看 `HttpServletRequest` 、 `Spring MVC`、
  `HTTP` 协议的各种 `Post` 方法去。

当然我不会在同事面前讲以上部分任何东西的。

我很清楚，同事问我问题，是觉得我可以回答，是看得起我；
我也愿意给同事解决各种疑难问题，毕竟有些问题的解决思路还是很有趣的；
但我更期待一个好一点的技术氛围，经常回答非常常见的问题还是有点无聊的，
我也希望有人能确切地解答我一些业务设计、代码组织方式方面的问题，
而不是仍出某 `CSDN` 博客让我自己看。

# 2019-06-03
---------------
我憎恨什么都无法坚持的自己。
