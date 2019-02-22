
/**
 * 登录页
 */
import React, { Component } from 'react';
// 引入antd组件
// import { Icon, Form, Input, Button, message } from 'antd';
import Icon from 'antd/es/icon';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Button from 'antd/es/button';
import message from 'antd/es/message';
// 引入 封装后的fetch工具类
import ajax from '$lib/utils/request';
// 引入样式表
import style from './css';
const FormItem = Form.Item;
class Login extends Component {
  // 构造器
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    style.use();
  }
  componentWillUnmount() {
    style.unuse();
  }

  handleSubmit(e) {
    // 通知 Web 浏览器不要执行与事件关联的默认动作
    e.preventDefault();
    // 表单验证
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 发起请求
        ajax.post('/auth/login', values)
          // 成功的回调
          .then((res) => {
            if (res) {
              message.info('登录成功');
              // 页面跳转
              this.props.history.push('/');
            } else {
              message.info('登录失败,账号或密码错误');
            }
          }).catch(err => {
            console.log(err, '异常1');
          });
      }
    });
  }

  render() {
    const { form } = this.props;
    // 验证规则
    const { getFieldDecorator } = form;
    return (
      <div className="wrapper">
        <div className="box">
          <header className="header">
            Welcome
          </header>

          <section className="form">
            <Form onSubmit={this.handleSubmit}>
              <FormItem>
                {getFieldDecorator('account', {
                  rules: [
                    {
                      required: true,
                      message: '请输入管理员帐号',
                      type: 'string'
                    }
                  ]
                })(
                  <Input type="text" prefix={<Icon type="user" />} />
                )}
              </FormItem>

              <FormItem>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码',
                      type: 'string'
                    }
                  ]
                })(
                  <Input type="password" prefix={<Icon type="lock" />} />
                )}
              </FormItem>

              <Button className="btn" type="primary" htmlType="submit">登录</Button>
            </Form>
          </section>
        </div>
      </div>
    );
  }
}
//经 Form.create() 包装过的组件会自带 this.props.form 属性，直接传给 Form 即可
Login = Form.create()(Login);

export default Login;
