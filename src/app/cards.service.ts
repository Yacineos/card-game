import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, WritableSignal} from '@angular/core';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CARDS_API, Card, Cards, Deck } from './data';

@Injectable({
  providedIn: 'root'
})

export class CardsService {
  sigDeck : Signal<Deck|undefined> = toSignal(this.initDeck()) ;
  testCard : Signal<Cards | undefined> ;
  constructor(private https: HttpClient) {
    this.testCard = toSignal(this.drawCard());
    
  }

  initDeck():Observable<Deck>{
    return this.https.get<Deck>(`${CARDS_API}new/`);
  }

  shuffleDeck():Observable<Deck>{
    return this.https.get<Deck>(`${CARDS_API}${this.sigDeck()?.deck_id}/shuffle/?remaining=true`)
  }

  drawCard(): Observable<Cards>{
    return this.https.get<Cards>(`${CARDS_API}${this.sigDeck()?.deck_id}/draw/?count=1`);
  }
  
}

