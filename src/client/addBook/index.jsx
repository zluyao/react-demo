/**
 * 图书编辑器组件
 */
import React from 'react';
// 引入 antd 组件
// import { Input, InputNumber, Form, Button, message } from 'antd';
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
// 表单布局
const formLayout = {
  // label 标签布局，同 <Col> 组件
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 16
  }
};

class BookEditor extends React.Component {
  // 构造器
  constructor(props, context) {
    super(props, context);

    this.state = {
      recommendUsers: []
    };
    // 绑定this
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOwnerIdChange = this.handleOwnerIdChange.bind(this);
  }

  // 生命周期--组件加载完毕
  componentDidMount() {
    /**
     * 在componentWillMount里使用form.setFieldsValue无法设置表单的值
     * 所以在componentDidMount里进行赋值
     */
    const { editTarget, form } = this.props;
    if (editTarget) {
      form.setFieldsValue(editTarget);
    }
  }

  // 按钮提交事件
  handleSubmit(e) {
    // 阻止submit默认行为
    e.preventDefault();
    // 定义常量
    const { form, editTarget } = this.props; // 组件传值
    // 验证
    form.validateFields((err, values) => {
      if (err) {
        message.warn(err);
        return;
      }

      // 默认值
      let editType = '添加';
      let apiUrl = 'http://localhost:8000/book';
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
          if (res.id) {
            message.success(editType + '添加图书成功!');
            // 跳转到用户列表页面
            this.context.router.push('/book/list');
          } else {
            message.error(editType + '添加图书失败!');
          }
        })
        // 失败的回调
        .catch((err) => console.error(err));
    });
  }

  // 获取推荐用户信息
  getRecommendUsers(partialUserId) {
    // 请求数据
    ajax.get('http://localhost:8000/user?id_like=' + partialUserId)
      .then((res) => {
        if (res.length === 1 && res[0].id === partialUserId) {
          // 如果结果只有1条且id与输入的id一致,说明输入的id已经完整了,没必要再设置建议列表
          return;
        }

        // 设置建议列表
        this.setState({
          recommendUsers: res.map((user) => {
            return {
              text: `${user.id}(${user.name})`,
              value: user.id
            }
          })
        });
      })
  }

  // 计时器
  timer = 0;
  handleOwnerIdChange(value) {
    this.setState({
      recommendUsers: []
    });

    // 使用"节流"的方式进行请求,防止用户输入的过程中过多地发送请求
    if (this.timer) {
      // 清除计时器
      clearTimeout(this.timer);
    }

    if (value) {
      // 200毫秒内只会发送1次请求
      this.timer = setTimeout(() => {
        // 真正的请求方法
        this.getRecommendUsers(value);
        this.timer = 0;
      }, 200);
    }
  }

  render() {
    // 定义常量
    const { recommendUsers } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSubmit} style={{ width: '400' }}>
        <FormItem label="书名:" {...formLayout}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入书名'
              }
            ]
          })(
            <Input type="text" />
          )}
        </FormItem>

        <FormItem label="价格:" {...formLayout}>
          {getFieldDecorator('price', {
            rules: [
              {
                required: true,
                message: '请输入价格',
                type: 'number'
              },
              {
                min: 1,
                max: 99999,
                type: 'number',
                message: '请输入1~99999的数字'
              }
            ]
          })(
            <InputNumber />
          )}
        </FormItem>

        <FormItem label="所有者:" {...formLayout}>
          {getFieldDecorator('owner_id', {
            rules: [
              {
                required: true,
                message: '请输入所有者ID'
              },
              {
                pattern: /^\d*$/,
                message: '请输入正确的ID'
              }
            ]
          })(
            <Input type="text"/>
          )}
        </FormItem>

        <FormItem wrapperCol={{ span: formLayout.wrapperCol.span, offset: formLayout.labelCol.span }}>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    );
  }
}

// 必须给BookEditor定义一个包含router属性的contextTypes
// 使得组件中可以通过this.context.router来使用React Router提供的方法
BookEditor.contextTypes = {
  router: PropTypes.object.isRequired
};

BookEditor = Form.create()(BookEditor);

export default BookEditor;
