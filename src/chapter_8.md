# 8 用通配符进行过滤

## 8.1 LIKE操作符

**通配符（wildcard）** 用来匹配值的一部分的特殊字符。

**搜索模式（search pattern）** 由字面值、通配符或两者组合构成的搜索条件。

### 8.1.1 百分号(%)通配符

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

MariaDB [testdatabase]> SELECT id, name FROM tasks WHERE name LIKE "%1";
+----+-----------------+
| id | name            |
+----+-----------------+
|  2 | db_create_test1 |
+----+-----------------+
1 row in set (0.000 sec)
```

此例子使用了搜索模式'%1'。在执行这条子句时，将检索任意以1结尾的词。%告诉MySQL接受1之前的任意字符，不管它有多少字符。  

**区分大小写** 根据MySQL的配置方式，搜索可以是区分大小写的。如果区分大小写，'jet%'与JetPack将不匹配。

要注意到，除了一个或多个字符外，%还能匹配0个字符。%代表搜索模式中给定位置的0个、1个或多个字符。

**注意NULL** 虽然似乎%通配符可以匹配任何东西，但有一个例外，即NULL。即使是WHERE prod_name LIKE '%'也不能匹配用值NULL作为产品名的行。

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

MariaDB [testdatabase]> SELECT id, name FROM tasks WHERE description LIKE "%";
+----+-----------------+
| id | name            |
+----+-----------------+
|  2 | db_create_test1 |
+----+-----------------+
1 row in set (0.000 sec)
```

### 8.1.2 下划线(_)通配符

下划线的用途与%一样，但下划线只匹配单个字符而不是多个字符。

与%能匹配0个字符不一样，_总是匹配一个字符，不能多也不能少。

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

MariaDB [testdatabase]> SELECT id, name FROM tasks WHERE name LIKE "%test_";
+----+-----------------+
| id | name            |
+----+-----------------+
|  2 | db_create_test1 |
|  3 | db_create_test2 |
+----+-----------------+
2 rows in set (0.001 sec)
```

## 8.2 使用通配符的技巧

正如所见，MySQL的通配符很有用。但这种功能是有代价的：通配符搜索的处理一般要比前面讨论的其他搜索所花时间更长。这里给出一些使用通配符要记住的技巧。
* 不要过度使用通配符。***如果其他操作符能达到相同的目的，应该使用其他操作符***。 
* 在确实需要使用通配符时，除非绝对有必要，否则***不要把它们用在搜索模式的开始处***。把通配符置于搜索模式的开始处，搜索起来是最慢的。 
* 仔细注意通配符的位置。如果放错地方，可能不会返回想要的数据。  
