# Currency Swap Form

A modern, interactive currency swap form built with React, TypeScript, and Vite.

## Features

### Core Functionality
- **Real-time currency swapping** with live price data from API
- **Automatic exchange rate calculation** based on current token prices
- **Bidirectional amount conversion** - automatically calculates the opposite amount when you type in either field
- **Token swap functionality** - quickly swap selected tokens and amounts with one click

### User Experience
- **Token search** - search tokens by symbol or name in dropdown selector
- **Smart token disabling** - prevents selecting the same token for both "From" and "To" fields
- **Real-time validation** with clear error messages using React Hook Form + Zod
- **Cross-field validation** - validates dependent fields and clears errors automatically
- **Token icon integration** with fallback display for missing icons
- **Market prices list** - displays top tokens with prices and 24h change percentage
- **Exchange rate display** - shows current conversion rate between selected tokens

### Development & Testing
- **Fast development with Vite** - instant HMR and optimized builds
- **Comprehensive unit tests** with Vitest and React Testing Library
- **TypeScript** for type safety and better developer experience

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Technologies

- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4
- Tailwind CSS - Utility-first CSS framework
- SCSS - CSS preprocessor
- Vitest 4.0.17
- React Testing Library

## API Integration

- Token prices: `https://interview.switcheo.com/prices.json`
- Token icons: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/{SYMBOL}.svg`
