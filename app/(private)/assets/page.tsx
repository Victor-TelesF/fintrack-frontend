'use client'

import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { ArrowUpRight, Search } from 'lucide-react'
import type { Asset } from '@/lib/types'
import { fetcher } from '@/lib/api'
import { assetType, assetTypes, currency, date, rate } from '@/lib/formatters'
import {
  PageHeader,
  ErrorState,
  EmptyState,
  TableSkeleton,
} from '@/components/data-states'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function AssetsPage() {
  const { data, error, isLoading, mutate } = useSWR<Asset[]>('/assets', fetcher)
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const filtered = (data || []).filter(
    (a) =>
      (a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.ticker.toLowerCase().includes(query.toLowerCase())) &&
      (type === 'all' || a.asset_type === type),
  )
  return (
    <>
      <PageHeader
        eyebrow="Mercado"
        title="Catálogo de ativos"
        description="Encontre oportunidades por nome, ticker ou classe de ativo."
      />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por nome ou ticker"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar ativos"
          />
        </div>
        <Select value={type} onValueChange={(v) => setType(v ?? 'all')}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Tipo de ativo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {Object.entries(assetTypes).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {error ? (
        <ErrorState message={error.message} retry={() => mutate()} />
      ) : isLoading ? (
        <TableSkeleton />
      ) : filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((asset) => (
            <Link key={asset.id} href={`/assets/${asset.id}`} className="group">
              <Card className="h-full transition-transform hover:-translate-y-0.5">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge variant="secondary">{asset.ticker}</Badge>
                      <CardTitle className="mt-3 text-lg">
                        {asset.name}
                      </CardTitle>
                    </div>
                    <ArrowUpRight className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <Metric label="Tipo" value={assetType(asset.asset_type)} />
                  <Metric
                    label="Preço atual"
                    value={currency(asset.current_price)}
                  />
                  <Metric label="Taxa" value={rate(asset.rate)} />
                  <Metric
                    label="Vencimento"
                    value={date(asset.maturity_date)}
                  />
                  <Metric
                    label="Liquidez"
                    value={asset.liquidity_type || 'Não informada'}
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum ativo encontrado"
          description="Ajuste a busca ou os filtros para ver outros resultados."
        />
      )}
    </>
  )
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  )
}
