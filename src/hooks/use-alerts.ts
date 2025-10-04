
'use client';
import { useState } from 'react';

// This is a mock hook. In a real app, this would interact with a backend or global state.
// For now, it just manages a local list of alerts.

type Alert = {
    id: string;
    type: 'Wallet' | 'Token';
    keyword: string;
    condition: string;
    chain: string;
    delivery: string;
    isQuick?: boolean;
};

const MAX_FREE_ALERTS = 3;

export const useAlerts = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    
    // In a real app, you would also get the user's plan (free/pro)
    const isPro = false; 

    const canAddAlert = () => {
        if (isPro) return true;
        return alerts.length < MAX_FREE_ALERTS;
    };

    const addAlert = (alert: Alert) => {
        if (!canAddAlert()) {
            console.error("Cannot add more alerts.");
            return;
        }
        setAlerts(prev => [...prev, alert]);
    };

    return {
        alerts,
        addAlert,
        canAddAlert,
    };
};
