import { useState } from 'react'
import { CurrencySwapForm } from './components/CurrencySwapForm'
import { TokenPriceList } from './components/TokenPriceList'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { BottomMenu } from './components/BottomMenu'
import type { Token } from './types/token'
import './App.scss'

function App() {
  const [tokens, setTokens] = useState<Token[]>([])

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <div className="app-content-wrapper">
          <div className="app-content-left">
            <TokenPriceList tokens={tokens} />
          </div>
          <div className="app-content-center">
            <CurrencySwapForm
              onTokensLoaded={(loadedTokens) => {
                setTokens(loadedTokens)
              }}
            />
          </div>
          <div className="app-content-right">
            {/* Reserved for future widgets */}
          </div>
        </div>
      </main>
      <Footer />
      <BottomMenu />
    </div>
  )
}

export default App
