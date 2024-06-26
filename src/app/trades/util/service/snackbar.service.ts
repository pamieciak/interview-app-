import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { GroupedOrder, Order } from '@app/trades/util/types';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  #showSnackBar(
    message: string,
    action: string = 'Zamknij',
    duration: number = 3000,
  ) {
    this.snackBar.open(message, action, {
      duration,
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

  showErrorMessage(
    errorMessage: string,
    action: string = 'Zamknij',
    duration: number = 3000,
  ) {
    this.snackBar.open(errorMessage, action, {
      duration,
    });
  }
}
