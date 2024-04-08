# 18 全文本搜索

## 18.1 理解全文本搜索

并非所有引擎都支持全文本搜索，MySQL支持几种基本的数据库引擎。并非所有的引擎都支持全文本搜索。两个最常使用的引擎为MyISAM和InnoDB，前者支持全文本搜索，而后者不支持。

LIKE通过统配操作匹配文本，通过LIKE能查找包含特殊值或部分值的行。

虽然这些搜索机制很有用，但存在几个重要的限制
* 性能——通配符和正则表达式匹配通常要求MySQL尝试匹配表中所有行(而且这些搜索极少使用表索引)。因此，由于被搜索行数不断增加，这些搜索可能非常耗时。
* 明确控制——使用通配符和正则表达式匹配，很难(而且并不总是能)明确地控制匹配什么和不匹配什么。
* 智能化结果——虽然基于通配符和正则表达式的搜索提供了非常灵活的搜索，但他们都不能提供一种智能化的选择结果的方法。

所有这些限制以及更多的限制都可以使用全文本搜索来解决。在使用全文本搜索的时候，MySQL不需要分别查看每个行，不需要分别分析和处理每个词。MySQL创建指定列中各词的一个索引，搜索可以针对这些词进行。这样，MySQL可以快速有效地决定哪些词匹配(哪些行包含它们)，哪些词不匹配，它的匹配频率等。

## 18.2 使用全文本搜索

为了使用全文本搜索，必须索引被搜索的列，而且要随着数据的改变不断底重新索引。在对表列进行适当的设计后，MySQL会自动进行所有列的索引和重新索引。

在索引后，SELECT可以Match()和Against()一起使用来实际执行搜索。

### 18.2.1 启用全文本搜索支持

一般在创建表的时候启用全文本搜索。CREATE TABLE语句接受FULLTEXT子句，它给出被索引列的一个都好分隔的列表。

```SQL
CREATE TABLE productnotes
(
  note_id    int           NOT NULL AUTO_INCREMENT,
  prod_id    char(10)      NOT NULL,
  note_date datetime       NOT NULL,
  note_text  text          NULL ,
  PRIMARY KEY(note_id),
  FULLTEXT(note_text)
) ENGINE=MyISAM;
```

在定义之后，MySQL自动维护该索引。在增加、更新或删除行的时候索引随之更新。

可以在创建表时指定FULLTEXT，或者在稍后指定(在这种情况下所有已有的数据必须立刻索引)。

**不要在导入数据时使用FULLTEXT** 更新索引要花时间，虽然不是很多，但毕竟要花时间。如果正在导入数据到一个新表，此时不应该启用FULLTEXT索引。应该首先导入所有数据，然后再修改表，定义FULLTEXT。这样有助于更快地导入数据(而且使索引数据的总时间小于在导入每行时分别进行索引所需的总时间)。

### 18.2.2 进行全文本搜索

在索引之后，使用两个函数Match()和Against()执行全文本搜索，其中Match()指定被搜索的列，Against()指定要使用的搜索表达式。

```SQL
MariaDB [testdatabase]> SELECT note_text FROM productnotes WHERE Match(note_text) Against('rabbit');
+----------------------------------------------------------------------------------------------------------------------+
| note_text                                                                                                            |
+----------------------------------------------------------------------------------------------------------------------+
| Customer complaint: rabbit has been able to detect trap, food apparently less effective now.                         |
| Quantity varies, sold by the sack load.
All guaranteed to be bright and orange, and suitable for use as rabbit bait. |
+----------------------------------------------------------------------------------------------------------------------+
2 rows in set (0.000 sec)
```

**使用完整的Match()说明** 传递给Match()的值必须与FULLTEXT()定义中的相同。如果指定多个列，则必须列出它们(而且次序正确)。

**搜索不区分大小写** 除非使用BINARY方式(本章中没有介绍)，否则全文本搜索不区分大小写。

全文本搜索的一个重要部分就是对结果排序。具有较高等级的行先返回(因为这些行很可能是你真正想要的行)。

