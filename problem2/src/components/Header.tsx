export function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-logo">
          <h1 className="header-title">Currency Swap</h1>
        </div>
        <nav className="header-nav">
          <a href="#" className="nav-link active">Swap</a>
          <a href="#" className="nav-link">Pools</a>
          <a href="#" className="nav-link">Farm</a>
        </nav>
        <div className="header-actions">
          <button className="header-button connect-wallet">
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  )
}