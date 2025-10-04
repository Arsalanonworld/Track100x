'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const triggerTypes = [
  { value: "Large Transaction", pro: false },
  { value: "Balance/Value Change", pro: false },
  { value: "Counterparty Interaction", pro: false },
  { value: "Price Change", pro: false },
];


const Condition = ({ index, onRemove }: { index: number, onRemove: (index: number) => void}) => {
    return (
        <div className="p-4 border rounded-lg space-y-4 relative bg-background">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Trigger Type</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a trigger..." />
                        </SelectTrigger>
                        <SelectContent>
                            {triggerTypes.map(type => 
                            <SelectItem key={type.value} value={type.value}>
                                {type.value}
                            </SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                     <Label>Condition</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a condition..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="greater_than">Is greater than</SelectItem>
                            <SelectItem value="less_than">Is less than</SelectItem>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Value</Label>
                <Input placeholder="e.g., 10 for %, 1000 for $, or a wallet address" />
            </div>
        </div>
    );
};


export default function AlertBuilder({ onSave }: { onSave: () => void }) {
    const [conditions, setConditions] = useState([{}]);

    const addCondition = () => {
        setConditions([...conditions, {}]);
    };

    const removeCondition = (index: number) => {
        setConditions(conditions.filter((_, i) => i !== index));
    }
    
    const handleSave = () => {
        toast({
            title: 'Alert Saved',
            description: 'Your new alert has been created.'
        })
        onSave();
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Linked Entity</h3>
                <p className="text-foreground text-sm">Build custom rule</p>
            </div>
            
            <div className="space-y-4">
                {conditions.map((_, index) => (
                    <div key={index}>
                         <Condition index={index} onRemove={removeCondition}/>
                    </div>
                ))}
            </div>

            <Button variant="outline" onClick={addCondition}>
                <Plus className="h-4 w-4 mr-2" />
                Add Condition (AND/OR)
            </Button>

            <div className="p-4 border rounded-lg space-y-2 bg-muted/50">
                 <h3 className="font-semibold text-sm text-muted-foreground">Rule Preview</h3>
                 <p className="text-sm text-foreground bg-background p-3 rounded-md font-mono">
                    ALERT IF (Large Transaction is greater than $1,000,000)
                 </p>
            </div>


            <div className="space-y-4">
                <h3 className="font-semibold">Delivery Options</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="email" defaultChecked />
                        <Label htmlFor="email">Email Notification</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="in-app" defaultChecked />
                        <Label htmlFor="in-app">In-App Notification</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="telegram" disabled/>
                        <Label htmlFor="telegram" className="text-muted-foreground">Telegram</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="discord" disabled/>
                        <Label htmlFor="discord" className="text-muted-foreground">Discord</Label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="ghost">Cancel</Button>
                <Button onClick={handleSave}>Save Alert</Button>
            </div>
        </div>
    );
}