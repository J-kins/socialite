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
import { TableCellComponent } from '../atoms/TableCell.component';

@Component({
  selector: 'ui-table-row',
  template: `
    <tr
      class="table-row"
      [class]="getClasses()"
      (click)="handleClick()"
      (mouseenter)="handleMouseEnter()"
      (mouseleave)="handleMouseLeave()"
      [attr.data-row-id]="rowId"
      [attr.aria-selected]="isSelected"
      [attr.role]="'row'"
    >
      <!-- Selection Cell -->
      <td *ngIf="selectable" class="table-row__selection-cell">
        <input
          type="checkbox"
          [checked]="isSelected"
          (change)="handleSelectionChange($event)"
          class="table-row__checkbox"
          [attr.aria-label]="'Select row ' + (rowId || index)"
        />
      </td>

      <!-- Expand/Collapse Cell -->
      <td *ngIf="expandable" class="table-row__expand-cell">
        <button
          type="button"
          class="table-row__expand-button"
          (click)="handleExpandToggle($event)"
          [attr.aria-expanded]="isExpanded"
          [attr.aria-label]="isExpanded ? 'Collapse row' : 'Expand row'"
        >
          <svg
            class="table-row__expand-icon"
            [class.table-row__expand-icon--expanded]="isExpanded"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </td>

      <!-- Row Index/Number -->
      <td *ngIf="showIndex" class="table-row__index-cell">
        <span class="table-row__index">{{ index + 1 }}</span>
      </td>

      <!-- Content Cells -->
      <ng-content></ng-content>

      <!-- Actions Cell -->
      <td *ngIf="showActions" class="table-row__actions-cell">
        <div class="table-row__actions">
          <ng-content select="[slot=actions]"></ng-content>
        </div>
      </td>

      <!-- Loading Overlay -->
      <td *ngIf="loading" [attr.colspan]="getColspan()" class="table-row__loading-cell">
        <div class="table-row__loading">
          <div class="table-row__spinner"></div>
          <span class="table-row__loading-text">Loading...</span>
        </div>
      </td>
    </tr>

    <!-- Expanded Content Row -->
    <tr *ngIf="expandable && isExpanded && !loading" class="table-row__expanded-content">
      <td [attr.colspan]="getColspan()" class="table-row__expanded-cell">
        <div class="table-row__expanded-wrapper">
          <ng-content select="[slot=expanded]"></ng-content>
        </div>
      </td>
    </tr>
  `,
  styleUrls: ['../../styles/molecules/table-row.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRowComponent implements AfterContentInit {
  @Input() rowData: any;
  @Input() rowId?: string;
  @Input() index = 0;
  @Input() selectable = false;
  @Input() isSelected = false;
  @Input() expandable = false;
  @Input() isExpanded = false;
  @Input() clickable = true;
  @Input() showIndex = false;
  @Input() showActions = false;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() variant: 'default' | 'compact' | 'bordered' | 'striped' = 'default';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() status?: 'normal' | 'success' | 'warning' | 'error';

  @Output() rowClick = new EventEmitter<{ row: any; index: number }>();
  @Output() rowSelect = new EventEmitter<{ row: any; selected: boolean; index: number }>();
  @Output() rowExpand = new EventEmitter<{ row: any; expanded: boolean; index: number }>();
  @Output() rowHover = new EventEmitter<{ row: any; index: number }>();

  @ContentChildren(TableCellComponent) cells!: QueryList<TableCellComponent>;

  @HostBinding('class') get hostClass() {
    return `table-row-host table-row-host--${this.variant} table-row-host--${this.size}`;
  }

  ngAfterContentInit() {
    // Initialize cell configurations if needed
  }

  getClasses(): string {
    const classes = [`table-row--${this.variant}`, `table-row--${this.size}`];

    if (this.selectable) classes.push('table-row--selectable');
    if (this.isSelected) classes.push('table-row--selected');
    if (this.expandable) classes.push('table-row--expandable');
    if (this.isExpanded) classes.push('table-row--expanded');
    if (this.clickable && !this.disabled) classes.push('table-row--clickable');
    if (this.loading) classes.push('table-row--loading');
    if (this.disabled) classes.push('table-row--disabled');
    if (this.status) classes.push(`table-row--${this.status}`);

    return classes.join(' ');
  }

  getColspan(): number {
    let colspan = this.cells ? this.cells.length : 0;

    if (this.selectable) colspan++;
    if (this.expandable) colspan++;
    if (this.showIndex) colspan++;
    if (this.showActions) colspan++;

    return Math.max(colspan, 1);
  }

  handleClick(): void {
    if (this.clickable && !this.disabled && !this.loading) {
      this.rowClick.emit({
        row: this.rowData,
        index: this.index,
      });
    }
  }

  handleSelectionChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.rowSelect.emit({
      row: this.rowData,
      selected: target.checked,
      index: this.index,
    });
  }

  handleExpandToggle(event: Event): void {
    event.stopPropagation();
    const newExpanded = !this.isExpanded;
    this.rowExpand.emit({
      row: this.rowData,
      expanded: newExpanded,
      index: this.index,
    });
  }

  handleMouseEnter(): void {
    if (!this.disabled) {
      this.rowHover.emit({
        row: this.rowData,
        index: this.index,
      });
    }
  }

  handleMouseLeave(): void {
    // Handle mouse leave if needed
  }
}
