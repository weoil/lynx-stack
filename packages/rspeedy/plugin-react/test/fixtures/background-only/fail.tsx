import { root } from '@lynx-js/react'
import { backgroundCall } from './backgroundCall.js'

function App() {
  backgroundCall()

  return (
    <view>
      <text>Hello, Lynx x rspeedy</text>
    </view>
  )
}

root.render(
  <page>
    <App />
  </page>,
)
