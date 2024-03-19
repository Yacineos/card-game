import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, WritableSignal, computed, signal} from '@angular/core';
import { Observable, firstValueFrom, single } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CARDS_API, Card, Cards, Deck, GameState, Player } from './data';

@Injectable({
  providedIn: 'root'
})

export class CardsService {
  
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

  async initDeck(): Promise<void> {
    const deck = await firstValueFrom(this.https.get<Deck>(`${CARDS_API}new/?jokers_enabled=true`));

    this.sigDeck.set(deck);

    this._sigGameState.update((gs) => ({...gs,turn: 'Player1',winner: undefined, isReset: true  }));

    this.sigDeck.set(await this.shuffleDeck());
  }


  shuffleDeck():Promise<Deck>{
    this._sigGameState.update((gs) => ({...gs, isReset: true  }));
    return firstValueFrom(this.https.get<Deck>(`${CARDS_API}${this.sigDeck()?.deck_id}/shuffle/?remaining=true`));
  }

  drawCard(): Promise<Cards>{
    this._sigGameState.update((gs) => {
      let turn: Player ="Player1";
      if(!gs.isReset){
         turn = gs.turn === "Player1" ? "Player2" : "Player1";
      } 
      return {...gs ,turn,isReset: false};  
    });
    return firstValueFrom(this.https.get<Cards>(`${CARDS_API}${this.sigDeck()?.deck_id}/draw/?count=1`));
  }

  isAjoker(card : Card ): void{
    card.value === "JOKER" ? this._sigGameState.update((gs) => ({...gs,winner:gs.turn})) : null ;
  }
  
}

