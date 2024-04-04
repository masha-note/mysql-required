Object.assign(window.search, {"doc_urls":["chapter_17.html#17-组合查询","chapter_17.html#171-组合查询","chapter_17.html#172-创建组合查询","chapter_17.html#1722-union的规则","chapter_17.html#1723-包含或取消重复的行","chapter_17.html#1724-对组合查询结果排序"],"index":{"documentStore":{"docInfo":{"0":{"body":0,"breadcrumbs":2,"title":1},"1":{"body":1,"breadcrumbs":2,"title":1},"2":{"body":0,"breadcrumbs":2,"title":1},"3":{"body":0,"breadcrumbs":3,"title":2},"4":{"body":3,"breadcrumbs":2,"title":1},"5":{"body":3,"breadcrumbs":2,"title":1}},"docs":{"0":{"body":"","breadcrumbs":"17 组合查询 » 17 组合查询","id":"0","title":"17 组合查询"},"1":{"body":"多数SQL查询都只包含从一个或多个表中返回数据的单条SELECT语句。MySQL也允许执行多个查询(多条SELECT语句)，并将结果作为单个查询结果集返回。这些组合查询通常称为并(union)或复合查询(compound query)。 有两种基本情况，其中需要使用组合查询 在单个查询中从不同的表返回类似结构的数据 对单个表执行多个查询，按单个查询返回数据 组合查询和多个WHERE条件 多数情况下，组合相同表的两个查询完成的工作与具有多个WHERE子句条件的单条查询完成的工作相同。换句话说，任何具有多个WHERE子句的SELECT语句都可以作为一个组合查询给出。这两种技术在不同的查询中性能也不同。因此，应该试一下这两种技术，以确定对特定的查询哪一种性能更好。","breadcrumbs":"17 组合查询 » 17.1 组合查询","id":"1","title":"17.1 组合查询"},"2":{"body":"可用UNION操作符来组合数条SQL查询。利用UNION，可给出多条SELECT语句，将它们的结果组合成单个结果集。","breadcrumbs":"17 组合查询 » 17.2 创建组合查询","id":"2","title":"17.2 创建组合查询"},"3":{"body":"UNION必须由两条或两条以上的SELECT语句组成，语句之间用关键字UNION分隔(因此，如果组合4条SELECT语句，将要使用3个UNION关键字)。 UNION中的每个查询必须包含相同的列、表达式或聚集函数(不过各个列不需要以相同的次序列出)。 列数据类型必须兼容:类型不必完全相同，但必须是DBMS可以隐含地转换的类型(例如，不同的数值类型或不同的日期类型)。","breadcrumbs":"17 组合查询 » 17.2.2 UNION的规则","id":"3","title":"17.2.2 UNION的规则"},"4":{"body":"UNION默认会取消重复的行，若要完全的结果，使用UNION ALL即可。 UNION ALL为UNION的一种形式，它可以完成WHERE子句完成不了的工作。如果确实需要每个条件的匹配行全部出现(包括重复行)，则必须使用UNION ALL而不是WHERE。","breadcrumbs":"17 组合查询 » 17.2.3 包含或取消重复的行","id":"4","title":"17.2.3 包含或取消重复的行"},"5":{"body":"在用UNION组合查询的时候只能使用一条ORDER BY子句，它必须出现在最后一条SELECT语句之后。 UNION的组合查询可以应用不同的表。","breadcrumbs":"17 组合查询 » 17.2.4 对组合查询结果排序","id":"5","title":"17.2.4 对组合查询结果排序"}},"length":6,"save":true},"fields":["title","body","breadcrumbs"],"index":{"body":{"root":{"1":{"7":{".":{"1":{"df":1,"docs":{"1":{"tf":1.0}}},"2":{".":{"2":{"df":1,"docs":{"3":{"tf":1.0}}},"3":{"df":1,"docs":{"4":{"tf":1.0}}},"4":{"df":1,"docs":{"5":{"tf":1.0}}},"df":0,"docs":{}},"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}},"df":1,"docs":{"0":{"tf":1.0}}},"df":0,"docs":{}},"a":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"df":0,"docs":{},"而":{"df":0,"docs":{},"不":{"df":0,"docs":{},"是":{"df":0,"docs":{},"w":{"df":0,"docs":{},"h":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":1,"docs":{"4":{"tf":1.0}}}}}}}}}}}},"b":{"df":0,"docs":{},"y":{"df":0,"docs":{},"子":{"df":0,"docs":{},"句":{"df":0,"docs":{},"，":{"df":0,"docs":{},"它":{"df":0,"docs":{},"必":{"df":0,"docs":{},"须":{"df":0,"docs":{},"出":{"df":0,"docs":{},"现":{"df":0,"docs":{},"在":{"df":0,"docs":{},"最":{"df":0,"docs":{},"后":{"df":0,"docs":{},"一":{"df":0,"docs":{},"条":{"df":0,"docs":{},"s":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"5":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}}}}}}}}}}}}}},"df":0,"docs":{},"q":{"df":0,"docs":{},"u":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"u":{"df":0,"docs":{},"n":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":3,"docs":{"3":{"tf":1.0},"4":{"tf":1.0},"5":{"tf":1.0}},"组":{"df":0,"docs":{},"合":{"df":0,"docs":{},"查":{"df":0,"docs":{},"询":{"df":0,"docs":{},"的":{"df":0,"docs":{},"时":{"df":0,"docs":{},"候":{"df":0,"docs":{},"只":{"df":0,"docs":{},"能":{"df":0,"docs":{},"使":{"df":0,"docs":{},"用":{"df":0,"docs":{},"一":{"df":0,"docs":{},"条":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"d":{"df":1,"docs":{"5":{"tf":1.0}}},"df":0,"docs":{}}}}}}}}}}}}}}}},"默":{"df":0,"docs":{},"认":{"df":0,"docs":{},"会":{"df":0,"docs":{},"取":{"df":0,"docs":{},"消":{"df":0,"docs":{},"重":{"df":0,"docs":{},"复":{"df":0,"docs":{},"的":{"df":0,"docs":{},"行":{"df":0,"docs":{},"，":{"df":0,"docs":{},"若":{"df":0,"docs":{},"要":{"df":0,"docs":{},"完":{"df":0,"docs":{},"全":{"df":0,"docs":{},"的":{"df":0,"docs":{},"结":{"df":0,"docs":{},"果":{"df":0,"docs":{},"，":{"df":0,"docs":{},"使":{"df":0,"docs":{},"用":{"df":0,"docs":{},"u":{"df":0,"docs":{},"n":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":1,"docs":{"4":{"tf":1.0}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},"breadcrumbs":{"root":{"1":{"7":{".":{"1":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}},"2":{".":{"2":{"df":1,"docs":{"3":{"tf":1.4142135623730951}}},"3":{"df":1,"docs":{"4":{"tf":1.4142135623730951}}},"4":{"df":1,"docs":{"5":{"tf":1.4142135623730951}}},"df":0,"docs":{}},"df":1,"docs":{"2":{"tf":1.4142135623730951}}},"df":0,"docs":{}},"df":6,"docs":{"0":{"tf":1.7320508075688772},"1":{"tf":1.0},"2":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":1.0},"5":{"tf":1.0}}},"df":0,"docs":{}},"a":{"df":0,"docs":{},"l":{"df":0,"docs":{},"l":{"df":0,"docs":{},"而":{"df":0,"docs":{},"不":{"df":0,"docs":{},"是":{"df":0,"docs":{},"w":{"df":0,"docs":{},"h":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":1,"docs":{"4":{"tf":1.0}}}}}}}}}}}},"b":{"df":0,"docs":{},"y":{"df":0,"docs":{},"子":{"df":0,"docs":{},"句":{"df":0,"docs":{},"，":{"df":0,"docs":{},"它":{"df":0,"docs":{},"必":{"df":0,"docs":{},"须":{"df":0,"docs":{},"出":{"df":0,"docs":{},"现":{"df":0,"docs":{},"在":{"df":0,"docs":{},"最":{"df":0,"docs":{},"后":{"df":0,"docs":{},"一":{"df":0,"docs":{},"条":{"df":0,"docs":{},"s":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"5":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}}}}}}}}}}}}}},"df":0,"docs":{},"q":{"df":0,"docs":{},"u":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"u":{"df":0,"docs":{},"n":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":3,"docs":{"3":{"tf":1.4142135623730951},"4":{"tf":1.0},"5":{"tf":1.0}},"组":{"df":0,"docs":{},"合":{"df":0,"docs":{},"查":{"df":0,"docs":{},"询":{"df":0,"docs":{},"的":{"df":0,"docs":{},"时":{"df":0,"docs":{},"候":{"df":0,"docs":{},"只":{"df":0,"docs":{},"能":{"df":0,"docs":{},"使":{"df":0,"docs":{},"用":{"df":0,"docs":{},"一":{"df":0,"docs":{},"条":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"d":{"df":1,"docs":{"5":{"tf":1.0}}},"df":0,"docs":{}}}}}}}}}}}}}}}},"默":{"df":0,"docs":{},"认":{"df":0,"docs":{},"会":{"df":0,"docs":{},"取":{"df":0,"docs":{},"消":{"df":0,"docs":{},"重":{"df":0,"docs":{},"复":{"df":0,"docs":{},"的":{"df":0,"docs":{},"行":{"df":0,"docs":{},"，":{"df":0,"docs":{},"若":{"df":0,"docs":{},"要":{"df":0,"docs":{},"完":{"df":0,"docs":{},"全":{"df":0,"docs":{},"的":{"df":0,"docs":{},"结":{"df":0,"docs":{},"果":{"df":0,"docs":{},"，":{"df":0,"docs":{},"使":{"df":0,"docs":{},"用":{"df":0,"docs":{},"u":{"df":0,"docs":{},"n":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":1,"docs":{"4":{"tf":1.0}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},"title":{"root":{"1":{"7":{".":{"1":{"df":1,"docs":{"1":{"tf":1.0}}},"2":{".":{"2":{"df":1,"docs":{"3":{"tf":1.0}}},"3":{"df":1,"docs":{"4":{"tf":1.0}}},"4":{"df":1,"docs":{"5":{"tf":1.0}}},"df":0,"docs":{}},"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}},"df":1,"docs":{"0":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{},"u":{"df":0,"docs":{},"n":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":1,"docs":{"3":{"tf":1.0}}}}}}}}}},"lang":"English","pipeline":["trimmer","stopWordFilter","stemmer"],"ref":"id","version":"0.9.5"},"results_options":{"limit_results":30,"teaser_word_count":30},"search_options":{"bool":"OR","expand":true,"fields":{"body":{"boost":1},"breadcrumbs":{"boost":1},"title":{"boost":2}}}});