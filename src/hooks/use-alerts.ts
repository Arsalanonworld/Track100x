'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';


export interface Alert {
  id: string;
  type: 'Wallet' | 'Token';
  keyword: string;
  condition: string;
  chain: string;
  delivery: string;
  isQuick?: boolean;
  status?: 'Active' | 'Inactive';
  lastTriggered?: string;
}

interface AlertsContextType {
  alerts: Alert[];
  addAlert: (alertData: Omit<Alert, 'id' | 'status' | 'lastTriggered'>) => void;
  deleteAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  updateAlert: (id: string, newRule: string) => void;
  canAddAlert: () => boolean;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

const mockAlerts: Alert[] = [
    { id: '1', type: 'Wallet', keyword: '0x1234...abcd', condition: 'Value > $1M', chain: 'all', delivery: 'Email, In-App', status: 'Active', isQuick: true },
    { id: '2', type: 'Token', keyword: 'WIF', condition: 'Price change > 5%', chain: 'Solana', delivery: 'Email', status: 'Active', isQuick: true },
    { id: '3', type: 'Wallet', keyword: 'PEPE Whale', condition: 'Multi-condition', chain: 'all', delivery: 'Email, In-App', status: 'Inactive', isQuick: false },
];

const FREE_PLAN_LIMIT = 3;

export const AlertsProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const { isPro } = useAuth();
  const { toast } = useToast();

  const canAddAlert = useCallback(() => {
    if (isPro) return true;
    const activeAlerts = alerts.filter(a => a.status === 'Active').length;
    return activeAlerts < FREE_PLAN_LIMIT;
  }, [alerts, isPro]);


  const addAlert = (alertData: Omit<Alert, 'id' | 'status' | 'lastTriggered'>) => {
    const newAlert = {
      ...alertData,
      id: String(Date.now()),
      status: 'Active' as const,
      lastTriggered: 'Never',
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id: string) => {
    const alertToToggle = alerts.find(a => a.id === id);
    if (!alertToToggle) return;

    if (!isPro && alertToToggle.status === 'Inactive' && !canAddAlert()) {
      toast({
        title: 'Alert Limit Reached',
        description: 'Upgrade to Pro to have more than 3 active alerts.',
        variant: 'destructive',
        action: React.createElement(Button, { asChild: true }, React.createElement(Link, { href: "/upgrade" }, "Upgrade")),
      });
      return;
    }

    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id
          ? { ...alert, status: alert.status === 'Active' ? 'Inactive' : 'Active' }
          : alert
      )
    );
  };

  const updateAlert = (id: string, newRule: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id
          ? { ...alert, condition: newRule }
          : alert
      )
    );
  };


  return React.createElement(
    AlertsContext.Provider,
    { value: { alerts, addAlert, deleteAlert, toggleAlert, updateAlert, canAddAlert } },
    children
  );
};

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
};
