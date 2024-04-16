# 7 数据过滤

## 7.1 组合WHERE子句

为了进行更强的过滤控制，MySQL允许给出多个WHERE子句。这些子句可以两种方式使用：以AND子句的方式或OR子句的方式使用。

**操作符（operator）** 用来联结或改变WHERE子句中的子句的关键字。也称为逻辑操作符（logical operator）。

### 7.1.1 AND操作符

```SQL
MariaDB [testdatabase]> SELECT * FROM tasks WHERE description is NULL AND parent is NULL;
+----+-----------------+--------+-------+---------+-------------+--------+
| Id | Name            | Result | Fault | Correct | Description | Parent |
+----+-----------------+--------+-------+---------+-------------+--------+
|  3 | db_create_test2 |      0 |     1 |       0 | NULL        | NULL   |
+----+-----------------+--------+-------+---------+-------------+--------+
1 row in set (0.000 sec)
```

**AND** 用在WHERE子句中的关键字，用来指示检索*满足所有给定条件的行*。可以添加多个过滤条件，每添加一条就要使用一个AND。

### 7.1.2 OR操作符

```SQL
MariaDB [testdatabase]> SELECT * FROM tasks WHERE description="" OR parent="";
+----+-----------------+--------+-------+---------+-------------+--------+
| Id | Name            | Result | Fault | Correct | Description | Parent |
+----+-----------------+--------+-------+---------+-------------+--------+
|  1 | db_create_test  |      1 |     1 |       0 | NULL        |        |
|  2 | db_create_test1 |      1 |     0 |       1 |             | NULL   |
+----+-----------------+--------+-------+---------+-------------+--------+
2 rows in set (0.000 sec)
```

**OR** WHERE子句中使用的关键字，用来表示检索匹配任一给定条件的行。

### 7.1.3 计算次序

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

MariaDB [testdatabase]> SELECT * FROM tasks WHERE id=1 OR id=3 AND description IS NOT NULL;
+----+----------------+--------+-------+---------+-------------+--------+
| Id | Name           | Result | Fault | Correct | Description | Parent |
+----+----------------+--------+-------+---------+-------------+--------+
|  1 | db_create_test |      1 |     1 |       0 | NULL        |        |
+----+----------------+--------+-------+---------+-------------+--------+
1 row in set (0.000 sec)
```

上面的结果，AND指定了description不是NULL，但输出的description是NULL。如果先计算OR，应该得到id=1和id=3两行，然后计算AND，description非NULL，两行都不满足。这是因为***SQL（像多数语言一样）在处理OR操作符前，优先处理AND操作符***。

为了使运算按照预期，我们可以使用括号来分组操作符。

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

MariaDB [testdatabase]> SELECT * FROM tasks WHERE (id=1 OR id=3) AND description IS NOT NULL;
Empty set (0.000 sec)
```

**在WHERE子句中使用圆括号** 任何时候使用具有AND和OR操作符的WHERE子句，都应该使用圆括号明确地分组操作符。不要过分依赖默认计算次序，即使它确实是你想要的东西也是如此。使用圆括号没有什么坏处，它能消除歧义。

## 7.2 IN操作符

```SQL
MariaDB [testdatabase]> SELECT * FROM tasks WHERE id IN (1,3);
+----+-----------------+--------+-------+---------+-------------+--------+
| Id | Name            | Result | Fault | Correct | Description | Parent |
+----+-----------------+--------+-------+---------+-------------+--------+
|  1 | db_create_test  |      1 |     1 |       0 | NULL        |        |
|  3 | db_create_test2 |      0 |     1 |       0 | NULL        | NULL   |
+----+-----------------+--------+-------+---------+-------------+--------+
2 rows in set (0.000 sec)
```

**IN：** WHERE子句中用来指定要匹配值的清单的关键字，功能与OR相当。优点: 
  * 在使用长的合法选项清单时，IN操作符的语法更清楚且更直观；
  * 在使用IN时，计算的次序更容易管理（因为使用的操作符更少）；
  * IN操作符一般比OR操作符清单执行更快；
  * 可以包含其他SELECT语句，使得WHERE子句的建立更加灵活。

## 7.3 NOT操作符

**NOT** WHERE子句中用来否定后跟条件的关键字。

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

MariaDB [testdatabase]> SELECT * FROM tasks WHERE description IS NOT NULL;
+----+-----------------+--------+-------+---------+-------------+--------+
| Id | Name            | Result | Fault | Correct | Description | Parent |
+----+-----------------+--------+-------+---------+-------------+--------+
|  2 | db_create_test1 |      1 |     0 |       1 |             | NULL   |
+----+-----------------+--------+-------+---------+-------------+--------+
1 row in set (0.000 sec)
```

**为什么使用NOT?** 对于简单的WHERE子句，使用NOT确实没有什么优势。但在更复杂的子句中，NOT是非常有用的。例如，在与IN操作符联合使用时，NOT使找出与条件列表不匹配的行非常简单。

**MySQL中的NOT** MySQL支持使用NOT对IN、BETWEEN和EXISTS子句取反，这与多数其他DBMS允许使用NOT对各种条件取反有很大的差别。