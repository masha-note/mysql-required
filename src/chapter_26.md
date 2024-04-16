# 26 管理事务处理

## 26.1 事务处理

事务处理(transaction processing)是一种机制，用来管理必须成批执行测MySQL操作。事务处理可以用来维护数据库的完整性，它保证成批的MySQl操作完全执行或者完全不执行。

关于事务处理的术语：
* 事务(transaction)指一组SQL语句；
* 回退(rollback)指撤销指定SQL语句的过程；
* 提交(commit)指将为存储的SQL语句结果写入数据库表；
* 保留点(savepoint)指事务处理中设置的临时占位符(placeholder)，可以对保留点发布回退(与回退整个事务处理不同)。

## 26.2 控制事务处理

管理事务处理的关键在于将SQL语句组分解为逻辑块，并明确规定数据何时应该回退。`START TRANSACTION`用来标识事务的开始。

### 26.2.1 使用ROLLBACK

ROLLBACK命令用来回退(撤销)MySQL语句。ROLLBACK只能在一个事务处理内使用(在START TRANSACTION执行之后)。

```SQL
SELECT * FROM ordertotals;
START TRANSACTION;
DELETE FROM ordertotals;
SELECT * FROM ordertotals;
ROLLBACK;
SELECT * FROM ordertotals;
```

**哪些语句可以回退：** 事务处理用来管理INSERT、UPDATE和DELETE语句。SELECT无法回退(也没有意义)，CREATE和DROP也不能回退。事务处理中可以使用CREATE和DROP，但如果执行回退，它们不会被撤销。

### 26.2.2 使用COMMIT

一般的MySQL语句都是直接针对数据库表执行和编写的。这就是所谓的隐含提交(implicit commit)，即提交(写或保存)操作是自动进行的。

事务处理块中，提交不会隐含地进行，要使用COMMIT明确提交：

```SQL
START TRANSACTION;
DELETE FROM orderitems WHERE order_num=20010;
DELETE FROM orders WHERE order_num=20010;
COMMIT;
```

20010项有两张表相关联，使用事务处理来删除确保没有残留。最后的COMMIT语句确保仅在不出错时写入更改。如果第一条DELETE成功而第二条DELETE失败，则DELETE不会提交(实际上是被自动撤销)。(撤销后最后修改时间之类的属性会不会改变？)

**隐含事务关闭：** 当COMMIT或ROLLBACK语句执行后，事务会自动关闭(将来的更改会隐含提交)。

### 26.2.3 使用保留点

简单的ROLLBACK和COMMIT无法支撑更复杂的事务处理，这时候就需要用到部分提交或回退。

为了支持回退部分事务处理，必须在事务处理块中合适的位置放置占位符。这样，如果需要回退就可以回退到某个占位符。这些占位符称为保留点。使用`SAVEPOINT <占位符名称>;`创建占位符。创建后就可以用`ROLLBACK TO <保留点名称>;`回退到该保留点。

**保留点越多越好：** 可以在MySQL代码中设置任意多的保留点，越多的保留点能确保越灵活的回退。

**释放保留点：** 保留点在事务处理完成(执行ROLLBACK或COMMIT)后自动释放。MySQL5后也可以用RELEASE SAVEPOINT明确地释放保留点。

### 26.2.4 更改默认的提交行为

autocommit标志位决定是否自动提交，该标志是针对每个连接而不是服务器的。`SET autocommit=0;`可以取消MySQL默认的自动提交。
