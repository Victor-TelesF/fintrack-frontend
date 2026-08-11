'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Landmark,
  Menu,
  ReceiptText,
  LogOut,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from './auth-provider'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const items = [
  { href: '/dashboard', label: 'Visão geral', icon: BarChart3 },
  { href: '/assets', label: 'Ativos', icon: Landmark },
  { href: '/transactions', label: 'Operações', icon: ReceiptText },
]
function Brand() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3 font-semibold tracking-tight"
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <TrendingUp className="size-5" aria-hidden="true" />
      </span>
      <span className="text-lg">FinTrack</span>
    </Link>
  )
}
function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1" aria-label="Navegação principal">
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            pathname.startsWith(href)
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-sidebar p-5 lg:flex">
        <Brand />
        <div className="mt-10">
          <Nav />
        </div>
        <div className="mt-auto flex items-center gap-3 rounded-xl bg-muted p-3">
          <Avatar className="size-9">
            <AvatarFallback>
              {user?.slice(0, 2).toUpperCase() || 'FT'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user}</p>
            <p className="text-xs text-muted-foreground">Conta pessoal</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={signOut}
            aria-label="Sair"
          >
            <LogOut />
          </Button>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-8 lg:justify-end">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" aria-label="Abrir menu">
                    <Menu />
                  </Button>
                }
              />
              <SheetContent side="left" className="w-72 p-5">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu principal</SheetTitle>
                  <SheetDescription>Navegue pelo FinTrack</SheetDescription>
                </SheetHeader>
                <Brand />
                <div className="mt-10">
                  <Nav />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-3 lg:hidden">
            <span className="max-w-32 truncate text-sm font-medium">
              {user}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              aria-label="Sair"
            >
              <LogOut />
            </Button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
