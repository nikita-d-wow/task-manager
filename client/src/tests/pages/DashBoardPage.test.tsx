import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "../../pages/DashboardPage";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { store } from "../../app/store";
import axiosInstance from "../../lib/axiosInstance";

vi.mock("../../lib/axiosInstance", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("DashboardPage", () => {
  const mockedAxios = axiosInstance as unknown as {
    get: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Loading dashboard/i)).toBeInTheDocument();
  });

  it("renders stats and recent tasks after fetch", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        tasks: [
          {
            _id: "1",
            title: "Task A",
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Task A/i)).toBeInTheDocument();
      expect(screen.getByText(/Recent Tasks/i)).toBeInTheDocument();
    });
  });
});
