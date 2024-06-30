import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

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

import { MatTooltip } from '@angular/material/tooltip';
import { GroupedOrder, Order } from 'app/trades/util/interfaces';
import { ProfitColorDirective } from '@app/trades/util/directives';
import { tableColumnsConfig } from '@app/trades/util/configs';
import { ThemeComponent } from '@app/trades/ui/components/theme-component/theme-component';
import { TableDataService } from '@app/trades/util/service/table-data.service';

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
    MatTooltip,
    ProfitColorDirective,
    ThemeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="theme-toggle">
      <app-theme-component />
    </div>
    <table
      mat-table
      [dataSource]="dataSource"
      multiTemplateDataRows
      class="mat-elevation-z3"
    >
      <ng-container matColumnDef="symbol">
        <th mat-header-cell *matHeaderCellDef>Symbol</th>
        <td mat-cell *matCellDef="let orderGroup" class="row">
          <button
            mat-icon-button
            aria-label="expand row"
            (click)="
              expandedElement =
                expandedElement === orderGroup ? null : orderGroup;
              $event.stopPropagation()
            "
          >
            @if (expandedElement === orderGroup) {
              <mat-icon>keyboard_arrow_up</mat-icon>
            } @else {
              <mat-icon>keyboard_arrow_down</mat-icon>
            }
          </button>
          {{ orderGroup.symbol }}
          <div class="order-count">{{ orderGroup.orderCount }}</div>
        </td>
      </ng-container>

      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>Order ID</th>
        <td mat-cell *matCellDef="let orderGroup">{{ orderGroup.id }}</td>
      </ng-container>
      <ng-container matColumnDef="side">
        <th mat-header-cell *matHeaderCellDef>Side</th>
        <td mat-cell *matCellDef="let orderGroup">{{ orderGroup.side }}</td>
      </ng-container>
      <ng-container matColumnDef="size">
        <th mat-header-cell *matHeaderCellDef>Size</th>
        <td mat-cell *matCellDef="let orderGroup">{{ orderGroup.size }}</td>
      </ng-container>
      <ng-container matColumnDef="openTime">
        <th mat-header-cell *matHeaderCellDef>Open Time</th>
        <td mat-cell *matCellDef="let orderGroup">{{ orderGroup.openTime }}</td>
      </ng-container>
      <ng-container matColumnDef="openPrice">
        <th mat-header-cell *matHeaderCellDef>Open Price</th>
        <td mat-cell *matCellDef="let orderGroup">
          {{ orderGroup.openPrice }}
        </td>
      </ng-container>
      <ng-container matColumnDef="swap">
        <th mat-header-cell *matHeaderCellDef>Swap</th>
        <td mat-cell *matCellDef="let orderGroup">{{ orderGroup.swap }}</td>
      </ng-container>
      <ng-container matColumnDef="profit">
        <th mat-header-cell *matHeaderCellDef>Profit</th>
        <td
          mat-cell
          *matCellDef="let orderGroup"
          [appProfitColor]="orderGroup.profit"
        >
          {{ orderGroup.profit | number: '1.2-2' }}
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let orderGroup">
          <button
            mat-icon-button
            (click)="deleteAll(orderGroup)"
            [matTooltip]="'Zamknij wszystko'"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <ng-container matColumnDef="expandedDetail">
        <td
          class="expand"
          mat-cell
          *matCellDef="let orderGroup"
          [attr.colspan]="columnsToDisplayWithExpand.length"
        >
          <div
            class="order-detail"
            [@detailExpand]="
              orderGroup === expandedElement ? 'expanded' : 'collapsed'
            "
          >
            <div class="order-detail-container">
              <table mat-table [dataSource]="orderGroup.orders">
                <ng-container matColumnDef="symbol">
                  <th mat-header-cell *matHeaderCellDef>Symbol</th>
                  <td mat-cell *matCellDef="let order" class="ext-cell">
                    {{ order.symbol }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>Order ID</th>
                  <td mat-cell *matCellDef="let order" class="ext-cell">
                    {{ order.id }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="side">
                  <th mat-header-cell *matHeaderCellDef>Side</th>
                  <td mat-cell *matCellDef="let order" class="ext-cell">
                    {{ order.side }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="size">
                  <th mat-header-cell *matHeaderCellDef>Size</th>
                  <td mat-cell *matCellDef="let order" class="ext-cell">
                    {{ order.size }}
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

                <ng-container matColumnDef="profit">
                  <th mat-header-cell *matHeaderCellDef>Profit</th>
                  <td
                    mat-cell
                    *matCellDef="let order"
                    [appProfitColor]="order.currentProfit"
                  >
                    {{ order.currentProfit | number: '1.2-2' }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>akcje</th>
                  <td mat-cell *matCellDef="let order">
                    <button mat-icon-button (click)="deleteOrder(order)">
                      <mat-icon>close</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr
                  mat-row
                  *matRowDef="let row; columns: columnsToDisplayWithExpand"
                ></tr>
              </table>
            </div>
          </div>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columnsToDisplayWithExpand"></tr>
      <tr
        mat-row
        *matRowDef="let orderGroup; columns: columnsToDisplayWithExpand"
        class="order-detail-row"
        [class.example-expanded-row]="expandedElement === orderGroup"
        (click)="
          expandedElement = expandedElement === orderGroup ? null : orderGroup
        "
      ></tr>
      <tr
        mat-row
        *matRowDef="let row; columns: ['expandedDetail']"
        class="detail-row"
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

    tr.detail-row {
      height: 0;
    }

    tr.order-detail-row:not(.example-expanded-row):hover {
      background-color: var(--background-hover);
    }

    tr.order-detail-row:not(.example-expanded-row):active {
      background-color: var(--background-hover);
    }

    .order-detail-row td {
      border-bottom-width: 0;
    }

    .order-detail {
      overflow: hidden;
      display: flex;
      width: 100%;
      padding: 0;
    }
    .order-detail-container {
      height: fit-content;
      width: 100%;
    }

    .mat-mdc-cell,
    .mat-mdc-header-cell {
      color: var(--text-default);
      min-width: 100px;
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

    .ext-cell {
      text-align: end;
    }

    .theme-toggle {
      height: 30px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  `,
})
export class TableComponent implements OnInit, OnDestroy {
  tableDataService = inject(TableDataService);
  cdr = inject(ChangeDetectorRef);
  dataSource = this.tableDataService.dataSource;
  displayedColumns: string[] = tableColumnsConfig;
  columnsToDisplayWithExpand = [...this.displayedColumns];
  expandedElement: GroupedOrder | null = null;

  ngOnInit() {
    this.tableDataService.setUpData(this.cdr);
  }

  ngOnDestroy() {
    this.tableDataService.onDestroy();
  }

  deleteAll(el: GroupedOrder) {
    this.dataSource.data = this.tableDataService.deleteAllOrders(el);
  }

  deleteOrder(el: Order) {
    this.dataSource.data = this.tableDataService.deleteOrder(el);
    this.cdr.detectChanges();
  }
}
