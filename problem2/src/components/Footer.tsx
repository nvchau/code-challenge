export function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Currency Swap</h3>
          <p className="footer-description">
            Swap tokens instantly with the best rates
          </p>
        </div>
        <div className="footer-section">
          <h4 className="footer-heading">Products</h4>
          <ul className="footer-links">
            <li><a href="#">Swap</a></li>
            <li><a href="#">Liquidity</a></li>
            <li><a href="#">Farming</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4 className="footer-heading">Resources</h4>
          <ul className="footer-links">
            <li><a href="#">Documentation</a></li>
            <li><a href="#">API</a></li>
            <li><a href="#">Support</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4 className="footer-heading">Community</h4>
          <ul className="footer-links">
            <li><a href="#">Twitter</a></li>
            <li><a href="#">Discord</a></li>
            <li><a href="#">Telegram</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2026 Currency Swap.
        </p>
      </div>
    </footer>
  )
}