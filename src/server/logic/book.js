import Mock, { Random } from 'mockjs';
import _ from 'underscore';

import pack from '../pack';

module.exports = function (router) {
  router.get('/book/list', (req, res) => {

    const result = _.map(_.range(0, 10), (v, i) => Mock.mock({
      "id": i,
      "status": 1,
      "name|1": [
        '书名1',
        '书名2',
        '书名3',
        '书名4',
        '书名5',
        '书名6',
        '书名7',
        '书名8',
      ],
      "price": Random.integer(0, 100),
      "owner_id": Random.integer(10000, 99999),
    }));

    setTimeout(() => res.json(pack(result)), Random.natural(0, 2000));
  });

  router.delete('/book/del/:id', (req, res) => {
    setTimeout(() => res.json(pack({ data: 0 })), Random.natural(0, 2000));
  });
};
