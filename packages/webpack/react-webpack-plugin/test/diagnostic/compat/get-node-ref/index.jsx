import { Component, root } from '@lynx-js/react'

class App extends Component {
  componentDidMount() {
    this.getNodeRef('foo')
    this.getNodeRefFromRoot('bar')
  }
  
  render() {
    return <view><text>Hello, world</text></view>
  }
}

root.render(
  <page>
    <App />
  </page>
)
