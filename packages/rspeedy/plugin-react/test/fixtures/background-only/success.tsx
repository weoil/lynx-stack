import { root, useEffect } from '@lynx-js/react'
import { backgroundCall } from './backgroundCall.js'

function App() {
  useEffect(() => {
    backgroundCall()
  })

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
