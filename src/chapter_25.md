# 25 使用触发器

## 25.1 触发器

触发器是MySQL响应以下任意语句而自动执行的一条MySQL语句（或位于BEGIN和END语句之间的一组语句）：
* DELETE；
* INSERT；
* UPDATE。

其他的MySQL语句不支持触发器。

# 25.2 创建触发器

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



