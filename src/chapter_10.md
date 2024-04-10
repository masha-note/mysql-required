# 10 创建计算字段

## 10.1 计算字段

**字段（field）** 基本上与列（column）的意思相同，经常互换使用，不过数据库列一般称为列，而术语字段通常用在计算字段的连接上。

**客户机与服务器的格式**  可在SQL语句内完成的许多转换和格式化工作都可以直接在客户机应用程序内完成。但一般来说，在数据库服务器上完成这些操作比在客户机中完成要快得多，因为DBMS是设计来快速有效地完成这种处理的。

## 10.2 拼接字段

在MySQL的SELECT语句中，可使用Concat()函数来拼接两个列。

**拼接（concatenate）** 将值联结到一起构成单个值。

**MySQL的不同之处**  多数DBMS使用+或||来实现拼接，MySQL则使用Concat()函数来实现。当把SQL语句转换成MySQL语句时一定要把这个区别铭记在心。

```SQL
MariaDB [testdatabase]> SELECT * FROM vendors;
+-----------+---------------+
| name      | location      |
+-----------+---------------+
| alphabet  | mountain view |
| amazon    | seattle       |
| amd       | california    |
| apple     | california    |
| intel     | california    |
| meta      | california    |
| microsoft | washington    |
| nvidia    | california    |
| tesla     | california    |
+-----------+---------------+
9 rows in set (0.001 sec)

MariaDB [testdatabase]> SELECT Concat(name, ' (', location, ')') FROM vendors ORDER BY name;
+-----------------------------------+
| Concat(name, ' (', location, ')') |
+-----------------------------------+
| alphabet (mountain view)          |
| amazon (seattle)                  |
| amd (california)                  |
| apple (california)                |
| intel (california)                |
| meta (california)                 |
| microsoft (washington)            |
| nvidia (california)               |
| tesla (california)                |
+-----------------------------------+
9 rows in set (0.000 sec)
```

**Concat()拼接串**，即把多个串连接起来形成一个较长的串。Concat()需要一个或多个指定的串，各个串之间用逗号分隔。上面的SELECT语句连接以下4个元素成一个列：
* 存储在name列中的名字
* 包含一个空格和一个左圆括号的串
* 存储在location列中的位置
* 包含一个右圆括号的串

**Trim函数**  MySQL除了支持RTrim()（正如刚才所见，它去掉串右边的空格），还支持LTrim()（去掉串左边的空格）以及Trim()（去掉串左右两边的空格）。

```SQL
MariaDB [testdatabase]> SELECT * FROM vendors;
+-----------+---------------+
| name      | location      |
+-----------+---------------+
| alphabet  | mountain view |
| amazon    | seattle       |
| amd       | california    |
| apple     | california    |
| intel     | california    |
| meta      | california    |
| microsoft | washington    |
| nvidia    | california    |
| tesla     | california    |
+-----------+---------------+
9 rows in set (0.001 sec)

MariaDB [testdatabase]> SELECT Concat(name, LTrim(' ('), location, ')') FROM vendors ORDER BY name;
+------------------------------------------+
| Concat(name, LTrim(' ('), location, ')') |
+------------------------------------------+
| alphabet(mountain view)                  |
| amazon(seattle)                          |
| amd(california)                          |
| apple(california)                        |
| intel(california)                        |
| meta(california)                         |
| microsoft(washington)                    |
| nvidia(california)                       |
| tesla(california)                        |
+------------------------------------------+
9 rows in set (0.001 sec)
```

**使用别名**

```SQL
MariaDB [testdatabase]> SELECT * FROM vendors;
+-----------+---------------+
| name      | location      |
+-----------+---------------+
| alphabet  | mountain view |
| amazon    | seattle       |
| amd       | california    |
| apple     | california    |
| intel     | california    |
| meta      | california    |
| microsoft | washington    |
| nvidia    | california    |
| tesla     | california    |
+-----------+---------------+
9 rows in set (0.000 sec)

MariaDB [testdatabase]> SELECT Concat(name,' (',location,')') AS vend_title FROM vendors;
+--------------------------+
| vend_title               |
+--------------------------+
| alphabet (mountain view) |
| amazon (seattle)         |
| amd (california)         |
| apple (california)       |
| intel (california)       |
| meta (california)        |
| microsoft (washington)   |
| nvidia (california)      |
| tesla (california)       |
+--------------------------+
9 rows in set (0.001 sec)
```

**别名的其他用途**  别名还有其他用途。常见的用途包括在实际的表列名包含不符合规定的字符（如空格）时重新命名它，在原来的名字含混或容易误解时扩充它，等等。

**导出列**  别名有时也称为导出列（derived column），不管称为什么，它们所代表的都是相同的东西。

## 10.3 执行算术计算

