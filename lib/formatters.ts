import type { AssetType } from './types'

export const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format
export const number = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 8 }).format
export const percent = (value: number) => `${new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}%`
export const date = (value: string | null) => value ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`)) : 'Não informado'
export const assetTypes: Record<AssetType, string> = { cdb: 'CDB', government_bond: 'Título público', national_stock: 'Ação nacional', international_stock: 'Ação internacional', real_estate_fund: 'Fundo imobiliário', cryptocurrency: 'Criptomoeda' }
export const assetType = (value: AssetType) => assetTypes[value] ?? value
export const rate = (value: number | null) => value === null ? 'Não informada' : percent(Math.abs(value) <= 1 ? value * 100 : value)
