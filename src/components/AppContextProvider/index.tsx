import { useRef, useState } from "react"
import { AppContext } from "../../utils/context"
import { AppContextProviderComponent } from "./types"

export const AppContextProvider: AppContextProviderComponent = ({ children }) => {
  const cache = useRef(new Map<string, string>())
  const [error, setError] = useState<string>("")

  if (process.env.REACT_APP_USE_BROWSER_CACHE && localStorage) {
    if (!cache.current.size) {
      Object.keys(localStorage).forEach(key => {
        const localResult = localStorage.getItem(key);
        if (localResult) cache?.current.set(key, localResult)
      })
    }
  } else {
    localStorage.clear()
  }

  return (
    <AppContext.Provider value={{ setError, cache }}>
      {error ? (
        <div className="RampError">
          <h1 className="RampTextHeading--l">Oops. Application broken</h1>
          <div className="RampBreak--l" />
          Error: {error}
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  )
}
