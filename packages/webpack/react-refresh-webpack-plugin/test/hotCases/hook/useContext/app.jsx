import { createContext, useContext } from '@lynx-js/react'

const Theme = createContext('light')

function Inner() {
  const theme = useContext(Theme)
  __RenderContent(`before: ${theme}`)
  return <text>before: {theme}</text>
}

export function App() {
  return (
    <Theme.Provider value={"dark"}>
      <Inner />
    </Theme.Provider>
  )
}

---
import { createContext, useContext } from '@lynx-js/react'

const Theme = createContext('light')

function Inner() {
  const theme = useContext(Theme)
  __RenderContent(`after: ${theme}`)
  return <text>after: {theme}</text>
}

export function App() {
  return (
    <Theme.Provider value={"dark"}>
      <Inner />
    </Theme.Provider>
  )
}


