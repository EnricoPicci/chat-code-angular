import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

/**
 * Search bar component for Wikipedia search functionality
 */
@Component({
  selector: 'app-search-bar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @Output() searchTermChanged = new EventEmitter<string>();
  
  searchControl = new FormControl('');

  /**
   * Handle search action
   */
  onSearch(): void {
    const searchTerm = this.searchControl.value?.trim();
    if (searchTerm) {
      this.searchTermChanged.emit(searchTerm);
    }
  }

  /**
   * Handle Enter key press in search input
   * @param event Keyboard event
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
  /**
   * Clear search input
   */
  clearSearch(): void {
    this.searchControl.setValue('');
  }
}
