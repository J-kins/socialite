import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { TableViewComponent, TableColumn, TableData } from '../molecules/TableView.component';
import { ViewToggleComponent, ViewMode } from '../molecules/ViewToggle.component';
import { SortConfig } from '../atoms/TableHeader.component';

export interface TableViewPanelConfig {
  showSearch?: boolean;
  showFilters?: boolean;
  showViewToggle?: boolean;
  showPagination?: boolean;
  showToolbar?: boolean;
  showExport?: boolean;
  showColumnToggle?: boolean;
}

export interface TableFilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'range';
  options?: Array<{ value: any; label: string }>;
  value?: any;
}

@Component({
  selector: 'ui-table-view-panel',
  template: `
    <div class="table-view-panel" [class]="getClasses()" [attr.data-panel-id]="panelId">
      <!-- Toolbar -->
      <div *ngIf="config.showToolbar" class="table-view-panel__toolbar">
        <div class="table-view-panel__toolbar-left">
          <!-- Search -->
          <div *ngIf="config.showSearch" class="table-view-panel__search">
            <div class="table-view-panel__search-container">
              <svg
                class="table-view-panel__search-icon"
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
                class="table-view-panel__search-input"
                [placeholder]="searchPlaceholder || 'Search records...'"
                [value]="searchQuery"
                (input)="handleSearchChange($event)"
                (keyup.enter)="handleSearchSubmit()"
              />
              <button
                *ngIf="searchQuery"
                type="button"
                class="table-view-panel__search-clear"
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
          <div *ngIf="config.showFilters && filters.length > 0" class="table-view-panel__filters">
            <div
              *ngFor="let filter of filters; trackBy: trackFilterBy"
              class="table-view-panel__filter"
            >
              <label class="table-view-panel__filter-label">{{ filter.label }}</label>
              <select
                *ngIf="filter.type === 'select'"
                class="table-view-panel__filter-select"
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
                class="table-view-panel__filter-input"
                [value]="filter.value"
                (input)="handleFilterChange(filter.key, $event)"
              />
              <input
                *ngIf="filter.type === 'date'"
                type="date"
                class="table-view-panel__filter-input"
                [value]="filter.value"
                (change)="handleFilterChange(filter.key, $event)"
              />
            </div>
          </div>
        </div>

        <div class="table-view-panel__toolbar-right">
          <!-- Column Toggle -->
          <div *ngIf="config.showColumnToggle" class="table-view-panel__column-toggle">
            <button
              type="button"
              class="table-view-panel__column-toggle-button"
              (click)="toggleColumnSelector()"
              [attr.aria-expanded]="showColumnSelector"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z"
                />
              </svg>
              Columns
            </button>
            <div *ngIf="showColumnSelector" class="table-view-panel__column-selector">
              <div
                *ngFor="let column of columns; trackBy: trackColumnBy"
                class="table-view-panel__column-option"
              >
                <label class="table-view-panel__column-label">
                  <input
                    type="checkbox"
                    [checked]="isColumnVisible(column.key)"
                    (change)="toggleColumn(column.key, $event)"
                  />
                  {{ column.label }}
                </label>
              </div>
            </div>
          </div>

          <!-- Export -->
          <div *ngIf="config.showExport" class="table-view-panel__export">
            <button
              type="button"
              class="table-view-panel__export-button"
              (click)="exportData()"
              [disabled]="loading"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export
            </button>
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
          <div class="table-view-panel__additional-controls">
            <ng-content select="[slot=toolbar-controls]"></ng-content>
          </div>
        </div>
      </div>

      <!-- Results Info -->
      <div *ngIf="showResultsInfo" class="table-view-panel__results-info">
        <span class="table-view-panel__results-count">
          {{ getResultsText() }}
        </span>
        <span *ngIf="isFiltered()" class="table-view-panel__filter-indicator">
          (filtered)
          <button type="button" class="table-view-panel__clear-filters" (click)="clearAllFilters()">
            Clear filters
          </button>
        </span>
      </div>

      <!-- Table View -->
      <ui-table-view
        #tableView
        [tableId]="tableId"
        [columns]="visibleColumns"
        [data]="filteredData"
        [variant]="tableVariant"
        [headerVariant]="headerVariant"
        [rowVariant]="rowVariant"
        [cellVariant]="cellVariant"
        [size]="size"
        [selectable]="selectable"
        [selectedRows]="selectedRows"
        [expandable]="expandable"
        [expandedRows]="expandedRows"
        [clickable]="clickable"
        [showIndex]="showIndex"
        [showActions]="showActions"
        [showFooter]="showFooter"
        [showPagination]="config.showPagination"
        [loading]="loading"
        [loadingRows]="loadingRows"
        [disabledRows]="disabledRows"
        [emptyTitle]="emptyTitle"
        [emptyDescription]="emptyDescription"
        [sortConfig]="sortConfig"
        [filters]="filterValues"
        [truncateCells]="truncateCells"
        [rowIdField]="rowIdField"
        [actionsTemplate]="actionsTemplate"
        [expandedTemplate]="expandedTemplate"
        (rowClick)="handleRowClick($event)"
        (rowSelect)="handleRowSelect($event)"
        (rowExpand)="handleRowExpand($event)"
        (rowHover)="handleRowHover($event)"
        (cellClick)="handleCellClick($event)"
        (sort)="handleSort($event)"
        (filter)="handleTableFilter($event)"
        (resize)="handleResize($event)"
        (selectionChange)="handleSelectionChange($event)"
      >
        <!-- Custom Table Content -->
        <ng-content></ng-content>

        <!-- Footer Slot -->
        <div slot="footer">
          <ng-content select="[slot=footer]"></ng-content>
        </div>

        <!-- Pagination Slot -->
        <div slot="pagination">
          <ng-content select="[slot=pagination]"></ng-content>
        </div>

        <!-- Empty Actions Slot -->
        <div slot="empty-actions">
          <ng-content select="[slot=empty-actions]"></ng-content>
        </div>
      </ui-table-view>

      <!-- Bulk Actions -->
      <div *ngIf="selectedRows.size > 0 && showBulkActions" class="table-view-panel__bulk-actions">
        <div class="table-view-panel__bulk-actions-container">
          <span class="table-view-panel__bulk-actions-count">
            {{ selectedRows.size }} selected
          </span>
          <div class="table-view-panel__bulk-actions-buttons">
            <ng-content select="[slot=bulk-actions]"></ng-content>
          </div>
          <button
            type="button"
            class="table-view-panel__bulk-actions-close"
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
  styleUrls: ['../../styles/organisms/table-view-panel.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableViewPanelComponent {
  @Input() panelId?: string;
  @Input() tableId?: string;
  @Input() columns: TableColumn[] = [];
  @Input() data: TableData[] = [];
  @Input() config: TableViewPanelConfig = {
    showToolbar: true,
    showSearch: true,
    showFilters: true,
    showViewToggle: true,
    showPagination: false,
    showExport: true,
    showColumnToggle: true,
  };
  @Input() tableVariant: 'default' | 'compact' | 'bordered' | 'striped' = 'default';
  @Input() headerVariant: 'default' | 'compact' | 'bordered' = 'default';
  @Input() rowVariant: 'default' | 'compact' | 'bordered' | 'striped' = 'default';
  @Input() cellVariant: 'default' | 'compact' | 'bordered' = 'default';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() selectable = false;
  @Input() selectedRows: Set<string> = new Set();
  @Input() expandable = false;
  @Input() expandedRows: Set<string> = new Set();
  @Input() clickable = true;
  @Input() showIndex = false;
  @Input() showActions = false;
  @Input() showFooter = false;
  @Input() showBulkActions = true;
  @Input() showResultsInfo = true;
  @Input() loading = false;
  @Input() loadingRows: Set<string> = new Set();
  @Input() disabledRows: Set<string> = new Set();
  @Input() emptyTitle?: string;
  @Input() emptyDescription?: string;
  @Input() sortConfig?: SortConfig;
  @Input() truncateCells = true;
  @Input() rowIdField = 'id';
  @Input() actionsTemplate?: any; // TemplateRef<any>
  @Input() expandedTemplate?: any; // TemplateRef<any>

  // Search & Filter
  @Input() searchQuery = '';
  @Input() searchPlaceholder?: string;
  @Input() filters: TableFilterOption[] = [];

  // Column Management
  @Input() hiddenColumns: Set<string> = new Set();
  @Input() showColumnSelector = false;

  // View Toggle
  @Input() currentViewMode: ViewMode = 'table';
  @Input() viewToggleOptions = [
    { mode: 'grid' as ViewMode, label: 'Grid View', icon: 'grid' },
    { mode: 'table' as ViewMode, label: 'Table View', icon: 'table' },
  ];
  @Input() viewToggleVariant: 'default' | 'compact' | 'pill' | 'minimal' = 'default';
  @Input() viewToggleSize: 'sm' | 'md' | 'lg' = 'md';

  @Output() rowClick = new EventEmitter<{ row: TableData; index: number }>();
  @Output() rowSelect = new EventEmitter<{ row: TableData; selected: boolean; index: number }>();
  @Output() rowExpand = new EventEmitter<{ row: TableData; expanded: boolean; index: number }>();
  @Output() rowHover = new EventEmitter<{ row: TableData; index: number }>();
  @Output() cellClick = new EventEmitter<{ value: any; column: string; row: TableData }>();
  @Output() sort = new EventEmitter<SortConfig>();
  @Output() filter = new EventEmitter<{ column: string; value: any }>();
  @Output() resize = new EventEmitter<{ column: string; width: number }>();
  @Output() selectionChange = new EventEmitter<Set<string>>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<{ key: string; value: any }>();
  @Output() viewModeChange = new EventEmitter<ViewMode>();
  @Output() columnToggle = new EventEmitter<{ column: string; visible: boolean }>();
  @Output() exportRequested = new EventEmitter<{ data: TableData[]; columns: TableColumn[] }>();

  @ViewChild('tableView') tableView!: TableViewComponent;

  filteredData: TableData[] = [];
  filterValues: Record<string, any> = {};

  ngOnInit() {
    this.updateFilteredData();
    this.updateFilterValues();
  }

  ngOnChanges() {
    this.updateFilteredData();
    this.updateFilterValues();
  }

  get visibleColumns(): TableColumn[] {
    return this.columns.filter((col) => !this.hiddenColumns.has(col.key));
  }

  getClasses(): string {
    const classes = [`table-view-panel--${this.tableVariant}`, `table-view-panel--${this.size}`];

    if (this.loading) classes.push('table-view-panel--loading');
    if (this.selectedRows.size > 0) classes.push('table-view-panel--has-selection');
    if (this.isFiltered()) classes.push('table-view-panel--filtered');

    return classes.join(' ');
  }

  updateFilteredData(): void {
    let filtered = [...this.data];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((row) =>
        this.columns.some((col) => {
          const value = row[col.key];
          return value?.toString().toLowerCase().includes(query);
        })
      );
    }

    // Apply filters
    this.filters.forEach((filter) => {
      if (filter.value) {
        filtered = filtered.filter((row) => {
          const itemValue = row[filter.key];
          if (filter.type === 'text') {
            return itemValue?.toString().toLowerCase().includes(filter.value.toLowerCase());
          }
          return itemValue === filter.value;
        });
      }
    });

    // Apply sorting
    if (this.sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[this.sortConfig!.column];
        const bValue = b[this.sortConfig!.column];

        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;

        return this.sortConfig!.direction === 'desc' ? -comparison : comparison;
      });
    }

    this.filteredData = filtered;
  }

  updateFilterValues(): void {
    this.filterValues = {};
    this.filters.forEach((filter) => {
      if (filter.value) {
        this.filterValues[filter.key] = filter.value;
      }
    });
  }

  getResultsText(): string {
    const total = this.data.length;
    const showing = this.filteredData.length;

    if (total === showing) {
      return `${total} record${total !== 1 ? 's' : ''}`;
    }
    return `${showing} of ${total} record${total !== 1 ? 's' : ''}`;
  }

  isFiltered(): boolean {
    return !!this.searchQuery.trim() || this.filters.some((filter) => filter.value);
  }

  isColumnVisible(columnKey: string): boolean {
    return !this.hiddenColumns.has(columnKey);
  }

  trackFilterBy(index: number, filter: TableFilterOption): string {
    return filter.key;
  }

  trackColumnBy(index: number, column: TableColumn): string {
    return column.key;
  }

  handleSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.searchChange.emit(this.searchQuery);
    this.updateFilteredData();
  }

  handleSearchSubmit(): void {
    this.updateFilteredData();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchChange.emit('');
    this.updateFilteredData();
  }

  handleFilterChange(key: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const filter = this.filters.find((f) => f.key === key);

    if (filter) {
      filter.value = target.value;
      this.filterChange.emit({ key, value: target.value });
      this.updateFilteredData();
      this.updateFilterValues();
    }
  }

  handleSort(sortConfig: SortConfig): void {
    this.sortConfig = sortConfig;
    this.sort.emit(sortConfig);
    this.updateFilteredData();
  }

  handleTableFilter(event: { column: string; value: any }): void {
    this.filter.emit(event);
  }

  handleResize(event: { column: string; width: number }): void {
    this.resize.emit(event);
  }

  handleViewModeChange(mode: ViewMode): void {
    this.currentViewMode = mode;
    this.viewModeChange.emit(mode);
  }

  toggleColumnSelector(): void {
    this.showColumnSelector = !this.showColumnSelector;
  }

  toggleColumn(columnKey: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const visible = target.checked;

    if (visible) {
      this.hiddenColumns.delete(columnKey);
    } else {
      this.hiddenColumns.add(columnKey);
    }

    this.columnToggle.emit({ column: columnKey, visible });
  }

  exportData(): void {
    this.exportRequested.emit({
      data: this.filteredData,
      columns: this.visibleColumns,
    });
  }

  clearAllFilters(): void {
    this.searchQuery = '';
    this.filters.forEach((filter) => (filter.value = ''));
    this.sortConfig = undefined;
    this.updateFilteredData();
    this.updateFilterValues();
  }

  handleRowClick(event: { row: TableData; index: number }): void {
    this.rowClick.emit(event);
  }

  handleRowSelect(event: { row: TableData; selected: boolean; index: number }): void {
    this.rowSelect.emit(event);
  }

  handleRowExpand(event: { row: TableData; expanded: boolean; index: number }): void {
    this.rowExpand.emit(event);
  }

  handleRowHover(event: { row: TableData; index: number }): void {
    this.rowHover.emit(event);
  }

  handleCellClick(event: { value: any; column: string; row: TableData }): void {
    this.cellClick.emit(event);
  }

  handleSelectionChange(selection: Set<string>): void {
    this.selectedRows = selection;
    this.selectionChange.emit(selection);
  }

  clearSelection(): void {
    this.handleSelectionChange(new Set());
  }

  // Public methods for external control
  selectAll(): void {
    this.tableView?.selectAll();
  }

  deselectAll(): void {
    this.tableView?.deselectAll();
  }

  getSelectedRows(): TableData[] {
    return this.tableView?.getSelectedRows() || [];
  }

  expandAll(): void {
    this.tableView?.expandAll();
  }

  collapseAll(): void {
    this.tableView?.collapseAll();
  }

  refresh(): void {
    this.updateFilteredData();
  }
}
