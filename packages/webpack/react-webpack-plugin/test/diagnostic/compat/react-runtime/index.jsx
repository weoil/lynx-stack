import { Component, root } from '@lynx-js/react'

class App extends Component {
  render() {
    return <view lynx-key="foo"></view>
  }
}

root.render(
  <page>
    <App />
  </page>
)
