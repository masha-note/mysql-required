# 24 使用游标

## 24.1 游标

有时，需要在检索出来的行中前进或后退一行或多行。这就是游标的用处。

**游标（cursor）** 是一个存储在MySQL服务器上的数据库查询，它不是一条SELECT语句，而是被该语句检索出来的结果集。在存储了游标之后，应用程序可以根据需要滚动或浏览其中的数据。

游标主要用于交互式应用，其中用户需要滚动屏幕上的数据，并对数据进行浏览或做出更改。

**只能用于存储过程** 不像多数DBMS，MySQL游标只能用于存储过程（和函数）。

## 24.2 使用游标

使用游标的几个明确的步骤：
* 先声明(定义)它。这个过程实际上没有检索数据，它只是定义要使用的SELECT语句。
* 声明后，必须打开游标以供使用。这个过程用前面定义的SELECT语句吧数据实际检索出来。
* 对于填有数据的游标，根据需要取出(检索各行)。
* 在结束游标使用时，必须关闭游标。

在游标声明后，可以根据需要频繁打开和关闭。在游标打开后，可以根据需要频繁地执行取操作。

### 24.2.1 创建游标

DELCLARE命名游标并定义相应的SELECT语句，根据需要带WHERE和其他子句。

```SQL
MariaDB [testdatabase]> DELIMITER //
MariaDB [testdatabase]> CREATE PROCEDURE processorders()
    -> BEGIN
    -> DECLARE ordernumbers CURSOR FOR SELECT order_num FROM orders;
    -> END //
Query OK, 0 rows affected (0.007 sec)

MariaDB [testdatabase]> DELIMITER ;
```

DECLARE语句定义和命名游标为ordernumbers。存储过程处理完成后，游标就消失（因为它局限于存储过程）。

### 24.2.2 打开和关闭游标

用`OPEN <游标名>;`语句打开游标。用`CLOSE <游标名>;`语句关闭游标。

*在处理OPEN语句时执行查询*，存储检索出的数据以供浏览和滚动。 

*CLOSE释放游标使用的所有内部内存和资源*，因此在每个游标不再需要时都应该关闭。在一个游标关闭后，如果没有重新打开，则不能使用它。但是，使用声明过的游标不需要再次声明，用OPEN语句打开它就可以了。

**隐含关闭** 如果你不明确关闭游标，MySQL将会在到达END语句时自动关闭它。

### 24.2.3 使用游标数据

在一个游标被打开后，可以使用FETCH语句分别访问它的每一行。FETCH指定检索什么数据（所需的列），检索出来的数据存储在什么地方。它还向前移动游标中的内部行指针，使下一条FETCH语句检索下一行（不重复读取同一行）。

```SQL
CREATE PROCEDURE proicessorders()
BEGIN
    -- Declare local variables
    DECLARE done BOOLEAN DEFAULT 0;
    DECLARE o INT;

    -- Declare the cuesor
    DECLARE ordernumbers CURSOR FOR SELECT order_num FROM orders;

    -- Declare continue handler
    DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done=1;

    -- Open the cursor
    OPEN ordernumbers;

    -- Loop through all rows
    REPEAT

        -- Get order number
        FETCH ordernumbers INTO o;

    -- End of loop
    UNTIL done END REPEAT;

    -- Close the cursor
    CLOSE ordernumbers;
END;
```

FETCH检索当前order_num到声明的名为o的变量中。

FETCH在REPEAT内，因此它反复执行知道done为真(由`UNTIL done END REPEAT;`规定)。为了使它起作用，用一个DEFAULT 0定义变量done。

`DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done=1;`这条语句定义了一个`CONTINUE HANDLER`，它是在条件出现时被执行的代码。这里表示当`SQLSTATE '02000'`出现时，SET done=1。

`SQLSTATE '02000'`是一个未找到条件，当REPEAT由于没有更多行供循环而不能继续时出现这个条件。

**MySQL的错误代码** 关于MySQL 5使用的MySQL错误代码列表，请参阅[http://dev.mysql.com/doc/mysql/en/error-handling.html](http://dev.mysql.com/doc/mysql/en/error-handling.html)。

**DECLARE语句的次序** DECLARE语句的发布存在特定的次序。用DECLARE语句定义的局部变量必须在定义任意游标或句柄(HANDLER)之前定义，而句柄必须在游标之后定义。不遵守此顺序将产生错误消息。即`变量->游标->句柄`。

如果一切正常，你可以在循环内放入任意需要的处理（在FETCH语句之后，循环结束之前）。




