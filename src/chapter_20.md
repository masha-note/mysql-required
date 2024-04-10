# 20 更新和删除数据

## 20.1 更新数据

使用UPDATE更新数据表中的数据有两种方式：
* 更新表中特定行
* 更新表中所有行

**不要省略**`WHERE`**子句** 不带WHERE会更新表中所有的行。

基本的UPDATE语句由3部分组成：
* 要更新的表；
* 列名和它们的新值；
* 确定要更新行的过滤条件。

```SQL
MariaDB [testdatabase]> UPDATE customers SET cust_name='The Fudds', cust_email='elmer@fudd.com' WHERE cust_id=10005;
```

在更新多个列时，只需要使用单个SET命令，每个“列=值”对之间用逗号分隔。

**在UPDATE语句中使用子查询** UPDATE语句中可以使用子查询，使得能用SELECT语句检索出的数据更新列数据。

**IGNORE关键字** 如果用UPDATE语句更新多行，并且在更新这些行中的一行或多行时出现一个错误，则整个UPDATE操作被取消(没有任何修改被执行)。如果要让错误发生后操作继续执行，可使用IGNORE关键字，如 `UPDATE IGNORE customers ...`。

## 20.2 删除数据

使用DELETE语句从表中删除数据有两种方式：
* 从表中删除特定的行
* 从表中删除所有行

**不要省略**`WHERE`**子句** 不带WHERE会删除表中所有的行。

```SQL
MariaDB [testdatabase]> DELETE FROM customers WHERE cust_id=10006;
```

DELETE删除的是数据行(不能用来删除表)，因此不需要列名或者通配符。

**更快的删除** 如果想从表中删除所有行，不要使用DELETE。可以使用 `TRUNCATE TABLE` 语句，他完成相同的工作，但速度更快(TRUNCATE TABLE实际是删除原来的表并重新创建一个表，而不是逐行删除表中的数据)。

## 20.3 更新和删除的指导原则

下面是一些DELETE和UPDATE时建议养成的好习惯：
* 除非确实打算更新和删除每一行，否则绝对不要使用不带WHERE子句的UPDATE或DELETE语句。
* 保证每个表都有主键（如果忘记这个内容，请参阅第15章），尽可能像WHERE子句那样使用它（可以指定各主键、多个值或值的范围）。
* 在对UPDATE或DELETE语句使用WHERE子句前，应该先用SELECT进行测试，保证它过滤的是正确的记录，以防编写的WHERE子句不正确。
* 本人尚未理解：使用强制实施引用完整性的数据库（关于这个内容，请参阅第15章），这样MySQL将不允许删除具有与其他表相关联的数据的行。
