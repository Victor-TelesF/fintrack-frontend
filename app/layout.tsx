import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AuthProvider } from '@/components/auth-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = { title: { default: 'FinTrack', template: '%s | FinTrack' }, description: 'Controle seus investimentos com clareza e confiança.', generator: 'v0.app' }
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f4f7f6', userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR" className="bg-background"><body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}><AuthProvider>{children}</AuthProvider><Toaster richColors position="top-right" />{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
