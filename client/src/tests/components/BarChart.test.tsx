import { render, screen } from "@testing-library/react";
import BarChart from "../../components/Charts/BarChart";
import { it, describe, expect} from "vitest"
const mockData = [
  { name: "Mon", Completed: 5, "In Progress": 2 },
  { name: "Tue", Completed: 3, "In Progress": 4 },
];

describe("BarChart", () => {
  it("renders chart title", () => {
    render(<BarChart data={mockData} title="Weekly Progress" colors={["#A8DADC", "#F4A261"]} />);
    expect(screen.getByText(/weekly progress/i)).toBeInTheDocument();
  });
});
