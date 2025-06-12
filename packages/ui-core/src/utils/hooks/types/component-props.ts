import { ReactNode, CSSProperties, HTMLAttributes, AriaAttributes } from 'react';

// Base component props that all components should extend
export interface BaseComponentProps {
  /** Unique identifier for the component */
  id?: string;
  /** CSS class names */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Children elements */
  children?: ReactNode;
  /** Test identifier for testing frameworks */
  'data-testid'?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: boolean;
  /** Success state */
  success?: boolean;
  /** Warning state */
  warning?: boolean;
}

// Size variants used across components
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Color variants used across components
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

// Theme variants
export type ThemeVariant = 'light' | 'dark' | 'auto';

// Button specific props
export interface ButtonProps extends BaseComponentProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  color?: ColorVariant;
  size?: Size;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
}

// Input specific props
export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  size?: Size;
  variant?: 'outline' | 'filled' | 'flushed' | 'unstyled';
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

// Modal specific props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  size?: Size | 'full';
  placement?: 'center' | 'top' | 'bottom';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  scrollBehavior?: 'inside' | 'outside';
  trapFocus?: boolean;
  returnFocusOnClose?: boolean;
  blockScrollOnMount?: boolean;
  preserveScrollBarGap?: boolean;
  motionPreset?: 'slideInBottom' | 'slideInRight' | 'scale' | 'none';
}

// Card specific props
export interface CardProps extends BaseComponentProps {
  variant?: 'elevated' | 'outline' | 'filled' | 'unstyled';
  size?: Size;
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// Avatar specific props
export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: Size;
  shape?: 'circle' | 'square';
  showBorder?: boolean;
  borderColor?: string;
  fallback?: ReactNode;
  loading?: 'eager' | 'lazy';
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  referrerPolicy?: HTMLImageElement['referrerPolicy'];
  onError?: () => void;
  onLoad?: () => void;
}

// Badge specific props
export interface BadgeProps extends BaseComponentProps {
  variant?: 'solid' | 'subtle' | 'outline';
  color?: ColorVariant;
  size?: Size;
  shape?: 'square' | 'circle';
  placement?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
}

// Tooltip specific props
export interface TooltipProps extends BaseComponentProps {
  label: ReactNode;
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end';
  hasArrow?: boolean;
  arrowSize?: number;
  arrowShadowColor?: string;
  arrowPadding?: number;
  bg?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  p?: number | string;
  px?: number | string;
  py?: number | string;
  borderRadius?: string;
  shadow?: string;
  maxW?: string;
  offset?: [number, number];
  gutter?: number;
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  closeOnClick?: boolean;
  closeOnMouseDown?: boolean;
  closeOnEsc?: boolean;
  closeDelay?: number;
  openDelay?: number;
  shouldWrapChildren?: boolean;
}

// Dropdown/Menu specific props
export interface DropdownProps extends BaseComponentProps {
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end';
  strategy?: 'absolute' | 'fixed';
  offset?: [number, number];
  gutter?: number;
  preventOverflow?: boolean;
  flip?: boolean;
  matchWidth?: boolean;
  boundary?: 'clippingParents' | 'scrollParent' | HTMLElement;
  eventListeners?: boolean;
  closeOnBlur?: boolean;
  closeOnSelect?: boolean;
  autoSelect?: boolean;
  computePositionOnMount?: boolean;
}

// Table specific props
export interface TableProps extends BaseComponentProps {
  variant?: 'simple' | 'striped' | 'bordered';
  size?: Size;
  layout?: 'auto' | 'fixed';
  colorScheme?: string;
  caption?: ReactNode;
  captionSide?: 'top' | 'bottom';
}

// Form control props
export interface FormControlProps extends BaseComponentProps {
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
  label?: ReactNode;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
}

