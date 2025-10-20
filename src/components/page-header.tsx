
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
    <div className={cn('mb-6', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {title}
            </h1>
            {description && (
                <p className="mt-2 text-base sm:text-lg text-muted-foreground">{description}</p>
            )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
