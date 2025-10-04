
import { Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';

type PricingCardProps = {
    plan: string;
    price: string;
    pricePeriod?: string;
    description: string;
    features: { text: string; included: boolean }[];
    ctaText: string;
    ctaVariant?: 'default' | 'outline';
    highlight?: boolean;
    disabled?: boolean;
};

export const PricingCard = ({
    plan,
    price,
    pricePeriod,
    description,
    features,
    ctaText,
    ctaVariant = 'default',
    highlight = false,
    disabled = false,
}: PricingCardProps) => (
    <Card className={cn('flex flex-col text-left', highlight && 'border-primary ring-2 ring-primary shadow-lg')}>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">{plan}</CardTitle>
            <CardDescription>{description}</CardDescription>
            <div className="flex items-baseline pt-4">
                <span className="text-4xl font-bold tracking-tight">{price}</span>
                {pricePeriod && <span className="ml-1 text-xl font-medium text-muted-foreground">{pricePeriod}</span>}
            </div>
        </CardHeader>
        <CardContent className="flex-1">
            <ul className="space-y-3">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                        {feature.included ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-muted-foreground" />}
                        <span className={cn(!feature.included && 'text-muted-foreground line-through')}>{feature.text}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
        <CardFooter>
            <Button className="w-full" size="lg" variant={ctaVariant} disabled={disabled}>
                {ctaText}
            </Button>
        </CardFooter>
    </Card>
);
