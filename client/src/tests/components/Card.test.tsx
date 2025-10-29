import { render, screen } from "@testing-library/react";
import Card from "../../components/Card/Card";
import { describe, it, expect } from "vitest";

describe("Card Component", () => {
  it("renders children correctly", () => {
    render(
      <Card>
        <p>Test content inside card</p>
      </Card>
    );

    // Should render the child text
    expect(screen.getByText(/test content inside card/i)).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const { container } = render(
      <Card className="border border-red-500">
        <p>Styled Card</p>
      </Card>
    );

    const cardDiv = container.firstChild as HTMLElement;
    // ✅ Check that both default + custom styles are applied
    expect(cardDiv.className).toContain("border-red-500");
    expect(cardDiv.className).toContain("bg-white");
  });
});
