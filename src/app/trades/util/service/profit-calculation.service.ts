import { Injectable } from '@angular/core';
import { SYMBOL_MULTIPLIERS } from '@app/trades/util/constants';

@Injectable({
  providedIn: 'root',
})
export class ProfitCalculationService {
  calculateProfit(
    openPrice: number,
    closePrice: number,
    side: string,
    symbol: string,
  ): number {
    const multiplier = SYMBOL_MULTIPLIERS[symbol] || 1;
    const sideMultiplier = side === 'BUY' ? 1 : -1;
    return ((closePrice - openPrice) * multiplier * sideMultiplier) / 100;
  }
}
