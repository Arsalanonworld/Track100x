
'use client';
import { useState, useEffect } from 'react';

const phrases = [
    'Follow the Smart Money.',
    'Decode On-Chain Data.',
    'Anticipate Market Moves.',
    'Unlock Crypto Alpha.',
];

export default function HeroSection() {
    const [text, setText] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentPhrase = phrases[phraseIndex];
        const typingSpeed = 100;
        const deletingSpeed = 50;
        const delayAfterTyping = 2000;

        const handleTyping = () => {
            if (isDeleting) {
                if (text.length > 0) {
                    setText(current => current.substring(0, current.length - 1));
                } else {
                    setIsDeleting(false);
                    setPhraseIndex(current => (current + 1) % phrases.length);
                }
            } else {
                if (text.length < currentPhrase.length) {
                    setText(current => currentPhrase.substring(0, current.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), delayAfterTyping);
                }
            }
        };

        const typingTimeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(typingTimeout);
    }, [text, isDeleting, phraseIndex]);

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-card to-background flex items-center justify-center min-h-[240px] py-8">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)] dark:opacity-20"></div>
            <div className="container mx-auto px-4 text-center relative">
                <h1 className="relative text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl text-foreground inline-block h-20 items-center">
                    <span>{text}</span>
                    <span className="absolute -right-2 top-0 bottom-0 w-1.5 bg-primary animate-blinking-cursor"></span>
                </h1>
            </div>
        </section>
    );
}
