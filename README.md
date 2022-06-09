# DBMS Final Project

## 系統環境

- UI Framework: `React`, `Electron`
- Database Engine: `SQLite3`

## 介面截圖

![](https://i.imgur.com/I5lxoEo.png)

![](https://i.imgur.com/4hIkwDk.png)

## 安裝使用說明

### 安裝

```shell
$ npm install
```

## 執行

```shell
$ npm run start
```

## 資料庫設計

### Entity Relation

![](https://i.imgur.com/UZ2AWaN.png)


### Relation Schema

![](https://i.imgur.com/HvXDbTE.png)

### 表格屬性說明

- Author table: 作家相關資料

| 屬性   | 說明        |
| ------ | ----------- |
| aid    | Primary Key |
| name   | 作家名稱    |
| gender | 作家性別    |
| intro  | 個人介紹    |

- Book table: 記錄每本書的基本資料

| 屬性      | 說明           |
| --------- | -------------- |
| bid       | Primary Key    |
| name      | 書名           |
| intro     | 簡介           |
| author    | 作者的 `aid`   |
| publisher | 出版商的 `pid` |

- Publisher table: 記錄出版商的資料

| 屬性     | 說明             |
| -------- | ---------------- |
| pid      | Primary Key      |
| name     | 出版商名稱       |
| location | 出版社所在地區   |
| phonenum | 出版社的電話號碼 |

- Reader table: 記錄讀者的資料

| 屬性   | 說明        |
| ------ | ----------- |
| bid    | Primary Key |
| name   | 讀者名稱    |
| gender | 讀者性別    |

- Comment table: 記錄所有書籍評論

| 屬性       | 說明                 |
| ---------- | -------------------- |
| cid        | Primary Key          |
| content    | 評論內文             |
| author     | 撰寫評論的讀者 `rid` |
| comment_to | 評論之書籍的 `bid`   |

- Rating table: 記錄所有評論分數 （因為每位讀者可以對多個不同評論進行評分，故需要以獨立的表格來記錄對應的關係與分數）

| 屬性       | 說明                 |
| ---------- | -------------------- |
| rateid     | Primary Key          |
| rate_by    | 進行評分的讀者 `rid` |
| to_comment | 評分之評論的 `cid`   |
| score      | 評分分數 (0 ~ 5)     |

## Embedded SQL 說明

### SELECT-FROM-WHERE

查詢所有書籍

```sql
SELECT * FROM book
```

### DELETE

將最後一本加入資料庫的書籍資料刪除

```sql
DELETE FROM book WHERE bid == (SELECT MAX(bid) FROM book)
```

### INSERT

加入新的書籍資料

```sql
INSERT INTO book (name, intro, author, publisher) 
VALUES ("bookname", "brief intro", 1, 2)
```

### UPDATE

更新書目簡介

```sql
UPDATE book SET intro = "new intro" WHERE bid == 0
```

### IN

查詢位於台灣的出版商資料

```sql
SELECT * FROM publisher WHERE location IN ('Taiwan')
```

### NOT IN

查詢位在台灣以外地區的出版商資料

```sql
SELECT * FROM publisher WHERE location NOT IN ('Taiwan')
```

### EXISTS

查詢有被評論過的所有書籍資料

```sql
SELECT * 
FROM book 
WHERE EXISTS (
    SELECT * 
    FROM comment 
    WHERE comment_to == bid)
```

### NOT EXISTS

查詢還未被評論記錄的書本資料

```sql
SELECT * 
FROM book 
WHERE NOT EXISTS (
    SELECT * 
    FROM comment 
    WHERE comment_to == bid)
```

### COUNT

計算每位有留過評論的讀者之評論總數量

```sql
SELECT rid, name, COUNT(cid) AS cnt 
FROM reader, comment 
WHERE author == rid
GROUP BY rid
```

### SUM

計算每位有留言的讀者所留下的評論總字數

```sql
SELECT rid, SUM(len) 
FROM (
    SELECT rid, LENGTH(content) AS len 
    FROM reader, comment 
    WHERE reader.rid == comment.author) 
GROUP BY rid
```

### MAX

查詢 "幼獅文化" 所出版的書中擁有最多則評論的書

```sql
SELECT bid, name, MAX(cmt) 
FROM (
    SELECT bid, book.name AS name, COUNT(cid) AS cmt, pid 
    FROM book, publisher, comment 
    WHERE bid == comment_to AND
    	  book.publisher == publisher.pid AND
    	  publisher.pid == 7 
    GROUP BY comment_to)
GROUP BY pid
```

### MIN

查詢 "幼獅文化" 所出版的書中擁有最少評論的書

```sql
SELECT bid, name, MIN(cmt) 
FROM (
    SELECT bid, book.name AS name, COUNT(cid) AS cmt, pid 
    FROM book, publisher, comment 
    WHERE bid == comment_to AND 
    	  book.publisher == publisher.pid AND
    	  publisher.pid == 7 
    GROUP BY comment_to) 
GROUP BY pid
```

### AVG

查詢有留言之讀者的平均評論則數

```sql
SELECT AVG(cmt) 
FROM (
    SELECT rid, COUNT(cid) AS cmt
    FROM reader, comment
    WHERE author == rid GROUP BY author)
```

### HAVING 

查詢曾出版過 2 本以上書籍的作者名稱

```sql
SELECT aid, author.name AS name, COUNT(bid) AS cnt
FROM author, book
WHERE aid == book.author
GROUP BY aid
HAVING cnt >= 2
```
