# 21 创建和操纵表

## 21.1 CREATE TABLE创建表

### 21.1.1 表创建基础

CREATE TABLE需要下列信息：
* 新表的名字，在关键字CREATE TABLE之后给出；
* 表列的名字和定义，用逗号分隔。

CREATE TABLE语句也可能会包括其他关键字或选项，但至少要包括表的名字和列的细节。

```SQL
MariaDB [testdatabase]> CREATE TABLE customers(
  cust_id      int       NOT NULL AUTO_INCREMENT,
  cust_name    char(50)  NOT NULL ,
  cust_address char(50)  NULL ,
  cust_city    char(50)  NULL ,
  cust_state   char(5)   NULL ,
  cust_zip     char(10)  NULL ,
  cust_country char(50)  NULL ,
  cust_contact char(50)  NULL ,
  cust_email   char(255) NULL ,
  PRIMARY KEY (cust_id)
) ENGINE=InnoDB;
```

每列的定义以列名(在表中必须唯一)开始，后跟列的数据类型([附录D](./appendixD.md)列出了MySQL支持的数据类型)。表的主键可以在创建表时用PRIMARY KEY关键字指定。

**处理现有的表** 在创建新表时，指定的表名必须不存在，否则将出错。如果要防止意外覆盖已有的表，SQL要求首先手工删除该表（请参阅后面的小节），然后再重建它，而不是简单地用创建表语句覆盖它。如果你仅想在一个表不存在时创建它，应该在表名后给出 `IF NOT EXISTS`。这样做不检查已有表的模式是否与你打算创建的表模式相匹配。它只是查看表名是否存在，并且仅在表名不存在时创建它。

### 21.1.2 使用NULL值

创建时指定NOT NULL的列不接受没有值的行

```SQL
MariaDB [testdatabase]> CREATE TABLE orders(
  order_num  int      NOT NULL AUTO_INCREMENT,
  order_date datetime NOT NULL ,
  cust_id    int      NOT NULL ,
  PRIMARY KEY (order_num)
) ENGINE=InnoDB;
```

**理解NULL** 不要把NULL值与空串相混淆。NULL值是没有值，它不是空串。如果指定''（两个单引号，其间没有字符），这在NOT NULL列中是允许的。空串是一个有效的值，它不是无值。NULL值用关键字NULL而不是空串指定。

### 21.1.3 关于主键

**主键值必须唯一**。即，表中的每个行必须具有唯一的主键值。如果主键使用单个列，则它的值必须唯一。如果使用多个列，则这些列的组合值必须唯一。

单个列作为主键的定义如 `PRIMARY KEY (vend_id)`。

创建由多个列组成的主键，应该以逗号分隔的列表给出各列名，如：

```SQL
MariaDB [testdatabase]> CREATE TABLE orderitems(
  order_num  int          NOT NULL ,
  order_item int          NOT NULL ,
  prod_id    char(10)     NOT NULL ,
  quantity   int          NOT NULL ,
  item_price decimal(8,2) NOT NULL ,
  PRIMARY KEY (order_num, order_item)
) ENGINE=InnoDB;
```

主键也可以在表创建后定义，主键只能使用不允许为NULL值的列。

### 21.1.4 使用AUTO_INCREMENT

AUTO_INCREMENT告诉MySQL，本列每当增加一行时自动增量。每次执行一个INSERT操作时，MySQL自动对该列增量（从而才有这个关键字AUTO_INCREMENT），给该列赋予下一个可用的值。

**确定AUTO_INCREMENT值** `SELECT last_insert_id()` 返回最后一个AUTO_INCREMENT值。

### 21.1.5 指定默认值

用DEFAULT关键字指定默认值：

```SQL
MariaDB [testdatabase]> CREATE TABLE orderitems(
  order_num  int          NOT NULL ,
  order_item int          NOT NULL ,
  prod_id    char(10)     NOT NULL ,
  quantity   int          NOT NULL DEFAULT 1,
  item_price decimal(8,2) NOT NULL ,
  PRIMARY KEY (order_num, order_item)
) ENGINE=InnoDB;
```

