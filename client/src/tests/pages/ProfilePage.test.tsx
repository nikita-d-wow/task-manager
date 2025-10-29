import { render, screen } from "@testing-library/react";
import ProfilePage from "../../pages/ProfilePage";
import { vi , describe, expect, it} from "vitest";
// import axiosInstance from "../../lib/axiosInstance";

vi.mock("../../lib/axiosInstance", () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { username: "Nikyy", email: "nikyy@example.com" } }),
  },
}));

describe("ProfilePage", () => {
  it("renders user data", async () => {
    render(<ProfilePage />);
    expect(await screen.findByText(/demo/i)).toBeInTheDocument();
    expect(await screen.findByText(/example\.com/i)).toBeInTheDocument();
  });
});
