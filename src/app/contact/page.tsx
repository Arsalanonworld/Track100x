
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Twitter, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
  { icon: <Twitter className="h-5 w-5" />, href: '#', name: 'Twitter' },
  { icon: <Linkedin className="h-5 w-5" />, href: '#', name: 'LinkedIn' },
  { icon: <Github className="h-5 w-5" />, href: '#', name: 'GitHub' },
];

const contactInfo = [
    { icon: <Mail className="h-5 w-5 text-primary" />, title: 'Support & Inquiries', value: 'support@track100x.com'},
]

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Get in Touch"
        description="Have a question or feedback? We'd love to hear from you."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left column for contact info */}
        <div className="lg:col-span-1 space-y-8">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Contact Information</h2>
                <p className="text-muted-foreground">
                    Reach out to us via email or find us on social media.
                </p>
                <div className="space-y-4">
                    {contactInfo.map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                            {item.icon}
                            <div>
                                <h3 className="font-semibold">{item.title}</h3>
                                <a href={`mailto:${item.value}`} className="text-muted-foreground hover:text-primary transition-colors">{item.value}</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Follow Us</h3>
                <div className="flex items-center gap-4">
                    {socialLinks.map((link) => (
                    <Button key={link.name} variant="outline" size="icon" asChild>
                        <Link href={link.href}>
                            {link.icon}
                            <span className="sr-only">{link.name}</span>
                        </Link>
                    </Button>
                    ))}
                </div>
            </div>
        </div>

        {/* Right column for the form */}
        <div className="lg:col-span-2">
            <Card>
            <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>Use the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your Name" />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="your@email.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="What is your message about?" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Your message..." rows={6} />
                    </div>
                    <Button type="submit" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                    </Button>
                </form>
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
