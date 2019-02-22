/**
 * 主页
 */
import React from 'react';
// 引入样式表
import style from './css';

class Home extends React.Component {
  componentDidMount() {
    style.use();
  }
  componentWillUnmount() {
    style.unuse();
  }
  // 构造器
  constructor(props) {
    super(props);
    // 定义初始化状态
    this.state = {};
  }

  render() {
    return (
      <div className="welcome">
        Welcome
      </div>
    );
  }
}

export default Home;
