# 外键约束

以下内容来自[MySQL官方文档](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html)。

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
## <div id="添加外键约束">添加外键约束</div>
## <div id="删除外键约束">删除外键约束</div>
## <div id="外键核查">外键核查</div>
## <div id="锁定">锁定</div>
## <div id="外键定义和元数据">外键定义和元数据</div>
## <div id="外键错误">外键错误</div>