```SQL
MariaDB [testdatabase]> SELECT * FROM orders;
+---------+----------+------------+
| prod_id | quantity | item_price |
+---------+----------+------------+
| ANV01   |       10 |       5.99 |
| ANV02   |        3 |       9.99 |
| FB      |        1 |         10 |
| YNT2    |        5 |         10 |
+---------+----------+------------+
4 rows in set (0.001 sec)

MariaDB [testdatabase]> SELECT prod_id,quantity,item_price,quantity*item_price AS expand_price FROM orders;
+---------+----------+------------+--------------------+
| prod_id | quantity | item_price | expand_price       |
+---------+----------+------------+--------------------+
| ANV01   |       10 |       5.99 |  59.89999771118164 |
| ANV02   |        3 |       9.99 | 29.969999313354492 |
| FB      |        1 |         10 |                 10 |
| YNT2    |        5 |         10 |                 50 |
+---------+----------+------------+--------------------+
4 rows in set (0.001 sec)
```
**MySql的float存在精度问题** 浮点数在计算机中的内部表示方式是使用有限的二进制位数进行近似存储的。由于浮点数的精度是有限的，当我们进行一些复杂的计算时，可能会导小数部分的精度损失。

**解决方法**

* 使用DECIMAL类型：DECIMAL(8,2)指定了存储8位数字，小数部分保留2位

    ```SQL
    MariaDB [testdatabase]> DESCRIBE orders;
    +------------+--------------+------+-----+---------+-------+
    | Field      | Type         | Null | Key | Default | Extra |
    +------------+--------------+------+-----+---------+-------+
    | prod_id    | varchar(50)  | NO   | PRI | NULL    |       |
    | quantity   | int(11)      | NO   |     | NULL    |       |
    | item_price | decimal(8,2) | NO   |     | NULL    |       |
    +------------+--------------+------+-----+---------+-------+
    3 rows in set (0.002 sec)

    MariaDB [testdatabase]> SELECT prod_id,quantity,item_price,quantity*item_price AS expand_price FROM orders;
    +---------+----------+------------+--------------+
    | prod_id | quantity | item_price | expand_price |
    +---------+----------+------------+--------------+
    | ANV01   |       10 |       5.99 |        59.90 |
    | ANV02   |        3 |       9.99 |        29.97 |
    | FB      |        1 |      10.00 |        10.00 |
    | YNT2    |        5 |      10.00 |        50.00 |
    +---------+----------+------------+--------------+
    4 rows in set (0.001 sec)
    ```

* 使用ROUND函数：ROUND函数可以将计算结果四舍五入到指定的精度
    
    ```SQL
    MariaDB [testdatabase]> DESCRIBE orders;
    +------------+-------------+------+-----+---------+-------+
    | Field      | Type        | Null | Key | Default | Extra |
    +------------+-------------+------+-----+---------+-------+
    | prod_id    | varchar(50) | NO   | PRI | NULL    |       |
    | quantity   | int(11)     | NO   |     | NULL    |       |
    | item_price | float       | NO   |     | NULL    |       |
    +------------+-------------+------+-----+---------+-------+
    3 rows in set (0.001 sec)

    MariaDB [testdatabase]> SELECT prod_id,quantity,item_price,ROUND(quantity*item_price,2) AS expand_price FROM orders;
    +---------+----------+------------+--------------+
    | prod_id | quantity | item_price | expand_price |
    +---------+----------+------------+--------------+
    | ANV01   |       10 |       5.99 |        59.90 |
    | ANV02   |        3 |       9.99 |        29.97 |
    | FB      |        1 |         10 |        10.00 |
    | YNT2    |        5 |         10 |        50.00 |
    +---------+----------+------------+--------------+
    4 rows in set (0.000 sec)
    ```

* 使用CAST函数：CAST将一个值转换为指定的数据类型。

    ```SQL
    MariaDB [testdatabase]> DESCRIBE orders;
    +------------+-------------+------+-----+---------+-------+
    | Field      | Type        | Null | Key | Default | Extra |
    +------------+-------------+------+-----+---------+-------+
    | prod_id    | varchar(50) | NO   | PRI | NULL    |       |
    | quantity   | int(11)     | NO   |     | NULL    |       |
    | item_price | float       | NO   |     | NULL    |       |
    +------------+-------------+------+-----+---------+-------+
    3 rows in set (0.001 sec)

    MariaDB [testdatabase]> SELECT prod_id,quantity,item_price,CAST(quantity*item_price AS DECIMAL(8,2)) AS expand_price FROM orders;
    +---------+----------+------------+--------------+
    | prod_id | quantity | item_price | expand_price |
    +---------+----------+------------+--------------+
    | ANV01   |       10 |       5.99 |        59.90 |
    | ANV02   |        3 |       9.99 |        29.97 |
    | FB      |        1 |         10 |        10.00 |
    | YNT2    |        5 |         10 |        50.00 |
    +---------+----------+------------+--------------+
    4 rows in set (0.001 sec)
    ```