// 创建一个错误边界
import React from 'react';

export default class ErrorBoundary extends React.Component {
  state: any;
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      // @ts-ignore
      return <h1>出现了未知错误，请联系客服哟</h1>;
    }

    return this.props.children;
  }
}
