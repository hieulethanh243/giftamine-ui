# GiftAmino - Frontend

A modern, beautiful wishlist sharing platform built with Next.js 16 and React. Share your gift wishes with friends and family, and keep track of what others want!

## 🎁 Features

- **Authentication System**
  - User login/registration with JWT tokens
  - Secure httpOnly cookie storage
  - Auto-refresh token mechanism
  - Account security with 15-minute access & 30-day refresh tokens

- **Wishlist Management**
  - Create and manage multiple wishlists
  - View personal wishlists and shared wishlists
  - Beautiful tabbed interface (All / My Wishlists / Shared with Me)
  - Real-time wishlist updates

- **Gift Item Management**
  - Add gifts to wishlists with details (name, price, link, image, notes)
  - Beautiful grid display with responsive layout
  - Mark items as purchased
  - Delete items from wishlist
  - View product links and images
  - Track purchase status and purchaser info

- **User Experience**
  - Responsive design (mobile, tablet, desktop)
  - Real-time data refresh on create/update/delete
  - Toast notifications for user feedback
  - Loading states and error handling
  - Optimized image loading with LCP support

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.1.6](https://nextjs.org/) with App Router & Turbopack
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **State Management**: [React Query v5](https://tanstack.com/query/latest) (TanStack Query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **HTTP Client**: [Axios](https://axios-http.com/) with custom interceptors
- **Icons**: [lucide-react](https://lucide.dev/)
- **Notifications**: [sonner](https://sonner.emilkowal.ski/)
- **Date Formatting**: [date-fns](https://date-fns.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📋 Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone git@github.com:hieulethanh243/giftamine-ui.git
cd giftamine-web

# Install dependencies
pnpm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Running Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the results.

The app will auto-reload on code changes thanks to Fast Refresh.

### Building for Production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
giftamine-web/
├── app/                           # Next.js App Router
│   ├── (app)/                    # Protected routes group
│   │   ├── home/                 # Home page with tabbed wishlists
│   │   └── wishlists/[id]/       # Wishlist detail page
│   ├── (auth)/                   # Auth routes group
│   │   ├── login/                # Login page
│   │   └── register/             # Register page (TODO)
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
│
├── components/
│   ├── auth/                     # Authentication components
│   │   └── login-form.tsx
│   ├── gift-item/                # Gift item components
│   │   ├── gift-item-card.tsx
│   │   └── add-gift-item-dialog.tsx
│   ├── wishlist/                 # Wishlist components
│   │   ├── wishlist-card.tsx
│   │   └── create-wishlist-dialog.tsx
│   ├── ui/                       # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   └── textarea.tsx
│   └── providers.tsx             # React Query & DevTools provider
│
├── lib/
│   ├── api/
│   │   ├── client.ts             # Axios client with interceptors
│   │   ├── auth.ts               # Authentication API calls
│   │   ├── wishlists.ts          # Wishlist API calls
│   │   └── gift-items.ts         # Gift items API calls
│   ├── hooks/
│   │   ├── wishlists.ts          # React Query hooks for wishlists
│   │   └── gift-items.ts         # React Query hooks for gift items
│   └── utils.ts                  # Utility functions
│
├── public/                        # Static assets
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── postcss.config.mjs            # PostCSS configuration
```

## 🔐 Authentication Flow

1. User logs in with credentials
2. Server returns access token (15 minutes) + refresh token (30 days)
3. Both tokens stored in httpOnly cookies
4. Each API request includes `Authorization: Bearer {token}` header
5. On 401 response, auto-refresh token and retry request
6. On refresh failure, redirect to login

## 🌐 API Integration

The frontend connects to a NestJS backend API:

- **Base URL**: Configurable via `NEXT_PUBLIC_API_URL`
- **Authentication**: JWT with auto-refresh
- **Error Handling**: Global error interceptors with user-friendly messages
- **Response Format**: `{ success, statusCode, message, data, timestamp }`

### Key Endpoints

```
POST   /auth/login                  - User login
POST   /auth/logout                 - User logout
POST   /auth/refresh                - Token refresh

GET    /wishlists/my-wishlists      - Get user's wishlists
GET    /wishlists/shared-with-me    - Get shared wishlists
GET    /wishlists/:id               - Get wishlist details
POST   /wishlists                   - Create wishlist
PATCH  /wishlists/:id               - Update wishlist
DELETE /wishlists/:id               - Delete wishlist

GET    /gift-items/wishlist/:id     - Get items in wishlist
POST   /gift-items/wishlist/:id     - Add gift item
PATCH  /gift-items/:id/purchase     - Mark item as purchased
DELETE /gift-items/:id              - Delete item
```

## 📱 Responsive Design

- **Mobile**: 1 column grid, optimized touch targets
- **Tablet**: 2-3 column grid
- **Desktop**: 4 column grid with full features

## 🎨 Key Components

### GiftItemCard

Displays individual gift items with:

- Image with fallback icon
- Price in VND format
- Purchase status badge
- Action buttons (View/Purchase/Delete)
- Purchaser information

### WishlistCard

Displays wishlist summary with:

- Wishlist name and description
- Item count
- Share status
- Action buttons

### AddGiftItemDialog

Form for adding new gifts with:

- Validation for required fields
- Optional fields: description, price, link, image URL
- Real-time form updates
- Success/error notifications

## 🚧 Upcoming Features

- [ ] User registration page
- [ ] Wishlist sharing functionality
- [ ] Direct share to users
- [ ] Shareable links
- [ ] Random gift selection
- [ ] Wishlist editing
- [ ] Gift item editing
- [ ] User profile page
- [ ] Search & filter wishlists
- [ ] Notifications system
- [ ] Anniversary/reminder features

## ⚙️ Configuration

### Image Domains

All external image domains are allowed for flexibility. Configure in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    { protocol: "https", hostname: "*" },
    { protocol: "http", hostname: "*" },
  ],
}
```

## 🐛 Known Issues

- Hydration warnings from Grammarly extension (safe to ignore)
- LCP warnings for above-fold images (performance notices)

## 📦 Dependencies

See `package.json` for full list. Key dependencies:

- `next`: ^16.1.6
- `react`: ^19.1.0
- `@tanstack/react-query`: ^5.90.21
- `axios`: ^1.7.7
- `react-hook-form`: ^7.54.2
- `zod`: ^3.24.2
- `tailwindcss`: ^4.0.5

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📝 License

This project is part of GiftAmino platform.

## 👨‍💻 Author

Created with ❤️ for the GiftAmino team

---

**Status**: Under active development 🚀

For questions or support, reach out to the development team.
