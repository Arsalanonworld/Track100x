
type ExplorerEntity = 'tx' | 'address';

export const getExplorerUrl = (network: string, value: string, entity: ExplorerEntity): string => {
    switch (network.toLowerCase()) {
        case 'ethereum':
            return `https://etherscan.io/${entity}/${value}`;
        case 'solana':
            return `https://solscan.io/${entity}/${value}`;
        case 'bitcoin':
            return `https://www.blockchain.com/btc/${entity}/${value}`;
        default:
            return '#';
    }
}
