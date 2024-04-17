# 27 全球化和本地化

## 27.1 字符集和校对顺序

数据库表被用来存储和检索数据。不同的语言和字符集需要以不同的方式存储和检索。因此MySQL需要适应不同的字符集(不同的字母和字符)，适应不同的排序和检索数据的方法。
* 字符集：字母和符号的集合；
* 编码：某个字符集成员的内部表示；
* 校对：规定字符如何比较的指令。

## 27.2 使用字符集和校对顺序

MySQL支持众多的字符集，可以使用`SHOW CHARACTER SET;`查看所支持的字符集完整列表。使用`SHOW COLLATION;`查看所支持校对的完整列表。

通常系统管理在安装时定义一个默认的字符集和校对。此外，也可以在创建数据库时，指定默认的字符集和校对。为了确定所用的字符集和校对，可以使用以下语句：

```SQL
SHOW VARIABLES LIKE 'character%';
SHOW VARIABLES LIKE 'collation%';
```

实际上，字符集很少是服务器范围（甚至数据库范围）的设置。不同的表，甚至不同的列都可能需要不同的字符集，而且两者都可以在创建表时指定。

```SQL
-- 指定了CHARACTER SET和COLLATE两者
CREATE TABLE mytable(
    column1 INT,
    column2 VARCHAR(10)
) DEFAULT CHARACTER SET hebrew COLLATE hebrew_general_ci;
```

一般，MySQL如下确定使用什么样的字符集和校对。
* 如果指定CHARACTER SET和COLLATE两者，则使用这些值。
* 如果只指定CHARACTER SET，则使用此字符集及其默认的校对（如SHOW CHARACTER SET的结果中所示）。
* 如果既不指定CHARACTER SET，也不指定COLLATE，则使用数据库
默认。

MySQL还允许对每个列设置它们，这里对整个表以及一个特定的列制定了CHARACTER SET和COLLATE：

```SQL
CREATE TABLE mytable(
    column1 INT,
    column2 VARCHAR(10),
    column3 VARCHAR(10) CHARACTER SET latin1 COLLATE latin1_general_ci
) DEFAULT CHARACTER SET hebrew COLLATE hebrew_general_ci;
```

校对在对用ORDER BY子句检索出来的数据排序时起重要的作用。如果你需要用与创建表时不同的校对顺序排序特定的SELECT语句，可以在SELECT语句自身中进行。此SELECT使用COLLATE指定一个备用的校对顺序(在这个例子中，为区分大小写的校对)：

```SQL
SELECT * FROM customers ORDER BY lastname, firstname COLLATE latin_general_cs;
```

**SELECT的其他COLLATE子句：** 除了这里看到的在ORDER BY子句中使用以外，COLLATE还可以用于GROUP BY、HAVING、聚集函数、别名等。 

如果需要，串可以使用Cast()或Convert()函数在字符集之间进行转换。
