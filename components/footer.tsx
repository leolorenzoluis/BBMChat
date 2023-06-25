import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'
import { SquigglyLines } from './ui/icons'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      <span className="relative whitespace-nowrap text-red-600 ">
        <SquigglyLines />
        <span className="relative text-bold">BBM Chatbot</span>
      </span>{' '}
      built with 🤖 ❤️ by{' '}
      <span className="relative whitespace-nowrap text-blue-600 text-bold">
        <ExternalLink href="mailto:contact@leoluis.xyz">Leo Luis.</ExternalLink>
      </span>
    </p>
  )
}
