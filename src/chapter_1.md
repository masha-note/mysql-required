# 1 了解SQL

## 1.1 数据库基础

### 1.1.1 什么是数据库

**数据库:** 保存有组织的数据的容器。

### 1.1.2 表

**表:** 某种特定类型数据的结构化清单。

表具有一些特性，这些特性定义了数据在表中如何存储，如可以存储什么样的数据，数据如何分解，各部分信息如何命名，等等。描述表的这组信息就是所谓的模式，模式可以用来描述数据库中特定的表以及整个数据库（和其中表的关系）。

**模式(schema):** 关于数据库和表的布局特性的信息。

### 1.1.3 列和数据类型

**列(column):** 表中的一个字段。所有表都是由一个或多个列组成的。

**数据类型(datatype):** 所容许的数据的类型。每个表列都有相应的数据类型，它限制（或容许）该列中存储的数据。

### 1.1.4 行

**行(row):** 表中的一个记录。

### 1.1.5 主键

**主键(primary key):** 一列（或一组列），其值能够唯一区分表中每个行。

*应该总是定义主键* 虽然并不总是都需要主键，但大多数数据库设计人员都应保证他们创建的每个表具有一个主键，以便于以后的数据操纵和管理。

表中的任何列都可以作为主键，只要它满足以下条件：  
* 任意两行都不具有相同的主键值；  
* 每个行都必须具有一个主键值（主键列不允许NULL值）。

主键通常定义在表的一列上，但这并不是必需的，也可以一起使用多个列作为主键。在使用多列作为主键时，上述条件必须应用到构成主键的所有列，所有列值的组合必须是唯一的（但单个列的值可以不唯一）。

*主键的最好习惯*  除MySQL强制实施的规则外，应该坚持的几个普遍认可的最好习惯为：
* 不更新主键列中的值；
* 不重用主键列的值；
* 不在主键列中使用可能会更改的值。（例如，如果使用一个名字作为主键以标识某个供应商，当该供应商合并和更改其名字时，必须更改这个主键。）  

## 1.2 什么是SQL

**SQL**是结构化查询语言(Structed Query Language)的缩写。