# 25 使用触发器

## 25.1 触发器

触发器是MySQL响应以下任意语句而自动执行的一条MySQL语句（或位于BEGIN和END语句之间的一组语句）：
* DELETE；
* INSERT；
* UPDATE。

其他的MySQL语句不支持触发器。

## 25.2 创建触发器

创建触发器时，需要给出4条信息：
* 唯一的触发器名；
* 触发器关联的表；
* 触发器应该响应的活动(DELETE、INSERT或UPDATE)；
* 触发器何时执行(处理之前或之后)。

**保持每个数据库的触发器名唯一** 截至这本书发行的时候，MySQL触发器名必须在每个表中唯一，但不是在每个数据库中唯一。这表示同一数据库中的两个表可具有相同名字的触发器。这在其他*每个数据库触发器名必须唯一*的DBMS中是不允许的，而且以后的MySQL版本很可能会使命名规则更为严格。因此，现在最好是在数据库范围内使用唯一的触发器名。

使用`CREATE TRIGGER`语句创建触发器。

```SQL
-- 该语句在8.0版本的MySQL中执行不了。待修改
MariaDB [testdatabase]> CREATE TRIGGER newproduct AFTER INSERT ON products FOR EACH ROW SELECT 'Product added';
ERROR 1415 (0A000): Not allowed to return a result set from a trigger
```

该语句在products表创建一个名为newproduct的在INSERT完成后触发的触发器，针对成功插入的每一行都会显示“Product added”。

**仅支持表** 只有表支持触发器，视图不支持(临时表也不支持)。

**触发器失败** 如果BEFORE触发器失败，则MySQL将不执行请求的操作。此外，如果BEFORE触发器或语句本身失败，MySQL 将不执行AFTER触发器(如果有的话)。

## 25.3 删除触发器

可以用`DROP TRIGGER <trigger名称>;`语句删除一个触发器。

## 25.4 使用触发器

### 25.4.1 INSERT触发器

INSERT触发器在INSERT语句执行之前或之后执行。
* 在INSERT触发器代码内，可引用一个名为NEW的虚拟表访问被将要被插入的行；
* 在BEFORE INSERT触发器中，NEW中的值也可以被更新(允许更改被插入的值)；
* 对于AUTO_INCREMENT列，NEW在INSERT执行之前包含0，在INSERT执行之后包含新的自动生成值。

AUTO_INCREMENT列具有MySQl自动赋予的值。第21章建议了几种确定新生成值得方法，但下面是一种更好得方法：

```SQL
-- 8.0可能执行不了
CREATE TRIGGER neworder AFTER INSERT ON orders FOR EACH ROW SELECT NEW.order_num;
```

**使用BEFORE还是AFTER：** BEFORE通常用于数据验证(目的是保证插入表中的数据确实是需要的数据)。

### 25.4.2 DELETE触发器

DELETE触发器在DELETE语句执行之前或之后执行。
* 在DELETE触发器代码内，可以引用一个名为OLD的虚拟表访问被删除的行；
* OLD中的值全都是只读的，不能更新。

```SQL
-- 8.0也可能执行不了
CREATE TRIGGER deleteorder BEFORE DELETE ON orders FOR EACH ROW
BEGIN
    INSERT INTO archive_orders(order_num, order_date, cust_id)
    VALUES(OLD.order_num, OLD.order_date, OLD.cust_id);
END;
```

使用BEFORE DELETE触发器的优点（相对于AFTER DELETE触发器来说）在于如果由于某种原因无法执行，DELETE本身将被放弃。

### 25.4.3 UPDATE触发器

UPDATE触发器在UPDATE语句执行之前或之后执行。
* 在UPDATE触发器代码中，你可以引用一个名为OLD的虚拟表访问以前旧值，引用一个名为NEW的虚拟表访问将要更新的值；
* 在BEFORE UPDATE触发器中，允许修改NEW虚拟表，即可以更改将要更新的内容；
* OLD中的值全都是只读的，不能更新。

```SQL
-- 8.0也可能执行不了
CREATE TRIGGER updatevendor BEFORE UPDATE ON vendors FOR EACH ROW SET NEW.vend_state=Upper(NEW.vend_state);
```

### 25.4.4 关于触发器的进一步介绍

最新的更详细的内容参考[官方的文档](https://dev.mysql.com/doc/refman/8.0/en/triggers.html)。

书中版本的MySQL触发器中不支持CALL语句，不能从触发器内调用存储过程。
