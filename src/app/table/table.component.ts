import { Component } from '@angular/core';
import { Card, Cards } from '../data';
import { CardsService } from '../cards.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  testCard !: Cards ;
  isAjoker = false ;
  
  constructor(public cardsService: CardsService){
    
  }

  async drawCard(){
    const cards =  await this.cardsService.drawCard();
    const card = cards.cards[0];

    this.cardsService.isAjoker(card);
    this.testCard = cards;
  }


  async reset(){
    await this.cardsService.initDeck();
  }
}
