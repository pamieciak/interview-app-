import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFactoryService, GroupedOrder, Order } from '../../../util';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { Subscription } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { SnackBarService } from '../../../util/service/snackbar.service';
import { WebSocketService } from '../../../util/service/websocket.service';

@Component({
  selector: 'app-table-component',
  standalone: true,
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
  imports: [
    CommonModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatHeaderCellDef,
    MatCellDef,
    MatRow,
    MatRowDef,
    MatIcon,
    MatIconButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table
      mat-table
      [dataSource]="dataSource"
      multiTemplateDataRows
      class="mat-elevation-z3"
    >
      <ng-container matColumnDef="symbol">
        <th mat-header-cell *matHeaderCellDef>Symbol</th>
        <td mat-cell *matCellDef="let element" class="row">
          <button
            mat-icon-button
            aria-label="expand row"
            (click)="
              expandedElement = expandedElement === element ? null : element;
              $event.stopPropagation()
            "
          >
            @if (expandedElement === element) {
              <mat-icon>keyboard_arrow_up</mat-icon>
            } @else {
              <mat-icon>keyboard_arrow_down</mat-icon>
            }
          </button>
          {{ element.symbol }}
          <div class="order-count">{{ element.orderCount }}</div>
        </td>
      </ng-container>

      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>Order ID</th>
        <td mat-cell *matCellDef="let element">{{ element.id }}</td>
      </ng-container>
      <ng-container matColumnDef="side">
        <th mat-header-cell *matHeaderCellDef>Side</th>
        <td mat-cell *matCellDef="let element">{{ element.side }}</td>
      </ng-container>
      <ng-container matColumnDef="size">
        <th mat-header-cell *matHeaderCellDef>Size</th>
        <td mat-cell *matCellDef="let element">{{ element.size }}</td>
      </ng-container>
      <ng-container matColumnDef="openTime">
        <th mat-header-cell *matHeaderCellDef>Open Time</th>
        <td mat-cell *matCellDef="let element">{{ element.openTime }}</td>
      </ng-container>
      <ng-container matColumnDef="openPrice">
        <th mat-header-cell *matHeaderCellDef>Open Price</th>
        <td mat-cell *matCellDef="let element">{{ element.openPrice }}</td>
      </ng-container>
      <ng-container matColumnDef="swap">
        <th mat-header-cell *matHeaderCellDef>Swap</th>
        <td mat-cell *matCellDef="let element">{{ element.swap }}</td>
      </ng-container>
      <ng-container matColumnDef="profit">
        <th mat-header-cell *matHeaderCellDef>Profit</th>
        <td
          mat-cell
          *matCellDef="let element"
          [ngClass]="{
            'profit-positive': element.profit > 0,
            'profit-negative': element.profit < 0,
          }"
        >
          {{ element.profit | number: '1.2-2' }}
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button (click)="deleteAll(element)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <ng-container matColumnDef="expandedDetail">
        <td
          class="expand"
          mat-cell
          *matCellDef="let element"
          [attr.colspan]="columnsToDisplayWithExpand.length"
        >
          <div
            class="example-element-detail"
            [@detailExpand]="
              element === expandedElement ? 'expanded' : 'collapsed'
            "
          >
            <div class="example-element-diagram">
              <table mat-table [dataSource]="element.orders">
                <ng-container matColumnDef="symbol">
                  <th mat-header-cell *matHeaderCellDef>Symbol</th>
                  <td mat-cell *matCellDef="let order" class="ext-cell">
                    {{ order.symbol }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>Order ID</th>
                  <td mat-cell *matCellDef="let element" class="ext-cell">
                    {{ element.id }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="openTime">
                  <th mat-header-cell *matHeaderCellDef>Open Time</th>
                  <td mat-cell *matCellDef="let order" class="ext-cell">
                    {{ order.openTime | date: 'dd.MM.yyyy HH:mm:ss' }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="openPrice">
                  <th mat-header-cell *matHeaderCellDef>Open Price</th>
                  <td mat-cell *matCellDef="let order">
                    {{ order.openPrice }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="swap">
                  <th mat-header-cell *matHeaderCellDef>Swap</th>
                  <td mat-cell *matCellDef="let order">{{ order.swap }}</td>
                </ng-container>
                <ng-container matColumnDef="size">
                  <th mat-header-cell *matHeaderCellDef>Size</th>
                  <td mat-cell *matCellDef="let order" class="ext-cell">
                    {{ order.size }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="side">
                  <th mat-header-cell *matHeaderCellDef>Side</th>
                  <td mat-cell *matCellDef="let order" class="ext-cell">
                    {{ order.side }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="profit">
                  <th mat-header-cell *matHeaderCellDef>Profit</th>
                  <td
                    mat-cell
                    *matCellDef="let order"
                    [ngClass]="{
                      'profit-positive': order.currentProfit > 0,
                      'profit-negative': order.currentProfit < 0,
                    }"
                  >
                    {{ order.currentProfit | number: '1.2-2' }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>akcje</th>
                  <td mat-cell *matCellDef="let order">
                    <button
                      mat-icon-button
                      (click)="deleteOrder(order, $event)"
                    >
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr
                  mat-row
                  *matRowDef="
                    let row;
                    columns: [
                      'symbol',
                      'id',
                      'side',
                      'size',
                      'openTime',
                      'openPrice',
                      'swap',
                      'profit',
                      'actions',
                    ]
                  "
                ></tr>
              </table>
            </div>
          </div>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columnsToDisplayWithExpand"></tr>
      <tr
        mat-row
        *matRowDef="let element; columns: columnsToDisplayWithExpand"
        class="example-element-row"
        [class.example-expanded-row]="expandedElement === element"
        (click)="expandedElement = expandedElement === element ? null : element"
      ></tr>
      <tr
        mat-row
        *matRowDef="let row; columns: ['expandedDetail']"
        class="example-detail-row"
      ></tr>
    </table>
  `,
  styles: `
    :host {
      display: block;
      padding: 16px;
    }

    table {
      width: 100%;
    }

    tr.example-detail-row {
      height: 0;
    }

    tr.example-element-row:not(.example-expanded-row):hover {
      background-color: var(--background-hover);
    }

    tr.example-element-row:not(.example-expanded-row):active {
      background-color: var(--background-hover);
    }

    .example-element-row td {
      border-bottom-width: 0;
    }

    .example-element-detail {
      overflow: hidden;
      display: flex;
      width: 100%;
      padding: 0;
    }
    .example-element-diagram {
      height: fit-content;
      width: 100%;
    }
    .mat-column-expandedDetail {
      padding: 0;
    }

    .mat-mdc-cell,
    .mat-mdc-header-cell {
      color: var(--text-default);
      min-width: 100px;
    }

    .example-element-description-attribution {
      opacity: 0.5;
    }

    .row {
      display: flex;
      padding: 2px;
      align-items: center;
      height: 100%;
      justify-content: space-between;
    }
    .order-count {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: black;
      color: white;
      margin-left: 10px;
    }

    .mat-mdc-header-row {
      background-color: var(--background-row);
    }

    .mat-mdc-row {
      background-color: var(--background-row);
    }

    .mat-mdc-row:hover {
      background-color: var(--background-hover);
    }

    .profit-positive {
      color: var(--profit-positive);
    }

    .profit-negative {
      color: var(--profit-negative);
    }

    .ext-cell {
      text-align: end;
    }
  `,
})
export class TableComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'symbol',
    'id',
    'side',
    'size',
    'openTime',
    'openPrice',
    'swap',
    'profit',
    'actions',
  ];
  columnsToDisplayWithExpand = [...this.displayedColumns];
  dataSource = new MatTableDataSource<GroupedOrder>([]);
  expandedElement: GroupedOrder | null = null;
  apiService = inject(DataFactoryService);
  snackbarService = inject(SnackBarService);
  webSocketService = inject(WebSocketService);
  cdr = inject(ChangeDetectorRef);
  private quotesSubscription!: Subscription;

  ngOnInit() {
    this.apiService.getOrders().subscribe((orders) => {
      this.dataSource.data = this.groupBySymbol(orders);

      const symbols = [...new Set(orders.map((order) => order.symbol))];
      this.webSocketService.subscribeSymbols(symbols);

      this.quotesSubscription = this.webSocketService
        .getQuotes()
        .subscribe((quote) => {
          this.updateProfit(quote);
          this.cdr.detectChanges();
        });
    });
  }

  ngOnDestroy() {
    const symbols = this.dataSource.data.map((group) => group.symbol);
    this.webSocketService.unsubscribeSymbols(symbols);
    this.quotesSubscription.unsubscribe();
  }

  calculateProfit(order: Order, currentPrice: number): number {
    let multiplier = 1;
    let sideMultiplier = order.side === 'BUY' ? 1 : -1;

    if (order.symbol === 'BTCUSD') {
      multiplier = Math.pow(10, 2);
    } else if (order.symbol === 'ETHUSD') {
      multiplier = Math.pow(10, 3);
    } else if (order.symbol === 'TTWO.US') {
      multiplier = Math.pow(10, 1);
    }

    return (
      ((currentPrice - order.openPrice) * multiplier * sideMultiplier) / 100
    );
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
        (acc, order) => acc + this.calculateProfit(order, order.closePrice),
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
          (acc, order) => acc + this.calculateProfit(order, quote.b),
          0,
        );
        group.orders.forEach((order) => {
          order['currentProfit'] = this.calculateProfit(order, quote.b);
        });
      }
    });
    this.dataSource._updateChangeSubscription();
  }

  deleteAll(el: GroupedOrder) {
    this.dataSource.data = this.dataSource.data.filter(
      (element) => element.symbol !== el.symbol,
    );
    this.snackbarService.showOrderSnackBar(el);
  }

  deleteOrder(el: Order, event: Event) {
    this.dataSource.data = this.dataSource.data.map((element) => {
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
        (acc, order) => acc + this.calculateProfit(order, order.closePrice),
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
