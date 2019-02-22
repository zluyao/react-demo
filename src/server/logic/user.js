import Mock, { Random } from 'mockjs';
import _ from 'underscore';
// var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/reactData";

import pack from '../pack';

module.exports = function (router) {
  router.get('/user/list', (req, res) => {

    const result = _.map(_.range(0, 10), (v, i) => Mock.mock({
      "id": i,
      "name": Random.name(),
      "status": 1,
      "gender|1": [
        '男',
        '女',
      ],
      "age": Random.integer(0, 100),
    }));

    setTimeout(() => res.json(pack(result)), Random.natural(0, 2000));
  });
  router.delete('/user/del/:id', (req, res) => {
    setTimeout(() => res.json(pack({ data: 0 })), Random.natural(0, 2000));
  });
  router.post('/user/add', (req, res) => {
    console.log(req.body)
    // var arr = [];
    // arr.push(req.body)
    // fs.writeFileSync('mockData/user.json',JSON.stringify(arr, null, '\t'));
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      console.log("数据库已创建!");
      var dbase = db.db("reactData");
      dbase.collection("user").insertOne(req.body, function (err, response) {
        if (err) throw err;
        console.log("文档插入成功", response.insertedId);
        db.close();
        res.json(pack({ id: response.insertedId }));
      });
    });

  });
};
