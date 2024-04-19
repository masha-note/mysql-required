# 9 用正则表达式进行搜索

## 9.2 使用MySQL正则表达式

MySQL仅支持多数正则表达式实现的一个很小的子集。

### 9.2.1 基本字符匹配

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

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP 'test';
+-----------------+
| name            |
+-----------------+
| db_create_test  |
| db_create_test1 |
| db_create_test2 |
+-----------------+
3 rows in set (0.027 sec)

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP 'test.';
+-----------------+
| name            |
+-----------------+
| db_create_test1 |
| db_create_test2 |
+-----------------+
2 rows in set (0.000 sec)
```

以上的功能可以由LIKE实现，正则表达式没有带来太多好处（可能还会降低性能）。

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

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP 'test';
+-----------------+
| name            |
+-----------------+
| db_create_test  |
| db_create_test1 |
| db_create_test2 |
+-----------------+
3 rows in set (0.000 sec)

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name LIKE 'test';
Empty set (0.000 sec)
```

**LIKE和REGEXP** LIKE匹配整个列。如果被匹配的文本在列值中出现，LIKE将不会找到它，相应的行也不被返回（除非使用通配符）。而REGEXP在列值内进行匹配，如果被匹配的文本在列值中出现，REGEXP将会找到它，相应的行将被返回。这是一个非常重要的差别。

REGEXP使用^和$定位符后也可以匹配整行。

**匹配不区分大小写** MySQL中的正则表达式匹配（自版本3.23.4后）不区分大小写（即，大写和小写都匹配）。为区分大小写，可使用BINARY关键字，如WHERE prod_name REGEXP BINARY 'JetPack .000'。

### 9.2.2 进行OR匹配

为搜索两个串之一（或者为这个串，或者为另一个串），使用 `|` 。

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

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP 'test1|test2';
+-----------------+
| name            |
+-----------------+
| db_create_test1 |
| db_create_test2 |
+-----------------+
2 rows in set (0.000 sec)
```

使用 `|` 从功能上类似于在SELECT语句中使用OR语句，多个OR条件可并入单个正则表达式。

**两个以上的OR条件** 可以给出两个以上的OR条件。例如，'1000 | 2000 | 3000'将匹配1000或2000或3000。

### 9.2.3 匹配几个字符之一

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

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP 'test[12]';
+-----------------+
| name            |
+-----------------+
| db_create_test1 |
| db_create_test2 |
+-----------------+
2 rows in set (0.000 sec)
```

正如所见，[]是另一种形式的OR语句。事实上，正则表达式test[12]为test[1|2]的缩写，也可以使用后者。但是，需要用[]来定义OR语句查找什么。

```SQL
MariaDB [testdatabase]> SELECT * FROM tasks;
+----+-----------------+--------+-------+---------+-------------+--------+
| Id | Name            | Result | Fault | Correct | Description | Parent |
+----+-----------------+--------+-------+---------+-------------+--------+
|  1 | db_create_test  |      1 |     1 |       0 | NULL        |        |
|  2 | db_create_test1 |      1 |     0 |       1 |             | NULL   |
|  3 | db_create_test2 |      0 |     1 |       0 | NULL        | NULL   |
|  4 | fake_case_1     |      1 |     0 |       0 |             |        |
+----+-----------------+--------+-------+---------+-------------+--------+
4 rows in set (0.001 sec)

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP 'test2|1';
+-----------------+
| name            |
+-----------------+
| db_create_test1 |
| db_create_test2 |
| fake_case_1     |
+-----------------+
3 rows in set (0.001 sec)
```

这并不是期望的输出。两个要求的行被检索出来，但还检索出了另外1行。之所以这样是由于MySQL假定你的意思是`'1'`或`'test2'`。

字符集合也可以被否定，即，它们将匹配除指定字符外的任何东西。为否定一个字符集，在集合的开始处放置一个^即可。因此，尽管`[123]`匹配字符1、2或3，但`[^123]`却匹配除这些字符外的任何东西。

### 9.2.4 匹配范围

范围不限于完整的集合，[1-3]和[6-9]也是合法的范围。此外，范围不一定只是数值的，[a-z]匹配任意字母字符。

```SQL
MariaDB [testdatabase]> SELECT * FROM tasks;
+----+-----------------+--------+-------+---------+-------------+--------+
| Id | Name            | Result | Fault | Correct | Description | Parent |
+----+-----------------+--------+-------+---------+-------------+--------+
|  1 | db_create_test  |      1 |     1 |       0 | NULL        |        |
|  2 | db_create_test1 |      1 |     0 |       1 |             | NULL   |
|  3 | db_create_test2 |      0 |     1 |       0 | NULL        | NULL   |
|  4 | fake_case_1     |      1 |     0 |       0 |             |        |
+----+-----------------+--------+-------+---------+-------------+--------+
4 rows in set (0.000 sec)

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP 'test[1-2]';
+-----------------+
| name            |
+-----------------+
| db_create_test1 |
| db_create_test2 |
+-----------------+
2 rows in set (0.000 sec)
```

### 9.2.5 匹配特殊字符

点(.)匹配任意字符，因此每个行都被检索出来。为了匹配特殊字符，必须用\\\\为前导。\\\\-表示查找-，\\\\.表示查找.。这种处理就是所谓的转义（escaping），正则表达式内具有特殊意义的所有字符都必须以这种方式转义。这包括.、|、[]以及迄今为止使用过的其他特殊字符。

空白元字符

