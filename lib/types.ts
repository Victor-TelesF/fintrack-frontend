export type AssetType = 'cdb' | 'government_bond' | 'national_stock' | 'international_stock' | 'real_estate_fund' | 'cryptocurrency'

export interface AuthResponse { access_token: string; token_type: string }
export interface RegisterResponse { user_id: string; user_name: string }
export interface Asset { id: string; name: string; ticker: string; current_price: number; asset_type: AssetType; rate: number | null; maturity_date: string | null; fgc_covered: boolean; liquidity_type: string | null; index_type: string | null; bond_index_type: string | null }
export interface AssetReference { id: string; name: string; ticker: string; current_price: number }
export interface PortfolioSummary { total_cost: number; total_equity: number; total_pnl: number; return_percentage: number }
export interface Position { asset: AssetReference; quantity: number; average_price: number; current_price: number; cost_basis: number; market_value: number; pnl: number; return_percentage: number }
export interface Transaction { id_transaction: string; asset: AssetReference; quantity: number; price: number; transaction_type: 'buy' | 'sell'; transaction_date: string }
export interface TradePayload { ticker: string; quantity: number; price: number; transaction_date: string }
