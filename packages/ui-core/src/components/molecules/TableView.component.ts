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
import { TableRowComponent } from './TableRow.component';
import { TableHeaderComponent, SortConfig } from '../atoms/TableHeader.component';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'currency' | 'boolean' | 'custom';
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  sticky?: boolean;
  customTemplate?: any; // TemplateRef<any>
}

export interface TableData {
  [key: string]: any;
}

@Component({
  selector: 'ui-table-view',
  template: `
    <div class="table-view" [class]="getClasses()" [attr.data-table-id]="tableId">
      <!-- Loading State -->
      <div *ngIf="loading" class="table-view__loading">
        <table class="table-view__skeleton-table">
          <thead>
            <tr>
              <th *ngFor="let col of columns" class="table-view__skeleton-header">
                <div class="table-view__skeleton-header-content"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of getSkeletonRows()" class="table-view__skeleton-row">
              <td *ngFor="let col of columns" class="table-view__skeleton-cell">
                <div class="table-view__skeleton-cell-content"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && isEmpty()" class="table-view__empty">
        <div class="table-view__empty-content">
          <div class="table-view__empty-icon">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
              />
            </svg>
          </div>
          <h3 class="table-view__empty-title">{{ emptyTitle || 'No data found' }}</h3>
          <p class="table-view__empty-description">
            {{ emptyDescription || 'There are no records to display.' }}
          </p>
          <ng-content select="[slot=empty-actions]"></ng-content>
        </div>
      </div>

      <!-- Table Content -->
      <div *ngIf="!loading && !isEmpty()" class="table-view__container">
        <table class="table-view__table" [class]="getTableClasses()">
          <!-- Table Header -->
          <thead class="table-view__header">
            <tr class="table-view__header-row">
              <!-- Selection Header -->
              <th *ngIf="selectable" class="table-view__selection-header">
                <input
                  type="checkbox"
                  [checked]="isAllSelected()"
                  [indeterminate]="isSomeSelected()"
                  (change)="handleSelectAll($event)"
                  class="table-view__select-all-checkbox"
                  [attr.aria-label]="'Select all rows'"
                />
              </th>

              <!-- Expand Header -->
              <th *ngIf="expandable" class="table-view__expand-header"></th>

              <!-- Index Header -->
              <th *ngIf="showIndex" class="table-view__index-header">#</th>

              <!-- Column Headers -->
              <ui-table-header
                *ngFor="let column of columns; trackBy: trackColumnBy"
                [label]="column.label"
                [columnKey]="column.key"
                [sortable]="column.sortable"
                [filterable]="column.filterable"
                [resizable]="column.resizable"
                [sortDirection]="getSortDirection(column.key)"
                [hasFilter]="hasColumnFilter(column.key)"
                [align]="column.align"
                [width]="column.width"
                [minWidth]="column.minWidth"
                [maxWidth]="column.maxWidth"
                [sticky]="column.sticky"
                [variant]="headerVariant"
                (sort)="handleSort($event)"
                (filter)="handleFilter($event)"
                (resize)="handleResize($event)"
              ></ui-table-header>

              <!-- Actions Header -->
              <th *ngIf="showActions" class="table-view__actions-header">Actions</th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="table-view__body">
            <!-- Static Rows -->
            <ng-content></ng-content>

            <!-- Dynamic Rows -->
            <ui-table-row
              *ngFor="let item of data; trackBy: trackRowBy; let i = index"
              [rowData]="item"
              [rowId]="getRowId(item)"
              [index]="i"
              [selectable]="selectable"
              [isSelected]="isRowSelected(item)"
              [expandable]="expandable"
              [isExpanded]="isRowExpanded(item)"
              [clickable]="clickable"
              [showIndex]="showIndex"
              [showActions]="showActions"
              [loading]="isRowLoading(item)"
              [disabled]="isRowDisabled(item)"
              [variant]="rowVariant"
              [size]="size"
              [status]="getRowStatus(item)"
              (rowClick)="handleRowClick($event)"
              (rowSelect)="handleRowSelect($event)"
              (rowExpand)="handleRowExpand($event)"
              (rowHover)="handleRowHover($event)"
            >
              <!-- Cell Content -->
              <ui-table-cell
                *ngFor="let column of columns; trackBy: trackColumnBy"
                [value]="getCellValue(item, column.key)"
                [type]="column.type"
                [align]="column.align"
                [columnKey]="column.key"
                [rowData]="item"
                [width]="column.width"
                [minWidth]="column.minWidth"
                [maxWidth]="column.maxWidth"
                [customTemplate]="column.customTemplate"
                [clickable]="isCellClickable(column)"
                [variant]="cellVariant"
                [truncate]="truncateCells"
                (cellClick)="handleCellClick($event)"
              ></ui-table-cell>

              <!-- Actions Slot -->
              <div slot="actions">
                <ng-container
                  *ngTemplateOutlet="actionsTemplate; context: { $implicit: item, index: i }"
                ></ng-container>
              </div>

              <!-- Expanded Content Slot -->
              <div slot="expanded">
                <ng-container
                  *ngTemplateOutlet="expandedTemplate; context: { $implicit: item, index: i }"
                ></ng-container>
              </div>
            </ui-table-row>
          </tbody>

          <!-- Table Footer -->
          <tfoot *ngIf="showFooter" class="table-view__footer">
            <tr class="table-view__footer-row">
              <td [attr.colspan]="getTotalColumns()" class="table-view__footer-cell">
                <ng-content select="[slot=footer]"></ng-content>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Pagination -->
      <div *ngIf="showPagination && !loading" class="table-view__pagination">
        <ng-content select="[slot=pagination]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['../../styles/molecules/table-view.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableViewComponent implements AfterContentInit {
  @Input() tableId?: string;
  @Input() columns: TableColumn[] = [];
  @Input() data: TableData[] = [];
  @Input() variant: 'default' | 'compact' | 'bordered' | 'striped' = 'default';
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
  @Input() showPagination = false;
  @Input() loading = false;
  @Input() loadingRows: Set<string> = new Set();
  @Input() disabledRows: Set<string> = new Set();
  @Input() emptyTitle?: string;
  @Input() emptyDescription?: string;
  @Input() sortConfig?: SortConfig;
  @Input() filters: Record<string, any> = {};
  @Input() truncateCells = true;
  @Input() rowIdField = 'id';
  @Input() actionsTemplate?: any; // TemplateRef<any>
  @Input() expandedTemplate?: any; // TemplateRef<any>

  @Output() rowClick = new EventEmitter<{ row: TableData; index: number }>();
  @Output() rowSelect = new EventEmitter<{ row: TableData; selected: boolean; index: number }>();
  @Output() rowExpand = new EventEmitter<{ row: TableData; expanded: boolean; index: number }>();
  @Output() rowHover = new EventEmitter<{ row: TableData; index: number }>();
  @Output() cellClick = new EventEmitter<{ value: any; column: string; row: TableData }>();
  @Output() sort = new EventEmitter<SortConfig>();
  @Output() filter = new EventEmitter<{ column: string; value: any }>();
  @Output() resize = new EventEmitter<{ column: string; width: number }>();
  @Output() selectionChange = new EventEmitter<Set<string>>();

  @ContentChildren(TableRowComponent) tableRows!: QueryList<TableRowComponent>;

  @HostBinding('class') get hostClass() {
    return `table-view-host table-view-host--${this.variant} table-view-host--${this.size}`;
  }

  ngAfterContentInit() {
    // Initialize table configurations if needed
  }

  getClasses(): string {
    const classes = [`table-view--${this.variant}`, `table-view--${this.size}`];

    if (this.selectable) classes.push('table-view--selectable');
    if (this.expandable) classes.push('table-view--expandable');
    if (this.loading) classes.push('table-view--loading');

    return classes.join(' ');
  }

  getTableClasses(): string {
    const classes = [`table-view__table--${this.variant}`, `table-view__table--${this.size}`];

    return classes.join(' ');
  }

  getSkeletonRows(): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => i);
  }

  getTotalColumns(): number {
    let count = this.columns.length;
    if (this.selectable) count++;
    if (this.expandable) count++;
    if (this.showIndex) count++;
    if (this.showActions) count++;
    return count;
  }

  isEmpty(): boolean {
    return this.data.length === 0 && this.tableRows.length === 0;
  }

  getRowId(row: TableData): string {
    return row[this.rowIdField] || row.id || '';
  }

  isRowSelected(row: TableData): boolean {
    return this.selectedRows.has(this.getRowId(row));
  }

  isRowExpanded(row: TableData): boolean {
    return this.expandedRows.has(this.getRowId(row));
  }

  isRowLoading(row: TableData): boolean {
    return this.loadingRows.has(this.getRowId(row));
  }

  isRowDisabled(row: TableData): boolean {
    return this.disabledRows.has(this.getRowId(row));
  }

  isAllSelected(): boolean {
    return this.data.length > 0 && this.data.every((row) => this.isRowSelected(row));
  }

  isSomeSelected(): boolean {
    return this.data.some((row) => this.isRowSelected(row)) && !this.isAllSelected();
  }

  getSortDirection(columnKey: string): 'asc' | 'desc' | undefined {
    return this.sortConfig?.column === columnKey ? this.sortConfig.direction : undefined;
  }

  hasColumnFilter(columnKey: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.filters, columnKey);
  }

  getCellValue(row: TableData, columnKey: string): any {
    return row[columnKey];
  }

  isCellClickable(column: TableColumn): boolean {
    return column.sortable || false;
  }

  getRowStatus(row: TableData): 'normal' | 'success' | 'warning' | 'error' | undefined {
    return row._status || row.status;
  }

  trackRowBy(index: number, row: TableData): string {
    return this.getRowId(row);
  }

  trackColumnBy(index: number, column: TableColumn): string {
    return column.key;
  }

  handleRowClick(event: { row: TableData; index: number }): void {
    this.rowClick.emit(event);
  }

  handleRowSelect(event: { row: TableData; selected: boolean; index: number }): void {
    const rowId = this.getRowId(event.row);
    const newSelection = new Set(this.selectedRows);

    if (event.selected) {
      newSelection.add(rowId);
    } else {
      newSelection.delete(rowId);
    }

    this.selectionChange.emit(newSelection);
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

  handleSort(sortConfig: SortConfig): void {
    this.sort.emit(sortConfig);
  }

  handleFilter(event: { column: string; value: any }): void {
    this.filter.emit(event);
  }

  handleResize(event: { column: string; width: number }): void {
    this.resize.emit(event);
  }

  handleSelectAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newSelection = new Set<string>();

    if (target.checked) {
      this.data.forEach((row) => {
        if (!this.isRowDisabled(row)) {
          newSelection.add(this.getRowId(row));
        }
      });
    }

    this.selectionChange.emit(newSelection);
  }

  // Public methods for external control
  selectAll(): void {
    const allIds = new Set(
      this.data.filter((row) => !this.isRowDisabled(row)).map((row) => this.getRowId(row))
    );
    this.selectionChange.emit(allIds);
  }

  deselectAll(): void {
    this.selectionChange.emit(new Set());
  }

  getSelectedRows(): TableData[] {
    return this.data.filter((row) => this.isRowSelected(row));
  }

  expandAll(): void {
    const allIds = new Set(this.data.map((row) => this.getRowId(row)));
    // Emit expand change for all rows
    this.data.forEach((row, index) => {
      this.rowExpand.emit({ row, expanded: true, index });
    });
  }

  collapseAll(): void {
    // Emit expand change for all rows
    this.data.forEach((row, index) => {
      this.rowExpand.emit({ row, expanded: false, index });
    });
  }
}
