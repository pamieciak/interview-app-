import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { GroupedOrder, Order } from '../types/api-response-type';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  #showSnackBar(
    message: string,
    action: string = 'Close',
    duration: number = 3000,
  ) {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  showOrderSnackBar(order: GroupedOrder | Order | undefined) {
    if ((order as GroupedOrder)?.orders) {
      const orderIDs = (order as GroupedOrder).orders
        .map((order) => order.id)
        .join(',');
      this.#showSnackBar(`Zamknięto zlecenia nr ${orderIDs}`);
    } else {
      const orderID = (order as Order)?.id;
      this.#showSnackBar(`Zamknięto zlecenie nr ${orderID}`);
    }
  }
}
