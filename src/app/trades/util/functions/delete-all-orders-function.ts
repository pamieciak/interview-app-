import { inject } from '@angular/core';
import { TableDataService } from '@app/trades/util/service/table-data.service';
import { GroupedOrder } from '@app/trades/util/types';

export function deleteAllOrders(orders: GroupedOrder) {
  const tableDataService = inject(TableDataService);
  return tableDataService.dataSource.data.filter(
    (element) => element.symbol !== orders.symbol,
  );
}
