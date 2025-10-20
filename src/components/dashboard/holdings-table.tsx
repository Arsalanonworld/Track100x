
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CryptoIcon } from '../crypto-icon';

const mockHoldings = [
    { token: 'WIF', amount: '1,234.56', value: '$500,000', allocation: 45.3 },
    { token: 'ETH', amount: '100.00', value: '$350,000', allocation: 31.8 },
    { token: 'USDC', amount: '150,000', value: '$150,000', allocation: 13.6 },
    { token: 'SOL', amount: '500.00', value: '$75,000', allocation: 6.8 },
    { token: 'RNDR', amount: '2,500.00', value: '$25,000', allocation: 2.3 },
];

export function HoldingsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aggregated Token Holdings</CardTitle>
        <CardDescription>
          A consolidated view of all tokens held across your watched wallets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead className="hidden sm:table-cell">Amount</TableHead>
              <TableHead>Value (USD)</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Allocation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockHoldings.map((holding) => (
              <TableRow key={holding.token}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <CryptoIcon token={holding.token} className="h-8 w-8" />
                    <span className="font-semibold">{holding.token}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{holding.amount}</TableCell>
                <TableCell>{holding.value}</TableCell>
                <TableCell className="text-right font-medium hidden sm:table-cell">
                  {holding.allocation.toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
