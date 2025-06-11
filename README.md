
# High-Level System Architecture

![image](https://github.com/user-attachments/assets/e44998b0-b173-4e91-97d6-3c460218b147)

# Core Technology Stack

## 💻 Frontend Stack Overview

| 🧰 Technology          | 📝 Purpose               | 📁 Key Files |
|-----------------------|--------------------------|--------------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white) `React 19.1.0` | UI Framework           | `src/main.tsx` |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) `TypeScript` | Type Safety            | `src/features/payment/types/payment.type.ts`  |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) `Vite` | Build Tool             | `package.json`  |
| ![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat&logo=redux&logoColor=white) `Redux Toolkit` | Client State           | `src/main.tsx`  |
| ![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat&logo=reactquery&logoColor=white) `React Query` | Server State (REST)    | `src/main.tsx`  <br> `src/components/home/Drinks.tsx` |
| ![Apollo](https://img.shields.io/badge/Apollo_Client-311C87?style=flat&logo=apollo-graphql&logoColor=white) `Apollo Client` | GraphQL Client         | `src/main.tsx`  |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=reactrouter&logoColor=white) `React Router` | Routing                | `src/routes/index.tsx` |
| ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white) `Tailwind CSS` | Styling                | `package.json` |


# Core Functional Domains


## E-commerce Features

The application provides complete e-commerce functionality including:

- Product Management: Browse products with filtering, search, and detailed views
- Shopping Cart: Add/remove items, quantity management, cart persistence
- Checkout Process: Multi-step checkout with shipping information and payment selection
- Payment Integration: VNPay gateway integration and cash-on-delivery options
- Order Management: Order tracking and status management
### User Management
- Authentication: Email/password login, Google OAuth integration
- User Profiles: Personal information management and shipping preferences
- Session Management: Persistent authentication state with Redux Persist
### Administrative Features
- Product Administration: Product listing and management interface
- Analytics Dashboard: Business metrics and reporting


# Application Structure

## Routing Architecture

## State Management Strategy

The application employs a multi-layered state management approach:

Redux: Client-side state (authentication, shopping cart)
React Query: Server state for REST APIs (product data)
Apollo Client: GraphQL operations (real-time features, complex queries)
Local Storage: Order persistence and user preferences


## Key Integration Points
Payment System Integration
The checkout system integrates with VNPay payment gateway while supporting fallback payment methods:

## Real-time Features
Apollo Client provides real-time capabilities through GraphQL subscriptions for features like live feedback updates and order status notifications.

## System Boundaries
The frontend application interfaces with:

- GraphQL API: Primary data source for complex operations
- REST APIs: Product catalog and pricing information
- VNPay Payment Gateway: Financial transaction processing
- Google OAuth: Third-party authentication
- Local Storage: Client-side data persistence
## The application does not handle:

- Server-side rendering (pure SPA)
- Direct database operations
- Payment processing logic (delegated to VNPay)
- Email services (handled by backend)











# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Get more detail in https://deepwiki.com/NMCuonG08/CaffeeShop-FE

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
