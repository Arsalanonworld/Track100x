# Track100x: Blockchain Intelligence Platform

Track100x is a Next.js application designed to be a comprehensive blockchain intelligence platform. It provides users with tools to decode on-chain behavior, discover opportunities, and track significant market movements in real-time.

This project was built within [Firebase Studio](https://studio.firebase.google.com).

## ✨ Key Features

- **Real-Time Whale Feed**: A live stream of significant on-chain transactions, filterable by token, chain, and type.
- **Smart Money Dashboard**: A leaderboard to discover and track the most influential and profitable wallets.
- **Personalized Watchlist**: Users can add wallets and tokens to their own watchlist for easy monitoring.
- **Advanced Alert System**: Create custom, multi-conditional alerts for on-chain events (e.g., large transactions, price changes).
- **Portfolio Tracking**: An aggregated view of on-chain wealth from watched wallets.
- **Secure Authentication**: User accounts managed via Firebase Authentication (Email & Google).
- **Pro & Free Tiers**: Implements a subscription model with feature-locking for different user plans.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **AI Features**: [Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Arsalanonworld/Track100x.git
    cd Track100x
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    The application runs on `http://localhost:9002` by default.
    ```bash
    npm run dev
    ```

### Firebase Configuration

The application is pre-configured to connect to a Firebase project. The configuration is located in `src/firebase/config.ts`. To connect to your own Firebase project, you can update this file with your project's credentials.

## ☁️ Deployment

This application is configured for continuous deployment to **Firebase App Hosting**.

1.  **Connect to GitHub**: Follow the instructions in the Firebase Console to connect your Firebase project to this GitHub repository.
2.  **Set Live Branch**: Configure the `main` branch as the "Live branch".
3.  **Push to Deploy**: Every `git push` to the `main` branch will automatically trigger a new build and deploy it to your App Hosting backend.