```SQL
MariaDB [testdatabase]> SELECT note_text,Match(note_text) Against('rabbit') AS rank FROM productnotes;
+-----------------------------------------------------------------------------------------------------------------------------------------------------------+--------------------+
| note_text                                                                                                                                                 | rank               |
+-----------------------------------------------------------------------------------------------------------------------------------------------------------+--------------------+
| Customer complaint:
Sticks not individually wrapped, too easy to mistakenly detonate all at once.
Recommend individual wrapping.                          |                  0 |
| Can shipped full, refills not available.
Need to order new can if refill needed.                                                                          |                  0 |
| Safe is combination locked, combination not provided with safe.
This is rarely a problem as safes are typically blown up or dropped by customers.         |                  0 |
| Quantity varies, sold by the sack load.
All guaranteed to be bright and orange, and suitable for use as rabbit bait.                                      | 1.5905543565750122 |
| Included fuses are short and have been known to detonate too quickly for some customers.
Longer fuses are available (item FU1) and should be recommended. |                  0 |
| Matches not included, recommend purchase of matches or detonator (item DTNTR).                                                                            |                  0 |
| Please note that no returns will be accepted if safe opened using explosives.                                                                             |                  0 |
| Multiple customer returns, anvils failing to drop fast enough or falling backwards on purchaser. Recommend that customer considers using heavier anvils.  |                  0 |
| Item is extremely heavy. Designed for dropping, not recommended for use with slings, ropes, pulleys, or tightropes.                                       |                  0 |
| Customer complaint: rabbit has been able to detect trap, food apparently less effective now.                                                              | 1.6408053636550903 |
| Shipped unassembled, requires common tools (including oversized hammer).                                                                                  |                  0 |
| Customer complaint:
Circular hole in safe floor can apparently be easily cut with handsaw.                                                                |                  0 |
| Customer complaint:
Not heavy enough to generate flying stars around head of victim. If being purchased for dropping, recommend ANV02 or ANV03 instead.   |                  0 |
| Call from individual trapped in safe plummeting to the ground, suggests an escape hatch be added.
Comment forwarded to vendor.                            |                  0 |
+-----------------------------------------------------------------------------------------------------------------------------------------------------------+--------------------+
14 rows in set (0.000 sec)
```

在SELECT而不是WHERE子句中使用Match()和Against()。Match()和Against()用来建立一个计算列，此列包含全文本搜索计算出的等级值。等级由MySQL根据行中词的数目、唯一词的数目、整个索引中词的总数以及包含该词的行的数目计算出来。

**排序多个搜索项** 如果指定多个搜索项，则包含多数匹配词的那些行将具有比包含较少词(或仅有一个匹配)的那些行高的等级值。

全文本搜索提供了简单LIKE搜索不能提供的功能。而且，由于数据是索引的，全文本搜索还相当快。

### 18.2.3 使用查询扩展

查询扩展用来设法放宽所返回的全文本搜索结果的范围。在使用查询扩展时，MySQL对数据和索引进行两遍扫描来完成搜索
* 首先，进行一个基本的全文本搜索，找出与搜索条件匹配的所有行；
* 其次，MySQL检查这些匹配行并选择所有有用的词。
* 再其次，MySQL再次进行全文本搜索，这次不仅使用原来的条件，而且还使用所有有用的词。

**只用于MySQL版本4.1.1或更高级的版本** 查询扩展功能是在MySQL4.1.1中引入的，因此不能用于之前的版本。

比如，没有查询扩展：

```SQL
MariaDB [testdatabase]> SELECT note_text FROM productnotes WHERE Match(note_text) Against('anvils');
+----------------------------------------------------------------------------------------------------------------------------------------------------------+
| note_text                                                                                                                                                |
+----------------------------------------------------------------------------------------------------------------------------------------------------------+
| Multiple customer returns, anvils failing to drop fast enough or falling backwards on purchaser. Recommend that customer considers using heavier anvils. |
+----------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.000 sec)
```

只有一行包含词anvils，因此只返回一行。下面是相同的搜索，这次使用查询扩展：

```SQL
MariaDB [testdatabase]> SELECT note_text FROM productnotes WHERE Match(note_text) Against('anvils' WITH QUERY EXPANSION);
+----------------------------------------------------------------------------------------------------------------------------------------------------------+
| note_text                                                                                                                                                |
+----------------------------------------------------------------------------------------------------------------------------------------------------------+
| Multiple customer returns, anvils failing to drop fast enough or falling backwards on purchaser. Recommend that customer considers using heavier anvils. |
| Customer complaint:
Sticks not individually wrapped, too easy to mistakenly detonate all at once.
Recommend individual wrapping.                         |
| Customer complaint:
Not heavy enough to generate flying stars around head of victim. If being purchased for dropping, recommend ANV02 or ANV03 instead.  |
| Please note that no returns will be accepted if safe opened using explosives.                                                                            |
| Customer complaint: rabbit has been able to detect trap, food apparently less effective now.                                                             |
| Customer complaint:
Circular hole in safe floor can apparently be easily cut with handsaw.                                                               |
| Matches not included, recommend purchase of matches or detonator (item DTNTR).                                                                           |
+----------------------------------------------------------------------------------------------------------------------------------------------------------+
7 rows in set (0.000 sec)
```

