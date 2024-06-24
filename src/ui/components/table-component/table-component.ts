import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
import { map } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

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
    <!--    <table-->
    <!--      mat-table-->
    <!--      [dataSource]="dataSource"-->
    <!--      multiTemplateDataRows-->
    <!--      class="mat-elevation-z8"-->
    <!--    >-->
    <!--      <ng-container matColumnDef="symbol">-->
    <!--        <th mat-header-cell *matHeaderCellDef>Symbol</th>-->
    <!--        <td mat-cell *matCellDef="let element" (click)="toggleRow(element)">-->
    <!--          <mat-icon *ngIf="expandedElement === element">expand_less</mat-icon>-->
    <!--          <mat-icon *ngIf="expandedElement !== element">expand_more</mat-icon>-->
    <!--          {{ element.symbol }} ({{ element.orderCount }})-->
    <!--        </td>-->
    <!--      </ng-container>-->

    <!--      <ng-container matColumnDef="orderCount">-->
    <!--        <th mat-header-cell *matHeaderCellDef>Order ID</th>-->
    <!--        <td mat-cell *matCellDef="let element">{{ element.orderCount }}</td>-->
    <!--      </ng-container>-->

    <!--      <ng-container matColumnDef="openPrice">-->
    <!--        <th mat-header-cell *matHeaderCellDef>Open Price</th>-->
    <!--        <td mat-cell *matCellDef="let element">{{ element.openPrice }}</td>-->
    <!--      </ng-container>-->

    <!--      <ng-container matColumnDef="swap">-->
    <!--        <th mat-header-cell *matHeaderCellDef>Swap</th>-->
    <!--        <td mat-cell *matCellDef="let element">{{ element.swap }}</td>-->
    <!--      </ng-container>-->

    <!--      <ng-container matColumnDef="profit">-->
    <!--        <th mat-header-cell *matHeaderCellDef>Profit</th>-->
    <!--        <td mat-cell *matCellDef="let element">{{ element.profit }}</td>-->
    <!--      </ng-container>-->

    <!--      <ng-container matColumnDef="size">-->
    <!--        <th mat-header-cell *matHeaderCellDef>Size</th>-->
    <!--        <td mat-cell *matCellDef="let element">{{ element.size }}</td>-->
    <!--      </ng-container>-->

    <!--      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>-->
    <!--      <tr-->
    <!--        mat-row-->
    <!--        *matRowDef="let row; columns: displayedColumns"-->
    <!--        class="element-row"-->
    <!--        [class.expanded]="expandedElement === row"-->
    <!--        (click)="toggleRow(row)"-->
    <!--      ></tr>-->

    <!--      <ng-container *ngIf="expandedElement === element">-->
    <!--        <tr-->
    <!--          mat-row-->
    <!--          *matRowDef="let row; columns: ['expandedDetail']"-->
    <!--          class="element-detail-row"-->
    <!--        >-->
    <!--          <td mat-cell [attr.colspan]="displayedColumns.length">-->
    <!--            <div class="element-detail">-->
    <!--              <table-->
    <!--                mat-table-->
    <!--                [dataSource]="element.orders"-->
    <!--                class="mat-elevation-z8 inner-table"-->
    <!--              >-->
    <!--                <ng-container matColumnDef="openTime">-->
    <!--                  <th mat-header-cell *matHeaderCellDef>Open Time</th>-->
    <!--                  <td mat-cell *matCellDef="let order">-->
    <!--                    {{ order.openTime | date: 'dd.MM.yyyy HH:mm:ss' }}-->
    <!--                  </td>-->
    <!--                </ng-container>-->

    <!--                <ng-container matColumnDef="symbol">-->
    <!--                  <th mat-header-cell *matHeaderCellDef>Symbol</th>-->
    <!--                  <td mat-cell *matCellDef="let order">{{ order.symbol }}</td>-->
    <!--                </ng-container>-->

    <!--                <ng-container matColumnDef="openPrice">-->
    <!--                  <th mat-header-cell *matHeaderCellDef>Open Price</th>-->
    <!--                  <td mat-cell *matCellDef="let order">-->
    <!--                    {{ order.openPrice }}-->
    <!--                  </td>-->
    <!--                </ng-container>-->

    <!--                <ng-container matColumnDef="swap">-->
    <!--                  <th mat-header-cell *matHeaderCellDef>Swap</th>-->
    <!--                  <td mat-cell *matCellDef="let order">{{ order.swap }}</td>-->
    <!--                </ng-container>-->

    <!--                <ng-container matColumnDef="closePrice">-->
    <!--                  <th mat-header-cell *matHeaderCellDef>Close Price</th>-->
    <!--                  <td mat-cell *matCellDef="let order">-->
    <!--                    {{ order.closePrice }}-->
    <!--                  </td>-->
    <!--                </ng-container>-->

    <!--                <ng-container matColumnDef="size">-->
    <!--                  <th mat-header-cell *matHeaderCellDef>Size</th>-->
    <!--                  <td mat-cell *matCellDef="let order">{{ order.size }}</td>-->
    <!--                </ng-container>-->

    <!--                <ng-container matColumnDef="side">-->
    <!--                  <th mat-header-cell *matHeaderCellDef>Side</th>-->
    <!--                  <td mat-cell *matCellDef="let order">{{ order.side }}</td>-->
    <!--                </ng-container>-->

    <!--                <tr-->
    <!--                  mat-header-row-->
    <!--                  *matHeaderRowDef="[-->
    <!--                    'openTime',-->
    <!--                    'symbol',-->
    <!--                    'openPrice',-->
    <!--                    'swap',-->
    <!--                    'closePrice',-->
    <!--                    'size',-->
    <!--                    'side',-->
    <!--                  ]"-->
    <!--                ></tr>-->
    <!--                <tr-->
    <!--                  mat-row-->
    <!--                  *matRowDef="-->
    <!--                    let row;-->
    <!--                    columns: [-->
    <!--                      'openTime',-->
    <!--                      'symbol',-->
    <!--                      'openPrice',-->
    <!--                      'swap',-->
    <!--                      'closePrice',-->
    <!--                      'size',-->
    <!--                      'side',-->
    <!--                    ]-->
    <!--                  "-->
    <!--                ></tr>-->
    <!--              </table>-->
    <!--            </div>-->
    <!--          </td>-->
    <!--        </tr>-->
    <!--      </ng-container>-->
    <!--    </table>-->

    <table
      mat-table
      [dataSource]="dataSource"
      multiTemplateDataRows
      class="mat-elevation-z8"
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

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Swap</th>
        <td mat-cell *matCellDef="let element">{{ element.swap }}</td>
      </ng-container>

      <!--      <ng-container matColumnDef="expand">-->
      <!--        <th mat-header-cell *matHeaderCellDef aria-label="row actions"></th>-->
      <!--        <td mat-cell *matCellDef="let element">-->
      <!--          <button-->
      <!--            mat-icon-button-->
      <!--            aria-label="expand row"-->
      <!--            (click)="-->
      <!--              expandedElement = expandedElement === element ? null : element;-->
      <!--              $event.stopPropagation()-->
      <!--            "-->
      <!--          >-->
      <!--            @if (expandedElement === element) {-->
      <!--              <mat-icon>keyboard_arrow_up</mat-icon>-->
      <!--            } @else {-->
      <!--              <mat-icon>keyboard_arrow_down</mat-icon>-->
      <!--            }-->
      <!--          </button>-->
      <!--        </td>-->
      <!--      </ng-container>-->

      <!-- Expanded Content Column - The detail row is made up of this one column that spans across all columns -->
      <ng-container matColumnDef="expandedDetail">
        <td
          mat-cell
          *matCellDef="let element"
          [attr.colspan]="columnsToDisplayWithExpand.length"
        >
          <div
            class="example-element-detail"
            [@detailExpand]="
              element == expandedElement ? 'expanded' : 'collapsed'
            "
          >
            <div class="example-element-diagram">
              <table
                mat-table
                [dataSource]="element.orders"
                class="inner-table"
              >
                <ng-container matColumnDef="symbol">
                  <th mat-header-cell *matHeaderCellDef>Symbol</th>
                  <td mat-cell *matCellDef="let order">{{ order.symbol }}</td>
                </ng-container>
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>Order ID</th>
                  <td mat-cell *matCellDef="let element">{{ element.id }}</td>
                </ng-container>

                <ng-container matColumnDef="openTime">
                  <th mat-header-cell *matHeaderCellDef>Open Time</th>
                  <td mat-cell *matCellDef="let order">
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

                <!--                <ng-container matColumnDef="closePrice">-->
                <!--                  <th mat-header-cell *matHeaderCellDef>Close Price</th>-->
                <!--                  <td mat-cell *matCellDef="let order">-->
                <!--                    {{ order.closePrice }}-->
                <!--                  </td>-->
                <!--                </ng-container>-->

                <ng-container matColumnDef="size">
                  <th mat-header-cell *matHeaderCellDef>Size</th>
                  <td mat-cell *matCellDef="let order">{{ order.size }}</td>
                </ng-container>

                <ng-container matColumnDef="side">
                  <th mat-header-cell *matHeaderCellDef>Side</th>
                  <td mat-cell *matCellDef="let order">{{ order.side }}</td>
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
    table {
      width: 100%;
    }

    tr.example-detail-row {
      height: 0;
    }

    tr.example-element-row:not(.example-expanded-row):hover {
      background: whitesmoke;
    }

    tr.example-element-row:not(.example-expanded-row):active {
      background: #efefef;
    }

    .example-element-row td {
      border-bottom-width: 0;
    }

    .example-element-detail {
      overflow: hidden;
      display: flex;
      justify-content: flex-end;
    }

    .mat-mdc-cell {
      min-width: 100px;
    }

    .mat-mdc-header-cell {
      max-width: 100px;
    }

    .example-element-diagram {
      height: fit-content;
      display: flex;

      min-width: 100%;

      font-weight: lighter;
    }

    //.example-element-symbol {
    //  font-weight: bold;
    //  font-size: 40px;
    //  line-height: normal;
    //}

    .example-element-description {
      padding: 16px;
    }

    .example-element-description-attribution {
      opacity: 0.5;
    }

    .row {
      display: flex;
      align-items: center;
      width: 200px;
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
  `,
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = [
    'symbol',
    'id',
    'side',
    'size',
    'openTime',
    'openPrice',
    'swap',
  ];
  columnsToDisplayWithExpand = [...this.displayedColumns];
  dataSource = new MatTableDataSource<GroupedOrder>([]);
  expandedElement: GroupedOrder | null = null;
  apiService = inject(DataFactoryService);

  ngOnInit() {
    this.apiService.getOrders().subscribe((orders: Order[]) => {
      this.dataSource.data = this.groupBySymbol(orders);
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
        acc[order.symbol].profit += order.closePrice - order.openPrice;
        acc[order.symbol].size += order.size;
        return acc;
      },
      {} as { [key: string]: GroupedOrder },
    );

    return Object.keys(grouped).map((symbol) => {
      const group = grouped[symbol];
      const orderCount = group.orderCount;
      return {
        symbol: group.symbol,
        orderCount,
        openPrice: +(group.openPrice / orderCount).toFixed(2),
        swap: +group.swap.toFixed(2),
        profit: +(group.profit / orderCount).toFixed(2),
        size: +group.size.toFixed(2),
        orders: group.orders,
      };
    });
  }

  toggleRow(element: GroupedOrder): void {
    this.expandedElement = this.expandedElement === element ? null : element;
  }
}
