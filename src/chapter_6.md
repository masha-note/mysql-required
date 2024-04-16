# 6 过滤数据

## 6.1 使用WHERE子句

```SQL
MariaDB [testdatabase]> SELECT id, name FROM tasks WHERE fault=1;
+----+-----------------+
| id | name            |
+----+-----------------+
|  1 | db_create_test  |
|  3 | db_create_test2 |
+----+-----------------+
2 rows in set (0.000 sec)
```

**SQL过滤与应用过滤** 数据也可以在应用层过滤。为此目的，SQL的SELECT语句为客户机应用检索出超过实际所需的数据，然后客户机代码对返回数据进行循环，以提取出需要的行。

在客户机上对数据库返回的数据再进行一次处理会极大地影响应用的性能和可伸缩性，此外服务器也不得不通过网络发送更多的数据从而浪费网络带宽。因此数据库对此进行了优化。

## 6.2 WHERE子句操作符

| 操作符 | 说明 |
| :---: | :---: |
| = | 等于 |
| <> | 不等于 |
| != | 不等于 |
| < | 小于 |
| <= | 小于等于 |
| > | 大于 |
| >= | 大于等于 |
| BETWEEN | 在指定的两个值之间 |

### 6.2.1 检查单个值

```SQL
MariaDB [testdatabase]> SELECT id, name FROM tasks WHERE fault=1;
+----+-----------------+
| id | name            |
+----+-----------------+
|  1 | db_create_test  |
|  3 | db_create_test2 |
+----+-----------------+
2 rows in set (0.000 sec)

MariaDB [testdatabase]> SELECT id, name FROM tasks WHERE fault<1;
+----+-----------------+
| id | name            |
+----+-----------------+
|  2 | db_create_test1 |
+----+-----------------+
1 row in set (0.000 sec)

MariaDB [testdatabase]> SELECT id, name FROM tasks WHERE fault<=1;
+----+-----------------+
| id | name            |
+----+-----------------+
|  1 | db_create_test  |
|  2 | db_create_test1 |
|  3 | db_create_test2 |
+----+-----------------+
3 rows in set (0.000 sec)
```

### 6.2.2 不匹配检查

```SQL
MariaDB [testdatabase]> SELECT id, name FROM tasks WHERE fault<>0;
+----+-----------------+
| id | name            |
+----+-----------------+
|  1 | db_create_test  |
|  3 | db_create_test2 |
+----+-----------------+
2 rows in set (0.000 sec)

MariaDB [testdatabase]> SELECT id, name FROM tasks WHERE fault!=0;
+----+-----------------+
| id | name            |
+----+-----------------+
|  1 | db_create_test  |
|  3 | db_create_test2 |
+----+-----------------+
2 rows in set (0.000 sec)
```

### 6.2.3 范围值检查

```SQL
MariaDB [testdatabase]> SELECT id, name FROM tasks WHERE fault BETWEEN 1 AND 0;
Empty set (0.000 sec)

MariaDB [testdatabase]> SELECT id, name FROM tasks WHERE fault BETWEEN 0 AND 1;
+----+-----------------+
| id | name            |
+----+-----------------+
|  1 | db_create_test  |
|  2 | db_create_test1 |
|  3 | db_create_test2 |
+----+-----------------+
3 rows in set (0.000 sec)
```

在使用BETWEEN时，必须指定两个值——所需范围的低端值和高端值。这两个值必须用AND关键字分隔。BETWEEN匹配范围中所有的值，包括指定的开始值和结束值。

### 6.2.4 空值检查

在创建表时，表设计人员可以指定其中的列是否可以不包含值。在一个列不包含值时，称其为包含空值NULL。

**NULL** 无值（no value），它与字段包含0、空字符串或仅仅包含空格不同。

```SQL
MariaDB [testdatabase]> SELECT name, description FROM tasks WHERE description IS NULL;
+-----------------+-------------+
| name            | description |
+-----------------+-------------+
| db_create_test  | NULL        |
| db_create_test2 | NULL        |
+-----------------+-------------+
2 rows in set (0.000 sec)
```

**NULL与不匹配：** NULL具有特殊含义，使用WHERE筛选或筛除具有特定值(不是NULL)的行时，数据库不知道它们是否匹配，所以不返回带NULL的行。

因此，在过滤数据时，一定要验证返回数据中确实给出了被过滤列具有NULL的行。

```SQL
MariaDB [testdatabase]> SELECT * FROM tasks;
+----+-----------------+--------+-------+---------+-------------+--------+
| Id | Name            | Result | Fault | Correct | Description | Parent |
+----+-----------------+--------+-------+---------+-------------+--------+
|  1 | db_create_test  |      1 |     1 |       0 | NULL        |        |
|  2 | db_create_test1 |      1 |     0 |       1 |             | NULL   |
|  3 | db_create_test2 |      0 |     1 |       0 | NULL        | NULL   |
+----+-----------------+--------+-------+---------+-------------+--------+
3 rows in set (0.000 sec)

MariaDB [testdatabase]> SELECT parent FROM tasks WHERE description is not NULL;
+--------+
| parent |
+--------+
| NULL   |
+--------+
1 row in set (0.000 sec)

MariaDB [testdatabase]> SELECT parent FROM tasks WHERE description is NULL;
+--------+
| parent |
+--------+
|        |
| NULL   |
+--------+
2 rows in set (0.001 sec)
```
