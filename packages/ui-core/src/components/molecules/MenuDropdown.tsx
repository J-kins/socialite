import React, { useState, useRef, useEffect } from 'react';
import { Icon, Avatar, Badge } from '../atoms';

export interface MenuDropdownItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
  divider?: boolean;
  children?: MenuDropdownItem[];
  onClick?: () => void;
}

export interface MenuDropdownProps {
  items: MenuDropdownItem[];
  trigger: React.ReactNode;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'left' | 'right';
  variant?: 'default' | 'compact' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  maxHeight?: string;
  closeOnClick?: boolean;
  className?: string;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({
  items,
  trigger,
  placement = 'bottom-start',
  variant = 'default',
  size = 'md',
  maxHeight = '320px',
  closeOnClick = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const getPlacementClasses = () => {
    const placements = {
      'bottom-start': 'top-full left-0 mt-1',
      'bottom-end': 'top-full right-0 mt-1',
      'top-start': 'bottom-full left-0 mb-1',
      'top-end': 'bottom-full right-0 mb-1',
      left: 'right-full top-0 mr-1',
      right: 'left-full top-0 ml-1',
    };
    return placements[placement];
  };

  const getVariantClasses = () => {
    const variants = {
      default:
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg',
      compact:
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-md',
      bordered:
        'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-xl rounded-lg',
    };
    return variants[variant];
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: {
        dropdown: 'min-w-48 text-xs',
        item: 'px-3 py-2',
        icon: 'w-3 h-3',
      },
      md: {
        dropdown: 'min-w-56 text-sm',
        item: 'px-4 py-2.5',
        icon: 'w-4 h-4',
      },
      lg: {
        dropdown: 'min-w-64 text-base',
        item: 'px-5 py-3',
        icon: 'w-5 h-5',
      },
    };
    return sizes[size];
  };

  const handleItemClick = (item: MenuDropdownItem) => {
    if (item.disabled) return;

    if (item.children) {
      setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
      return;
    }

    if (item.onClick) {
      item.onClick();
    }

    if (closeOnClick) {
      setIsOpen(false);
      setActiveSubmenu(null);
    }
  };

  const renderMenuItem = (item: MenuDropdownItem, level = 0) => {
    const sizeClasses = getSizeClasses();
    const hasSubmenu = item.children && item.children.length > 0;
    const isSubmenuOpen = activeSubmenu === item.id;

    if (item.divider) {
      return (
        <div key={item.id} className="my-1">
          <hr className="border-gray-200 dark:border-gray-600" />
        </div>
      );
    }

    return (
      <div key={item.id} className="relative">
        <button
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
          className={`
            w-full ${sizeClasses.item} flex items-center justify-between text-left
            ${
              item.disabled
                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
            ${level > 0 ? 'pl-8' : ''}
            transition-colors duration-150 rounded-md mx-1
          `}
        >
          <div className="flex items-center space-x-3">
            {item.icon && (
              <Icon
                name={item.icon}
                className={`${sizeClasses.icon} ${item.disabled ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}
              />
            )}
            <span className="flex-1">{item.label}</span>
          </div>

          <div className="flex items-center space-x-2">
            {item.badge && (
              <Badge variant="secondary" size="sm">
                {item.badge}
              </Badge>
            )}
            {hasSubmenu && (
              <Icon
                name="chevron-forward"
                className={`${sizeClasses.icon} transition-transform duration-200 ${
                  isSubmenuOpen ? 'rotate-90' : ''
                }`}
              />
            )}
          </div>
        </button>

        {/* Submenu */}
        {hasSubmenu && isSubmenuOpen && (
          <div className="mt-1 ml-4 space-y-1">
            {item.children!.map((subItem) => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const sizeClasses = getSizeClasses();
  const placementClasses = getPlacementClasses();
  const variantClasses = getVariantClasses();

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`
            absolute ${placementClasses} ${variantClasses} ${sizeClasses.dropdown}
            py-2 z-50 backdrop-blur-sm
          `}
          style={{ maxHeight }}
        >
          <div className="overflow-y-auto">{items.map((item) => renderMenuItem(item))}</div>
        </div>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
