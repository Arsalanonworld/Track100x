'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { Article } from "@/lib/insights-data";
import { PlaceHolderImagesById } from "@/lib/placeholder-images";

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
    const image = PlaceHolderImagesById[article.imageSlug];
    
    return (
        <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
            {image && (
                 <Link href={article.href} className="block relative w-full h-48">
                    <Image 
                        src={image.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                    />
                </Link>
            )}
            <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">{article.category}</Badge>
                <CardTitle className="text-xl leading-tight font-bold">
                    <Link href={article.href} className="hover:text-primary transition-colors">
                        {article.title}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <p className="text-muted-foreground text-sm">{article.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{article.date}</span>
                </div>
                <Button variant="link" asChild className="p-0">
                    <Link href={article.href}>Read More <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
            </CardFooter>
        </Card>
    )
}