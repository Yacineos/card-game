import { Component } from '@angular/core';
import { Card } from '../data';
import { CardsService } from '../cards.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  testCard : Card | undefined = this.cardsService.testCard()?.cards[0];
  
  constructor(private cardsService: CardsService){
    // this.testCard = cardsService.testCard ;
  }
}
