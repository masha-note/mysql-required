# 13 数据分组

## 13.2 创建分组

分组是在SELECT语句的GROUP BY子句中建立的。

```SQL
MariaDB [testdatabase]> SELECT * FROM products;
+----+-----------+---------+
| id | vend_name | product |
+----+-----------+---------+
|  1 | apple     | macbook |
|  2 | apple     | ipad    |
|  3 | apple     | iphone  |
|  4 | microsoft | surface |
|  5 | microsoft | windows |
|  6 | google    | gemini  |
+----+-----------+---------+
6 rows in set (0.001 sec)

MariaDB [testdatabase]> SELECT vend_name,COUNT(*) AS num_products FROM products GROUP BY vend_name;
+-----------+--------------+
| vend_name | num_products |
+-----------+--------------+
| apple     |            3 |
| google    |            1 |
| microsoft |            2 |
+-----------+--------------+
3 rows in set (0.001 sec)
```

在具体使用GROUP BY子句前，需要知道一些重要的规定
* GROUP BY子句可以包含任意数目的列。这使得能对分组进行嵌套，为数据分组提供更细致的控制。
* 如果在GROUP BY子句中嵌套了分组，数据将在最后规定的分组上进行汇总。换句话说，在建立分组时，指定的所有列都一起计算（所以不能从个别的列取回数据）。
* GROUP BY子句中列出的每个列都必须是检索列或有效的表达式（但不能是聚集函数）。如果在SELECT中使用表达式，则必须在GROUP BY子句中指定相同的表达式。不能使用别名。 
* GROUP BY子句必须出现在WHERE子句之后，ORDER BY子句之前。

```SQL
MariaDB [testdatabase]> SELECT * FROM products;
+----+-----------+---------+
| id | vend_name | product |
+----+-----------+---------+
|  1 | apple     | macbook |
|  2 | apple     | ipad    |
|  3 | apple     | iphone  |
|  4 | microsoft | surface |
|  5 | microsoft | windows |
|  6 | google    | gemini  |
|  7 | google    | NULL    |
+----+-----------+---------+
7 rows in set (0.001 sec)

MariaDB [testdatabase]> SELECT vend_name,COUNT(*) AS num_products FROM products GROUP BY vend_name;
+-----------+--------------+
| vend_name | num_products |
+-----------+--------------+
| apple     |            3 |
| google    |            2 |
| microsoft |            2 |
+-----------+--------------+
3 rows in set (0.001 sec)

MariaDB [testdatabase]> SELECT vend_name,COUNT(*) AS num_products FROM products GROUP BY vend_name WITH ROLLUP;
+-----------+--------------+
| vend_name | num_products |
+-----------+--------------+
| apple     |            3 |
| google    |            2 |
| microsoft |            2 |
| NULL      |            7 |
+-----------+--------------+
4 rows in set (0.001 sec)
```  

## 13.3 过滤分组

**HAVING支持所有WHERE操作符** 在第6章和第7章中，我们学习了WHERE子句的条件（包括通配符条件和带多个操作符的子句）。所学过的有关WHERE的所有这些技术和选项都适用于HAVING。它们的句法是相同的，只是关键字有差别。

```SQL
MariaDB [testdatabase]> SELECT vend_name,COUNT(*) AS num_products FROM products GROUP BY vend_name;
+-----------+--------------+
| vend_name | num_products |
+-----------+--------------+
| apple     |            3 |
| google    |            2 |
| microsoft |            2 |
+-----------+--------------+
3 rows in set (0.000 sec)

MariaDB [testdatabase]> SELECT vend_name,COUNT(*) AS num_products FROM products GROUP BY vend_name HAVING COUNT(*)>2;
+-----------+--------------+
| vend_name | num_products |
+-----------+--------------+
| apple     |            3 |
+-----------+--------------+
1 row in set (0.001 sec)
```

**HAVING和WHERE的差别**  这里有另一种理解方法，WHERE在数据分组前进行过滤，HAVING在数据分组后进行过滤。这是一个重要的区别，WHERE排除的行不包括在分组中。这可能会改变计算值，从而影响HAVING子句中基于这些值过滤掉的分组。  

## 13.4 分组和排序

**ORDER BY**和**GROUP BY**的区别

|ORDER BY|GROUP BY|
| :---: | :---: |
|排序产生的输出|分组行。但输出可能不是分组的顺序|
|任意列都可以使用(甚至非选择的列也可以使用)|只可能使用选择列或表达式列，而且必须使用每个选择列表达式|

**不要忘记ORDER BY**  一般在使用GROUP BY子句时，应该也给出ORDER BY子句。这是保证数据正确排序的唯一方法。千万不要仅依赖GROUP BY排序数据。

## 13.5 SELECT子句顺序

|   子句   |         说明         |      是否必须使用      |
| :------: | :------------------: | :--------------------: |
|  SELECT  | 要返回的列或者表达式 |           是           |
|   FROM   |  从中检索数据中的表  | 仅在从表选择数据时使用 |
|  WHERE   |       行级过滤       |           否           |
| GROUP BY |         分组         | 仅在按组计算聚集时使用 |
|  HAVING  |       组级过滤       |           否           |
| ORDER BY |      给输出排序      |           否           |
|  LIMIT   |     要检索的行数     |           否           |
