import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, WritableSignal, computed, signal} from '@angular/core';
import { Observable, single } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CARDS_API, Card, Cards, Deck, GameState } from './data';

@Injectable({
  providedIn: 'root'
})

export class CardsService {
  
  // I have a problem with this signal, because I want it to be reactive , I want , when I call init deck , the value refreshes here also
  sigDeck: WritableSignal<Deck|undefined> = signal<Deck|undefined>(undefined);

  private readonly _sigGameState = signal<GameState>(
    {
      deck: this.sigDeck(),
      isReset: true ,
      turn: "Player1",
      winner: undefined
    }
  );
  readonly sigGameState = computed<GameState>(() => this._sigGameState());

  constructor(private https: HttpClient) {
    this.initDeck();
  }

  initDeck(): void {
    this.https.get<Deck>(`${CARDS_API}new/?jokers_enabled=true`).subscribe(deck => {
      this.sigDeck.set(deck);
      this._sigGameState.update((gs) => ({...gs,winner: undefined, isReset: true  }));
      this.shuffleDeck().subscribe(
        (shuffledDeck)=> this.sigDeck.set(shuffledDeck)
      );
    });
  }


  shuffleDeck():Observable<Deck>{
    this._sigGameState.update((gs) => ({...gs, isReset: true  }));
    return this.https.get<Deck>(`${CARDS_API}${this.sigDeck()?.deck_id}/shuffle/?remaining=true`)
  }

  drawCard(): Observable<Cards>{
    this._sigGameState.update((gs) => {
      const turn = gs.turn === "Player1" ? "Player2" : "Player1";
      return {...gs ,turn,isReset: false};  
    });
    return this.https.get<Cards>(`${CARDS_API}${this.sigDeck()?.deck_id}/draw/?count=1`);
  }

  isAjoker(card : Card ): void{
    card.value === "JOKER" ? this._sigGameState.update((gs) => ({...gs,winner:gs.turn})) : null ;
  }
  
}

