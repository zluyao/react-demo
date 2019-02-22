/**
 * 用户编辑器组件
 */
import React from 'react';
// 引入 antd 组件
// import { Form, Input, InputNumber, Select, Button, message } from 'antd';
import message from 'antd/es/message';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import InputNumber from 'antd/es/input-number';
import Select from 'antd/es/select';
import Button from 'antd/es/button';
// 引入 prop-types
import PropTypes from 'prop-types';
// 引入 封装fetch工具类
import ajax from '$lib/utils/request';

const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 16
  }
};

class UserEditor extends React.Component {
  // 构造器
  constructor(props, context) {
    super(props, context);

    console.log(context);
    // 绑定this
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  // 生命周期--组件加载完毕
  componentDidMount() {
    /**
     * 在componentWillMount里使用form.setFieldsValue无法设置表单的值
     * 所以在componentDidMount里进行赋值
     */
    const { editTarget, form } = this.props;
    if (editTarget) {
      // 将editTarget的值设置到表单
      form.setFieldsValue(editTarget);
    }
  }

  // 按钮提交事件
  handleSubmit(e) {
    // 阻止表单submit事件自动跳转页面的动作
    e.preventDefault();
    // 定义常量
    const { form, editTarget } = this.props; // 组件传值

    // 验证
    form.validateFields((err, values) => {
      if (!err) {
        // 默认值
        let editType = '添加';
        let apiUrl = '/api/user/add';
        let method = 'post';
        // 判断类型
        if (editTarget) {
          editType = '编辑';
          apiUrl += '/' + editTarget.id;
          method = 'put';
        }

        // 发送请求
        ajax.post(apiUrl, values)
          // 成功的回调
          .then((res) => {
            // 当添加成功时,返回的json对象中应包含一个有效的id字段
            // 所以可以使用res.id来判断添加是否成功
            console.log(res);
            if (res.id) {
              message.success(editType + '添加用户成功!');
              // 跳转到用户列表页面
              this.context.router.history.push('/user/list');
              return;
            } else {
              message.error(editType + '添加用户失败!');
            }
          })
          // 失败的回调
          .catch((err) => console.error(err));
      } else {
        message.warn(err);
      }
    });
  }

  render() {
    // 定义常量
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div style={{ width: '400' }}>
        <Form onSubmit={(e) => this.handleSubmit(e)}>
          <FormItem label="用户名:" {...formLayout}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入用户名'
                },
                {
                  pattern: /^.{1,4}$/,
                  message: '用户名最多4个字符'
                }
              ]
            })(
              <Input type="text" />
            )}
          </FormItem>

          <FormItem label="年龄:" {...formLayout}>
            {getFieldDecorator('age', {
              rules: [
                {
                  required: true,
                  message: '请输入年龄',
                  type: 'number'
                },
                {
                  min: 1,
                  max: 100,
                  message: '请输入1~100的年龄',
                  type: 'number'
                }
              ]
            })(
              <InputNumber />
            )}
          </FormItem>

          <FormItem label="性别:" {...formLayout}>
            {getFieldDecorator('gender', {
              rules: [
                {
                  required: true,
                  message: '请选择性别'
                }
              ]
            })(
              <Select placeholder="请选择">
                <Select.Option value="male">男</Select.Option>
                <Select.Option value="female">女</Select.Option>
              </Select>
            )}
          </FormItem>

          <FormItem wrapperCol={{ ...formLayout.wrapperCol, offset: formLayout.labelCol.span }}>
            <Button type="primary" htmlType="submit">提交</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

// 必须给UserEditor定义一个包含router属性的contextTypes
// 使得组件中可以通过this.context.router来使用React Router提供的方法
UserEditor.contextTypes = {
  router: PropTypes.object.isRequired
};

/**
 * 使用Form.create({ ... })(UserEditor)处理之后的UserEditor组件会接收到一个props.form
 * 使用props.form下的一系列方法，可以很方便地创造表单
 */
UserEditor = Form.create()(UserEditor);

export default UserEditor;
