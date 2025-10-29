import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignupPage from "../../pages/SignupPage";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import { it, describe, expect } from "vitest";

describe("SignupPage", () => {
  it("renders input fields and button", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignupPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign Up/i })).toBeInTheDocument();
  });

  it("updates input values correctly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignupPage />
        </MemoryRouter>
      </Provider>
    );

    const usernameInput = screen.getByPlaceholderText(/Username/i);
    fireEvent.change(usernameInput, { target: { value: "nikyy" } });
    expect(usernameInput).toHaveValue("nikyy");
  });
});
