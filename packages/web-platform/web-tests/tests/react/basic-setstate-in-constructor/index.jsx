// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { Component, root } from '@lynx-js/react';
class Foo extends Component {
  constructor(props) {
    super(props);
    // the following line made `this._nextState !== this.state` be truthy prior to the fix for preactjs/preact#2638
    this.state = { react: '111' };
    this.setState({ react: 'awesome' });
  }
  render() {
    return <text>{this.state.react}</text>;
  }
}
root.render(<Foo></Foo>);
