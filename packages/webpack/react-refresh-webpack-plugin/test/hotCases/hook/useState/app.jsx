import { useState } from '@lynx-js/react'

function Inner({ theme }) {
  __RenderContent(`before: ${theme}`)
  return <text>before: {theme}</text>
}

export function App() {
  const [theme, setTheme] = useState("light")
  setTimeout(() => {
    setTheme("dark");
  }, 100);
  return (
    <Inner theme={theme}/>
  )
}

---
import { useState } from '@lynx-js/react'

function Inner({ theme }) {
  __RenderContent(`after: ${theme}`)
  return <text>after: {theme}</text>
}

export function App() {
  const [theme] = useState("light")
  return (
    <Inner theme={theme} />
  )
}
