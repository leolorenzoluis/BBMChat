import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      BBM chatbot built with 🤖 ❤️ by{' '}
      <ExternalLink href="mailto:contact@leoluis.xyz">Leo Luis.</ExternalLink>
    </p>
  )
}
