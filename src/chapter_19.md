# 19 插入数据

## 19.1 数据插入

INSERT用来插入(或添加)行到数据库表的。插入可以用几种方式使用：
* 插入完整的行；
* 插入行的一部分；
* 插入多行；
* 插入某些查询的结果。

**插入及系统安全** 可针对每个表或每个用户，利用MySQl的安全机制禁止使用INSERT语句。

## 19.2 插入完整的行

指定表名和被插入到新行中的值

```SQL
MariaDB [testdatabase]> INSERT INTO Customers VALUES(NULL, 'Pep E. LaPew', '100 Main Street', 'Los Angeles', 'CA', '90046', 'USA', NULL, NULL);
```

**没有输出** INSERT语句一半不会产生输出。

如果某列没有值，应该使用NULL值(如果允许的话)。各个列必须以它们在表定义中出现的次序填充。

虽然这种语法很简单，但并不安全，应该尽量避免使用。上面的SQL语句高度依赖于表中列的定义次序，并且还依赖于其次序容易获得的信息。即使可得到这种次序信息，也不能保证下一次表结构变动后各个列保持完全相同的次序。

这是更安全的一种做法：

```SQL
INSERT INTO customers(cust_id, cust_name) VALUES(10001, 'Coyote Inc.');
```

在表名后的括号里明确地给出了列名。在插入行时，MySQL将用VALUES列表中的相应值填入列表中的对应项。其优点是，即使表的结构改变，此INSERT语句仍然能正确工作。而且未指定的列不用填NULL。

**省略列** 如果表的定义允许，则可以在INSERT操作中省略某些列。省略的列必须满足以下某个条件。
* 该列定义为允许NULL值（无值或空值）。
* 在表定义中给出默认值。这表示如果不给出值，将使用默认值。 

如果对表中不允许NULL值且没有默认值的列不给出值，则MySQL将产生一条错误消息，并且相应的行插入不成功。

**提高整体性能** 数据库经常被多个客户访问，对处理什么请求以及用什么次序处理进行管理是MySQL的任务。INSERT操作可能很耗时（特别是有很多索引需要更新时），而且它可能降低等待处理的SELECT语句的性能。

如果数据检索是最重要的（通常是这样），则你可以通过在INSERT和INTO之间添加关键字LOW_PRIORITY，指示MySQL降低INSERT语句的优先级，如 `INSERT LOW_PRIORITY INTO` 。这同样适用于 `UPDATE` 和 `DELETE` 语句。

## 19.3 插入多个行

可以多次INSERT来插入多条数据。但更建议组合INSERT(性能更好)。

```SQL
INSERT INTO customers(cust_name,cust_address,cust_city,cust_state,cust_zip,cust_country) VALUES('Pep E. LaPew','100 Main Street','Los Angeles','CA','90046','USA'),('M. Martian','42 Galaxy Way','New York','NY','11213','USA');
Query OK, 2 rows affected (0.005 sec)
Records: 2  Duplicates: 0  Warnings: 0
```

其中单条INSERT语句有多组值，每组值用一对圆括号括起来，用逗号分隔。

## 19.4 插入检索出的数据

INSERT一般用来给表插入一个指定列值的行。但是，INSERT还存在另一种形式，可以利用它将一条SELECT语句的结果插入表中。这就是所谓的INSERT SELECT，顾名思义，它是由一条INSERT语句和一条SELECT语句组成的。

```SQL
MariaDB [testdatabase]> INSERT INTO customers(cust_id,cust_contact) SELECT cust_id,cust_contact FROM custnew;
```

这个例子使用INSERT SELECT从custnew中将所有数据导入customers。SELECT语句从custnew检索出要插入的值，而不是列出它们。

**INSERT SELECT中的列名** 为简单起见，这个例子在INSERT和SELECT语句中使用了相同的列名。但是，不一定要求列名匹配。事实上，MySQL甚至不关心SELECT返回的列名。它使用的是列的位置，因此SELECT中的第一列（不管其列名）将用来填充表列中指定的第一个列，第二列将用来填充表列中指定的第二个列，如此等等。这对于从使用不同列名的表中导入数据是非常有用的。

INSERT SELECT中SELECT语句可包含WHERE子句以过滤插入的数据。



