
import { BarChart, Bell, CheckCircle } from "lucide-react";
import { WhaleIcon } from "./icons/whale-icon";

const features = [
    {
        icon: <WhaleIcon className="h-5 w-5 text-muted-foreground" />,
        label: "Live Whale Feed"
    },
    {
        icon: <BarChart className="h-5 w-5 text-muted-foreground" />,
        label: "Wallet Leaderboards"
    },
    {
        icon: <Bell className="h-5 w-5 text-muted-foreground" />,
        label: "Real-Time Alerts"
    },
    {
        icon: <CheckCircle className="h-5 w-5 text-muted-foreground" />,
        label: "Free for Everyone"
    }
]

export default function HeroStats() {
    return (
        <section className="py-6 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                    {features.map((feature, index) => (
                       <div key={feature.label} className="flex items-center gap-3">
                            {feature.icon}
                            <span className="text-sm font-medium text-muted-foreground">{feature.label}</span>
                       </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
