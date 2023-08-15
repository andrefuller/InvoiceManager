import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DarkModeSwitch from "./DarkModeSwitch";

test("DarkModeSwitch should toggle dark mode on click", async () => {
  render(<DarkModeSwitch />);

  const switchElement: HTMLElement = screen.getByRole("checkbox");

  expect(switchElement).not.toBeChecked();

  await userEvent.click(switchElement);

  expect(switchElement).toBeChecked();

  await userEvent.click(switchElement);

  expect(switchElement).not.toBeChecked();
});
