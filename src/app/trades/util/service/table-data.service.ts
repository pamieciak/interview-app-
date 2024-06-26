import { ChangeDetectorRef, inject, Injectable, OnInit } from '@angular/core';
import { DataFactoryService } from '@app/trades/util/service/data-factory.service';
import { QuoteService } from '@app/trades/util/service/quote.service';
import { GroupedOrder, Order } from '@app/trades/util/types';
import { ProfitCalculationService } from '@app/trades/util/service/profit-calculation.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { SnackBarService } from '@app/trades/util/service/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  apiService = inject(DataFactoryService);
  quoteService = inject(QuoteService);
  snackbarService = inject(SnackBarService);
  profitCalculationService = inject(ProfitCalculationService);
  private quotesSubscription!: Subscription;

  dataSource = new MatTableDataSource<GroupedOrder>([]);

  setUpData(cdr: ChangeDetectorRef) {
    this.apiService.getOrders().subscribe((orders) => {
      this.dataSource.data = this.groupBySymbol(orders);

      const symbols = [...new Set(orders.map((order) => order.symbol))];
      this.quoteService.subscribeSymbols(symbols);

      this.quotesSubscription = this.quoteService
        .getQuotes()
        .subscribe((quote) => {
          this.updateProfit(quote);
          cdr.detectChanges();
        });
    });
  }

  groupBySymbol(orders: Order[]): GroupedOrder[] {
    const grouped = orders.reduce(
      (acc, order) => {
        if (!acc[order.symbol]) {
          acc[order.symbol] = {
            symbol: order.symbol,
            orders: [],
            orderCount: 0,
            openPrice: 0,
            swap: 0,
            profit: 0,
            size: 0,
          };
        }
        acc[order.symbol].orders.push(order);
        acc[order.symbol].orderCount++;
        acc[order.symbol].openPrice += order.openPrice;
        acc[order.symbol].swap += order.swap;
        acc[order.symbol].size += order.size;
        return acc;
      },
      {} as { [key: string]: GroupedOrder },
    );

    return Object.keys(grouped).map((symbol) => {
      const group = grouped[symbol];
      const orderCount = group.orderCount;
      const profit = group.orders.reduce(
        (acc, order) =>
          acc +
          this.profitCalculationService.calculateProfit(
            order.openPrice,
            order.closePrice,
            order.side,
            order.symbol,
          ),
        0,
      );
      return {
        symbol: group.symbol,
        orderCount,
        openPrice: +(group.openPrice / orderCount).toFixed(2),
        swap: +group.swap.toFixed(2),
        profit: +profit.toFixed(2),
        size: +group.size.toFixed(2),
        orders: group.orders,
      };
    });
  }

  updateProfit(quote: { s: string; b: number }) {
    this.dataSource.data.forEach((group) => {
      if (group.symbol === quote.s) {
        group.profit = group.orders.reduce(
          (acc, order) =>
            acc +
            this.profitCalculationService.calculateProfit(
              order.openPrice,
              quote.b,
              order.side,
              order.symbol,
            ),
          0,
        );
        group.orders.forEach((order) => {
          order['currentProfit'] =
            this.profitCalculationService.calculateProfit(
              order.openPrice,
              quote.b,
              order.side,
              order.symbol,
            );
        });
      }
    });
    this.dataSource._updateChangeSubscription();
  }

  onDestroy() {
    const symbols = this.dataSource.data.map((group) => group.symbol);
    this.quoteService.unsubscribeSymbols(symbols);
    this.quotesSubscription.unsubscribe();
  }

  deleteAllOrders(orders: GroupedOrder) {
    this.snackbarService.showOrderSnackBar(orders);
    return this.dataSource.data.filter(
      (element) => element.symbol !== orders.symbol,
    );
  }

  deleteOrder(el: Order) {
    return this.dataSource.data.map((element) => {
      const filteredOrders = element.orders.filter(
        (order) => order.id !== el.id,
      );
      const deletedOrder = element.orders.find((order) => order.id === el.id);

      const averagePrice = filteredOrders.length
        ? filteredOrders.reduce((sum, order) => sum + order.openPrice, 0) /
          filteredOrders.length
        : 0;

      if (deletedOrder) {
        this.snackbarService.showOrderSnackBar(deletedOrder);
      }

      const newProfit = filteredOrders.reduce(
        (acc, order) =>
          acc +
          this.profitCalculationService.calculateProfit(
            order.openPrice,
            order.closePrice,
            order.side,
            order.symbol,
          ),
        0,
      );

      return {
        ...element,
        size: deletedOrder
          ? +(element.size - deletedOrder.size).toFixed(2)
          : element.size,
        openPrice: deletedOrder ? averagePrice : element.openPrice,
        swap: deletedOrder
          ? +(element.swap - deletedOrder.swap).toFixed(2)
          : element.swap,
        orders: filteredOrders,
        orderCount: filteredOrders.length,
        profit: newProfit,
      };
    });

    this.dataSource._updateChangeSubscription();
  }
}
