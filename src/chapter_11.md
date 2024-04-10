# 11 使用数据处理函数

## 11.2 使用函数

大多数SQL实现支持以下类型的函数
* 用于处理文本串(如删除或填充值，转换值为大小写)的文本函数。
* 用于在数值数据上进行算术操作(如返回绝对值，进行代数运算)的数值函数。
* 用于处理日期的时间值并从这些值中提取特定成分(例如，返回两个日期之差，检查日期有效性等)的日期和时间函数。
* 返回DBMS正使用的特殊信息(如返回用户登录信息，检查版本细节)的系统函数。

## 11.2.1 文本处理函数

```SQL
MariaDB [testdatabase]> SELECT name FROM vendors LIMIT 3;
+----------+
| name     |
+----------+
| alphabet |
| amazon   |
| amd      |
+----------+
3 rows in set (0.001 sec)

MariaDB [testdatabase]> SELECT name,Upper(name) AS name_upcase FROM vendors LIMIT 3;
+----------+-------------+
| name     | name_upcase |
+----------+-------------+
| alphabet | ALPHABET    |
| amazon   | AMAZON      |
| amd      | AMD         |
+----------+-------------+
3 rows in set (0.001 sec)
```

正如所见，Upper将文本转换为大写。

#### 常用的文本处理函数

|函数|说明|
|:---:|:---:|
|Left(str,length)|返回str左边数起length长度的字符|
|Length(str)|返回str的长度|
|Locate(sub,str,start)|找出str中start位置开始检查sub子串的位置，默认从1开始|
|Lower(str)|将串转换为小写|
|LTrim(str)|去掉串左边的空格|
|Right(str,length)|返回串右边的字符|
|RTrim(str)|去掉串右边的空格|
|Soundex(str)|返回串的SOUNDEX值|
|SubString(str,start,length)|返回str从start开始length长度的子串|
|Upper(str)|将串转换为大写|

SOUNDEX是一个将任何文本串转换为描述其语音表示的字母数字模式的算法。SOUNDEX考虑了类似的发音字符和音节，使得能对串进行发音比较而不是字母比较。虽然SOUNDEX不是SQL概念，但MySQL（就像多数DBMS一样）都提供对SOUNDEX的支持。

### 11.2.2 日期和时间处理函数

**常用日期和时间处理函数**

|函数|说明|
|:---:|:---:|
|AddDate(date,INTERVALvalueunit)|增加一个日期（天、周等）|
|AddTime()|增加一个时间（时、分等）|
|CurDate()|返回当前日期|
|CurTime()|返回当前时间|
|Date()|返回日期时间的日期部分|
|DateDiff(end,start)|计算两个日期之差|
|Date_Add(date,INTERVALvalueunit)|高度灵活的日期运算函数|
|Date_Format(date,format)|返回一个格式化的日期或时间串|
|Day()|返回一个日期的天数部分|
|DayOfWeek()|对于一个日期，返回对应的星期几|
|Hour()|返回一个时间的小时部分|
|Minute()|返回一个时间的分钟部分|
|Month()|返回一个日期的月份部分|
|Now()|返回当前日期和时间|
|Second()|返回一个时间的秒部分|
|Time()|返回一个日期时间的时间部分|
|Year()|返回一个日期的年份部分|

```SQL
MariaDB [testdatabase]> SELECT ADDDATE('2022-03-01', INTERVAL 1 DAY);
+---------------------------------------+
| ADDDATE('2022-03-01', INTERVAL 1 DAY) |
+---------------------------------------+
| 2022-03-02                            |
+---------------------------------------+
1 row in set (0.000 sec)

MariaDB [testdatabase]> SELECT ADDDATE('2022-03-01', 1);
+--------------------------+
| ADDDATE('2022-03-01', 1) |
+--------------------------+
| 2022-03-02               |
+--------------------------+
1 row in set (0.000 sec)

MariaDB [testdatabase]> SELECT ADDDATE('2022-03-01', -1);
+---------------------------+
| ADDDATE('2022-03-01', -1) |
+---------------------------+
| 2022-02-28                |
+---------------------------+
1 row in set (0.001 sec)

MariaDB [testdatabase]> SELECT ADDDATE('2022-03-01', INTERVAL -1 WEEK);
+-----------------------------------------+
| ADDDATE('2022-03-01', INTERVAL -1 WEEK) |
+-----------------------------------------+
| 2022-02-22                              |
+-----------------------------------------+
1 row in set (0.000 sec)
MariaDB [testdatabase]> SELECT ADDTIME('12:00:00', '03:30:00');
+---------------------------------+
| ADDTIME('12:00:00', '03:30:00') |
+---------------------------------+
| 15:30:00                        |
+---------------------------------+
1 row in set (0.001 sec)

MariaDB [testdatabase]> SELECT ADDTIME('12:00:00', '-03:30:00');
+----------------------------------+
| ADDTIME('12:00:00', '-03:30:00') |
+----------------------------------+
| 08:30:00                         |
+----------------------------------+
1 row in set (0.000 sec)

MariaDB [testdatabase]> SELECT CONCAT(CURDATE(), ' ', CURTIME()) AS now;
+---------------------+
| now                 |
+---------------------+
| 2024-03-23 19:02:36 |
+---------------------+
1 row in set (0.000 sec)

MariaDB [testdatabase]> SELECT DATE(CURDATE());
+-----------------+
| DATE(CURDATE()) |
+-----------------+
| 2024-03-23      |
+-----------------+
1 row in set (0.002 sec)

MariaDB [testdatabase]> SELECT DATEDIFF(CURDATE(), '2024-03-01');
+-----------------------------------+
| DATEDIFF(CURDATE(), '2024-03-01') |
+-----------------------------------+
|                                22 |
+-----------------------------------+
1 row in set (0.001 sec)

MariaDB [testdatabase]> SELECT DATE_FORMAT('2024-03-01','%Y%m%d');
+------------------------------------+
| DATE_FORMAT('2024-03-01','%Y%m%d') |
+------------------------------------+
| 20240301                           |
+------------------------------------+
1 row in set (0.001 sec)
```

**需要注意MySQL使用的日期格式，** 无论你什么时候指定一个日期，不管是插入或更新表值还是用WHERE子句进行过滤，日期必须为格式yyyy-mm-dd。

**应该总是使用4位数字的年份**  支持2位数字的年份，MySQL处理00-69为2000-2069，处理70-99为1970-1999。虽然它们可能是打算要的年份，但使用完整的4位数字年份更可靠，因为MySQL不必做出任何假定。

### 11.2.3 数值处理函数

|  函数  |        说明        |
| :----: | :----------------: |
| Abs()  | 返回一个数的绝对值 |
| Cos()  | 返回一个角度的余弦 |
| Exp()  | 返回一个数的指数值 |
| Mod()  |  返回除操作的余数  |
|  Pi()  |     返回圆周率     |
| Rand() |   返回一个随机数   |
| Sin()  | 返回一个角度的正弦 |
| Sqrt() | 返回一个数的平方根 |
| Tan()  | 返回一个角度的正切 |
