
import { cn } from '@/lib/utils';
import React from 'react';

type PageHeaderProps = {
  title: string;
  description?: string | React.ReactNode;
  className?: string;
  action?: React.ReactNode;
};

export default function PageHeader({ title, description, className, action }: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground truncate">
                {title}
            </h1>
            {description && (
                <p className="mt-1 text-muted-foreground max-w-2xl">{description}</p>
            )}
        </div>
        {action && <div className='shrink-0'>{action}</div>}
      </div>
    </div>
  );
}
