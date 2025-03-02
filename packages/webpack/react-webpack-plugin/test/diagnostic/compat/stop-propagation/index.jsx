import { Component, root } from '@lynx-js/react'

class App extends Component {
  handleClick(e) {
    e.stopPropagation()
  }
  
  render() {
    return <view bindtap={this.handleClick.bind(this)}><text>Hello, world</text></view>
  }
}

root.render(
  <page>
    <App />
  </page>
)