// Animation props
export interface AnimationProps {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  variants?: any;
  custom?: any;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

// Responsive props utility type
export type ResponsiveValue<T> = T | T[] | { [key: string]: T };

// Common HTML attributes that components might need
export interface CommonHTMLProps
  extends Omit<HTMLAttributes<HTMLElement>, 'color' | 'translate'>,
    AriaAttributes {
  // Accessibility
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-controls'?: string;
  'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-hidden'?: boolean;
  'aria-live'?: 'off' | 'assertive' | 'polite';
  'aria-atomic'?: boolean;
  'aria-busy'?: boolean;
  'aria-checked'?: boolean | 'false' | 'true' | 'mixed';
  'aria-disabled'?: boolean;
  'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
  'aria-pressed'?: boolean | 'false' | 'true' | 'mixed';
  'aria-readonly'?: boolean;
  'aria-required'?: boolean;
  'aria-selected'?: boolean;
  'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
  'aria-valuemax'?: number;
  'aria-valuemin'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;

  // Common data attributes
  'data-state'?: string;
  'data-orientation'?: 'horizontal' | 'vertical';
  'data-side'?: 'top' | 'right' | 'bottom' | 'left';
  'data-align'?: 'start' | 'center' | 'end';
  'data-highlighted'?: boolean;
  'data-disabled'?: boolean;
  'data-invalid'?: boolean;
  'data-checked'?: boolean;
  'data-selected'?: boolean;
  'data-active'?: boolean;
  'data-focus'?: boolean;
  'data-hover'?: boolean;
  'data-loading'?: boolean;
}

// Theme-aware props
export interface ThemeProps {
  theme?: ThemeVariant;
  colorMode?: 'light' | 'dark';
}

// Layout props
export interface LayoutProps {
  display?: ResponsiveValue<CSSProperties['display']>;
  width?: ResponsiveValue<CSSProperties['width']>;
  height?: ResponsiveValue<CSSProperties['height']>;
  minWidth?: ResponsiveValue<CSSProperties['minWidth']>;
  minHeight?: ResponsiveValue<CSSProperties['minHeight']>;
  maxWidth?: ResponsiveValue<CSSProperties['maxWidth']>;
  maxHeight?: ResponsiveValue<CSSProperties['maxHeight']>;
  overflow?: ResponsiveValue<CSSProperties['overflow']>;
  overflowX?: ResponsiveValue<CSSProperties['overflowX']>;
  overflowY?: ResponsiveValue<CSSProperties['overflowY']>;
  verticalAlign?: ResponsiveValue<CSSProperties['verticalAlign']>;
}

// Spacing props
export interface SpacingProps {
  margin?: ResponsiveValue<CSSProperties['margin']>;
  marginTop?: ResponsiveValue<CSSProperties['marginTop']>;
  marginRight?: ResponsiveValue<CSSProperties['marginRight']>;
  marginBottom?: ResponsiveValue<CSSProperties['marginBottom']>;
  marginLeft?: ResponsiveValue<CSSProperties['marginLeft']>;
  marginX?: ResponsiveValue<CSSProperties['marginLeft']>;
  marginY?: ResponsiveValue<CSSProperties['marginTop']>;
  padding?: ResponsiveValue<CSSProperties['padding']>;
  paddingTop?: ResponsiveValue<CSSProperties['paddingTop']>;
  paddingRight?: ResponsiveValue<CSSProperties['paddingRight']>;
  paddingBottom?: ResponsiveValue<CSSProperties['paddingBottom']>;
  paddingLeft?: ResponsiveValue<CSSProperties['paddingLeft']>;
  paddingX?: ResponsiveValue<CSSProperties['paddingLeft']>;
  paddingY?: ResponsiveValue<CSSProperties['paddingTop']>;
}

// Typography props
export interface TypographyProps {
  fontFamily?: ResponsiveValue<CSSProperties['fontFamily']>;
  fontSize?: ResponsiveValue<CSSProperties['fontSize']>;
  fontWeight?: ResponsiveValue<CSSProperties['fontWeight']>;
  lineHeight?: ResponsiveValue<CSSProperties['lineHeight']>;
  letterSpacing?: ResponsiveValue<CSSProperties['letterSpacing']>;
  textAlign?: ResponsiveValue<CSSProperties['textAlign']>;
  textTransform?: ResponsiveValue<CSSProperties['textTransform']>;
  textDecoration?: ResponsiveValue<CSSProperties['textDecoration']>;
  whiteSpace?: ResponsiveValue<CSSProperties['whiteSpace']>;
  wordBreak?: ResponsiveValue<CSSProperties['wordBreak']>;
  color?: ResponsiveValue<string>;
}

// Position props
export interface PositionProps {
  position?: ResponsiveValue<CSSProperties['position']>;
  zIndex?: ResponsiveValue<CSSProperties['zIndex']>;
  top?: ResponsiveValue<CSSProperties['top']>;
  right?: ResponsiveValue<CSSProperties['right']>;
  bottom?: ResponsiveValue<CSSProperties['bottom']>;
  left?: ResponsiveValue<CSSProperties['left']>;
}

// Border props
export interface BorderProps {
  border?: ResponsiveValue<CSSProperties['border']>;
  borderWidth?: ResponsiveValue<CSSProperties['borderWidth']>;
  borderStyle?: ResponsiveValue<CSSProperties['borderStyle']>;
  borderColor?: ResponsiveValue<CSSProperties['borderColor']>;
  borderTop?: ResponsiveValue<CSSProperties['borderTop']>;
  borderRight?: ResponsiveValue<CSSProperties['borderRight']>;
  borderBottom?: ResponsiveValue<CSSProperties['borderBottom']>;
  borderLeft?: ResponsiveValue<CSSProperties['borderLeft']>;
  borderRadius?: ResponsiveValue<CSSProperties['borderRadius']>;
  borderTopLeftRadius?: ResponsiveValue<CSSProperties['borderTopLeftRadius']>;
  borderTopRightRadius?: ResponsiveValue<CSSProperties['borderTopRightRadius']>;
  borderBottomLeftRadius?: ResponsiveValue<CSSProperties['borderBottomLeftRadius']>;
  borderBottomRightRadius?: ResponsiveValue<CSSProperties['borderBottomRightRadius']>;
}

// Shadow props
export interface ShadowProps {
  boxShadow?: ResponsiveValue<CSSProperties['boxShadow']>;
  textShadow?: ResponsiveValue<CSSProperties['textShadow']>;
}

// Transform props
export interface TransformProps {
  transform?: ResponsiveValue<CSSProperties['transform']>;
  transformOrigin?: ResponsiveValue<CSSProperties['transformOrigin']>;
}

// Transition props
export interface TransitionProps {
  transition?: ResponsiveValue<CSSProperties['transition']>;
  transitionProperty?: ResponsiveValue<CSSProperties['transitionProperty']>;
  transitionDuration?: ResponsiveValue<CSSProperties['transitionDuration']>;
  transitionTimingFunction?: ResponsiveValue<CSSProperties['transitionTimingFunction']>;
  transitionDelay?: ResponsiveValue<CSSProperties['transitionDelay']>;
}

// Complete style props interface
export interface StyleProps
  extends LayoutProps,
    SpacingProps,
    TypographyProps,
    PositionProps,
    BorderProps,
    ShadowProps,
    TransformProps,
    TransitionProps {}

// Complete component props interface
export interface ComponentProps
  extends BaseComponentProps,
    CommonHTMLProps,
    ThemeProps,
    StyleProps,
    AnimationProps {}

// Event handler types
export interface EventHandlers {
  onClick?: (event: React.MouseEvent) => void;
  onDoubleClick?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onMouseMove?: (event: React.MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onMouseUp?: (event: React.MouseEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onKeyUp?: (event: React.KeyboardEvent) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
  onChange?: (event: React.ChangeEvent) => void;
  onInput?: (event: React.FormEvent) => void;
  onSubmit?: (event: React.FormEvent) => void;
  onReset?: (event: React.FormEvent) => void;
  onScroll?: (event: React.UIEvent) => void;
  onWheel?: (event: React.WheelEvent) => void;
  onTouchStart?: (event: React.TouchEvent) => void;
  onTouchMove?: (event: React.TouchEvent) => void;
  onTouchEnd?: (event: React.TouchEvent) => void;
  onTouchCancel?: (event: React.TouchEvent) => void;
  onDragStart?: (event: React.DragEvent) => void;
  onDrag?: (event: React.DragEvent) => void;
  onDragEnd?: (event: React.DragEvent) => void;
  onDragEnter?: (event: React.DragEvent) => void;
  onDragLeave?: (event: React.DragEvent) => void;
  onDragOver?: (event: React.DragEvent) => void;
  onDrop?: (event: React.DragEvent) => void;
}

// Export utility types
export type { ResponsiveValue };
export type PropsWithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PropsWithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type PropsWithChildren<T = {}> = T & { children: ReactNode };
export type PropsWithClassName<T = {}> = T & { className?: string };
export type PropsWithStyle<T = {}> = T & { style?: CSSProperties };
