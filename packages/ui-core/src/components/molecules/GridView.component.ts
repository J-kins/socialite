import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ChangeDetectionStrategy,
  ContentChildren,
  QueryList,
  AfterContentInit,
} from '@angular/core';
import { GridItemComponent, GridItemData } from '../atoms/GridItem.component';

export interface GridViewConfig {
  columns: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  aspectRatio?: 'square' | '4:3' | '16:9' | 'auto';
}

@Component({
  selector: 'ui-grid-view',
  template: `
    <div class="grid-view" [class]="getClasses()" [attr.data-grid-id]="gridId">
      <!-- Loading State -->
      <div *ngIf="loading" class="grid-view__loading">
        <div *ngFor="let item of getSkeletonItems()" class="grid-view__skeleton-item">
          <div class="grid-view__skeleton-content"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && isEmpty()" class="grid-view__empty">
        <div class="grid-view__empty-content">
          <div class="grid-view__empty-icon">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
              />
            </svg>
          </div>
          <h3 class="grid-view__empty-title">{{ emptyTitle || 'No items found' }}</h3>
          <p class="grid-view__empty-description">
            {{ emptyDescription || 'There are no items to display.' }}
          </p>
          <ng-content select="[slot=empty-actions]"></ng-content>
        </div>
      </div>

      <!-- Grid Content -->
      <div
        *ngIf="!loading && !isEmpty()"
        class="grid-view__container"
        [style.grid-template-columns]="getGridColumns()"
      >
        <!-- Static Content -->
        <ng-content></ng-content>

        <!-- Dynamic Items -->
        <ui-grid-item
          *ngFor="let item of items; trackBy: trackByFn; let i = index"
          [data]="item"
          [variant]="itemVariant"
          [size]="itemSize"
          [selectable]="selectable"
          [isSelected]="isItemSelected(item)"
          [clickable]="clickable"
          [showImage]="showImages"
          [showDescription]="showDescriptions"
          [showMetadata]="showMetadata"
          [showActions]="showActions"
          [loading]="isItemLoading(item)"
          [disabled]="isItemDisabled(item)"
          (itemClick)="handleItemClick($event)"
          (itemSelect)="handleItemSelect($event)"
          (itemHover)="handleItemHover($event)"
          (imageError)="handleImageError($event)"
        >
          <!-- Custom item content -->
          <ng-container
            *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: i }"
          ></ng-container>
        </ui-grid-item>
      </div>

      <!-- Load More -->
      <div *ngIf="hasMore && !loading" class="grid-view__load-more">
        <button
          type="button"
          class="grid-view__load-more-button"
          (click)="loadMore.emit()"
          [disabled]="loadingMore"
        >
          <span *ngIf="!loadingMore">{{ loadMoreText || 'Load More' }}</span>
          <span *ngIf="loadingMore">
            <svg class="grid-view__spinner" fill="none" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                opacity="0.25"
              />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                opacity="0.75"
              />
            </svg>
            Loading...
          </span>
        </button>
      </div>

      <!-- Pagination -->
      <div *ngIf="showPagination && !loading" class="grid-view__pagination">
        <ng-content select="[slot=pagination]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['../../styles/molecules/grid-view.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridViewComponent implements AfterContentInit {
  @Input() gridId?: string;
  @Input() items: GridItemData[] = [];
  @Input() config: GridViewConfig = {
    columns: { xs: 1, sm: 2, md: 3, lg: 4 },
    gap: 'md',
  };
  @Input() variant: 'default' | 'compact' | 'masonry' | 'auto-fit' = 'default';
  @Input() itemVariant: 'default' | 'compact' | 'card' | 'media' = 'default';
  @Input() itemSize: 'sm' | 'md' | 'lg' = 'md';
  @Input() selectable = false;
  @Input() selectedItems: Set<string> = new Set();
  @Input() clickable = true;
  @Input() showImages = true;
  @Input() showDescriptions = true;
  @Input() showMetadata = false;
  @Input() showActions = false;
  @Input() loading = false;
  @Input() loadingItems: Set<string> = new Set();
  @Input() disabledItems: Set<string> = new Set();
  @Input() emptyTitle?: string;
  @Input() emptyDescription?: string;
  @Input() hasMore = false;
  @Input() loadingMore = false;
  @Input() loadMoreText?: string;
  @Input() showPagination = false;
  @Input() itemTemplate?: any; // TemplateRef<any>

  @Output() itemClick = new EventEmitter<GridItemData>();
  @Output() itemSelect = new EventEmitter<{ item: GridItemData; selected: boolean }>();
  @Output() itemHover = new EventEmitter<GridItemData>();
  @Output() imageError = new EventEmitter<{ item: GridItemData; event: Event }>();
  @Output() loadMore = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<Set<string>>();

  @ContentChildren(GridItemComponent) gridItems!: QueryList<GridItemComponent>;

  @HostBinding('class') get hostClass() {
    return `grid-view-host grid-view-host--${this.variant}`;
  }

  ngAfterContentInit() {
    // Initialize grid configurations if needed
  }

  getClasses(): string {
    const classes = [`grid-view--${this.variant}`, `grid-view--gap-${this.config.gap}`];

    if (this.config.aspectRatio) {
      classes.push(`grid-view--aspect-${this.config.aspectRatio}`);
    }
    if (this.selectable) classes.push('grid-view--selectable');
    if (this.loading) classes.push('grid-view--loading');

    return classes.join(' ');
  }

  getGridColumns(): string {
    if (this.variant === 'auto-fit') {
      return 'repeat(auto-fit, minmax(250px, 1fr))';
    }
    if (this.variant === 'masonry') {
      return '';
    }

    const { xs = 1, sm = 2, md = 3, lg = 4, xl = 5 } = this.config.columns;
    return `repeat(${xs}, 1fr)`;
  }

  getSkeletonItems(): number[] {
    const columns = this.config.columns.md || 3;
    return Array(columns * 3)
      .fill(0)
      .map((_, i) => i);
  }

  isEmpty(): boolean {
    return this.items.length === 0 && this.gridItems.length === 0;
  }

  isItemSelected(item: GridItemData): boolean {
    return this.selectedItems.has(item.id);
  }

  isItemLoading(item: GridItemData): boolean {
    return this.loadingItems.has(item.id);
  }

  isItemDisabled(item: GridItemData): boolean {
    return this.disabledItems.has(item.id);
  }

  trackByFn(index: number, item: GridItemData): string {
    return item.id;
  }

  handleItemClick(item: GridItemData): void {
    this.itemClick.emit(item);
  }

  handleItemSelect(event: { item: GridItemData; selected: boolean }): void {
    const newSelection = new Set(this.selectedItems);

    if (event.selected) {
      newSelection.add(event.item.id);
    } else {
      newSelection.delete(event.item.id);
    }

    this.selectionChange.emit(newSelection);
    this.itemSelect.emit(event);
  }

  handleItemHover(item: GridItemData): void {
    this.itemHover.emit(item);
  }

  handleImageError(event: { item: GridItemData; event: Event }): void {
    this.imageError.emit(event);
  }

  // Public methods for external control
  selectAll(): void {
    const allIds = new Set(this.items.map((item) => item.id));
    this.selectionChange.emit(allIds);
  }

  deselectAll(): void {
    this.selectionChange.emit(new Set());
  }

  getSelectedItems(): GridItemData[] {
    return this.items.filter((item) => this.selectedItems.has(item.id));
  }
}
