export type Article = {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
    href: string;
    imageSlug: string;
};

export const mockArticles: Article[] = [
    {
        id: "1",
        title: "The Rise of Solana Memecoins: A New Era of Community-Driven Value",
        description: "An in-depth analysis of the recent surge in Solana-based memecoins, exploring the factors driving their popularity and what it means for the future of the ecosystem.",
        category: "Market Analysis",
        date: "Oct 2, 2024",
        href: "#",
        imageSlug: "insight-1",
    },
    {
        id: "2",
        title: "Whale Wallet 0x123...aBcd Moves $52.2M ETH to Kraken: What's the Play?",
        description: "We break down the massive transaction from a known whale, speculating on the potential motives, from profit-taking to a strategic repositioning for a new trade.",
        category: "Whale Watch",
        date: "Sep 28, 2024",
        href: "#",
        imageSlug: "insight-2",
    },
    {
        id: "3",
        title: "Understanding On-Chain Data: A Beginner's Guide to Tracking Smart Money",
        description: "New to on-chain analysis? This guide will walk you through the basics of reading blockchain data to identify patterns and follow the moves of influential wallets.",
        category: "Education",
        date: "Sep 15, 2024",
        href: "#",
        imageSlug: "insight-3",
    },
]
