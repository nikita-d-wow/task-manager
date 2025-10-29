import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { store } from "../../app/store";
import LoginPage from "../../pages/LoginPage";
import { vi, it, describe, expect } from "vitest";
import * as authSlice from "../../features/auth/slice/authSlice";

vi.mock("../features/auth/slice/authSlice", async (importOriginal) => {
  const actual = await importOriginal();
  return { actual, loginUser: vi.fn(() => () => Promise.resolve()) };
});

describe("LoginPage", () => {
  it("renders form fields", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });

  it("calls loginUser on submit", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "test@email.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: "password" } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(authSlice.loginUser).toHaveBeenCalled();
    });
  });
});
