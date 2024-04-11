# 22 使用视图

## 22.1 视图

视图是虚拟的表。与包含数据的表不一样，视图只包含使用时动态检索数据的查询。

### 22.1.1 为什么使用视图

常见应用：
* 重用SQL语句。
* 简化复杂的SQL操作。在编写查询后，可以方便地重用它而不必知道它的基本查询细节。
* 使用表的组成部分而不是整个表。
* 保护数据。可以给用户授予表的特定部分的访问权限而不是整个表的访问权限。
* 更改数据格式和表示。视图可返回与底层表的表示和格式不同的数据。

在视图创建之后可以用与表基本相同的方式利用它们。视图仅仅是用来查看存储在别处的数据的一种设施。视图本身不包含数据，因此它们返回的数据是从其他表中检索出来的。再添加或更改这些表中的数据时，视图将返回改变过的数据。

**性能问题** 因为视图不包含数据，所以每次使用视图的时候，都必须处理查询执行时所需的任一个检索。如果用多个联结和过滤创建了复杂的视图或者嵌套了视图，可能会发现性能下降得很厉害。因此，在部署使用了大量视图的应用前，应该进行测试。

### 22.1.2 视图的规则和限制

常见的规则和限制：
* 与表名一样，视图必须唯一命名；
* 对于可以创建的视图数目没有限制；
* 视图可以嵌套，即可以用一个视图来创建另外一个视图；
* ORDER BY可以用在视图中，但是如果创建视图的检索(源)中也使用了ORDER BY，视图(源)中的ORDER BY将被覆盖。
* 视图不能索引，也不能有关联的触发器或默认值
* 视图可以和表一起使用。

## 22.2 使用视图

视图的创建：
* 用CREATE VIEW语句来创建视图；
* 使用 `SHOW CREATE VIEW viewname;` 来查看创建视图的语句；
* 使用DROP删除视图，其语法为 `DROP VIEW viewname;`。
* 更新视图时，可以先用DROP再用CREATE，也可以直接使用 `CREATE OR REPLACE VIEW`。如果要更新的视图不存在，则 `CREATE OR REPLACE VIEW` 会创建一个视图，否则替换原视图。

### 22.2.1 利用视图简化复杂的联结

视图最常见的应用之一是隐藏复杂的SQL：

```SQL
MariaDB [testdatabase]> CREATE VIEW productcustomers AS SELECT cust_name,cust_contact,prod_id FROM customers,orders,orderitems WHERE customers.cust_id=orders.cust_id AND orderitems.order_num=orders.order_num;
Query OK, 0 rows affected (0.007 sec)

MariaDB [testdatabase]> SELECT cust_name,cust_contact FROM productcustomers WHERE prod_id='TNT2';
+----------------+--------------+
| cust_name      | cust_contact |
+----------------+--------------+
| Coyote Inc.    | Y Lee        |
| Yosemite Place | Y Sam        |
+----------------+--------------+
2 rows in set (0.001 sec)
```

**创建可重用的视图** 创建不受特定数据限制的视图是一种好办法。扩展视图的范围不仅使得它能被重用，而且甚至更有用。这样做不需要创建和维护多个类似视图。

### 22.2.2 用视图重新格式化检索出来的数据

视图的另一种常见用途是重新格式化检索出来的数据。

```SQL
MariaDB [testdatabase]> SELECT Concat(Rtrim(vend_name), ' (', RTrim(vend_country), ')') AS vend_title FROM vendors ORDER BY vend_name;
+-------------------------+
| vend_title              |
+-------------------------+
| ACME (USA)              |
| Anvils R Us (USA)       |
| Furball Inc. (USA)      |
| Jet Set (England)       |
| Jouets Et Ours (France) |
| LT Supplies (USA)       |
+-------------------------+
6 rows in set (0.001 sec)

MariaDB [testdatabase]> CREATE VIEW vendorlocations AS SELECT Concat(RTrim(vend_name), '(', RTrim(vend_country), ')') AS vend_title FROM vendors ORDER BY vend_name;
Query OK, 0 rows affected (0.006 sec)

MariaDB [testdatabase]> SELECT * FROM vendorlocations;
+------------------------+
| vend_title             |
+------------------------+
| ACME(USA)              |
| Anvils R Us(USA)       |
| Furball Inc.(USA)      |
| Jet Set(England)       |
| Jouets Et Ours(France) |
| LT Supplies(USA)       |
+------------------------+
6 rows in set (0.001 sec)
```

### 22.2.3 用视图过滤不想要的数据

可以用视图过滤掉那些不需要的或者无效的数据(比如说没有值，NULL)。

**WHERE子句与WHERE子句** 如果从视图检索数据时使用了一条WHERE子句，则两组子句（一组在视图中，另一组是传递给视图的）将自动组合。 

### 22.2.4 使用视图与计算字段

创建每个结果的计算视图然后通过WHERE对视图进行筛选。

例子太长了，意思就是有商品、价格、数目构成的表，由所有的价格*数目构建视图，使用的时候只需筛选商品，不用再写计算的表达式了。

### 22.2.5 更新视图

通常视图是可更新的(即可以使用INSERT、UPDATE和DELETE)，而这会影响到作为数据源的表(视图本身没有数据)。也就是说对视图增加或删除行，实际上是对其基表增加或删除行。

如果MySQL不能**正确地确定被更新的源数据**，则不允许更新（包括插入和删除）。这实际上意味着，如果视图定义中有以下操作，则不能进行视图的更新：
* 分组(使用GROUP BY和HAVING)；
* 联结；
* 子查询；
* 并；
* 聚集函数；
* DISTINCT；
* 计算列

**将视图用于检索** 一般，应该将视图用于检索（SELECT语句）而不用于更新（INSERT、UPDATE和DELETE）。


