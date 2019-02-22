/**
 * 图书列表页面
 */
import React from 'react';
// 引入 antd 组件
// import { message, Table, Button, Popconfirm } from 'antd';
import message from 'antd/es/message';
import Table from 'antd/es/table';
import Button from 'antd/es/button';
import Popconfirm from 'antd/es/popconfirm';
// 引入 prop-types
import PropTypes from 'prop-types';
// 引入 封装fetch工具类
import ajax from '$lib/utils/request';

class BookList extends React.Component {
  // 构造器
  constructor(props) {
    super(props);
    // 定义初始化状态
    this.state = {
      bookList: []
    };
  }

  /**
   * 生命周期
   * componentWillMount
   * 组件初始化时只调用，以后组件更新不调用，整个生命周期只调用一次
   */
  componentWillMount() {
    // 请求数据
    ajax.get('/api/book/list')
      .then((data) => {
        /**
         * 成功的回调
         * 数据赋值
         */
        this.setState({
          bookList: data
        });
      });
  }

  /**
   * 编辑
   */
  handleEdit(book) {
    // 跳转编辑页面
    this.context.router.push('/book/edit/' + book.id);
  }

  /**
   * 删除
   */
  handleDel(book) {
    // 执行删除数据操作
    ajax.del('/api/book/del/' + book.id, {
    })
      .then(res => {
        /**
         * 设置状态
         * array.filter
         * 把Array的某些元素过滤掉，然后返回剩下的元素
         */
        this.setState({
          bookList: this.state.bookList.filter(item => item.id !== book.id)
        });
        message.success('删除图书成功');
      })
      .catch(err => {
        console.error(err);
        message.error('删除图书失败');
      });
  }

  render() {
    // 定义变量
    const { bookList } = this.state;
    // antd的Table组件使用一个columns数组来配置表格的列
    const columns = [
      {
        title: '图书ID',
        dataIndex: 'id'
      },
      {
        title: '书名',
        dataIndex: 'name'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (text, record) => <span>¥{record.price / 100}</span>
      },
      {
        title: '所有者ID',
        dataIndex: 'owner_id'
      },
      {
        title: '操作',
        render: (text, record) => (
          <Button.Group type="ghost">
            <Button size="small" onClick={() => this.handleEdit(record)}>编辑</Button>
            <Popconfirm
              title="确定要删除吗?"
              okText="确定"
              cancelText="取消"
              onConfirm={() => this.handleDel(record)}>
              <Button size="small">删除</Button>
            </Popconfirm>
          </Button.Group>
        )
      }
    ];

    return (
      <Table columns={columns} dataSource={bookList} rowKey={row => row.id} />
    );
  }
}

/**
 * 任何使用this.context.xxx的地方，必须在组件的contextTypes里定义对应的PropTypes
 */
BookList.contextTypes = {
  router: PropTypes.object.isRequired
};

export default BookList;
