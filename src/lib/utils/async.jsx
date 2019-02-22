import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

let Delay = 200
  , Loading = null;

class AsyncComponent extends React.PureComponent {
  static setDelay = v => Delay = v
  static setLoading = v => Loading = v

  static propTypes = {
    delay: PropTypes.number,
    component: PropTypes.func.isRequired,
    loading: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
    ]),
  }

  static defaultProps = {
    delay: null,
    loading: null,
  }

  constructor(props) {
    super(props);

    this.$isUnmount = false;
    this.state = {
      Component: null,
      isExpired: false,
    };
  }

  componentDidMount() {
    const { delay, component } = this.props
      , token = setTimeout(() => !this.$isUnmount && this.setState({
        isExpired: true,
      }), delay || Delay);

    component().then(v => {
      clearTimeout(token);

      if (this.$isUnmount) {
        return;
      }

      this.setState({
        Component: v.__esModule ? v.default : v,
      });
    });
  }

  componentWillUnmount() {
    this.$isUnmount = true;
  }

  render() {
    const { loading, ...rest } = this.props
      , { Component } = this.state
      , loadingX = loading || Loading;

    if (Component) {
      // return React.createElement(Component, rest);
      return (
        <Route {...rest} component={Component} />
      );
    } else if (this.state.isExpired) {
      return loadingX ? React.createElement(loadingX) : null;
    } else {
      return null;
    }
  }
}

export default AsyncComponent;
