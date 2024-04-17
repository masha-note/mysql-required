# 28 安全管理

## 28.1 访问控制

**防止无意的错误：** 重要的是注意到，访问控制的目的不仅仅是防止用户的恶意企图。数据梦魇更为常见的是无意识错误的结果，如错打MySQL语句，在不合适的数据库中操作或其他一些用户错误。通过保证用户不能执行他们不应该执行的语句，访问控制有助于避免这些情况的发生。

**不要使用root：** 应该严肃对待root登录的使用。仅在绝对需要时使用它（或许在你不能登录其他管理账号时使用）。不应该在日常的MySQL操作中使用root。

## 28.2 管理用户

MySQL用户账号和信息存储在名为mysql的MySQL数据库中。mysql数据库有一个名为user的表，它包含所有用户账号。user表有一个名为user的列，它存储用户登录名。

### 28.2.1 创建用户账号

使用`CREATE USER`语句创建一个新用户账号，如：

```SQL
CREATE USER ben IDENTIFIED BY 'yourPassword';
```

在创建用户账号时不一定需要口令(密码)，不过这个例子用`IDENTIFIED BY 'p@$$wOrd'`给出了一个口令。

**指定散列口令：** IDENTIFIED BY指定的口令为纯文本，MySQL将在保存到user表之前对其进行加密。为了作为散列值指定口令，使用IDENTIFIED BY PASSWORD(TODO:没明白这里说的是什么意思)。


**使用GRANT或INSERT：** GRANT语句也可以创建用户账号，但一般来说CREATE USER是最清楚和最简单的句子。此外，也可以通过直接插入行到user表来增加用户，不过为安全起见，一般不建议这样做。MySQL用来存储用户账号信息的表（以及表模式等）极为重要，对它们的任何毁坏都可能严重地伤害到MySQL服务器。因此，相对于直接处理来说，最好是用标记和函数来处理这些表。

可以使用`RENAME USER`语句重新命名一个用户账号，如：

```SQL
RENAME USER ben TO bforta;
```

**MySQL 5之前：** 仅MySQL 5或之后的版本支持RENAME USER。为了在以前的MySQL中重命名一个用户，可使用UPDATE直接更新user表。 

### 28.2.2 删除用户账号

使用`DROP USER`语句删除一个用户账号，如：

```SQL
DROP USER bforta;
```

**MySQL 5之前：** 自MySQL 5以来，DROP USER删除用户账号和所有相关的账号权限。在MySQL 5以前，DROP USER只能用来删除用户账号，不能删除相关的权限。因此，如果使用旧版本的MySQL，需要先用REVOKE删除与账号相关的权限，然后再用DROP USER删除账号。

### 28.2.3 设置访问权限

在创建用户账号后，必须接着分配访问权限。新创建的用户账号没有访问权限。它们能登录MySQL，但不能看到数据，不能执行任何数据库操作。

使用SHOW GRANTS FOR可以看到赋予用户账号的权限：

```SQL
MariaDB [mysql]> SHOW GRANTS FOR masha;
+---------------------------------------------------------------------------------------------+
| Grants for masha@%                                                                          |
+---------------------------------------------------------------------------------------------+
| GRANT ALL PRIVILEGES ON *.* TO `masha`@`%` IDENTIFIED BY PASSWORD '88888' WITH GRANT OPTION |
+---------------------------------------------------------------------------------------------+
1 row in set (0.000 sec)
```

**用户定义为user@host：** MySQL的权限用用户名和主机名结合定义。如果不指定主机名，则使用默认的主机名`%`（授予用户访问权限而不管主机名）。

使用GRANT语句设置权限，GRANT语句至少需要下列的信息：
* 要授予的权限；
* 被授予访问权限的数据库或表；
* 用户名。

```SQL
-- 此GRANT允许用户bforta在crashcourse.*(crashcourse数据库的所有表)上使用SELECT。
GRANT SELECT ON crashcourse.* TO bforta;
```

GRANT的反操作为REVOKE，它用于撤销特定的权限：

```SQL
-- 此GRANT撤销用户bforta在crashcourse.*(crashcourse数据库的所有表)上使用SELECT的权限。
REVOKE SELECT ON crashcourse.* FROM bforta;
```

REVOKE所撤销的权限必须存在，否则会出错。

GRANT和REVOKE可在几个层次上控制访问权限：
* 整个服务器，使用GRANT ALL和REVOKE ALL；
* 整个数据库，使用ON database.*；
* 特定的表，使用ON database.table；
* 特定的列；
* 特定的存储过程。

可供授予或撤销的权限参考[官方文档 table15.11和table15.12](https://dev.mysql.com/doc/refman/8.0/en/grant.html)。

**未来的授权：** 在使用GRANT和REVOKE时，用户账号必须存在，但对所涉及的对象没有这个要求。这允许管理员在创建数据库和表之前设计和实现安全措施。这样做的副作用是，当某个数据库或表被删除时（用DROP语句），相关的访问权限仍然存在。而且，如果将来重新创建该数据库或表，这些权限仍然起作用。

**简化多次授权** 可通过列出各权限并用逗号分隔，将多条GRANT语句串在一起，如`GRANT SELECT,INSERT ON crashcourse.* TO bforta;`。

### 28.2.4 更改口令

可使用SET PASSWORD语句更改用户口令，新口令必须加密：

```SQL
SET PASSWORD FOR bforta=Password('new passwrod');
```

SET PASSWORD在不指定用户的时候将更新当前登录用户的口令：

```SQL
SET PASSWORD = Password('new password');
```


