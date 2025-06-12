import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { GridViewComponent, GridViewConfig } from '../molecules/GridView.component';
import { ViewToggleComponent, ViewMode } from '../molecules/ViewToggle.component';
import { GridItemData } from '../atoms/GridItem.component';

export interface GridViewPanelConfig extends GridViewConfig {
  showSearch?: boolean;
  showFilters?: boolean;
  showSort?: boolean;
  showViewToggle?: boolean;
  showPagination?: boolean;
  showToolbar?: boolean;
}

export interface SortOption {
  key: string;
  label: string;
  direction?: 'asc' | 'desc';
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'range';
  options?: Array<{ value: any; label: string }>;
  value?: any;
}

@Component({
  selector: 'ui-grid-view-panel',
  template: `
    <div class="grid-view-panel" [class]="getClasses()" [attr.data-panel-id]="panelId">
      <!-- Toolbar -->
      <div *ngIf="config.showToolbar" class="grid-view-panel__toolbar">
        <div class="grid-view-panel__toolbar-left">
          <!-- Search -->
          <div *ngIf="config.showSearch" class="grid-view-panel__search">
            <div class="grid-view-panel__search-container">
              <svg
                class="grid-view-panel__search-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                class="grid-view-panel__search-input"
                [placeholder]="searchPlaceholder || 'Search items...'"
                [value]="searchQuery"
                (input)="handleSearchChange($event)"
                (keyup.enter)="handleSearchSubmit()"
              />
              <button
                *ngIf="searchQuery"
                type="button"
                class="grid-view-panel__search-clear"
                (click)="clearSearch()"
                aria-label="Clear search"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Filters -->
          <div *ngIf="config.showFilters && filters.length > 0" class="grid-view-panel__filters">
            <div
              *ngFor="let filter of filters; trackBy: trackFilterBy"
              class="grid-view-panel__filter"
            >
              <label class="grid-view-panel__filter-label">{{ filter.label }}</label>
              <select
                *ngIf="filter.type === 'select'"
                class="grid-view-panel__filter-select"
                [value]="filter.value"
                (change)="handleFilterChange(filter.key, $event)"
              >
                <option value="">All</option>
                <option *ngFor="let option of filter.options" [value]="option.value">
                  {{ option.label }}
                </option>
              </select>
              <input
                *ngIf="filter.type === 'text'"
                type="text"
                class="grid-view-panel__filter-input"
                [value]="filter.value"
                (input)="handleFilterChange(filter.key, $event)"
              />
              <input
                *ngIf="filter.type === 'date'"
                type="date"
                class="grid-view-panel__filter-input"
                [value]="filter.value"
                (change)="handleFilterChange(filter.key, $event)"
              />
            </div>
          </div>
        </div>

        <div class="grid-view-panel__toolbar-right">
          <!-- Sort -->
          <div *ngIf="config.showSort && sortOptions.length > 0" class="grid-view-panel__sort">
            <select
              class="grid-view-panel__sort-select"
              [value]="currentSort?.key + ':' + currentSort?.direction"
              (change)="handleSortChange($event)"
            >
              <option value="">Sort by...</option>
              <optgroup
                *ngFor="let option of sortOptions; trackBy: trackSortBy"
                [label]="option.label"
              >
                <option [value]="option.key + ':asc'">{{ option.label }} (A-Z)</option>
                <option [value]="option.key + ':desc'">{{ option.label }} (Z-A)</option>
              </optgroup>
            </select>
          </div>

          <!-- View Toggle -->
          <ui-view-toggle
            *ngIf="config.showViewToggle"
            [currentMode]="currentViewMode"
            [options]="viewToggleOptions"
            [variant]="viewToggleVariant"
            [size]="viewToggleSize"
            (modeChange)="handleViewModeChange($event)"
          ></ui-view-toggle>

          <!-- Additional Controls -->
          <div class="grid-view-panel__additional-controls">
            <ng-content select="[slot=toolbar-controls]"></ng-content>
          </div>
        </div>
      </div>

      <!-- Results Info -->
      <div *ngIf="showResultsInfo" class="grid-view-panel__results-info">
        <span class="grid-view-panel__results-count">
          {{ getResultsText() }}
        </span>
        <span *ngIf="isFiltered()" class="grid-view-panel__filter-indicator">
          (filtered)
          <button type="button" class="grid-view-panel__clear-filters" (click)="clearAllFilters()">
            Clear filters
          </button>
        </span>
      </div>

      <!-- Grid View -->
      <ui-grid-view
        #gridView
        [gridId]="gridId"
        [items]="filteredItems"
        [config]="config"
        [variant]="gridVariant"
        [itemVariant]="itemVariant"
        [itemSize]="itemSize"
        [selectable]="selectable"
        [selectedItems]="selectedItems"
        [clickable]="clickable"
        [showImages]="showImages"
        [showDescriptions]="showDescriptions"
        [showMetadata]="showMetadata"
        [showActions]="showActions"
        [loading]="loading"
        [loadingItems]="loadingItems"
        [disabledItems]="disabledItems"
        [emptyTitle]="emptyTitle"
        [emptyDescription]="emptyDescription"
        [hasMore]="hasMore"
        [loadingMore]="loadingMore"
        [loadMoreText]="loadMoreText"
        [showPagination]="config.showPagination"
        [itemTemplate]="itemTemplate"
        (itemClick)="handleItemClick($event)"
        (itemSelect)="handleItemSelect($event)"
        (itemHover)="handleItemHover($event)"
        (imageError)="handleImageError($event)"
        (loadMore)="handleLoadMore()"
        (selectionChange)="handleSelectionChange($event)"
      >
        <!-- Custom Grid Content -->
        <ng-content></ng-content>

        <!-- Pagination Slot -->
        <div slot="pagination">
          <ng-content select="[slot=pagination]"></ng-content>
        </div>

        <!-- Empty Actions Slot -->
        <div slot="empty-actions">
          <ng-content select="[slot=empty-actions]"></ng-content>
        </div>
      </ui-grid-view>

      <!-- Bulk Actions -->
      <div *ngIf="selectedItems.size > 0 && showBulkActions" class="grid-view-panel__bulk-actions">
        <div class="grid-view-panel__bulk-actions-container">
          <span class="grid-view-panel__bulk-actions-count">
            {{ selectedItems.size }} selected
          </span>
          <div class="grid-view-panel__bulk-actions-buttons">
            <ng-content select="[slot=bulk-actions]"></ng-content>
          </div>
          <button
            type="button"
            class="grid-view-panel__bulk-actions-close"
            (click)="clearSelection()"
            aria-label="Clear selection"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../../styles/organisms/grid-view-panel.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridViewPanelComponent {
  @Input() panelId?: string;
  @Input() gridId?: string;
  @Input() items: GridItemData[] = [];
  @Input() config: GridViewPanelConfig = {
    columns: { xs: 1, sm: 2, md: 3, lg: 4 },
    gap: 'md',
    showToolbar: true,
    showSearch: true,
    showFilters: true,
    showSort: true,
    showViewToggle: true,
    showPagination: false,
  };
  @Input() gridVariant: 'default' | 'compact' | 'masonry' | 'auto-fit' = 'default';
  @Input() itemVariant: 'default' | 'compact' | 'card' | 'media' = 'default';
  @Input() itemSize: 'sm' | 'md' | 'lg' = 'md';
  @Input() selectable = false;
  @Input() selectedItems: Set<string> = new Set();
  @Input() clickable = true;
  @Input() showImages = true;
  @Input() showDescriptions = true;
  @Input() showMetadata = false;
  @Input() showActions = false;
  @Input() showBulkActions = true;
  @Input() showResultsInfo = true;
  @Input() loading = false;
  @Input() loadingItems: Set<string> = new Set();
  @Input() disabledItems: Set<string> = new Set();
  @Input() emptyTitle?: string;
  @Input() emptyDescription?: string;
  @Input() hasMore = false;
  @Input() loadingMore = false;
  @Input() loadMoreText?: string;
  @Input() itemTemplate?: any; // TemplateRef<any>

  // Search & Filter
  @Input() searchQuery = '';
  @Input() searchPlaceholder?: string;
  @Input() filters: FilterOption[] = [];
  @Input() sortOptions: SortOption[] = [];
  @Input() currentSort?: SortOption;

  // View Toggle
  @Input() currentViewMode: ViewMode = 'grid';
  @Input() viewToggleOptions = [
    { mode: 'grid' as ViewMode, label: 'Grid View', icon: 'grid' },
    { mode: 'table' as ViewMode, label: 'Table View', icon: 'table' },
  ];
  @Input() viewToggleVariant: 'default' | 'compact' | 'pill' | 'minimal' = 'default';
  @Input() viewToggleSize: 'sm' | 'md' | 'lg' = 'md';

  @Output() itemClick = new EventEmitter<GridItemData>();
  @Output() itemSelect = new EventEmitter<{ item: GridItemData; selected: boolean }>();
  @Output() itemHover = new EventEmitter<GridItemData>();
  @Output() imageError = new EventEmitter<{ item: GridItemData; event: Event }>();
  @Output() loadMore = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<Set<string>>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<{ key: string; value: any }>();
  @Output() sortChange = new EventEmitter<SortOption>();
  @Output() viewModeChange = new EventEmitter<ViewMode>();

  @ViewChild('gridView') gridView!: GridViewComponent;

  @HostBinding('class') get hostClass() {
    return `grid-view-panel-host grid-view-panel-host--${this.gridVariant}`;
  }

  filteredItems: GridItemData[] = [];

  ngOnInit() {
    this.updateFilteredItems();
  }

  ngOnChanges() {
    this.updateFilteredItems();
  }

  getClasses(): string {
    const classes = [`grid-view-panel--${this.gridVariant}`, `grid-view-panel--${this.itemSize}`];

    if (this.loading) classes.push('grid-view-panel--loading');
    if (this.selectedItems.size > 0) classes.push('grid-view-panel--has-selection');
    if (this.isFiltered()) classes.push('grid-view-panel--filtered');

    return classes.join(' ');
  }

  updateFilteredItems(): void {
    let filtered = [...this.items];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    this.filters.forEach((filter) => {
      if (filter.value) {
        filtered = filtered.filter((item) => {
          const itemValue = item[filter.key];
          if (filter.type === 'text') {
            return itemValue?.toString().toLowerCase().includes(filter.value.toLowerCase());
          }
          return itemValue === filter.value;
        });
      }
    });

    // Apply sorting
    if (this.currentSort) {
      filtered.sort((a, b) => {
        const aValue = a[this.currentSort!.key];
        const bValue = b[this.currentSort!.key];

        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;

        return this.currentSort!.direction === 'desc' ? -comparison : comparison;
      });
    }

    this.filteredItems = filtered;
  }

  getResultsText(): string {
    const total = this.items.length;
    const showing = this.filteredItems.length;

    if (total === showing) {
      return `${total} item${total !== 1 ? 's' : ''}`;
    }
    return `${showing} of ${total} item${total !== 1 ? 's' : ''}`;
  }

  isFiltered(): boolean {
    return !!this.searchQuery.trim() || this.filters.some((filter) => filter.value);
  }

  trackFilterBy(index: number, filter: FilterOption): string {
    return filter.key;
  }

  trackSortBy(index: number, option: SortOption): string {
    return option.key;
  }

  handleSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.searchChange.emit(this.searchQuery);
    this.updateFilteredItems();
  }

  handleSearchSubmit(): void {
    this.updateFilteredItems();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchChange.emit('');
    this.updateFilteredItems();
  }

  handleFilterChange(key: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const filter = this.filters.find((f) => f.key === key);

    if (filter) {
      filter.value = target.value;
      this.filterChange.emit({ key, value: target.value });
      this.updateFilteredItems();
    }
  }

  handleSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const [key, direction] = target.value.split(':');

    if (key && direction) {
      const option = this.sortOptions.find((opt) => opt.key === key);
      if (option) {
        this.currentSort = { ...option, direction: direction as 'asc' | 'desc' };
        this.sortChange.emit(this.currentSort);
        this.updateFilteredItems();
      }
    } else {
      this.currentSort = undefined;
      this.updateFilteredItems();
    }
  }

  handleViewModeChange(mode: ViewMode): void {
    this.currentViewMode = mode;
    this.viewModeChange.emit(mode);
  }

  clearAllFilters(): void {
    this.searchQuery = '';
    this.filters.forEach((filter) => (filter.value = ''));
    this.currentSort = undefined;
    this.updateFilteredItems();
  }

  handleItemClick(item: GridItemData): void {
    this.itemClick.emit(item);
  }

  handleItemSelect(event: { item: GridItemData; selected: boolean }): void {
    this.itemSelect.emit(event);
  }

  handleItemHover(item: GridItemData): void {
    this.itemHover.emit(item);
  }

  handleImageError(event: { item: GridItemData; event: Event }): void {
    this.imageError.emit(event);
  }

  handleLoadMore(): void {
    this.loadMore.emit();
  }

  handleSelectionChange(selection: Set<string>): void {
    this.selectedItems = selection;
    this.selectionChange.emit(selection);
  }

  clearSelection(): void {
    this.handleSelectionChange(new Set());
  }

  // Public methods for external control
  selectAll(): void {
    this.gridView?.selectAll();
  }

  deselectAll(): void {
    this.gridView?.deselectAll();
  }

  getSelectedItems(): GridItemData[] {
    return this.gridView?.getSelectedItems() || [];
  }

  refresh(): void {
    this.updateFilteredItems();
  }
}
