
export type TokenInfo = {
    symbol: string;
    name: string;
    iconUrl?: string;
};

export const tokenLibrary: Record<string, TokenInfo> = {
    ETH: { symbol: 'ETH', name: 'Ethereum', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png' },
    USDT: { symbol: 'USDT', name: 'Tether', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png' },
    USDC: { symbol: 'USDC', name: 'USD Coin', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png' },
    WIF: { symbol: 'WIF', name: 'dogwifhat', iconUrl: 'https://assets.coingecko.com/coins/images/34041/standard/wif.jpg?1715065403' },
    WBTC: { symbol: 'WBTC', name: 'Wrapped Bitcoin', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png' },
    BONK: { symbol: 'BONK', name: 'Bonk', iconUrl: 'https://assets.coingecko.com/coins/images/28600/standard/bonk.jpg?1715124248' },
    LINK: { symbol: 'LINK', name: 'Chainlink', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png' },
    SHIB: { symbol: 'SHIB', name: 'Shiba Inu', iconUrl: 'https://assets.coingecko.com/coins/images/11939/standard/shiba.png' },
    MATIC: { symbol: 'MATIC', name: 'Polygon', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polygon/assets/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/logo.png' },
    AVAX: { symbol: 'AVAX', name: 'Avalanche', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/avalanchec/assets/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7/logo.png' },
    DOGE: { symbol: 'DOGE', name: 'Dogecoin', iconUrl: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png' },
    SOL: { symbol: 'SOL', name: 'Solana', iconUrl: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png' },
    RNDR: { symbol: 'RNDR', name: 'Render Token', iconUrl: 'https://assets.coingecko.com/coins/images/4778/large/render.png' },
    PEPE: { symbol: 'PEPE', name: 'Pepe', iconUrl: 'https://assets.coingecko.com/coins/images/29853/large/pepe.jpeg' },
    BTC: { symbol: 'BTC', name: 'Bitcoin', iconUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png' },
    XRP: { symbol: 'XRP', name: 'XRP', iconUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ripple/info/logo.png' },
    ADA: { symbol: 'ADA', name: 'Cardano', iconUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cardano/info/logo.png' },
    LTC: { symbol: 'LTC', name: 'Litecoin', iconUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/litecoin/info/logo.png' },
    UNI: { symbol: 'UNI', name: 'Uniswap', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png' },
    AAVE: { symbol: 'AAVE', name: 'Aave', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png' },
    MKR: { symbol: 'MKR', name: 'Maker', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png' },
    CRV: { symbol: 'CRV', name: 'Curve DAO Token', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png' },
    SNX: { symbol: 'SNX', name: 'Synthetix', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png' },
    YFI: { symbol: 'YFI', name: 'yearn.finance', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e/logo.png' },
    '1INCH': { symbol: '1INCH', name: '1inch', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x111111111117dC0aa78b770fA6A738034120C302/logo.png' },
    SUSHI: { symbol: 'SUSHI', name: 'SushiSwap', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png' },
    COMP: { symbol: 'COMP', name: 'Compound', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png' },
    ZRX: { symbol: 'ZRX', name: '0x', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xE41d2489571d322189246DaFA5ebDe1F4699F498/logo.png' },
    BAL: { symbol: 'BAL', name: 'Balancer', iconUrl: 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png' },
    GNO: { symbol: 'GNO', name: 'Gnosis', iconUrl: 'https://assets.coingecko.com/coins/images/53/standard/gnosis.png?1696501422' },
    LDO: { symbol: 'LDO', name: 'Lido DAO', iconUrl: 'https://assets.coingecko.com/coins/images/13573/standard/Lido_DAO.png?1696513333' },
    JUP: { symbol: 'JUP', name: 'Jupiter', iconUrl: 'https://assets.coingecko.com/coins/images/34188/standard/jup.png?1715065963' },
    PYTH: { symbol: 'PYTH', name: 'Pyth Network', iconUrl: 'https://assets.coingecko.com/coins/images/32223/standard/pyth.png?1715063074' },
};
