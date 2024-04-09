# 4 检索数据

## 4.1 SELECT语句

SQL语句是由简单的英语单词构成的。这些单词称为关键字，每个SQL语句都是由一个或多个关键字构成的。大概，最经常使用的SQL语句就是SELECT语句了。它的用途是从一个或多个表中检索信息。

为了使用SELECT检索表数据，必须至少给出两条信息——想选择什么，以及从什么地方选择。

## 4.2 检索单个列

```SQL
MariaDB [mysql]> SELECT user FROM user;
+-------+
| user  |
+-------+
| masha |
| root  |
| masha |
| root  |
+-------+
```

如果未经指定，返回的数据是未排序的。

**结束SQL语句** 多条SQL语句必须以分号（;）分隔。MySQL如同多数DBMS一样，不需要在单条SQL语句后加分号。但特定的DBMS可能必须在单条SQL语句后加上分号。当然，如果愿意可以总是加上分号。事实上，即使不一定需要，但加上分号肯定没有坏处。如果你使用的是mysql命令行，必须加上分号来结束SQL语句。

## 4.3 检索多个列

```SQL
MariaDB [mysql]> SELECT user, host FROM user;
+-------+-----------+
| user  | host      |
+-------+-----------+
| masha | %         |
| root  | %         |
| masha | localhost |
| root  | localhost |
+-------+-----------+
```  

## 4.4 检索所有列

```SQL
MariaDB [testdatabase]> SELECT * FROM tasks;
+----+-----------------+--------+-------+---------+-------------+--------+
| Id | Name            | Result | Fault | Correct | Description | Parent |
+----+-----------------+--------+-------+---------+-------------+--------+
|  1 | db_create_test  |      1 |     0 |       0 | NULL        | NULL   |
|  2 | db_create_test1 |      1 |     0 |       0 |             |        |
+----+-----------------+--------+-------+---------+-------------+--------+
```

**使用通配符**  一般，除非你确实需要表中的每个列，否则最好别使用*通配符。虽然使用通配符可能会使你自己省事，不用明确列出所需列，但检索不需要的列通常会降低检索和应用程序的性能。

**检索未知列**  使用通配符有一个大优点。由于不明确指定列名（因为星号检索每个列），所以能检索出名字未知的列。

## 4.5 检索不同的行

```SQL
MariaDB [mysql]> SELECT DISTINCT user FROM user;
+-------+
| user  |
+-------+
| masha |
| root  |
+-------+
```

使用DISTINCT关键字指示MySQL只返回不同的值。

**不能部分使用DISTINCT** DISTINCT关键字应用于所有列而不仅是前置它的列。如果给出SELECT DISTINCT vend_id, prod_price，除非指定的两个列都不同，否则所有行都将被检索出来。

## 4.6 限制结果

```SQL
MariaDB [testdatabase]> SELECT Id FROM tasks;
+----+
| Id |
+----+
|  1 |
|  2 |
+----+
2 rows in set (0.000 sec)

MariaDB [testdatabase]> SELECT Id FROM tasks LIMIT 1;
+----+
| Id |
+----+
|  1 |
+----+
1 row in set (0.000 sec)

MariaDB [testdatabase]> SELECT Id FROM tasks LIMIT 1,1;
+----+
| Id |
+----+
|  2 |
+----+
1 row in set (0.000 sec)

MariaDB [testdatabase]> SELECT Id FROM tasks LIMIT 1,5;
+----+
| Id |
+----+
|  2 |
+----+
1 row in set (0.000 sec)

MariaDB [testdatabase]> SELECT Id FROM tasks LIMIT 5 OFFSET 1;
+----+
| Id |
+----+
|  2 |
+----+
1 row in set (0.000 sec)
```

带一个值的LIMIT总是从第一行开始，给出的数为返回的行数。

带两个值的LIMIT可以指定从行号为第一个值的位置开始。

**行0** 检索出来的第一行为行0而不是行1。因此，LIMIT 1, 1将检索出第二行而不是第一行。

**在行数不够时** LIMIT中指定要检索的行数为检索的最大行数。如果没有足够的行（例如，给出LIMIT 1, 5，但只有2行），MySQL将只返回它能返回的那么多行。

由于LIMIT的这个原因，MySQL 5支持LIMIT的另一种替代语法。LIMIT 4 OFFSET 3意为从行3开始取4行，就像LIMIT 3, 4一样。

## 4.7 使用完全限定的表名

使用完全限定的名字来引用列（同时使用表名和列字）。

```SQL
MariaDB [testdatabase]> SELECT tasks.Name FROM tasks;
+-----------------+
| Name            |
+-----------------+
| db_create_test  |
| db_create_test1 |
+-----------------+
2 rows in set (0.000 sec)
```

表名也可以是完全限定的

```SQL
MariaDB [testdatabase]> SELECT tasks.Name FROM tasks;
+-----------------+
| Name            |
+-----------------+
| db_create_test  |
| db_create_test1 |
+-----------------+
2 rows in set (0.000 sec)
```
