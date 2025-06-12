import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ChangeDetectionStrategy,
} from '@angular/core';

export type ViewMode = 'grid' | 'table';

export interface ViewToggleOption {
  mode: ViewMode;
  label: string;
  icon: string;
  disabled?: boolean;
  tooltip?: string;
}

@Component({
  selector: 'ui-view-toggle',
  template: `
    <div
      class="view-toggle"
      [class]="getClasses()"
      [attr.role]="'radiogroup'"
      [attr.aria-label]="'View mode selector'"
    >
      <!-- Toggle Buttons -->
      <button
        *ngFor="let option of options; trackBy: trackOptionBy"
        type="button"
        class="view-toggle__button"
        [class]="getButtonClasses(option)"
        [disabled]="option.disabled || disabled"
        [attr.aria-pressed]="currentMode === option.mode"
        [attr.aria-label]="option.label"
        [attr.title]="option.tooltip || option.label"
        (click)="handleModeChange(option.mode)"
      >
        <!-- Icon -->
        <svg *ngIf="showIcons" class="view-toggle__icon" fill="currentColor" viewBox="0 0 24 24">
          <ng-container [ngSwitch]="option.icon">
            <!-- Grid Icon -->
            <path
              *ngSwitchCase="'grid'"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />

            <!-- Table Icon -->
            <path
              *ngSwitchCase="'table'"
              d="M3 3a1 1 0 000 2v10a2 2 0 002 2h14a2 2 0 002-2V5a1 1 0 100-2H3zm3 2v2h4V5H6zm6 0v2h4V5h-4zm-6 4v2h4v-2H6zm6 0v2h4v-2h-4zm-6 4v2h4v-2H6zm6 0v2h4v-2h-4z"
            />

            <!-- List Icon -->
            <path *ngSwitchCase="'list'" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />

            <!-- Card Icon -->
            <path
              *ngSwitchCase="'card'"
              d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
            />

            <!-- Default Icon -->
            <circle *ngSwitchDefault cx="12" cy="12" r="2" />
          </ng-container>
        </svg>

        <!-- Label -->
        <span *ngIf="showLabels" class="view-toggle__label">{{ option.label }}</span>

        <!-- Badge -->
        <span *ngIf="option.disabled" class="view-toggle__badge">
          <svg class="view-toggle__badge-icon" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </button>

      <!-- Custom Options -->
      <ng-content select="[slot=custom-options]"></ng-content>

      <!-- Indicator -->
      <div
        *ngIf="showIndicator"
        class="view-toggle__indicator"
        [style.transform]="getIndicatorTransform()"
      ></div>
    </div>

    <!-- Mode Labels (for accessibility) -->
    <div *ngIf="showModeLabel" class="view-toggle__mode-label">
      Current view: {{ getCurrentModeLabel() }}
    </div>

    <!-- Additional Controls -->
    <div *ngIf="showAdditionalControls" class="view-toggle__controls">
      <ng-content select="[slot=controls]"></ng-content>
    </div>
  `,
  styleUrls: ['../../styles/molecules/view-toggle.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewToggleComponent {
  @Input() currentMode: ViewMode = 'grid';
  @Input() options: ViewToggleOption[] = [
    { mode: 'grid', label: 'Grid View', icon: 'grid' },
    { mode: 'table', label: 'Table View', icon: 'table' },
  ];
  @Input() variant: 'default' | 'compact' | 'pill' | 'minimal' = 'default';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showIcons = true;
  @Input() showLabels = true;
  @Input() showIndicator = false;
  @Input() showModeLabel = false;
  @Input() showAdditionalControls = false;
  @Input() disabled = false;
  @Input() exclusive = true; // Only one option can be selected at a time

  @Output() modeChange = new EventEmitter<ViewMode>();
  @Output() optionClick = new EventEmitter<{ mode: ViewMode; option: ViewToggleOption }>();

  @HostBinding('class') get hostClass() {
    return `view-toggle-host view-toggle-host--${this.variant} view-toggle-host--${this.size}`;
  }

  getClasses(): string {
    const classes = [`view-toggle--${this.variant}`, `view-toggle--${this.size}`];

    if (this.disabled) classes.push('view-toggle--disabled');
    if (this.showIndicator) classes.push('view-toggle--with-indicator');
    if (!this.showLabels) classes.push('view-toggle--icons-only');

    return classes.join(' ');
  }

  getButtonClasses(option: ViewToggleOption): string {
    const classes = [`view-toggle__button--${this.variant}`, `view-toggle__button--${this.size}`];

    if (this.currentMode === option.mode) {
      classes.push('view-toggle__button--active');
    }
    if (option.disabled) {
      classes.push('view-toggle__button--disabled');
    }

    return classes.join(' ');
  }

  getIndicatorTransform(): string {
    const activeIndex = this.options.findIndex((option) => option.mode === this.currentMode);
    if (activeIndex === -1) return 'translateX(0)';

    const percentage = (activeIndex / Math.max(this.options.length - 1, 1)) * 100;
    return `translateX(${percentage}%)`;
  }

  getCurrentModeLabel(): string {
    const currentOption = this.options.find((option) => option.mode === this.currentMode);
    return currentOption?.label || this.currentMode;
  }

  trackOptionBy(index: number, option: ViewToggleOption): string {
    return option.mode;
  }

  handleModeChange(mode: ViewMode): void {
    if (mode === this.currentMode && this.exclusive) {
      return; // Don't allow deselecting in exclusive mode
    }

    if (this.disabled) {
      return;
    }

    const option = this.options.find((opt) => opt.mode === mode);
    if (option?.disabled) {
      return;
    }

    this.modeChange.emit(mode);

    if (option) {
      this.optionClick.emit({ mode, option });
    }
  }

  // Public methods for external control
  setMode(mode: ViewMode): void {
    if (this.options.some((option) => option.mode === mode)) {
      this.handleModeChange(mode);
    }
  }

  getAvailableModes(): ViewMode[] {
    return this.options.filter((option) => !option.disabled).map((option) => option.mode);
  }

  isValidMode(mode: ViewMode): boolean {
    return this.options.some((option) => option.mode === mode && !option.disabled);
  }

  getNextMode(): ViewMode | null {
    const availableModes = this.getAvailableModes();
    const currentIndex = availableModes.indexOf(this.currentMode);

    if (currentIndex === -1 || availableModes.length <= 1) {
      return null;
    }

    const nextIndex = (currentIndex + 1) % availableModes.length;
    return availableModes[nextIndex];
  }

  getPreviousMode(): ViewMode | null {
    const availableModes = this.getAvailableModes();
    const currentIndex = availableModes.indexOf(this.currentMode);

    if (currentIndex === -1 || availableModes.length <= 1) {
      return null;
    }

    const prevIndex = (currentIndex - 1 + availableModes.length) % availableModes.length;
    return availableModes[prevIndex];
  }

  toggleMode(): void {
    const nextMode = this.getNextMode();
    if (nextMode) {
      this.setMode(nextMode);
    }
  }
}
