# 外键约束

以下内容来自[MySQL官方文档](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html)。

在MySQL的SQL语句后加上`\G`，表示将查询结果进行按列打印，可以使每个字段打印到单独的行。即将查到的结构旋转90度变成纵向。

MySQL支持外键(foreign key)和外键约束(foreign key constraint)。外键允许跨表数据的交叉引用，外键约束维持外键所建立的引用关系。

一对外键关系包含*一个含有初始列的父表*和一个子表，子表中的一列引用父表中的初始列。外键约束在子表中定义。

在`CREATE TABLE`或`ALTER TABLE`中定义外键约束，定义语法如下：

```SQL
[CONSTRAINT [symbol]] FOREIGN KEY
    [index_name] (col_name, ...)
    REFERENCES tbl_name (col_name, ...)
    [ON DELETE reference_option]
    [ON UPDATE reference_option]

reference_option:
    RESTRICT | CASCADE | SET NULL | NO ACTION | SET DEFAULT
```

外键约束的用法：

- [标识符](#标识符)
- [条件和限制](#条件和限制)
- [参考操作](#参考操作)
- [外键约束示例](#外键约束示例)
- [添加外键约束](#添加外键约束)
- [删除外键约束](#删除外键约束)
- [外键核查](#外键核查)
- [锁定](#锁定)
- [外键定义和元数据](#外键定义和元数据)
- [外键错误](#外键错误)

## <div id="标识符">标识符</div>

外键约束的命名按下列规则管理：

- 如果给出了`CONSTRAINT <symbol>`子句，那么使用语句中定义的名字。

- 如果没有定义`CONSTRAINT <symbol>`子句或者`CONSTRAINT`后没给出`symbol`，那么约束名会自动生成。

    在MySQL 8.0.16之前，InnoDB和NDB引擎使用`FOREIGN_KEY index_name`(如果有定义)。MySQL 8.0.16后的更高版本会忽略`FOREIGN_KEY index_name`。

- `CONSTRAINT <symbol>`定义的值必须是database中唯一的，重复的值会引发类似的错误：

    ```SQL
    ERROR 1005 (HY000): Can't create table 'test.fk1' (errno: 121).
    ```

- NDB集群使用的外键名大小写和它们定义的时候一样。`8.0.20`版本之前，在处理SELECT和其他SQL语句的时候，如果系统变量`lower_case_table_names`为0，NDB对比执行语句中的外键名和存储的大小写敏感的外键名。`8.0.20`和之后的版本，该系统变量会被忽略，所有的比较都是忽略大小写的(Bug #30512043)。

`FOREIGN KEY ... REFERENCES`子句中的表和列的标识符可以被`` ` ``囊括。`ANSI_QUOTES`SQL模式开启的时候，`"`也可以起到相同的作用。这些同样考虑到了`lower_case_table_names`变量的影响。

## <div id="条件和限制">条件和限制</div>

外键约束有以下的条件和限制：

- 父表和子表必须使用相同的存储引擎，且不能是临时表。

- 创建外键约束需要有父表的`REFERENCES`权限。

- 外键和其引用的列必须是相似的数据类型。大小，符号，精度必须是一样的，比如`INTEGER`和`DECIMAL`。如果是`string`类型，则长度不必一致，但它们的字符集和排序规则需要一致。

- MySQL支持外键引用同一张表中的其他列(外键不允许引用自己)。这种情况下，"child table record"指的是同表中的依赖记录。

- MySQl要求外键和其引用列创建索引从而避免在外键检查的时候检索全表，以此提高外键检查的速度。In the referencing table, there must be an index where the foreign key columns are listed as the first columns in the same order(这句没明白，需要仔细研究下索引)。这样的索引如果不存在就会被自动创建。如果创建了另外一个可以用于维持外键约束的索引，那么这个自动创建的索引会自动删掉。如果指定了index_name，将会按照[标识符](#标识符)中的规则生效。

- InnoDB允许外键引用任意索引了的一个或者一组列。However, in the referenced table, there must be an index where the referenced columns are the first columns in the same order(同样，这句没明白，需要仔细研究下索引)。InnoDB添加到索引中的隐藏列也在考虑范围内(参考[聚集索引和二级索引](https://dev.mysql.com/doc/refman/8.0/en/innodb-index-types.html))。

    NDB中外键所引用的列需要是显示唯一的键(或者主键)。而作为标准SQL的扩展的InnoDB不需要。

- 外键列不支持索引前缀，因此外键列不能包含`BLOB`和`TEXT`(这些列上的索引必须始终包含前缀长度)。

- InnoDB不支持在含有`user-defined partitioning`的表中建立外键和外键约束。

    此限制不适用于由KEY或LINEAR KEY(NDB存储引擎支持的唯一用户分区类型)分区的NDB表；它们可能具有外键引用，或者是此类引用的目标。

- 外键约束下的表不能改用其他的存储引擎。如果要修改，必须要先删除表上所有的外键约束。

- 外键不能引用引用虚拟创建的列。

更多细节参考[MySQL的外键实现和标准SQL的区别](https://dev.mysql.com/doc/refman/8.0/en/ansi-diff-foreign-keys.html)。

## <div id="参考操作">参考操作</div>

当`UPDATE`或`DELETE`操作影响父表中具有子表中匹配行的键值时，结果取决于`FOREIGN KEY`子句的`ON UPDATE`和`ON DELETE`子句指定的引用操作。参考操作包括:

- `CASCADE`：删除或更新父表中的行时会自动删除或更新子表中的匹配行。支持同时使用`ON DELETE CASCADE`和`ON UPDATE CASCADE`。两个表之间不要定义多个`ON UPDATE CASCADE`子句，这些子句作用于父表或子表中的同一列。

    如果在一对外键关系中的两个表上都定义了`FOREIGN KEY`子句，使两个表都成为父表和子表，则必须为两个`FOREIGN KEY`子句都定义`ON UPDATE CASCADE`或`ON DELETE CASCADE`子句，以便级联(CASCADE)操作成功。如果仅为一个`FOREIGN KEY`子句定义了`ON UPDATE CASCADE`或`ON DELETE CASCADE`子句，则级联操作将失败并报错。

    **注意**：`CASCADE`引起的列变更不会触发触发器(triggers)。

- `SET NULL`：删除或更新父表中的行，并将子表中的外键列设置为NULL。支持同时使用`ON DELETE SET NULL`和`ON UPDATE SET NULL`子句。使用前必须确认外键列没有设置`NOT NULL`。

- `RESTRICT`：拒绝父表的删除或更新操作。指定`RESTRICT`(或`NO ACTION`)等同于省略`ON DELETE`或`ON UPDATE`子句。

- `NO ACTION`：标准SQL中的关键字。在InnoDB中这相当于`RESTRICT`；如果子表中存在对应的外键值，则立即拒绝父表的删除或更新操作。NDB支持延迟检查，`NO ACTION`指定延迟检查；使用此选项时，约束检查会延迟到提交(commit)的时候才被执行。注意，这会导致使用NDB的父表和子表的外键检查都被延迟。

- `SET DEFAULT`：这个操作由MySQL解析器识别，但是InnoDB和NDB都拒绝在定义表的时候使用`ON DELETE SET DEFAULT`或`ON UPDATE SET DEFAULT`。

对于支持外键的存储引擎，如果在父表中没有匹配的候选键值，MySQL会拒绝任何试图在子表中创建外键值的`INSERT`或`UPDATE`操作。

如果不指定`ON DELETE`或`ON UPDATE`，则默认使用`NO ACTION`。

作为默认值，即便是明确指定的`ON DELETE NO ACTION`或`ON UPDATE NO ACTION`子句也不会出现在`SHOW CREATE TABLE`的输出和使用`mysqldump`转储的表中。而`RESTRICT`是等效的非默认关键字，会出现在`SHOW CREATE TABLE`输出和使用`mysqldump`转储的表中。

对于NDB表，如果引用是父表的主键(NDB中外键所引用的列需要是显示唯一的键)，则不支持`ON UPDATE CASCADE`。

从`NDB 8.0.16`开始：对于NDB表，如果子表包含`TEXT`或`BLOB`类型的列，则不支持`ON DELETE CASCADE`。(Bug #89511, Bug #27484882)

InnoDB使用深度优先搜索算法对外键约束对应的索引记录执行级联(CASCADE)操作。

被存储的生成列上的外键约束不能使用`CASCADE`、`SET NULL`或`SET DEFAULT`作为`ON UPDATE`参考操作(剩余`RESTRICT`，也就说对于子表存在的键值，不允许更新父表中对应的键值)，也不能使用`SET NULL`或`SET DEFAULT`作为`ON DELETE`的参考操作(`RESTRICT`：也就说对于子表存在的键值，不允许删除父表中对应的键值；`CASCADE`：删除父表中的键值也会同时删除子表中的所有对应键值)。

**TODO** 自理解(待验证)：被存储的生成列的外键约束中，如果父表中存在和子表相对应的键值，那么那些键值不可`UPDATE`，但可以`DELETE`(也可以限制)。

*被存储的生成列*的基列上的外键约束不能使用`CASCADE`、`SET NULL`或`SET DEFAULT`作为`ON UPDATE`或`ON DELETE`参考操作。

## <div id="外键约束示例">外键约束示例</div>

下面是一个在单个列上的建立外键关系的示例：

```SQL
MariaDB [testdatabase]> CREATE TABLE parent(
    -> id INT NOT NULL,
    -> PRIMARY KEY (id)
    -> ) ENGINE=INNODB;
Query OK, 0 rows affected (0.030 sec)

MariaDB [testdatabase]> CREATE TABLE child(
    -> id INT,
    -> parent_id INT,
    -> INDEX par_ind (parent_id),
    -> FOREIGN KEY (parent_id) REFERENCES parent(id)
    -> ON DELETE CASCADE
    -> ) ENGINE=INNODB;
Query OK, 0 rows affected (0.029 sec)
```

以下是一个更复杂的示例，其中product_order表具有另外两个表的外键。一个外键引用product表中的一个两列索引，另一个引用customer表中的单列索引：

```SQL
MariaDB [test]> CREATE TABLE product (
    -> category INT NOT NULL, id INT NOT NULL,
    -> price DECIMAL,
    -> PRIMARY KEY(category, id)
    -> ) ENGINE=INNODB;
Query OK, 0 rows affected (0.029 sec)

MariaDB [test]> CREATE TABLE customer (
    -> id INT NOT NULL,
    -> PRIMARY KEY (id)
    -> ) ENGINE=INNODB;
Query OK, 0 rows affected (0.023 sec)

MariaDB [test]> CREATE TABLE product_order (
    -> no INT NOT NULL AUTO_INCREMENT,
    -> product_category INT NOT NULL,
    -> product_id INT NOT NULL,
    -> customer_id INT NOT NULL,
    -> 
    -> PRIMARY KEY(no),
    -> INDEX (product_category, product_id),
    -> INDEX (customer_id),
    -> 
    -> FOREIGN KEY (product_category, product_id)
    -> REFERENCES product(category, id)
    -> ON UPDATE CASCADE ON DELETE RESTRICT,
    -> 
    -> FOREIGN KEY (customer_id)
    -> REFERENCES customer(id)
    -> ) ENGINE=INNODB;
Query OK, 0 rows affected (0.037 sec)
```

## <div id="添加外键约束">添加外键约束</div>

可以通过`ALTER TABLE`给一个已存在的表添加外键约束：

```SQL
ALTER TABLE tbl_name
    ADD [CONSTRAINT [symbol]] FOREIGN KEY
    [index_name] (col_name, ...)
    REFERENCES tbl_name (col_name, ...)
    [ON DELETE reference_option]
    [ON UPDATE reference_option]
```

外键可以自引用(引用同一个表)。当使用`ALTER TABLE`向表添加外键约束时，请记住首先在外键引用的列上创建索引。

## <div id="删除外键约束">删除外键约束</div>

使用`ALTER TABLE`删除外键约束：

```SQL
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol;
```

如果`FOREIGN KEY`子句在创建约束时定义了约束名称，则可以引用该名称来删除外键约束。否则要使用内部生成的约束名称。使用`SHOW CREATE TABLE`确定外键约束名称：

```SQL
MariaDB [testdatabase]> SHOW CREATE TABLE child\G
*************************** 1. row ***************************
       Table: child
Create Table: CREATE TABLE `child` (
  `id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  KEY `par_ind` (`parent_id`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
1 row in set (0.000 sec)

MariaDB [testdatabase]> ALTER TABLE child DROP FOREIGN KEY `child_ibfk_1`;
Query OK, 0 rows affected (0.008 sec)
Records: 0  Duplicates: 0  Warnings: 0

MariaDB [testdatabase]> SHOW CREATE TABLE child\G
*************************** 1. row ***************************
       Table: child
Create Table: CREATE TABLE `child` (
  `id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  KEY `par_ind` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
1 row in set (0.000 sec)
```

`ALTER TABLE ... ALGORITHM=INPLACE`支持同时有添加和删除操作，但`ALTER TABLE ... ALGORITHM=COPY`不支持。

## <div id="外键核查">外键核查</div>

在MySQL中，InnoDB和NDB表支持检查外键约束。外键检查由`foreign_key_checks`变量控制，该变量在默认情况下是启用的。通常在正常操作期间启用该变量以强制引用完整性。`foreign_key_checks`变量对NDB表和InnoDB表的作用是一样的。

`foreign_key_checks`变量是动态的，支持全局作用域和会话作用域。更多信息参考[使用系统变量](https://dev.mysql.com/doc/refman/8.0/en/using-system-variables.html)。

以下场景中通常会关闭外键检查：

- 删除由外键约束引用的表。被引用的表只有在禁用`foreign_key_checks`后才能被删除(否则需要先删除外键约束)。删除表时，表上定义的约束也会被删除。

- Reloading tables in different order than required by their foreign key relationships。例如，`mysqldump`在转储文件中生成正确的表定义，包括子表的外键约束。为了更方便地从转储文件中重新加载具有外键关系的表，`mysqldump`自动在转储输出中包含一条禁用`foreign_key_checks`的语句。这使得表能够以任何顺序导入，以防转储文件中包含外键顺序不正确的表。禁用`foreign_key_checks`还可以通过避免外键检查来加快导入操作。

- 执行`LOAD DATA`时关闭`foreign_key_checks`以禁用外键检查。

- 对具有外键关系的表执行`ALTER TABLE`操作时关闭`foreign_key_checks`。

当`foreign_key_checks`被禁用时，外键约束将被忽略，除了以下例外情况：

- 如果表定义不符合引用此表的外键约束(比如被引用列数据类型变更)，则重新创建先前被删除的表将返回错误。表必须具有正确的列名和类型。被引用得键上必须建立有索引。如果不满足这些要求， MySQL返回错误表示未形成正确的外键约束。

- 如果更改后的表的外键定义不正确，则针对此表的更改将返回错误(errno: 150)。

- 删除外键约束所需的索引。在删除索引之前，必须先删除外键约束(为什么删表不用?)。

- 在类型不匹配(不满足创建外键约束的要求)的两个列间创建外键约束。

禁用`foreign_key_checks`有这些额外效果：

- 允许删除包含*被该数据库外部的表引用*的具有外键的表的数据库。

- 启用`foreign_key_checks`不会触发对表数据的扫描，这意味着在禁用`foreign_key_checks`时添加到表中的行不会在重新启用`foreign_key_checks`后检查约束。

## <div id="锁定">锁定</div>

MySQL根据需要将元数据锁(metadata locks)扩展到与外键约束相关的表。扩展元数据锁可以防止冲突的`DML`和`DDL`操作在相关表上并发执行。此特性还允许在修改父表时更新子表外键元数据。在早期的MySQL版本中，子表拥有的外键元数据不能安全地更新。

如果用`LOCK TABLES`显式地锁定表，那么与外键约束相关的任何表都将被隐式地打开和锁定。外键检查在相关表上使用共享只读锁(`LOCK TABLES READ`)。级联(CASCADE)更新在涉及操作的相关表上使用无共享写锁(`LOCK TABLES WRITE`)。

## <div id="外键定义和元数据">外键定义和元数据</div>

可以从信息模式(Information Schema)KEY_COLUMN_USAGE表中获取外键信息。下面显示了针对该表的查询示例：

```SQL
MariaDB [testdatabase]> SHOW CREATE TABLE child\G
*************************** 1. row ***************************
       Table: child
Create Table: CREATE TABLE `child` (
  `id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  KEY `par_ind` (`parent_id`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
1 row in set (0.001 sec)

MariaDB [testdatabase]> SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME
    -> FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    -> WHERE REFERENCED_TABLE_SCHEMA IS NOT NULL;
+--------------+---------------+------------------+----------------------+
| TABLE_SCHEMA | TABLE_NAME    | COLUMN_NAME      | CONSTRAINT_NAME      |
+--------------+---------------+------------------+----------------------+
| testdatabase | child         | parent_id        | child_ibfk_1         |
+--------------+---------------+------------------+----------------------+
1 rows in set (0.012 sec)
```

InnoDB的外键信息可以从`INNODB_FOREIGN`(使用MariaDB实验的时候没发现此表，而是`INNODB_SYS_FOREIGN`)和`INNODB_FOREIGN_COLS`(使用MariaDB实验的时候没发现此表，而是`INNODB_SYS_FOREIGN_COLS`)表中获取。例如：

```SQL
MariaDB [testdatabase]> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN \G
*************************** 1. row ***************************
      ID: test/product_order_ibfk_1
FOR_NAME: test/product_order
REF_NAME: test/product
  N_COLS: 2
    TYPE: 4
*************************** 2. row ***************************
      ID: test/product_order_ibfk_2
FOR_NAME: test/product_order
REF_NAME: test/customer
  N_COLS: 1
    TYPE: 0
*************************** 3. row ***************************
      ID: testdatabase/child_ibfk_1
FOR_NAME: testdatabase/child
REF_NAME: testdatabase/parent
  N_COLS: 1
    TYPE: 1
*************************** 4. row ***************************
      ID: testdatabase/fk_orderitems_orders
FOR_NAME: testdatabase/orderitems
REF_NAME: testdatabase/orders
  N_COLS: 1
    TYPE: 0
*************************** 5. row ***************************
      ID: testdatabase/fk_orders_customers
FOR_NAME: testdatabase/orders
REF_NAME: testdatabase/customers
  N_COLS: 1
    TYPE: 0
*************************** 6. row ***************************
      ID: testdatabase/fk_products_vendors
FOR_NAME: testdatabase/products
REF_NAME: testdatabase/vendors
  N_COLS: 1
    TYPE: 0
6 rows in set (0.000 sec)
```

## <div id="外键错误">外键错误</div>

在涉及InnoDB表的外键错误(通常是MySQL服务器的error 150)的情况下，可以通过查看`SHOW ENGINE INNODB STATUS`输出来获取最新的外键错误信息。

```SQL
MariaDB [testdatabase]> SHOW ENGINE INNODB STATUS\G
......
------------------------
LATEST FOREIGN KEY ERROR
------------------------
2024-04-07 21:57:11 0x7f71cc2fa700 Error in foreign key constraint creation for table `testdatabase`.`#sql-170a53_4b6e`.
A foreign key constraint of name `testdatabase`.`fk_orderitems_orders`
already exists. (Note that internally InnoDB adds 'databasename'
in front of the user-defined constraint name.)
Note that InnoDB’s FOREIGN KEY system tables store
constraint names as case-insensitive, with the
MySQL standard latin1_swedish_ci collation. If you
create tables or databases whose names differ only in
the character case, then collisions in constraint
names can occur. Workaround: name your constraints
explicitly with unique names.
......

1 row in set (0.001 sec)
```

**Warning**

如果用户拥有所有父表的表级权限，则外键操作的`ER_NO_REFERENCED_ROW_2`和`ER_ROW_IS_REFERENCED_2`错误消息会暴露父表的信息。如果用户没有所有父表的表级权限，则会显示更通用的错误消息(`ER_NO_REFERENCED_ROW`和`ER_ROW_IS_REFERENCED`)。

一个例外是定义了以`DEFINER`权限执行的存储过程中，权限评估的对象是`DEFINER`子句中的指定的用户而不是调用者。如果该用户具有表级父表权限，则仍然显示父表信息。在这种情况下，存储程序创建者应该通过包含适当的条件处理程序来隐藏信息。
