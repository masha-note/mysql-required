# 12 汇总数据

## 12.1 聚集函数

**聚集函数** 运行在行组上，计算和返回单个值的函数

| 函数 | 说明 |
| :---: | :---: |
| AVG() | 返回某列的平均值 |
| COUNT() | 返回某列的行数 |
| MAX() | 返回某列的最大值 |
| MIN() | 返回某列的最小值 |
| SUM() | 返回某列的值之和 |

### 12.1.1 AVG函数

**只用于单个列**  AVG()只能用来确定特定数值列的平均值，而且列名必须作为函数参数给出。为了获得多个列的平均值，必须使用多个AVG()函数。

**NULL值**  AVG()函数忽略列值为NULL的行。

### 12.1.2 COUNT函数

COUNT函数有两种使用方式：
* 使用COUNT(*)对表中行的数目进行计数，不管表列中包含的是空值（NULL）还是非空值。
* 使用COUNT(column)对特定列中具有值的行进行计数，忽略NULL值。

### 12.1.3 MAX函数

**对非数值数据使用MAX()**  虽然MAX()一般用来找出最大的数值或日期值，但MySQL允许将它用来返回任意列中的最大值，包括返回文本列中的最大值。在用于文本数据时，如果数据按相应的列排序，则MAX()返回最后一行。

**NULL值**  MAX()函数忽略列值为NULL的行。

### 12.1.4 MIN函数

**对非数值数据使用MIN()**  MIN()函数与MAX()函数类似，MySQL允许将它用来返回任意列中的最小值，包括返回文本列中的最小值。在用于文本数据时，如果数据按相应的列排序，则MIN()返回最前面的行。

**NULL值**  MAX()函数忽略列值为NULL的行。

### 12.1.5 SUM函数

**NULL值**  SUM()函数忽略列值为NULL的行。

```SQL
MariaDB [testdatabase]> SELECT * FROM tasks;
+----+-----------------+--------+-------+---------+-------------+--------+
| Id | Name            | Result | Fault | Correct | Description | Parent |
+----+-----------------+--------+-------+---------+-------------+--------+
|  1 | db_create_test  |      1 |     1 |       0 | NULL        |        |
|  2 | db_create_test1 |      1 |     0 |       1 |             | NULL   |
|  3 | db_create_test2 |      0 |     1 |       0 | NULL        | NULL   |
|  4 | fake_case_1     |      1 |     0 |       0 |             |        |
|  5 | create_test12   |      1 |     2 |       0 | NULL        | NULL   |
+----+-----------------+--------+-------+---------+-------------+--------+
5 rows in set (0.000 sec)

MariaDB [testdatabase]> SELECT SUM(result*fault) FROM tasks;
+-------------------+
| SUM(result*fault) |
+-------------------+
|                 3 |
+-------------------+
1 row in set (0.001 sec)
```

## 12.2 聚集不同值

**以上5个聚集函数都可以做如下使用**
* 对所有的行执行计算，指定ALL参数或不给参数（因为ALL是默认行为）；
* 只包含不同的值，指定*DISTINCT*参数。

```SQL
MariaDB [testdatabase]> SELECT * FROM tasks;
+----+-----------------+--------+-------+---------+-------------+--------+
| Id | Name            | Result | Fault | Correct | Description | Parent |
+----+-----------------+--------+-------+---------+-------------+--------+
|  1 | db_create_test  |      1 |     1 |       0 | NULL        |        |
|  2 | db_create_test1 |      1 |     0 |       1 |             | NULL   |
|  3 | db_create_test2 |      0 |     1 |       0 | NULL        | NULL   |
|  4 | fake_case_1     |      1 |     0 |       0 |             |        |
|  5 | create_test12   |      1 |     2 |       0 | NULL        | NULL   |
+----+-----------------+--------+-------+---------+-------------+--------+
5 rows in set (0.001 sec)

MariaDB [testdatabase]> SELECT SUM(result) FROM tasks;
+-------------+
| SUM(result) |
+-------------+
|           4 |
+-------------+
1 row in set (0.000 sec)

MariaDB [testdatabase]> SELECT SUM(DISTINCT result) FROM tasks;
+----------------------+
| SUM(DISTINCT result) |
+----------------------+
|                    1 |
+----------------------+
1 row in set (0.001 sec)
```

DISTINCT不能用于COUNT(*)，因此不允许使用COUNT（DISTINCT），否则会产生错误。类似地，DISTINCT必须使用列名，不能用于计算或表达式。
