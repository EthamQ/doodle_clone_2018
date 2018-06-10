var dbUtils = require("./dbUtils");

dbName = "TaskList";
collectionName = "tasks";
var myobj = { title: "TESTTITEL", priority: "hoch" };
dbUtils.insertIntoCollection(dbName, collectionName, myobj);