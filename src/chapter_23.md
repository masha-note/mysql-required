# 23 使用存储过程

## 23.1 存储过程

存储过程简单来说就是为以后的使用而保存的一条或多条MySQL语句的集合。可将其视为皮文件，虽然它们的作用不仅限于批处理。

## 23.2 为什么要使用存储过程

封装处理，简化操作。

保证数据完整性，防止错误。因为存储过程在多次的使用中执行的是相同的代码。

简化管理。如果数据结构有变更，那么管理人员只需要变更存储过程，使用人员不需要知道有哪些变化。

提高性能，使用存储过程比使用单独的SQL语句更快。

存在一些只能用在单个请求中的MySQL元素和特性，存储过程可以使用它们来编写功能更强更灵活的代码。

总结一下就是**简单、安全、高性能。**

## 23.3 使用存储过程

存储过程的执行远比其定义更经常遇到，因此先从执行存储过程开始介绍。

### 23.3.1 执行存储过程

MySQL称存储过程的执行为调用，因此MySQL执行过程的语句为CALL。CALL接受存储过程的名字以及需要传递给它的任意参数。

如`CALL productpricing(@pricelow, @pricehigh, @priceaverage);`，存储过程可以显示结果，也可以不显示。

### 23.3.2 创建存储过程

这是一个返回产品平均价格的存储过程：

```SQL
MariaDB [testdatabase]> CREATE PROCEDURE productpricing()
BEGIN
    SELECT Avg(prod_price) AS priceaverage FROM products;
END;
```

此存储过程名为productpricing，用`CREATE PROCEDURE productpricing()`语句定义。如果存储过程接受参数，它们将在`()`中列举出来。此存储过程没有参数，但后跟的`()`仍然需要。`BEGIN`和`END`语句用来限定存储过程体，过程体本身仅是一个简单的SELECT语句。

在MySQL处理这段代码时，它创建一个新的存储过程productpricing。没有返回数据，因为这段代码并未调用存储过程，这里只是为以后使用而创建它。

**mysql命令行客户机的分隔符** 默认的MySQL语句分隔符为`;`。mysql命令行实用程序也使用`;`作为语句分隔符。如果命令行实用程序要解释存储过程自身内的`;`字符，则它们最终不会成为存储过程的成分，这会使存储过程中的SQL出现句法错误。解决办法是临时更改命令行实用程序的语句分隔符，如下所示:

```SQL
DELIMITER //

CREATE PROCEDURE productpricing()
BEGIN
    SELECT Avg(prod_price) AS priceaverage FROM products;
END //

DELIMITER;
```

其中，`DELIMITER //`告诉命令行实用程序使用`//`作为新的语句结束分隔符，可以看到标志存储过程结束的END定义为`END //`而不是`END;`。这样，存储过程体内的;仍然保持不动，并且正确地传递给数据库引擎。最后，为恢复为原来的语句分隔符，可使用`DELIMITER;`。

除`\`符号外，任何字符都可以用作语句分隔符。

```SQL
MariaDB [testdatabase]> CALL productpricing();
+--------------+
| priceaverage |
+--------------+
|    16.133571 |
+--------------+
1 rows in set (0.001 sec)
```

`CALL productpricing();`执行创建的存储过程并返回结果。因为存储过程实际上是一种函数，所以存储过程后需要有`()`符号(即使不传递参数也需要)。

### 23.3.3 删除存储过程

存储过程在创建之后，被保存在服务器上以供使用，直至被删除。可使用`DROP PROCEDURE productpricing;`。这条语句删除刚创建的存储过程。这里并没有使用`()`，只给出存储过程。

**仅当存在时删除** 如果指定的过程不存在，则DROP PROCEDURE将产生一个错误。当过程存在想删除它时(如果过程不存在也不产生错误)可使用`DROP PROCEDURE IF EXISTS`。

### 23.3.4 使用参数

productpricing只是一个简单的存储过程，它简单地显示SELECT语句的结果。一般，存储过程并不显示结果，而是把结果返回给你指定的变量。

**变量(variable)** 内存中一个特定的位置，用来临时存储数据。

```SQL
MariaDB [testdatabase]> DELIMITER //
MariaDB [testdatabase]>
MariaDB [testdatabase]> CREATE PROCEDURE productpricing(
    ->     OUT pl DECIMAL(8, 2),
    ->     OUT ph DECIMAL(8, 2),
    ->     OUT pa DECIMAL(8, 2)
    -> )
    -> BEGIN
    ->     SELECT Min(prod_price)
    ->     INTO pl
    ->     FROM products;
    ->     SELECT Max(prod_price)
    ->     INTO ph
    ->     FROM products;
    ->     SELECT Avg(prod_price)
    ->     INTO pa
    ->     FROM products;
    -> END //
Query OK, 0 rows affected (0.001 sec)

