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
    {
        id: "4",
        title: "AI & Crypto: How Machine Learning is Revolutionizing Trading Strategies",
        description: "Explore the intersection of artificial intelligence and cryptocurrency, and how AI-powered tools are giving traders a new edge in the market.",
        category: "Technology",
        date: "Sep 5, 2024",
        href: "#",
        imageSlug: "insight-4",
    },
    {
        id: "5",
        title: "The Next Narrative: Identifying Trends Before They Happen",
        description: "A deep dive into the art of narrative trading, using on-chain data to spot emerging trends and position yourself ahead of the curve.",
        category: "Strategy",
        date: "Aug 29, 2024",
        href: "#",
        imageSlug: "insight-5",
    },
    {
        id: "6",
        title: "Airdrop Farming: Maximizing Your Yield in 2024",
        description: "Our comprehensive guide to airdrop farming, with tips and strategies for identifying opportunities and maximizing your returns.",
        category: "DeFi",
        date: "Aug 21, 2024",
        href: "#",
        imageSlug: "insight-6",
    }
];
