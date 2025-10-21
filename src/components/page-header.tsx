
import { cn } from '@/lib/utils';
import React from 'react';

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
};

export default function PageHeader({ title, description, className, action }: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center text-center gap-4 relative">
        <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                {title}
            </h1>
            {description && (
                <p className="mt-1 text-muted-foreground max-w-2xl mx-auto">{description}</p>
            )}
        </div>
        {action && <div className="sm:absolute sm:right-0">{action}</div>}
      </div>
    </div>
  );
}
