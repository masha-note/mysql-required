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

# 23.3.3 删除存储过程

存储过程在创建之后，被保存在服务器上以供使用，直至被删除。可使用`DROP PROCEDURE productpricing;`。这条语句删除刚创建的存储过程。这里并没有使用`()`，只给出存储过程。

**仅当存在时删除** 如果指定的过程不存在，则DROP PROCEDURE将产生一个错误。当过程存在想删除它时(如果过程不存在也不产生错误)可使用`DROP PROCEDURE IF EXISTS`。

