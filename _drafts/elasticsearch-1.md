---
layout: post
title:  "elasticsearch 文档阅读记录"
categories: 阅读记录
date: +0800 2017-07-18 09:44:55
tag: reading elasticsearch
---

* content
{:toc}

# 简介
--------------
Elasticsearch是一个高扩展性的全文搜索与分析引擎。

# 名词定义
--------------
- **Cluster** 集群是一个或多个节点（Nodes，servers）的集合，集群中的所有节点共同持有整个数据，
并且提供联合索引与搜索功能。

- **Node** 节点就是集群中的一个服务，存数数据并参数集群索引，提供集群搜索功能。

- **Index** 索引是具有某种相似特征的文档的集合。索引由一个名称唯一确定，
在对索引中的文档进行更新、搜索、删除操作时需要索引名称。

- **Type** 类型一个索引中的逻辑分类/分区，可以自定义语义。

- **Document** 文档是可以索引化的基本单位。

- **Shards & Replicas**