**不允许函数** 与大多数DBMS不一样，MySQL不允许使用函数作为默认值，它只支持常量。

**使用默认值而不是NULL值** 许多数据库开发人员使用默认值而不是NULL列，特别是对用于计算或数据分组的列更是如此。 

### 21.1.6 引擎类型

与其他DBMS一样，MySQL有一个具体管理和处理数据的内部引擎。

MySQL具有多种引擎。它打包多个引擎，这些引擎都隐藏在MySQL服务器内，全都能执行CREATE TABLE和SELECT等命令。

为什么要发行多种引擎呢？因为它们具有各自不同的功能和特性，为不同的任务选择正确的引擎能获得良好的功能和灵活性。

如果省略ENGINE=语句，则使用默认引擎（很可能是MyISAM），多数SQL语句都会默认使用它。但并不是所有语句都默认使用它，这就是为什么ENGINE=语句很重要。引擎类型可以混用。

几个重要的引擎：
* InnoDB是一个可靠的事务处理引擎([详见26章](./chapter_26.md))，不支持全文本搜索；
* MEMORY在功能上等同于MyISAM，但由于数据存储在内存(不是磁盘)中，速度很快(适用于临时表)。
* MyISAM是一个性能极高的引擎，支持全文本搜索，但不支持事务处理。

## 21.2 更新表

可以使用ALTER TABLE语句更新表，但理想状态下，当表中存储数据以后，该表就不应该再被更新。**在表的设计过程中需要花费大量时间来考虑，以便后期不对该表进行大的改动。**

ALTER TABLE更改表结构需要下面的信息：
* 在ALTER TABLE之后给出要更改的表明(该表必须存在，否则将出错)；
* 更改列表；

```SQL
MariaDB [testdatabase]> ALTER TABLE vendors ADD vend_phone CHAR(20);
```

该语句给vendors表增加一个名为vend_phone的列，必须明确其数据类型。

ALTER TABLE的一种常见用途是定义外键：

```SQL
MariaDB [testdatabase]> ALTER TABLE orderitems ADD CONSTRAINT fk_orderitems_orders FOREIGN KEY (order_num) REFERENCES orders (order_num);

MariaDB [testdatabase]> ALTER TABLE orderitems ADD CONSTRAINT fk_orderitems_products FOREIGN KEY (prod_id) REFERENCES products (prod_id);

MariaDB [testdatabase]> ALTER TABLE orders ADD CONSTRAINT fk_orders_customers FOREIGN KEY (cust_id) REFERENCES customers (cust_id);

MariaDB [testdatabase]> ALTER TABLE products ADD CONSTRAINT fk_products_vendors FOREIGN KEY (vend_id) REFERENCES vendors (vend_id);
```

复杂的表结构更改一半需要手动删除，设计以下步骤：
* 用新的列布局创建一个新表；
* 使用INSERT SELECT语句从旧表复制数据到新表。如果有必要，可使用转换函数和计算字段；
* 检验包含所需数据的新表；
* 重命名旧表(如果确定，可以删除它)；
* 用旧表原来的名字重命名新表；
* 根据需要，重新创建触发器、存储过程、索引和外键。

**小心使用ALTER TABLE** 使用ALTER TABLE要极为小心，应该在进行改动前做一个完整的备份（模式和数据的备份）。数据库表的更改不能撤销，如果增加了不需要的列，可能不能删除它们。类似地，如果删除了不应该删除的列，可能会丢失该列中的所有数据。

## 21.3 删除表

删除表(删除整个表而不是删除表中的内容)非常简单，使用DROP TABLE语句即可：`DROP TABLE customers2;`。

## 21.4 重命名表

RENAME TABLE语句可以重命名一个表：`RENAME TABLE customers2 TO customers;`。

RENAME TABLE所作的仅是重命名一个表。可以使用下面的语句对多个表重命名：

```SQL
MariaDB [testdatabase]> RENAME TABLE backup_customers TO customers, backup_vendors TO vendors, backup_products TO products;
```

