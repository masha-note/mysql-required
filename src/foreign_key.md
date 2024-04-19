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
- [参照动作](#参照动作)
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
## <div id="参照动作">参照动作</div>
## <div id="外键约束示例">外键约束示例</div>
## <div id="添加外键约束">添加外键约束</div>
## <div id="删除外键约束">删除外键约束</div>
## <div id="外键核查">外键核查</div>
## <div id="锁定">锁定</div>
## <div id="外键定义和元数据">外键定义和元数据</div>
## <div id="外键错误">外键错误</div>