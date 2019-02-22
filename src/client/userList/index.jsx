/**
 * 用户列表页面
 */
import React from 'react';
// 引入 antd 组件
// import { message, Table, Button, Popconfirm } from 'antd';
import message from 'antd/es/message';
import Table from 'antd/es/table';
import Button from 'antd/es/button';
import Popconfirm from 'antd/es/popconfirm';
import Tabs from 'antd/es/tabs';
// 引入 prop-types
import PropTypes from 'prop-types';

const TabPane = Tabs.TabPane;
// 引入 封装后的fetch工具类
import ajax from '$lib/utils/request';

class UserList extends React.Component {
  // 构造器
  constructor(props) {
    super(props);
    console.log(props);
    // 定义初始化状态
    this.state = {
      userList: []
    };
  }

  /**
   * 生命周期
   * componentWillMount
   * 组件初始化时只调用，以后组件更新不调用，整个生命周期只调用一次
   */
  componentWillMount() {
    // 请求数据
    ajax.get('/api/user/list')
      .then((data) => {
        /**
         * 成功的回调
         * 数据赋值
         */
        this.setState({
          userList: data,
        });
      });
  }

  /**
   * 编辑
   */
  handleEdit(user) {
    // 跳转编辑页面
    console.log(this.context);
    this.context.router.history.push('/user/edit/' + user.id);
  }

  /**
   * 删除
   */
  handleDel(user) {
    // 执行删除数据操作
    ajax.del('/api/user/del/' + user.id, {
    })
      .then((res) => {
        /**
         * 设置状态
         * array.filter
         * 把Array的某些元素过滤掉，然后返回剩下的元素
         */
        this.setState({
          userList: this.state.userList.filter(item => item.id !== user.id)
        });
        message.success('删除用户成功');
      })
      .catch(err => {
        console.error(err);
        message.error('删除用户失败');
      });
  }

  render() {
    // 定义变量
    const { userList } = this.state;
    // antd的Table组件使用一个columns数组来配置表格的列
    const columns = [
      {
        title: '用户ID',
        dataIndex: 'id'
      },
      {
        title: '用户名',
        dataIndex: 'name'
      },
      {
        title: '性别',
        dataIndex: 'gender'
      },
      {
        title: '年龄',
        dataIndex: 'age'
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
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
          );
        }
      }
    ];

    return (
      // <Table columns={columns} dataSource={userList} rowKey={row => row.id} />
      <div className="card-container">
        <Tabs defaultActiveKey="1" size='large'>
          <TabPane tab="Tab Title 1" key="1">
            <Table columns={columns} dataSource={userList} rowKey={row => row.id} />
          </TabPane>
          <TabPane tab="Tab Title 2" key="2">
            <p>Content of Tab Pane 2</p>
            <p>Content of Tab Pane 2</p>
            <p>Content of Tab Pane 2</p>
          </TabPane>
          <TabPane tab="Tab Title 3" key="3">
            <p>Content of Tab Pane 3</p>
            <p>Content of Tab Pane 3</p>
            <p>Content of Tab Pane 3</p>
          </TabPane>
        </Tabs>
      </div>

    );
  }
}

/**
 * 任何使用this.context.xxx的地方，必须在组件的contextTypes里定义对应的PropTypes
 */
UserList.contextTypes = {
  router: PropTypes.object.isRequired
};

export default UserList;
