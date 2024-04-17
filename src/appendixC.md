# MySQL常用语句的语法

约定：
- `|`用来指出几个选择中的一个，因此`NULL | NOT NULL`表示或者给出NULL或者给出NOT NULL。
- 包含在方括号中的关键字或子句(如`[like this]`)是可选的。

## C.1 ALTER TABLE

```SQL
ALTER TABLE tablename
(
    ADD     column  datatype    [NULL|NOT NULL] [CONSTRAINTS],
    CHANGE  column  columns  datatype    [NULL|NOT NULL] [CONSTRAINTS],
    DROP    column  datatype    [NULL|NOT NULL] [CONSTRAINTS],
    ...
);
```

## C.2 CREATE INDEX

```SQL
CREATE INDEX indexname ON tablename (column [ASC|DESC], ...);
```

## C.3 CREATE PROCEDURE

```SQL
CREATE PROCEDURE procedurename([parameters])
BEGIN
...
END;
```

## C.4 CREATE TABLE

```SQL
CREATE TABLE tablename
(
    column  datatype    [NULL|NOT NULL] [CONSTRAINTS],
    column  datatype    [NULL|NOT NULL] [CONSTRAINTS],
    ...
);
```

## C.5 CREATE USER

```SQL
CREATE USER username[@hostname] [IDENTIFIED BY [PASSWORD] 'password'];
```

## C.6 CREATE VIEW

```SQL
CREATE [OR REPLACE] VIEW viewname AS SELECT ...;
```

## C.7 DROP

```SQL
DROP DATABASE|INDEX|PROCEDURE|TABLE|TRIGGER|USER|VIEW itemname;
```

## C.8 INSERT SELECT

```SQL
INSERT INTO tablename [(columns,...)] SELECT columns,... FROM tablename1,... [WHERE ...];
```

## C.9 ROLLBACK

```SQL
ROLBACK [TO savepointname];
```

## C.10 UPDATE

```SQL
UPDATE tablename SET column=value,... [WHERE ...];
```


