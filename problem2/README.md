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

<img width="1904" height="907" alt="image" src="https://github.com/user-attachments/assets/14cd38db-d96b-4523-a16b-532e1d63b6e9" />

<img width="1903" height="909" alt="image" src="https://github.com/user-attachments/assets/45b2fd3d-d357-4995-9bf4-d9e6077f2df8" />

<img width="428" height="930" alt="image" src="https://github.com/user-attachments/assets/47306ffe-29c4-41f8-9681-bdab72ce47e2" />

<img width="428" height="930" alt="image" src="https://github.com/user-attachments/assets/e2ff6f49-f5ba-4446-9f01-8b8f81bde6e5" />
