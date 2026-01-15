import { useState } from 'react'

interface BottomMenuProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

// Simple SVG Icons
const SwapIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isActive ? '#F0B90B' : '#9CA3AF'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7h18M7 3l-4 4 4 4M21 17H3M17 21l4-4-4-4" />
  </svg>
)

const PoolsIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isActive ? '#F0B90B' : '#9CA3AF'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
  </svg>
)

const FarmIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isActive ? '#F0B90B' : '#9CA3AF'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
)

const WalletIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isActive ? '#F0B90B' : '#9CA3AF'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

export function BottomMenu({ activeTab = 'swap', onTabChange }: BottomMenuProps) {
  const [currentTab, setCurrentTab] = useState(activeTab)

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab)
    onTabChange?.(tab)
  }

  const menuItems = [
    { id: 'swap', label: 'Swap', icon: SwapIcon },
    { id: 'pools', label: 'Pools', icon: PoolsIcon },
    { id: 'farm', label: 'Farm', icon: FarmIcon },
    { id: 'wallet', label: 'Wallet', icon: WalletIcon },
  ]

  return (
    <nav className="bottom-menu">
      {menuItems.map((item) => {
        const IconComponent = item.icon
        const isActive = currentTab === item.id
        return (
          <button
            key={item.id}
            className={`bottom-menu-item ${isActive ? 'active' : ''}`}
            onClick={() => handleTabClick(item.id)}
            aria-label={item.label}
          >
            <span className="bottom-menu-icon">
              <IconComponent isActive={isActive} />
            </span>
            <span className="bottom-menu-label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}