这次返回了7行。第一行词包括anvils，因此等级最高。第二行与anvils无关，但它因为包含第一行中的两个词(customer和recommend)，所以也被检索出来。第三行也包含这两个相同的词，但它们在文本中的位置更靠后且分开的更远，因此也包含这一行，但等级为第三。

正如所见，查询扩展极大地增加了返回的行数，但这样做也增加了你实际上并不想要的行的数目。

**行越多越好** 表中的行越多(这些行中的文本就越多)，使用查询扩展返回的结果越好。

### 18.2.4 布尔文本搜索

MySQL支持全文本搜索的另外一种形式，称为布尔方式(boolean mode)。该方式可以提供如下内容的细节：
* 要匹配的词；
* 要排斥的词(如果某行包含要排斥的词，即使它包含要匹配的词也不返回)；
* 排列提示(指定某些词比其他词更重要，更重要的词等级更高)；
* 表达式分组；

**即使没有FULLTEXT索引也可以使用** 布尔方式不同于迄今为止所使用的全文本搜索语法的地方在于，即使没有定义FULLTEXT索引也可以使用它。但这是一种非常缓慢的操作(其性能将随着数据量的增加而降低)。

```SQL
MariaDB [testdatabase]> SELECT note_text FROM productnotes WHERE Match(note_text) Against('heavy' IN BOOLEAN MODE);
+---------------------------------------------------------------------------------------------------------------------------------------------------------+
| note_text
                                  |
+---------------------------------------------------------------------------------------------------------------------------------------------------------+
| Item is extremely heavy. Designed for dropping, not recommended for use with slings, ropes, pulleys, or tightropes.                                     |
| Customer complaint:
Not heavy enough to generate flying stars around head of victim. If being purchased for dropping, recommend ANV02 or ANV03 instead. |
+---------------------------------------------------------------------------------------------------------------------------------------------------------+
2 rows in set (0.000 sec)
```

此全文本搜索检索包含词heavy的所有行(有两行)。其中使用了关键字IN BOOLEAN MODE，但实际上没有指定布尔操作符，因此，其结果与没有指定布尔方式的结果相同。

为了匹配包含heavy但不包含任意以rope开始的词的行，可使用以下的查询。

```SQL
MariaDB [testdatabase]> SELECT note_text FROM productnotes WHERE Match(note_text) Against('heavy -rope*' IN BOOLEAN MODE);
+---------------------------------------------------------------------------------------------------------------------------------------------------------+
| note_text
                   |
+---------------------------------------------------------------------------------------------------------------------------------------------------------+
| Customer complaint:
Not heavy enough to generate flying stars around head of victim. If being purchased for dropping, recommend ANV02 or ANV03 instead. |
+---------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.000 sec)
```

这次只返回一行，仍然匹配词heavy，但-rope\*明确地只是MySQL配出包含rope\*的行。

在MySQL 4.x中所需的代码更改 如果使用的是MySQL 4.x，则上面的例子可能不返回任何行。这是\*操作符处理中的一个错误。要在MySQL 4.x中使用这个例子，使用-ropes而不是-rope\*(排除ropes而不是排除任何以rope开始的词)。

全文本布尔操作符

|布尔操作符|说明|
|:---:|:---:|
|+|包含，此必须存在|
|-|排除，词必须不存在|
|>|包含，而且增加等级值|
|<|包含，且减少等级值|
|()|把词组成子表达式(允许这些子表达式作为一个组被包含、排除、排列等)|
|~|取消一个词的排序值|
|*|词尾的通配符|
|""|定义一个短语(与单个词的列表不一样，它匹配整个短语以便包含或排除这个短语)|

举例说明：

* 匹配包含词rabbit和bait的行。

```SQL
MariaDB [testdatabase]> SELECT note_text FROM productnotes WHERE Match(note_text) Against('+rabbit +bait' IN BOOLEAN MODE);
+----------------------------------------------------------------------------------------------------------------------+
| note_text                                                                                                            |
+----------------------------------------------------------------------------------------------------------------------+
| Quantity varies, sold by the sack load.
All guaranteed to be bright and orange, and suitable for use as rabbit bait. |
+----------------------------------------------------------------------------------------------------------------------+
1 row in set (0.000 sec)
```

