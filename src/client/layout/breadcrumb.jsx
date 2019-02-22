import React, { Component } from 'react';
import Breadcrumb from 'antd/es/breadcrumb';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
//具体导航的名称
const breadcrumbNameMap = {
  '/user': '用户管理',
  '/book': '图书管理',
  '/user/list': '用户列表',
  '/user/add': '添加用户',
  '/user/edit': '编辑用户',
  '/book/list': '图书列表',
  '/book/add': '添加图书',
};
class BreadcrumbCustom extends Component {
  //利用PropTypes记住所跳转每个页面的位置
  static contextTypes = {
    router: PropTypes.object
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      pathSnippets: null,
      extraBreadcrumbItems: null
    }
  }
  getPath() {
    //对路径进行切分，存放到this.state.pathSnippets中
    this.state.pathSnippets = this.context.router.history.location.pathname.split('/').filter(i => i);
    //将切分的路径读出来，形成面包屑，存放到this.state.extraBreadcrumbItems
    this.state.extraBreadcrumbItems = this.state.pathSnippets.map((_, index) => {
      const url = `/${this.state.pathSnippets.slice(0, index + 1).join('/')}`;
      // console.log('url', url);
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>
            {breadcrumbNameMap[url]}
          </Link>
        </Breadcrumb.Item>
      );
    });
  }

  componentWillMount() {
    //首次加载的时候调用，形成面包屑
    this.getPath();
  }
  componentWillReceiveProps() {
    //任何子页面发生改变，均可调用，完成路径切分以及形成面包屑
    this.getPath();
  }
  render() {
    return (
      <span>
        <Breadcrumb style={{ margin: '12px 0', paddingLeft: '12px' }}>
          {this.state.extraBreadcrumbItems}
        </Breadcrumb>
      </span>
    )
  }
}
export default BreadcrumbCustom;

