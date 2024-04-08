# 14 使用子查询

## 14.2 利用子查询进行过滤

SQL允许创建子查询（subquery），即嵌套在其他查询中的查询。

```SQL
MariaDB [testdatabase]> SELECT cust_id FROM orders WHERE order_num IN (SELECT order_num FROM orderitems WHERE prod_id = 'TNT2');
+-----------+
|  cust_id  |
+-----------+
|    10001  |
|    10004  |
+-----------+
2 rows in set (0.001 sec)
```

在WHERE子句中使用子查询能够编写出功能很强并且很灵活的SQL语句。对于能嵌套的子查询的数目没有限制，不过在实际使用时由于性能的限制，不能嵌套太多的子查询。

**列必须匹配**  在WHERE子句中使用子查询（如这里所示），应该保证SELECT语句具有与WHERE子句中相同数目的列。通常，子查询将返回单个列并且与单个列匹配，但如果需要也可以使用多个列。

## 14.3 作为计算字段使用子查询

```SQL
MariaDB [testdatabase]> SELECT cust_name,cust_state,(SELECT COUNT(*) FROM orders WHERE orders.cust_id = customers.cust_id) AS orders FROM customers ORDER BY cust_name;
+-----------------+------------+--------+
| cust_name       | cust_state | orders |
+-----------------+------------+--------+
| Coyote Inc.     | MI         |      2 |
| E Fudd          | IL         |      1 |
| Mouse House     | OH         |      0 |
| Wascals         | IN         |      1 |
| Yosemite Place  | AZ         |      1 |
+-----------------+------------+--------+
5 rows in set (0.001 sec)
```

子查询中的WHERE子句与前面使用的WHERE子句稍有不同，因为它使用了完全限定列名（在第4章中首次提到）。上面的语句告诉SQL比较orders表中的cust_id与当前正从customers表中检索的cust_id。

这种类型的子查询称为相关子查询。任何时候只要列名可能有多义性，就必须使用这种语法（表名和列名由一个句点分隔）。

**逐渐增加子查询来建立查询**  用子查询测试和调试查询很有技巧性，特别是在这些语句的复杂性不断增加的情况下更是如此。用子查询建立（和测试）查询的最可靠的方法是逐渐进行，这与MySQL处理它们的方法非常相同。首先，建立和测试最内层的查询。然后，用硬编码数据建立和测试外层查询，并且仅在确认它正常后才嵌入子查询。这时，再次测试它。对于要增加的每个查询，重复这些步骤。这样做仅给构造查询增加了一点点时间，但节省了以后（找出查询为什么不正常）的大量时间，并且极大地提高了查询一开始就正常工作的可能性。