MariaDB [testdatabase]> 
MariaDB [testdatabase]> DELIMITER ;
```

此存储过程接受3个参数：pl存储产品最低价格，ph存储产品最高价格，pa存储产品平均价格。

关键字OUT指出相应的参数用来`从存储过程传出一个值（返回给调用者）`。

MySQL支持IN（传递给存储过程）、OUT（从存储过程传出，如这里所用）和INOUT（对存储过程传入和传出）类型的参数。

存储过程的代码位于BEGIN和END语句内，如前所见，它们是一系列SELECT语句，用来检索值，然后保存到相应的变量（通过指定INTO关键字）。 

**参数的数据类型** 存储过程的参数允许的数据类型与表中使用的数据类型相同。注意，记录集不是允许的类型，因此，不能通过一个参数返回多个行和列。

为调用此修改的存储过程，必须指定3个变量名，如

```SQL
MariaDB [testdatabase]> CALL productpricing(@pricelow, @pricehigh, @priceaverage);
Query OK, 3 rows affected, 1 warning (0.001 sec)
```

由于此存储过程要求3个参数，因此必须正好传递3个参数。

**变量名** 所有MySQl变量都必须以@开始。

在调用时，这条语句并不显示任何数据。他返回以后可以显示的变量，为了显示检索出的产品平均价格，可如下进行：

```SQL
MariaDB [testdatabase]> SELECT @priceaverage;
+---------------+
| @priceaverage |
+---------------+
|         16.13 |
+---------------+
1 row in set (0.000 sec)

MariaDB [testdatabase]> SELECT @priceaverage, @pricelow, @priceaverage;
+---------------+-----------+---------------+
| @priceaverage | @pricelow | @priceaverage |
+---------------+-----------+---------------+
|         16.13 |      2.50 |         16.13 |
+---------------+-----------+---------------+
1 row in set (0.000 sec)
```

下面是另外一个例子，使用IN和OUT参数。ordertotal接受订单号并返回该订单的合计：

```SQL
MariaDB [testdatabase]> DELIMITER //
MariaDB [testdatabase]> 
MariaDB [testdatabase]> CREATE PROCEDURE ordertotal(
    ->     IN onumber INT,
    ->     OUT ototal DECIMAL(8, 2)
    -> )
    -> BEGIN
    -> SELECT Sum(item_price*quantity) FROM orderitems WHERE order_num=onumber INTO ototal;
    -> END //
Query OK, 0 rows affected (0.006 sec)

MariaDB [testdatabase]> 
MariaDB [testdatabase]> DELIMITER ;
```

onumber定义为IN，因此订单号被传入存储过程。ototal定义为OUT，因为要从存储过程返回合计。使用方法如下：

```SQL
MariaDB [testdatabase]> CALL ordertotal(20005, @total);
Query OK, 1 row affected (0.001 sec)

MariaDB [testdatabase]> SELECT @total;
+--------+
| @total |
+--------+
| 149.87 |
+--------+
1 row in set (0.000 sec)
```

### 23.3.5 建立智能存储过程

在存储过程内包含业务规则和智能处理

```SQL
-- Name: ordertotal
-- Parameters:  onumber = order number
--              taxable = 0 if not taxable, 1 if taxable
--              ototal  = order totoal variable

CREATE PROCEDURE ordertotal(
    IN onumber INT,
    IN taxable BOOLEAN,
    OUT ototal DECIMAL(8,2)
) COMMENT 'Obtain order total, optinally adding tax'
BEGIN
    -- Declare variable for total
    DECLARE total DECIMAL(8,2);
    -- Declare tax percentage
    DECLARE taxrate INT DEFAULT 6;

    -- Get the order total
    SELECT Sum(item_price*quantity) FROM orderitems WHERE order_num=onumber INTO total;

    -- Is this taxable?
    IF taxable THEN
        -- Yes, so add taxable to the total
        SELECT total+(total/100*taxrate) INTO total;
    END IF;

    -- And finally, save to out variable
    SELECT total INTO ototal;
END;
```

此存储过程增加了注释(前面放置`--`)。

DECLARE语句定义局部变量，DECLARE要求指定变量名和数据类型，也支持可选的默认值

IF语句检查taxable是否为真，如果为真，则用另一SELECT语句增加营业税到局部变量total。

**COMMENT关键字** 本例子中的存储过程在CREATE PROCEDURE语句中包含了一个COMMENT值。它不是必需的，但如果给出，将在`SHOW PROCEDURE STATUS`的结果中显示。

**IF语句** 这个例子给出了MySQL的IF语句的基本用法。IF语句还支持ELSEIF和ELSE子句（前者还使用THEN子句，后者不使用）。

### 23.3.6 检查存储过程

为显示用来创建一个存储过程的CREATE语句，使用`SHOW CREATE PROCEDURE <procedure名称>;`语句。

使用`SHOW PROCEDURE STATUS`获得包括何时、由谁创建等详细信息的存储过程列表。

**限制过程状态结果** `SHOW PROCEDURE STATUS`列出所有存储过程。为限制其输出，可使用LIKE指定一个过滤模式，例如：`SHOW PROCEDURE STATUS LIKE 'ordertotal';`。


