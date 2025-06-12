import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBox } from '../../src/components/molecules/SearchBox';

// Mock props
const defaultProps = {
  placeholder: 'Search...',
  onSearch: jest.fn(),
  onChange: jest.fn(),
};

describe('SearchBox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(<SearchBox {...defaultProps} />);

      const input = screen.getByPlaceholderText('Search...');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders with custom placeholder', () => {
      render(<SearchBox {...defaultProps} placeholder="Custom search..." />);

      expect(screen.getByPlaceholderText('Custom search...')).toBeInTheDocument();
    });

    it('renders with search icon by default', () => {
      render(<SearchBox {...defaultProps} />);

      const searchIcon = screen.getByRole('button', { name: /search/i });
      expect(searchIcon).toBeInTheDocument();
    });

    it('renders without search icon when showIcon is false', () => {
      render(<SearchBox {...defaultProps} showIcon={false} />);

      const searchIcon = screen.queryByRole('button', { name: /search/i });
      expect(searchIcon).not.toBeInTheDocument();
    });

    it('renders clear button when clearable and has value', () => {
      render(<SearchBox {...defaultProps} clearable value="test" />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      expect(clearButton).toBeInTheDocument();
    });

    it('does not render clear button when no value', () => {
      render(<SearchBox {...defaultProps} clearable />);

      const clearButton = screen.queryByRole('button', { name: /clear/i });
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('calls onChange when typing', async () => {
      const user = userEvent.setup();
      render(<SearchBox {...defaultProps} />);

      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, 'test query');

      expect(defaultProps.onChange).toHaveBeenCalledWith('test query');
    });

    it('calls onSearch when Enter key is pressed', async () => {
      const user = userEvent.setup();
      render(<SearchBox {...defaultProps} />);

      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, 'test query');
      await user.keyboard('{Enter}');

      expect(defaultProps.onSearch).toHaveBeenCalledWith('test query');
    });

    it('calls onSearch when search button is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchBox {...defaultProps} value="test query" />);

      const searchButton = screen.getByRole('button', { name: /search/i });
      await user.click(searchButton);

      expect(defaultProps.onSearch).toHaveBeenCalledWith('test query');
    });

    it('clears value when clear button is clicked', async () => {
      const user = userEvent.setup();
      const onClear = jest.fn();
      render(<SearchBox {...defaultProps} clearable value="test" onClear={onClear} />);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(onClear).toHaveBeenCalled();
    });

    it('focuses input when container is clicked', async () => {
      const user = userEvent.setup();
      render(<SearchBox {...defaultProps} />);

      const container = screen.getByRole('searchbox').parentElement;
      const input = screen.getByPlaceholderText('Search...');

      await user.click(container!);

      expect(input).toHaveFocus();
    });
  });

  describe('Debounced Search', () => {
    it('debounces search calls when debounceMs is provided', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<SearchBox {...defaultProps} debounceMs={300} />);

      const input = screen.getByPlaceholderText('Search...');

      // Type multiple characters quickly
      await user.type(input, 'test');

      // onSearch should not be called yet
      expect(defaultProps.onSearch).not.toHaveBeenCalled();

      // Advance timers to trigger debounced call
      jest.advanceTimersByTime(300);

      expect(defaultProps.onSearch).toHaveBeenCalledWith('test');

      jest.useRealTimers();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading', () => {
      render(<SearchBox {...defaultProps} loading />);

      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('disables input when loading', () => {
      render(<SearchBox {...defaultProps} loading />);

      const input = screen.getByPlaceholderText('Search...');
      expect(input).toBeDisabled();
    });
  });

  describe('Disabled State', () => {
    it('disables input when disabled', () => {
      render(<SearchBox {...defaultProps} disabled />);

      const input = screen.getByPlaceholderText('Search...');
      expect(input).toBeDisabled();
    });

    it('disables search button when disabled', () => {
      render(<SearchBox {...defaultProps} disabled />);

      const searchButton = screen.getByRole('button', { name: /search/i });
      expect(searchButton).toBeDisabled();
    });
  });

  describe('Autocomplete', () => {
    it('shows suggestions when autocomplete is enabled', async () => {
      const suggestions = ['suggestion 1', 'suggestion 2', 'suggestion 3'];
      render(<SearchBox {...defaultProps} autocomplete suggestions={suggestions} />);

      const input = screen.getByPlaceholderText('Search...');
      await userEvent.type(input, 'sugg');

      await waitFor(() => {
        suggestions.forEach((suggestion) => {
          expect(screen.getByText(suggestion)).toBeInTheDocument();
        });
      });
    });

    it('selects suggestion when clicked', async () => {
      const suggestions = ['suggestion 1', 'suggestion 2'];
      const onSelect = jest.fn();
      render(
        <SearchBox
          {...defaultProps}
          autocomplete
          suggestions={suggestions}
          onSuggestionSelect={onSelect}
        />
      );

      const input = screen.getByPlaceholderText('Search...');
      await userEvent.type(input, 'sugg');

      await waitFor(() => {
        const firstSuggestion = screen.getByText('suggestion 1');
        return userEvent.click(firstSuggestion);
      });

      expect(onSelect).toHaveBeenCalledWith('suggestion 1');
    });
  });

  describe('Size Variants', () => {
    it('applies small size class', () => {
      render(<SearchBox {...defaultProps} size="sm" />);

      const container = screen.getByRole('searchbox').parentElement;
      expect(container).toHaveClass('search-box--sm');
    });

    it('applies large size class', () => {
      render(<SearchBox {...defaultProps} size="lg" />);

      const container = screen.getByRole('searchbox').parentElement;
      expect(container).toHaveClass('search-box--lg');
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates suggestions with arrow keys', async () => {
      const suggestions = ['suggestion 1', 'suggestion 2'];
      render(<SearchBox {...defaultProps} autocomplete suggestions={suggestions} />);

      const input = screen.getByPlaceholderText('Search...');
      await userEvent.type(input, 'sugg');

      // Press arrow down to select first suggestion
      await userEvent.keyboard('{ArrowDown}');

      const firstSuggestion = screen.getByText('suggestion 1');
      expect(firstSuggestion).toHaveClass('search-box__suggestion--highlighted');

      // Press arrow down to select second suggestion
      await userEvent.keyboard('{ArrowDown}');

      const secondSuggestion = screen.getByText('suggestion 2');
      expect(secondSuggestion).toHaveClass('search-box__suggestion--highlighted');
    });

    it('selects highlighted suggestion with Enter', async () => {
      const suggestions = ['suggestion 1', 'suggestion 2'];
      const onSelect = jest.fn();
      render(
        <SearchBox
          {...defaultProps}
          autocomplete
          suggestions={suggestions}
          onSuggestionSelect={onSelect}
        />
      );

      const input = screen.getByPlaceholderText('Search...');
      await userEvent.type(input, 'sugg');

      // Navigate to first suggestion and select it
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Enter}');

      expect(onSelect).toHaveBeenCalledWith('suggestion 1');
    });

    it('closes suggestions with Escape', async () => {
      const suggestions = ['suggestion 1', 'suggestion 2'];
      render(<SearchBox {...defaultProps} autocomplete suggestions={suggestions} />);

      const input = screen.getByPlaceholderText('Search...');
      await userEvent.type(input, 'sugg');

      // Verify suggestions are shown
      expect(screen.getByText('suggestion 1')).toBeInTheDocument();

      // Press Escape to close suggestions
      await userEvent.keyboard('{Escape}');

      // Verify suggestions are hidden
      expect(screen.queryByText('suggestion 1')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<SearchBox {...defaultProps} />);

      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('aria-label', 'Search');
    });

    it('has proper ARIA attributes for autocomplete', () => {
      const suggestions = ['suggestion 1'];
      render(<SearchBox {...defaultProps} autocomplete suggestions={suggestions} />);

      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('updates aria-expanded when suggestions are shown', async () => {
      const suggestions = ['suggestion 1'];
      render(<SearchBox {...defaultProps} autocomplete suggestions={suggestions} />);

      const input = screen.getByRole('searchbox');
      await userEvent.type(input, 'sugg');

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<SearchBox {...defaultProps} className="custom-search" />);

      const container = screen.getByRole('searchbox').parentElement;
      expect(container).toHaveClass('custom-search');
    });

    it('applies custom styles', () => {
      const customStyle = { backgroundColor: 'red' };
      render(<SearchBox {...defaultProps} style={customStyle} />);

      const container = screen.getByRole('searchbox').parentElement;
      expect(container).toHaveStyle('background-color: red');
    });
  });
});
