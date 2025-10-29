import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { describe, it, expect } from "vitest";

describe("Navbar Component", () => {
  it("renders all navigation links", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>
    );

    const links = ["Dashboard", "Tasks", "Calendar", "Reports", "Profile", "Sign Up"];
    links.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("highlights the active route", () => {
    render(
      <MemoryRouter initialEntries={["/tasks"]}>
        <Navbar />
      </MemoryRouter>
    );

    const activeLink = screen.getByText("Tasks");
    expect(activeLink.className).toContain("bg-blue-500");
    expect(activeLink.className).toContain("text-white");
  });

  it("toggles mobile menu when hamburger is clicked", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /open main menu/i });

    // Initially closed
    expect(screen.queryByText("Dashboard")).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");

    // Open menu
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    // Close menu
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("closes mobile menu after clicking a link", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /open main menu/i });

    fireEvent.click(button); // open
    const link = screen.getByText("Tasks");
    fireEvent.click(link); // close
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
