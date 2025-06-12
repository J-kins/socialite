import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ChangeDetectionStrategy,
} from '@angular/core';

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'ui-table-header',
  template: `
    <th
      class="table-header"
      [class]="getClasses()"
      [style.text-align]="align"
      [style.width]="width"
      [style.min-width]="minWidth"
      [style.max-width]="maxWidth"
      (click)="handleClick()"
      [attr.data-column]="columnKey"
      [attr.aria-sort]="getAriaSort()"
      [attr.role]="'columnheader'"
      [attr.scope]="'col'"
    >
      <div class="table-header__content">
        <!-- Header Text -->
        <span class="table-header__text">{{ label }}</span>

        <!-- Sort Indicator -->
        <div *ngIf="sortable" class="table-header__sort-indicator">
          <svg
            *ngIf="sortDirection === 'asc'"
            class="table-header__sort-icon table-header__sort-icon--asc"
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
            class="table-header__sort-icon table-header__sort-icon--desc"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <div
            *ngIf="!sortDirection"
            class="table-header__sort-icon table-header__sort-icon--neutral"
          >
            <svg class="table-header__sort-icon-up" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <svg class="table-header__sort-icon-down" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
        </div>

        <!-- Filter Indicator -->
        <div *ngIf="filterable && hasFilter" class="table-header__filter-indicator">
          <svg class="table-header__filter-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>

        <!-- Required Indicator -->
        <span *ngIf="required" class="table-header__required" aria-label="required">*</span>
      </div>

      <!-- Resize Handle -->
      <div
        *ngIf="resizable"
        class="table-header__resize-handle"
        (mousedown)="onResizeStart($event)"
        (touchstart)="onResizeStart($event)"
      ></div>
    </th>
  `,
  styleUrls: ['../../styles/atoms/table-header.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeaderComponent {
  @Input() label!: string;
  @Input() columnKey!: string;
  @Input() sortable = false;
  @Input() filterable = false;
  @Input() resizable = false;
  @Input() sortDirection?: 'asc' | 'desc';
  @Input() hasFilter = false;
  @Input() required = false;
  @Input() align: 'left' | 'center' | 'right' = 'left';
  @Input() width?: string;
  @Input() minWidth?: string;
  @Input() maxWidth?: string;
  @Input() sticky = false;
  @Input() variant: 'default' | 'compact' | 'bordered' = 'default';

  @Output() sort = new EventEmitter<SortConfig>();
  @Output() filter = new EventEmitter<string>();
  @Output() resize = new EventEmitter<{ column: string; width: number }>();

  @HostBinding('class') get hostClass() {
    return `table-header-host table-header-host--${this.variant}`;
  }

  getClasses(): string {
    const classes = [`table-header--${this.variant}`, `table-header--${this.align}`];

    if (this.sortable) classes.push('table-header--sortable');
    if (this.filterable) classes.push('table-header--filterable');
    if (this.resizable) classes.push('table-header--resizable');
    if (this.sticky) classes.push('table-header--sticky');
    if (this.sortDirection) classes.push(`table-header--sorted-${this.sortDirection}`);
    if (this.hasFilter) classes.push('table-header--filtered');
    if (this.required) classes.push('table-header--required');

    return classes.join(' ');
  }

  getAriaSort(): string | null {
    if (!this.sortable) return null;
    if (this.sortDirection === 'asc') return 'ascending';
    if (this.sortDirection === 'desc') return 'descending';
    return 'none';
  }

  handleClick(): void {
    if (this.sortable) {
      const newDirection: 'asc' | 'desc' = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.sort.emit({
        column: this.columnKey,
        direction: newDirection,
      });
    }
  }

  onResizeStart(event: MouseEvent | TouchEvent): void {
    if (!this.resizable) return;

    event.preventDefault();
    event.stopPropagation();

    const startX = this.getEventX(event);
    const startWidth = (event.target as HTMLElement).parentElement?.offsetWidth || 0;

    const onMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentX = this.getEventX(moveEvent);
      const diff = currentX - startX;
      const newWidth = Math.max(50, startWidth + diff); // Minimum width of 50px

      this.resize.emit({
        column: this.columnKey,
        width: newWidth,
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onMouseMove);
    document.addEventListener('touchend', onMouseUp);
  }

  private getEventX(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) {
      return event.clientX;
    } else {
      return event.touches[0].clientX;
    }
  }
}