| 元符  |   说明   |
| :---: | :------: |
| \\\\f |   换页   |
| \\\\n |   换行   |
| \\\\r |   回车   |
| \\\\t |   制表   |
| \\\\v | 纵向制表 |

**匹配\\**  为了匹配反斜杠（\）字符本身，需要使用\\\。

**\或\\\\?**  多数正则表达式实现使用单个反斜杠转义特殊字符，以便能使用这些字符本身。但MySQL要求两个反斜杠（MySQL自己解释一个，正则表达式库解释另一个）。

### 9.2.6 匹配字符类

存在找出你自己经常使用的数字、所有字母字符或所有数字字母字符等的匹配。为更方便工作，可以使用预定义的字符集称为字符类（character class）。

|类|说明|
|:---:|:---:|
|[:alnum:]|任意字母和数字（同[a-zA-Z0-9]）|
|[:alpha:]|任意字符（同[a-zA-Z]）|
|[:blank:]|空格和制表（同[\\t]）|
|[:cntrl:]|ASCII控制字符（ASCII0到31和127）|
|[:digit:]|任意数字（同[0-9]）|
|[:graph:]|与[:print:]相同，但不包括空格|
|[:lower:]|任意小写字母（同[a-z]）|
|[:print:]|任意可打印字符|
|[:punct:]|既不在[:alnum:]又不在[:cntrl:]中的任意字符|
|[:space:]|包括空格在内的任意空白字符（同[\\\\f\\\\n\\\\r\\\\t\\\\v]）|
|[:upper:]|任意大写字母（同[A-Z]）|
|[:xdigit:]|任意十六进制数字（同[a-fA-F0-9]）|

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

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP "test[[:digit:]]*";
+-----------------+
| name            |
+-----------------+
| db_create_test  |
| db_create_test1 |
| db_create_test2 |
| create_test12   |
+-----------------+
4 rows in set (0.001 sec)

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP "test[[:digit:]]+";
+-----------------+
| name            |
+-----------------+
| db_create_test1 |
| db_create_test2 |
| create_test12   |
+-----------------+
3 rows in set (0.000 sec)

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP "test[[:digit:]]?";
+-----------------+
| name            |
+-----------------+
| db_create_test  |
| db_create_test1 |
| db_create_test2 |
| create_test12   |
+-----------------+
4 rows in set (0.001 sec)
```

### 9.2.7 匹配多个实例

重复元字符

| 元字符 |            说明            |
| :----: | :------------------------: |
|   *    |       0个或多个匹配        |
|   +    |  1个或多个匹配(等于{1，})  |
|   ?    |  0个或1个匹配(等于{0，1})  |
|  {n}   |       指定数目的匹配       |
|  {n,}  |    不少于指定数目的匹配    |
| {n,m}  | 匹配数目的范围(m不超过255) |

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

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP "test[a-z0-9]*";
+-----------------+
| name            |
+-----------------+
| db_create_test  |
| db_create_test1 |
| db_create_test2 |
| create_test12   |
+-----------------+
4 rows in set (0.000 sec)

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP "test[a-z0-9]+";
+-----------------+
| name            |
+-----------------+
| db_create_test1 |
| db_create_test2 |
| create_test12   |
+-----------------+
3 rows in set (0.001 sec)

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP "test[a-z0-9]?";
+-----------------+
| name            |
+-----------------+
| db_create_test  |
| db_create_test1 |
| db_create_test2 |
| create_test12   |
+-----------------+
4 rows in set (0.001 sec)

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP "test[a-z0-9]{1}";
+-----------------+
| name            |
+-----------------+
| db_create_test1 |
| db_create_test2 |
| create_test12   |
+-----------------+
3 rows in set (0.001 sec)

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP "test[a-z0-9]{1,}";
+-----------------+
| name            |
+-----------------+
| db_create_test1 |
| db_create_test2 |
| create_test12   |
+-----------------+
3 rows in set (0.001 sec)

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP "test[a-z0-9]{2,3}";
+---------------+
| name          |
+---------------+
| create_test12 |
+---------------+
1 row in set (0.001 sec)
```

### 9.2.8 定位符

为了匹配特定位置的文本，需要使用定位符。

| 元字符  |    说明    |
| :-----: | :--------: |
|    ^    | 文本的开始 |
|    $    | 文本的结尾 |
| [[:<:]] |  词的开始  |
| [[:>:]] |  词的结尾  |

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

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP "^[a-d]{2}";
+-----------------+
| name            |
+-----------------+
| db_create_test  |
| db_create_test1 |
| db_create_test2 |
+-----------------+
3 rows in set (0.001 sec)

MariaDB [testdatabase]> SELECT name FROM tasks WHERE name REGEXP "[[:digit:]_]{2}$";
+---------------+
| name          |
+---------------+
| fake_case_1   |
| create_test12 |
+---------------+
2 rows in set (0.001 sec)
```

**^的双重用途**  ^有两种用法。在集合中（用[和]定义，也就是^出现在方括号里面的时候，表示否定），用它来否定该集合，否则，用来指串的开始处。

**使REGEXP起类似LIKE的作用**  利用定位符，通过用^开始每个表达式，用$结束每个表达式，可以使REGEXP的作用与LIKE一样。

**简单的正则表达式测试**  可以在不使用数据库表的情况下用SELECT来测试正则表达式。REGEXP检查总是返回0（没有匹配）或1（匹配）。可以用带文字串的REGEXP来测试表达式，并试验它们。相应的语法如```SELECT 'hello' REGEXP '[0-9]';```这个例子显然将返回0（因为文本hello中没有数字）。
