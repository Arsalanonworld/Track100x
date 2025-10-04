'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const triggerTypes = [
  { value: "Large Transaction", pro: false },
  { value: "Balance/Value Change", pro: false },
  { value: "Counterparty Interaction", pro: false },
  { value: "Price Change", pro: false },
  { value: "Leaderboard Rank Change", pro: false },
  { value: "PnL Shift", pro: false },
  { value: "Gas Fee Spike", pro: false },
  { value: "Dormancy Status", pro: false },
  { value: "Contract Deployment", pro: false },
  { value: "Liquidity Shift", pro: false },
];


const Condition = ({ index, onRemove }: { index: number, onRemove: (index: number) => void}) => {

    return (
        <div className="p-4 border rounded-lg space-y-4 relative bg-background">
             {index > 0 && <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => onRemove(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>}
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
                                <div className="flex items-center justify-between w-full">
                                    <span>{type.value}</span>
                                </div>
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


export default function AlertBuilder({ entity, onSave }: { entity: any, onSave: () => void }) {
    const [conditions, setConditions] = useState([{}]);
    const [logic, setLogic] = useState('AND');

    const addCondition = () => {
        setConditions([...conditions, {}]);
    };

    const removeCondition = (index: number) => {
        setConditions(conditions.filter((_, i) => i !== index));
    }
    
    const handleSave = () => {
        onSave();
    }


    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Linked Entity</h3>
                <p className="text-foreground font-mono text-sm">{entity?.identifier}</p>
            </div>
            
            <div className="space-y-4">
                {conditions.map((_, index) => (
                    <div key={index} className="space-y-4">
                         <Condition index={index} onRemove={removeCondition}/>
                         {index < conditions.length - 1 && (
                             <div className="flex justify-center items-center">
                                <Switch
                                    id={`logic-switch-${index}`}
                                    checked={logic === 'OR'}
                                    onCheckedChange={(checked) => setLogic(checked ? 'OR' : 'AND')}
                                    className="data-[state=checked]:bg-orange-500"
                                />
                                <Label htmlFor={`logic-switch-${index}`} className="ml-2 font-semibold">{logic}</Label>
                             </div>
                         )}
                    </div>
                ))}
            </div>

                <div className="flex justify-center">
                    <Button variant="outline" onClick={addCondition}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Condition (AND/OR)
                    </Button>
                </div>

            <div className="p-4 border rounded-lg space-y-2 bg-muted/50">
                 <h3 className="font-semibold text-sm text-muted-foreground">Rule Preview</h3>
                 <p className="text-sm text-foreground bg-background p-3 rounded-md font-mono">
                    ALERT IF (Large Transaction is greater than $1,000,000)
                 </p>
            </div>


            <div className="space-y-4">
                <h3 className="font-semibold">Delivery Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="email" defaultChecked />
                        <Label htmlFor="email">Email Notification</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="in-app" defaultChecked />
                        <Label htmlFor="in-app">In-App Notification</Label>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                 <div className="flex items-center space-x-2 opacity-70">
                                    <Checkbox id="telegram" disabled/>
                                    <Label htmlFor="telegram">Telegram</Label>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Coming Soon!</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                     <TooltipProvider>
                        <Tooltip>
                             <TooltipTrigger asChild>
                                <div className="flex items-center space-x-2 opacity-70">
                                    <Checkbox id="discord" disabled/>
                                    <Label htmlFor="discord">Discord</Label>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Coming Soon!</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost">Cancel</Button>
                <Button onClick={handleSave}>Save Alert</Button>
            </div>
        </div>
    );
}