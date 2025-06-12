import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ChangeDetectionStrategy,
} from '@angular/core';

export interface GridItemData {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  metadata?: Record<string, any>;
  [key: string]: any;
}

@Component({
  selector: 'ui-grid-item',
  template: `
    <div class="grid-item" [class]="getClasses()" (click)="handleClick()" [attr.data-id]="data.id">
      <!-- Image/Preview -->
      <div *ngIf="showImage && data.imageUrl" class="grid-item__image-container">
        <img
          [src]="data.imageUrl"
          [alt]="data.title || 'Grid item'"
          class="grid-item__image"
          (error)="onImageError($event)"
          loading="lazy"
        />

        <!-- Overlay -->
        <div *ngIf="showOverlay" class="grid-item__overlay">
          <div class="grid-item__overlay-content">
            <ng-content select="[slot=overlay]"></ng-content>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="grid-item__content" [class.grid-item__content--compact]="variant === 'compact'">
        <!-- Title -->
        <h3 *ngIf="data.title" class="grid-item__title" [title]="data.title">
          {{ data.title }}
        </h3>

        <!-- Description -->
        <p
          *ngIf="data.description && showDescription"
          class="grid-item__description"
          [title]="data.description"
        >
          {{ data.description }}
        </p>

        <!-- Metadata -->
        <div *ngIf="showMetadata && data.metadata" class="grid-item__metadata">
          <ng-container *ngFor="let item of getMetadataItems()">
            <span class="grid-item__metadata-item">{{ item.key }}: {{ item.value }}</span>
          </ng-container>
        </div>

        <!-- Custom Content -->
        <div class="grid-item__custom-content">
          <ng-content></ng-content>
        </div>
      </div>

      <!-- Actions -->
      <div *ngIf="showActions" class="grid-item__actions">
        <ng-content select="[slot=actions]"></ng-content>
      </div>

      <!-- Selection Indicator -->
      <div
        *ngIf="selectable"
        class="grid-item__selection-indicator"
        [class.grid-item__selection-indicator--selected]="isSelected"
      >
        <input
          type="checkbox"
          [checked]="isSelected"
          (change)="handleSelectionChange($event)"
          class="grid-item__checkbox"
          [attr.aria-label]="'Select ' + (data.title || 'item')"
        />
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="grid-item__loading">
        <div class="grid-item__spinner"></div>
      </div>
    </div>
  `,
  styleUrls: ['../../styles/atoms/grid-item.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridItemComponent {
  @Input() data!: GridItemData;
  @Input() variant: 'default' | 'compact' | 'card' | 'media' = 'default';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() selectable = false;
  @Input() isSelected = false;
  @Input() clickable = true;
  @Input() showImage = true;
  @Input() showDescription = true;
  @Input() showMetadata = false;
  @Input() showActions = false;
  @Input() showOverlay = false;
  @Input() loading = false;
  @Input() disabled = false;

  @Output() itemClick = new EventEmitter<GridItemData>();
  @Output() itemSelect = new EventEmitter<{ item: GridItemData; selected: boolean }>();
  @Output() itemHover = new EventEmitter<GridItemData>();
  @Output() imageError = new EventEmitter<Event>();

  @HostBinding('class') get hostClass() {
    return `grid-item-host grid-item-host--${this.variant} grid-item-host--${this.size}`;
  }

  getClasses(): string {
    const classes = [`grid-item--${this.variant}`, `grid-item--${this.size}`];

    if (this.selectable) classes.push('grid-item--selectable');
    if (this.isSelected) classes.push('grid-item--selected');
    if (this.clickable && !this.disabled) classes.push('grid-item--clickable');
    if (this.loading) classes.push('grid-item--loading');
    if (this.disabled) classes.push('grid-item--disabled');

    return classes.join(' ');
  }

  getMetadataItems(): Array<{ key: string; value: any }> {
    if (!this.data.metadata) return [];

    return Object.entries(this.data.metadata).map(([key, value]) => ({
      key: this.formatMetadataKey(key),
      value: this.formatMetadataValue(value),
    }));
  }

  private formatMetadataKey(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }

  private formatMetadataValue(value: any): string {
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }

  handleClick(): void {
    if (this.clickable && !this.disabled && !this.loading) {
      this.itemClick.emit(this.data);
    }
  }

  handleSelectionChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.itemSelect.emit({
      item: this.data,
      selected: target.checked,
    });
  }

  onImageError(event: Event): void {
    this.imageError.emit(event);
  }

  onMouseEnter(): void {
    if (!this.disabled) {
      this.itemHover.emit(this.data);
    }
  }
}
