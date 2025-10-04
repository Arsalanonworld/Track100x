
export type Alert = {
    id: string;
    alertType: 'wallet' | 'token';
    walletId?: string;
    token?: string;
    rule: string;
    threshold?: number;
    enabled: boolean;
    createdAt: any; // Firebase Timestamp
    userId: string;
};
