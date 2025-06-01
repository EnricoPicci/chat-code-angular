import { Component, Input } from '@angular/core';
import { WikipediaSearchResult } from '../../interfaces/wikipedia-search-result';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wiki-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wiki-card.component.html',
  styleUrl: './wiki-card.component.css'
})
export class WikiCardComponent {
  @Input() article: WikipediaSearchResult | undefined;
}
