import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import { clearChats } from '@/app/actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { SidebarList } from '@/components/sidebar-list'
import {
  IconGitHub,
  IconNextChat,
  IconRobot,
  IconSeparator,
  IconVercel,
  SquigglyLines
} from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { UserMenu } from '@/components/user-menu'
import { LoginButton } from '@/components/login-button'
import { ExternalLink } from './external-link'

export async function Header() {
  const session = await auth()
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        {session?.user ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              {/* @ts-ignore */}
              <SidebarList userId={session?.user?.id} />
            </React.Suspense>
            <SidebarFooter>
              <ThemeToggle />
              <ClearHistory clearChats={clearChats} />
            </SidebarFooter>
          </Sidebar>
        ) : (
          <Link href="/" target="_blank" rel="nofollow">
            <IconRobot className="w-6 h-6 mr-2 dark:hidden" />
            <IconRobot className="hidden w-6 h-6 mr-2 dark:block" />
          </Link>
        )}
        <div className="flex items-center">
          <IconSeparator className="w-6 h-6 text-muted-foreground/50" />
          <p
            className={cn(
              'px-2 text-center text-xs leading-normal text-muted-foreground'
            )}
          >
            <span className="relative whitespace-nowrap text-red-600 ">
              <SquigglyLines />
              <span className="relative text-bold">BBM Chatbot</span>
            </span>{' '}
            built with 🤖 ❤️ by{' '}
            <span className="relative whitespace-nowrap text-blue-600 text-bold">
              <ExternalLink href="https://www.leoluis.xyz">
                Leo Luis.
              </ExternalLink>
            </span>
          </p>
        </div>
      </div>
    </header>
  )
}
