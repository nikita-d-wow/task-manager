import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CalendarPage from "../../pages/CalendarPage";
import { vi, describe, it, beforeEach, expect } from "vitest";
import axiosInstance from "../../lib/axiosInstance";

vi.mock("../../lib/axiosInstance", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("CalendarPage", () => {
  const mockedAxios = axiosInstance as unknown as {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.get.mockResolvedValue({ data: [] });
    mockedAxios.post.mockResolvedValue({ data: {} });
  });

  it("renders calendar and days", async () => {
    render(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText(/No tasks for this day/i)).toBeInTheDocument();
    });
  });

  it("adds a new task when enter key is pressed", async () => {
    render(<CalendarPage />);

    const input = screen.getByPlaceholderText(/Add new task/i);
    fireEvent.change(input, { target: { value: "New Task" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });
});
