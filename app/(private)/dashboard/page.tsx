'use client'

import useSWR from 'swr'
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  RefreshCw,
  WalletCards,
} from 'lucide-react'
import type { PortfolioSummary, Position } from '@/lib/types'
import { fetcher } from '@/lib/api'
import { currency, percent } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import {
  PageHeader,
  ErrorState,
  EmptyState,
  TableSkeleton,
} from '@/components/data-states'
import { PositionsView } from '@/components/positions-view'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const summary = useSWR<PortfolioSummary>('/portfolios/summary', fetcher)
  const positions = useSWR<Position[]>('/portfolios/positions', fetcher)
  const refresh = () => {
    summary.mutate()
    positions.mutate()
  }
  return (
    <>
      <PageHeader
        eyebrow="Carteira"
        title="Visão geral"
        description="Acompanhe a evolução do seu patrimônio e a performance das suas posições."
        action={
          <Button
            variant="outline"
            onClick={refresh}
            disabled={summary.isLoading || positions.isLoading}
          >
            <RefreshCw data-icon="inline-start" />
            Atualizar dados
          </Button>
        }
      />
      {summary.error ? (
        <ErrorState
          message={summary.error.message}
          retry={() => summary.mutate()}
        />
      ) : summary.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      ) : (
        summary.data && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Patrimônio total"
              value={currency(summary.data.total_equity)}
              icon={WalletCards}
            />
            <SummaryCard
              title="Total investido"
              value={currency(summary.data.total_cost)}
              icon={CircleDollarSign}
            />
            <SummaryCard
              title="Lucro / prejuízo"
              value={currency(summary.data.total_pnl)}
              icon={summary.data.total_pnl >= 0 ? ArrowUpRight : ArrowDownRight}
              signed={summary.data.total_pnl}
            />
            <SummaryCard
              title="Rentabilidade"
              value={percent(summary.data.return_percentage)}
              icon={
                summary.data.return_percentage >= 0
                  ? ArrowUpRight
                  : ArrowDownRight
              }
              signed={summary.data.return_percentage}
            />
          </div>
        )
      )}
      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Suas posições</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Valores atualizados conforme a última cotação disponível.
          </p>
        </div>
        {positions.error ? (
          <ErrorState
            message={positions.error.message}
            retry={() => positions.mutate()}
          />
        ) : positions.isLoading ? (
          <TableSkeleton />
        ) : positions.data?.length ? (
          <PositionsView positions={positions.data} />
        ) : (
          <EmptyState
            title="Nenhuma posição na carteira"
            description="Explore o catálogo de ativos para fazer sua primeira operação."
          />
        )}
      </section>
    </>
  )
}
function SummaryCard({
  title,
  value,
  icon: Icon,
  signed,
}: {
  title: string
  value: string
  icon: typeof WalletCards
  signed?: number
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <Icon className="size-4" />
        </span>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            'text-2xl font-semibold tracking-tight',
            signed !== undefined &&
              (signed >= 0 ? 'text-positive' : 'text-destructive'),
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}
