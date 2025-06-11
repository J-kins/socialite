import { useState, useCallback, useEffect, useRef } from "react";

export interface UseModalOptions {
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  preventScroll?: boolean;
  restoreFocus?: boolean;
  initialOpen?: boolean;
}

export interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  modalProps: {
    "aria-hidden": boolean;
    role: string;
    tabIndex: number;
  };
  overlayProps: {
    onClick: (event: React.MouseEvent) => void;
  };
  contentProps: {
    onClick: (event: React.MouseEvent) => void;
  };
}

/**
 * A comprehensive hook for managing modal state and behavior
 *
 * @param options - Configuration options for the modal
 * @returns Object with modal state and event handlers
 *
 * @example
 * ```tsx
 * const { isOpen, open, close, modalProps, overlayProps, contentProps } = useModal({
 *   closeOnEscape: true,
 *   closeOnOverlayClick: true,
 *   preventScroll: true
 * });
 *
 * return (
 *   <div>
 *     <button onClick={open}>Open Modal</button>
 *     {isOpen && (
 *       <div className="modal-overlay" {...overlayProps} {...modalProps}>
 *         <div className="modal-content" {...contentProps}>
 *           <h2>Modal Title</h2>
 *           <button onClick={close}>Close</button>
 *         </div>
 *       </div>
 *     )}
 *   </div>
 * );
 * ```
 */
export const useModal = (options: UseModalOptions = {}): UseModalReturn => {
  const {
    closeOnEscape = true,
    closeOnOverlayClick = true,
    preventScroll = true,
    restoreFocus = true,
    initialOpen = false,
  } = options;

  const [isOpen, setIsOpen] = useState(initialOpen);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    if (restoreFocus && document.activeElement instanceof HTMLElement) {
      previousActiveElement.current = document.activeElement;
    }
    setIsOpen(true);
  }, [restoreFocus]);

  const close = useCallback(() => {
    setIsOpen(false);

    if (restoreFocus && previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [restoreFocus]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEscape, close]);

  // Handle body scroll prevention
  useEffect(() => {
    if (!preventScroll || !isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen, preventScroll]);

  // Focus management
  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }
  }, [isOpen]);

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        close();
      }
    },
    [closeOnOverlayClick, close],
  );

  const handleContentClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    modalProps: {
      "aria-hidden": !isOpen,
      role: "dialog",
      tabIndex: -1,
    },
    overlayProps: {
      onClick: handleOverlayClick,
    },
    contentProps: {
      onClick: handleContentClick,
    },
  };
};

/**
 * Hook for managing multiple modals
 *
 * @param modalIds - Array of modal identifiers
 * @param options - Global options for all modals
 * @returns Object with modal states and controls
 */
export const useMultipleModals = (
  modalIds: string[],
  options: UseModalOptions = {},
) => {
  const [openModals, setOpenModals] = useState<Set<string>>(new Set());

  const open = useCallback((modalId: string) => {
    setOpenModals((prev) => new Set(prev).add(modalId));
  }, []);

  const close = useCallback((modalId: string) => {
    setOpenModals((prev) => {
      const newSet = new Set(prev);
      newSet.delete(modalId);
      return newSet;
    });
  }, []);

  const closeAll = useCallback(() => {
    setOpenModals(new Set());
  }, []);

  const toggle = useCallback((modalId: string) => {
    setOpenModals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(modalId)) {
        newSet.delete(modalId);
      } else {
        newSet.add(modalId);
      }
      return newSet;
    });
  }, []);

  const isOpen = useCallback(
    (modalId: string) => {
      return openModals.has(modalId);
    },
    [openModals],
  );

  // Close all modals on escape
  useEffect(() => {
    if (!options.closeOnEscape || openModals.size === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAll();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openModals.size, options.closeOnEscape, closeAll]);

  return {
    openModals: Array.from(openModals),
    open,
    close,
    closeAll,
    toggle,
    isOpen,
    hasOpenModals: openModals.size > 0,
  };
};

/**
 * Hook for modal with confirmation dialog
 *
 * @param options - Modal options plus confirmation settings
 * @returns Modal controls with confirmation functionality
 */
export const useConfirmModal = (
  options: UseModalOptions & {
    confirmTitle?: string;
    confirmMessage?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  } = {},
) => {
  const {
    confirmTitle = "Confirm Action",
    confirmMessage = "Are you sure you want to continue?",
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    ...modalOptions
  } = options;

  const modal = useModal(modalOptions);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const confirm = useCallback(
    (action: () => void) => {
      setPendingAction(() => action);
      modal.open();
    },
    [modal],
  );

  const handleConfirm = useCallback(() => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    modal.close();
  }, [pendingAction, modal]);

  const handleCancel = useCallback(() => {
    setPendingAction(null);
    modal.close();
  }, [modal]);

  return {
    ...modal,
    confirm,
    handleConfirm,
    handleCancel,
    confirmTitle,
    confirmMessage,
    confirmButtonText,
    cancelButtonText,
    hasPendingAction: !!pendingAction,
  };
};
