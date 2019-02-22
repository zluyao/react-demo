/**
 * 布局组件
 */
import React, { Component } from 'react';
import Loadable from 'react-loadable';
// 路由
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
// Menu 导航菜单 Icon 图标
// import { Menu, Icon } from 'antd';
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import Layout from 'antd/lib/layout';
// 引入 prop-types
import PropTypes from 'prop-types';

import style from './css';
import Async from '$lib/utils/async';

const { Header, Sider, Content } = Layout;

// breadcrumb
import Breadcrumb from './breadcrumb';

const MyLoadingComponent = ({ isLoading, error }) => {
  if (isLoading) {
    return <div>Loading...</div>
  }
  else if (error) {
    return <div>Sorry, there was a problem loading the page.</div>
  }
  else {
    return null;
  }
};

const HomePage = Loadable({
  loader: () => import('../homePage'),
  loading: MyLoadingComponent
});
const UserList = Loadable({
  loader: () => import('../userList'),
  loading: MyLoadingComponent
});
const addUser = Loadable({
  loader: () => import('../addUser'),
  loading: MyLoadingComponent
});
const bookList = Loadable({
  loader: () => import('../bookList'),
  loading: MyLoadingComponent
});
const addBook = Loadable({
  loader: () => import('../addBook'),
  loading: MyLoadingComponent
});

console.log(HomePage);

const routes = [
  { path: '/book/list', aaa: {}, component: bookList },
  { path: '/book/add', aaa: {}, component: addBook },
  { path: '/user/list', aaa: {}, component: UserList },
  { path: '/user/add', aaa: {}, component: addUser },
  { path: '/user/edit/:id', aaa: {}, component: addUser },
  { path: '/', aaa: {}, component: HomePage },
]

// 左侧菜单栏
const SubMenu = Menu.SubMenu;

class HomeLayout extends Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  componentDidMount() {
    style.use();
    console.log(this.context);
  }
  componentWillUnmount() {
    style.unuse();
  }
  render() {
    return (
      <Layout className="main">
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}>
          <div className="logo" >logo</div>
          <Menu mode="inline" theme="dark" defaultSelectedKeys={['1']}>
            <SubMenu
              key="user"
              title={
                <span>
                  <Icon type="user" />
                  <span>用户管理</span>
                </span>
              }>
              <Menu.Item key="user-list">
                <Link to="/user/list">用户列表</Link>
              </Menu.Item>
              <Menu.Item key="user-add">
                <Link to="/user/add">添加用户</Link>
              </Menu.Item>
            </SubMenu>

            <SubMenu
              key="book"
              title={
                <span>
                  <Icon type="book" />
                  <span>图书管理</span>
                </span>
              }>
              <Menu.Item key="book-list">
                <Link to="/book/list">图书列表</Link>
              </Menu.Item>
              <Menu.Item key="book-add">
                <Link to="/book/add">添加图书</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Breadcrumb></Breadcrumb>
          <Content style={{ margin: '10px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            <Router>
              <Switch>
                {
                  routes.map(route => (
                    <Route key={route.path} path={route.path} component={route.component} exact={route.exact} />
                  ))
                }
              </Switch>
            </Router>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

HomeLayout.contextTypes = {
  router: PropTypes.object.isRequired
};

export default HomeLayout;
