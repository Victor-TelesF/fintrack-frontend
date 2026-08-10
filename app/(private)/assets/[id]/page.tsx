'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { ArrowLeft, ShieldCheck, ShieldX } from 'lucide-react'
import type { Asset } from '@/lib/types'
import { fetcher } from '@/lib/api'
import { assetType, currency, date, rate } from '@/lib/formatters'
import { TradeDialog } from '@/components/trade-dialog'
import { ErrorState } from '@/components/data-states'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AssetDetailPage(){const {id}=useParams<{id:string}>();const {data,error,isLoading,mutate}=useSWR<Asset>(id?`/assets/${id}`:null,fetcher);if(error)return <ErrorState message={error.message} retry={()=>mutate()}/>;if(isLoading||!data)return <div className="flex flex-col gap-4"><Skeleton className="h-10 w-56"/><Skeleton className="h-72 w-full"/></div>;return <><Button variant="ghost" render={<Link href="/assets"/>}><ArrowLeft data-icon="inline-start"/>Voltar aos ativos</Button><div className="mt-6 flex flex-col gap-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2"><Badge variant="secondary">{data.ticker}</Badge><Badge variant="outline">{assetType(data.asset_type)}</Badge></div><h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">{data.name}</h1><p className="mt-2 text-2xl font-semibold text-primary">{currency(data.current_price)}</p></div><div className="flex gap-3"><TradeDialog asset={data} kind="buy"/><TradeDialog asset={data} kind="sell"/></div></div><Card><CardHeader><CardTitle>Informações do ativo</CardTitle></CardHeader><CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><Metric label="Taxa" value={rate(data.rate)}/><Metric label="Vencimento" value={date(data.maturity_date)}/><Metric label="Liquidez" value={data.liquidity_type||'Não informada'}/><Metric label="Índice" value={data.index_type||data.bond_index_type||'Não informado'}/><div><p className="text-sm text-muted-foreground">Cobertura FGC</p><p className="mt-2 flex items-center gap-2 font-medium">{data.fgc_covered?<><ShieldCheck className="size-4 text-positive"/>Coberto pelo FGC</>:<><ShieldX className="size-4 text-muted-foreground"/>Sem cobertura FGC</>}</p></div></CardContent></Card></div></>}
function Metric({label,value}:{label:string;value:string}){return <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 font-medium">{value}</p></div>}
