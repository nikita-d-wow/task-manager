import { render, screen, waitFor } from "@testing-library/react";
import ProgressPage from "../../pages/ProgressPage";
import axiosInstance from "../../lib/axiosInstance";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock axiosInstance
vi.mock("../../lib/axiosInstance", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
  },
}));

// Mock Chart Components
vi.mock("../../components/Charts/BarChart", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div>{title} Chart</div>,
}));

vi.mock("../../components/Charts/LineChart", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div>{title} Chart</div>,
}));

vi.mock("../../components/Charts/ChartWrapper", () => ({
  __esModule: true,
  default: ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <section data-testid={`chart-${title}`}>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}));

// ✅ Extract mocked axios
const mockedAxios = axiosInstance as unknown as {
  get: ReturnType<typeof vi.fn>;
};

describe("ProgressPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    render(<ProgressPage />);
    expect(screen.getByText(/Loading progress data/i)).toBeInTheDocument();
  });

  it("renders error message on fetch failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));
    render(<ProgressPage />);
    await waitFor(() =>
      expect(
        screen.getByText(/Failed to fetch progress data/i)
      ).toBeInTheDocument()
    );
  });

  it("renders overall stats and charts after successful fetch", async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      switch (url) {
        case "/weekly":
          return Promise.resolve({
            data: [
              { day: "Monday", completedTasks: 3, inProgress: 1 },
              { day: "Tuesday", completedTasks: 2, inProgress: 2 },
            ],
          });
        case "/monthly":
          return Promise.resolve({
            data: [
              { month: "January", completedTasks: 10, inProgress: 5 },
              { month: "February", completedTasks: 8, inProgress: 3 },
            ],
          });
        case "/overall":
          return Promise.resolve({
            data: {
              totalTasks: 20,
              completedTasks: 15,
              overallProgress: 75,
            },
          });
        default:
          return Promise.resolve({ data: [] });
      }
    });

    render(<ProgressPage />);

    await waitFor(() =>
      expect(
        screen.queryByText(/Loading progress data/i)
      ).not.toBeInTheDocument()
    );

    expect(screen.getByText(/Total Tasks: 20/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed: 15/i)).toBeInTheDocument();
    expect(screen.getByText(/Overall Progress: 75.0%/i)).toBeInTheDocument();

    expect(screen.getByTestId("chart-Weekly Progress")).toBeInTheDocument();
    expect(screen.getByTestId("chart-Monthly Progress")).toBeInTheDocument();
    expect(screen.getByText("Weekly Progress Chart")).toBeInTheDocument();
    expect(screen.getByText("Monthly Progress Chart")).toBeInTheDocument();
  });
});
