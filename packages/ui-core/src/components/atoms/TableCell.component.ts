import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ChangeDetectionStrategy,
  TemplateRef,
} from '@angular/core';

export type TableCellAlign = 'left' | 'center' | 'right';
export type TableCellType = 'text' | 'number' | 'date' | 'currency' | 'boolean' | 'custom';

@Component({
  selector: 'ui-table-cell',
  template: `
    <td
      class="table-cell"
      [class]="getClasses()"
      [style.text-align]="align"
      [style.width]="width"
      [style.min-width]="minWidth"
      [style.max-width]="maxWidth"
      (click)="handleClick()"
      [attr.data-column]="columnKey"
      [attr.data-type]="type"
    >
      <!-- Loading State -->
      <div *ngIf="loading" class="table-cell__loading">
        <div class="table-cell__skeleton"></div>
      </div>

      <!-- Content -->
      <div *ngIf="!loading" class="table-cell__content">
        <!-- Custom Template -->
        <ng-container *ngIf="customTemplate">
          <ng-container
            *ngTemplateOutlet="
              customTemplate;
              context: { $implicit: value, row: rowData, column: columnKey }
            "
          ></ng-container>
        </ng-container>

        <!-- Default Content -->
        <ng-container *ngIf="!customTemplate">
          <!-- Boolean Type -->
          <ng-container *ngIf="type === 'boolean'">
            <span class="table-cell__boolean" [class.table-cell__boolean--true]="value">
              <svg
                *ngIf="value"
                class="table-cell__check-icon"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <svg
                *ngIf="!value"
                class="table-cell__x-icon"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
          </ng-container>

          <!-- Number Type -->
          <ng-container *ngIf="type === 'number'">
            <span class="table-cell__number">{{ formatNumber(value) }}</span>
          </ng-container>

          <!-- Currency Type -->
          <ng-container *ngIf="type === 'currency'">
            <span class="table-cell__currency">{{ formatCurrency(value) }}</span>
          </ng-container>

          <!-- Date Type -->
          <ng-container *ngIf="type === 'date'">
            <span class="table-cell__date">{{ formatDate(value) }}</span>
          </ng-container>

          <!-- Text Type (Default) -->
          <ng-container *ngIf="type === 'text' || !type">
            <span class="table-cell__text" [title]="value">{{ value }}</span>
          </ng-container>
        </ng-container>

        <!-- Badge/Tag -->
        <span *ngIf="badge" class="table-cell__badge" [class]="getBadgeClasses()">
          {{ badge }}
        </span>

        <!-- Secondary Text -->
        <div *ngIf="secondaryText" class="table-cell__secondary">
          {{ secondaryText }}
        </div>
      </div>

      <!-- Actions -->
      <div *ngIf="showActions && !loading" class="table-cell__actions">
        <ng-content select="[slot=actions]"></ng-content>
      </div>

      <!-- Sort Indicator (for header cells) -->
      <div *ngIf="sortable && !loading" class="table-cell__sort-indicator">
        <svg
          *ngIf="sortDirection === 'asc'"
          class="table-cell__sort-icon"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <svg
          *ngIf="sortDirection === 'desc'"
          class="table-cell__sort-icon"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
    </td>
  `,
  styleUrls: ['../../styles/atoms/table-cell.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCellComponent {
  @Input() value: any;
  @Input() type: TableCellType = 'text';
  @Input() align: TableCellAlign = 'left';
  @Input() columnKey?: string;
  @Input() rowData?: any;
  @Input() width?: string;
  @Input() minWidth?: string;
  @Input() maxWidth?: string;
  @Input() badge?: string;
  @Input() badgeVariant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' = 'primary';
  @Input() secondaryText?: string;
  @Input() customTemplate?: TemplateRef<any>;
  @Input() clickable = false;
  @Input() sortable = false;
  @Input() sortDirection?: 'asc' | 'desc';
  @Input() showActions = false;
  @Input() loading = false;
  @Input() sticky = false;
  @Input() variant: 'default' | 'compact' | 'bordered' = 'default';
  @Input() truncate = true;

  @Output() cellClick = new EventEmitter<{ value: any; column: string; row: any }>();
  @Output() sortChange = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();

  @HostBinding('class') get hostClass() {
    return `table-cell-host table-cell-host--${this.variant}`;
  }

  getClasses(): string {
    const classes = [
      `table-cell--${this.variant}`,
      `table-cell--${this.type}`,
      `table-cell--${this.align}`,
    ];

    if (this.clickable) classes.push('table-cell--clickable');
    if (this.sortable) classes.push('table-cell--sortable');
    if (this.loading) classes.push('table-cell--loading');
    if (this.sticky) classes.push('table-cell--sticky');
    if (this.truncate) classes.push('table-cell--truncate');
    if (this.sortDirection) classes.push(`table-cell--sorted-${this.sortDirection}`);

    return classes.join(' ');
  }

  getBadgeClasses(): string {
    return `table-cell__badge--${this.badgeVariant}`;
  }

  formatNumber(value: any): string {
    if (value == null) return '';
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return new Intl.NumberFormat().format(num);
  }

  formatCurrency(value: any): string {
    if (value == null) return '';
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num);
  }

  formatDate(value: any): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  handleClick(): void {
    if (this.clickable && this.columnKey) {
      this.cellClick.emit({
        value: this.value,
        column: this.columnKey,
        row: this.rowData,
      });
    }

    if (this.sortable && this.columnKey) {
      const newDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.sortChange.emit({
        column: this.columnKey,
        direction: newDirection,
      });
    }
  }
}
