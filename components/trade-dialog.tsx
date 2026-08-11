'use client'

import { useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { mutate } from 'swr'
import type { Asset, TradePayload } from '@/lib/types'
import { api } from '@/lib/api'
import { currency } from '@/lib/formatters'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Kind = 'buy' | 'sell'
export function TradeDialog({ asset, kind }: { asset: Asset; kind: Kind }) {
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState(String(asset.current_price))
  const [transactionDate, setTransactionDate] = useState(() =>
    new Date().toLocaleDateString('en-CA'),
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const total = (Number(quantity) || 0) * (Number(price) || 0)
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const payload: TradePayload = {
      ticker: asset.ticker,
      quantity: Number(quantity),
      price: Number(price),
      transaction_date: transactionDate,
    }
    if (
      Number.isNaN(payload.quantity) ||
      Number.isNaN(payload.price) ||
      payload.quantity <= 0 ||
      payload.price <= 0 ||
      !transactionDate
    ) {
      setError('Preencha todos os campos com valores válidos.')
      return
    }
    setLoading(true)
    try {
      await api(`/portfolios/${kind}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      await Promise.all([
        mutate('/portfolios/summary'),
        mutate('/portfolios/positions'),
        mutate('/portfolios/transactions'),
      ])
      toast.success(
        kind === 'buy'
          ? 'Compra registrada com sucesso.'
          : 'Venda registrada com sucesso.',
      )
      setOpen(false)
      setQuantity('')
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Não foi possível concluir a operação.',
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={kind === 'buy' ? 'default' : 'outline'}>
            {kind === 'buy' ? 'Comprar' : 'Vender'}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {kind === 'buy' ? 'Comprar' : 'Vender'} {asset.ticker}
          </DialogTitle>
          <DialogDescription>
            Revise os dados antes de confirmar sua operação.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-5">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${kind}-ticker`}>Ticker</Label>
              <Input id={`${kind}-ticker`} value={asset.ticker} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${kind}-quantity`}>Quantidade</Label>
              <Input
                id={`${kind}-quantity`}
                type="number"
                min="0.00000001"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${kind}-price`}>Preço unitário</Label>
              <Input
                id={`${kind}-price`}
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${kind}-date`}>Data</Label>
              <Input
                id={`${kind}-date`}
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted p-4">
            <span className="text-sm text-muted-foreground">Valor total</span>
            <strong className="text-xl">{currency(total)}</strong>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && (
                <LoaderCircle
                  data-icon="inline-start"
                  className="animate-spin"
                />
              )}
              {loading ? 'Confirmando...' : 'Confirmar operação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
