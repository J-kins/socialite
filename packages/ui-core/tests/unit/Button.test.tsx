import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Button } from "../../src/components/atoms/Button";

describe("Button Component", () => {
  // Basic rendering tests
  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole("button", { name: "Click me" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("btn", "btn-md", "btn-primary");
    });

    it("renders with custom className", () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("renders children correctly", () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>,
      );
      expect(screen.getByText("Icon")).toBeInTheDocument();
      expect(screen.getByText("Text")).toBeInTheDocument();
    });
  });

  // Variant tests
  describe("Variants", () => {
    it("applies primary variant styles", () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("btn-primary");
    });

    it("applies secondary variant styles", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("btn-secondary");
    });

    it("applies outline variant styles", () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("btn-outline");
    });

    it("applies ghost variant styles", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("btn-ghost");
    });

    it("applies danger variant styles", () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("btn-danger");
    });
  });

  // Size tests
  describe("Sizes", () => {
    it("applies small size styles", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("btn-sm");
    });

    it("applies medium size styles", () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("btn-md");
    });

    it("applies large size styles", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("btn-lg");
    });

    it("applies extra large size styles", () => {
      render(<Button size="xl">Extra Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("btn-xl");
    });
  });

  // State tests
  describe("States", () => {
    it("handles disabled state", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("btn-disabled");
    });

    it("handles loading state", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("btn-loading");
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    it("shows loading text when provided", () => {
      render(
        <Button loading loadingText="Processing...">
          Submit
        </Button>,
      );
      expect(screen.getByText("Processing...")).toBeInTheDocument();
      expect(screen.queryByText("Submit")).not.toBeInTheDocument();
    });
  });

  // Icon tests
  describe("Icons", () => {
    it("renders left icon", () => {
      render(<Button leftIcon="heart">Like</Button>);
      const icon = screen.getByTestId("icon-heart");
      expect(icon).toBeInTheDocument();
    });

    it("renders right icon", () => {
      render(<Button rightIcon="arrow-forward">Next</Button>);
      const icon = screen.getByTestId("icon-arrow-forward");
      expect(icon).toBeInTheDocument();
    });

    it("renders both left and right icons", () => {
      render(
        <Button leftIcon="heart" rightIcon="arrow-forward">
          Button
        </Button>,
      );
      expect(screen.getByTestId("icon-heart")).toBeInTheDocument();
      expect(screen.getByTestId("icon-arrow-forward")).toBeInTheDocument();
    });
  });

  // Interactive tests
  describe("Interactions", () => {
    it("calls onClick handler when clicked", async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button");
      await userEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>,
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("does not call onClick when loading", async () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} loading>
          Click me
        </Button>,
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("handles keyboard interactions", async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button");
      button.focus();
      await userEvent.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // Accessibility tests
  describe("Accessibility", () => {
    it("has correct role", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("supports custom aria-label", () => {
      render(<Button aria-label="Custom label">Button</Button>);
      const button = screen.getByRole("button", { name: "Custom label" });
      expect(button).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <div>
          <Button aria-describedby="description">Button</Button>
          <div id="description">Button description</div>
        </div>,
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-describedby", "description");
    });

    it("is focusable when not disabled", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });

    it("is not focusable when disabled", () => {
      render(<Button disabled>Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("tabindex", "-1");
    });

    it("announces loading state to screen readers", () => {
      render(<Button loading>Submit</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-busy", "true");
    });
  });

  // Form integration tests
  describe("Form Integration", () => {
    it("submits form when type is submit", async () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit</Button>
        </form>,
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it("resets form when type is reset", async () => {
      render(
        <form>
          <input defaultValue="test" />
          <Button type="reset">Reset</Button>
        </form>,
      );

      const input = screen.getByRole("textbox");
      const button = screen.getByRole("button");

      await userEvent.clear(input);
      await userEvent.type(input, "changed");
      expect(input).toHaveValue("changed");

      await userEvent.click(button);
      expect(input).toHaveValue("test");
    });
  });

  // Edge cases
  describe("Edge Cases", () => {
    it("handles empty children", () => {
      render(<Button>{""}</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it("handles null children", () => {
      render(<Button>{null}</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("handles multiple click handlers", async () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      render(
        <Button onClick={handler1} onMouseDown={handler2}>
          Click me
        </Button>,
      );

      const button = screen.getByRole("button");
      await userEvent.click(button);

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });
  });

  // Performance tests
  describe("Performance", () => {
    it("does not re-render unnecessarily", () => {
      const renderSpy = jest.fn();
      const TestButton = React.memo(({ children, ...props }: any) => {
        renderSpy();
        return <Button {...props}>{children}</Button>;
      });

      const { rerender } = render(<TestButton>Button</TestButton>);
      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render with same props
      rerender(<TestButton>Button</TestButton>);
      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render with different props
      rerender(<TestButton disabled>Button</TestButton>);
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });
});
