
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '../ui/input';

interface QuickAlertEditorProps {
  entity: {
    type: 'Wallet' | 'Token';
    identifier: string;
    label: string;
  };
  onSave: (rule: string) => void;
  onCancel: () => void;
}

const QuickAlertEditor: React.FC<QuickAlertEditorProps> = ({ entity, onSave, onCancel }) => {
  const [rule, setRule] = useState('value_over_10k');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Alert me about</Label>
        <Input value={`${entity.type}: ${entity.label}`} readOnly disabled />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rule">When</Label>
        <Select value={rule} onValueChange={setRule}>
          <SelectTrigger id="rule">
            <SelectValue placeholder="Select a condition..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value_over_10k">Transaction value exceeds $10,000</SelectItem>
            <SelectItem value="value_over_100k">Transaction value exceeds $100,000</SelectItem>
            <SelectItem value="any_transaction">Any transaction occurs</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(rule)}>Save Alert</Button>
      </div>
    </div>
  );
};

export default QuickAlertEditor;