* 没有指定操作符，匹配包含rabbit和bait中的至少一个词的行。

```SQL
MariaDB [testdatabase]> SELECT note_text FROM productnotes WHERE Match(note_text) Against('rabbit bait' IN BOOLEAN MODE);
+----------------------------------------------------------------------------------------------------------------------+
| note_text                                                                                                            |
+----------------------------------------------------------------------------------------------------------------------+
| Quantity varies, sold by the sack load.
All guaranteed to be bright and orange, and suitable for use as rabbit bait. |
| Customer complaint: rabbit has been able to detect trap, food apparently less effective now.                         |
+----------------------------------------------------------------------------------------------------------------------+
2 rows in set (0.000 sec)
```

* 匹配短语rabbit bait而不是匹配两个词rabbit和bait。

```SQL
MariaDB [testdatabase]> SELECT note_text FROM productnotes WHERE Match(note_text) Against('"bait rabbit"' IN BOOLEAN MODE);
Empty set (0.000 sec)

MariaDB [testdatabase]> SELECT note_text FROM productnotes WHERE Match(note_text) Against('"rabbit bait"' IN BOOLEAN MODE);
+----------------------------------------------------------------------------------------------------------------------+
| note_text                                                                                                            |
+----------------------------------------------------------------------------------------------------------------------+
| Quantity varies, sold by the sack load.
All guaranteed to be bright and orange, and suitable for use as rabbit bait. |
+----------------------------------------------------------------------------------------------------------------------+
1 row in set (0.000 sec)
```

* 匹配rabbit和carrot，增加前者的等级，降低后者的等级。

```SQL
MariaDB [testdatabase]> SELECT note_text FROM productnotes WHERE Match(note_text) Against('>rabbit <bait' IN BOOLEAN MODE);
+----------------------------------------------------------------------------------------------------------------------+
| note_text                                                                                                            |
+----------------------------------------------------------------------------------------------------------------------+
| Quantity varies, sold by the sack load.
All guaranteed to be bright and orange, and suitable for use as rabbit bait. |
| Customer complaint: rabbit has been able to detect trap, food apparently less effective now.                         |
+----------------------------------------------------------------------------------------------------------------------+
2 rows in set (0.000 sec)
```

* 匹配safe和combination，降低后者的等级。

```SQL
MariaDB [testdatabase]> SELECT note_text FROM productnotes WHERE Match(note_text) Against('+safe +(<combination)' IN BOOLEAN MODE);
+---------------------------------------------------------------------------------------------------------------------------------------------------+
| note_text                                                                                                                                         |
+---------------------------------------------------------------------------------------------------------------------------------------------------+
| Safe is combination locked, combination not provided with safe.
This is rarely a problem as safes are typically blown up or dropped by customers. |
+---------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.000 sec)
```

**排列而不排序** 在布尔方式中，不按等级值降序排序返回的行。

### 18.2.5 全文本搜索的使用说明

***重要说明***：
* 在索引全文本数据时，短词被忽略且从索引中排除。短词定义为那些具有3个或3个以下字符的词（如果需要，这个数目可以更改）。
* MySQL带有一个内建的非用词（stopword）列表，这些词在索引全文本数据时总是被忽略。如果需要，可以覆盖这个列表（请参阅MySQL文档以了解如何完成此工作）。
* 许多词出现的频率很高，搜索它们没有用处（返回太多的结果）。因此，MySQL规定了一条50%规则，如果一个词出现在50%以上的行中，则将它作为一个非用词忽略。50%规则不适用于IN BOOLEAN MODE。
* 如果表中的行数少于3行，则全文本搜索不返回结果（因为每个词或者不出现，或者至少出现在50%的行中）。
* 忽略词中的单引号。例如，don't索引为dont。
* 不具有词分隔符（包括日语和汉语）的语言不能恰当地返回全文本搜索结果。 
* 仅在MyISAM数据库引擎中支持全文本搜索。

### 18.2.6 邻近操作符

邻近搜索是许多全文本搜索支持的一个特性，它能搜索相邻的词（在相同的句子中、相同的段落中或者在特定数目的词的部分中，等等）。

笔记摘录的书写成的时候MySQL还不支持邻近操作符，待补充。


