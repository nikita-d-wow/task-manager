import { render, screen } from "@testing-library/react";
import LineChart from "../../components/Charts/LineChart";
import { it, describe, expect} from "vitest"

describe("LineChart", () => {
  it("renders title", () => {
    render(<LineChart data={[]} title="Monthly Progress" colors={["#A8DADC", "#F4A261"]} />);
    expect(screen.getByText(/monthly progress/i)).toBeInTheDocument();
  });
});
