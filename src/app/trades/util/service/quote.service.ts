import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

interface Quote {
  s: string;
  b: number;
}

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private socket$: WebSocketSubject<any>;
  private quotesSubject = new Subject<Quote>();

  constructor() {
    this.socket$ = webSocket('wss://webquotes.geeksoft.pl/websocket/quotes');
    this.socket$.subscribe(
      (msg) => this.onMessage(msg),
      (err) => console.error(err),
      () => console.warn('Completed!'),
    );
  }

  private onMessage(message: any) {
    if (message.p === '/quotes/subscribed') {
      message.d.forEach((quote: any) => {
        this.quotesSubject.next({
          s: quote.s,
          b: quote.b,
        });
      });
    }
  }

  subscribeSymbols(symbols: string[]) {
    this.socket$.next({ p: '/subscribe/addlist', d: symbols });
  }

  unsubscribeSymbols(symbols: string[]) {
    this.socket$.next({ p: '/subscribe/removelist', d: symbols });
  }

  getQuotes(): Observable<Quote> {
    return this.quotesSubject.asObservable();
  }
}
