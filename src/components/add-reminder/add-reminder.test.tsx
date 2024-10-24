import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { AddReminder } from "./add-reminder";
import { createReminder } from "../../services/reminder";
import moment from "moment";

// Mock the createReminder service
jest.mock("../../services/reminder");

const mockCreateReminder = createReminder as jest.MockedFunction<typeof createReminder>;

describe("AddReminder Component", () => {
    const mockOnClose = jest.fn();
    const mockOnSave = jest.fn();
    const userId = "test-user-id";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render the modal when open", () => {
        render(<AddReminder open={true} onClose={mockOnClose} userId={userId} onSave={mockOnSave} />);
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/pick a date/i)).toBeInTheDocument();
    });

    it("should call onClose when the modal is closed", () => {
        render(<AddReminder open={true} onClose={mockOnClose} userId={userId} onSave={mockOnSave} />);
        const backdrop = document.querySelector('.MuiBackdrop-root')!;
        fireEvent.click(backdrop);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it("should update input fields on user input", () => {
        render(<AddReminder open={true} onClose={mockOnClose} userId={userId} onSave={mockOnSave} />);
        const descriptionInput = screen.getByLabelText(/description/i);
        fireEvent.change(descriptionInput, { target: { value: "Test Reminder" } });
        expect(descriptionInput).toHaveValue("Test Reminder");
    });

    it("should submit form and call createReminder", async () => {
        mockCreateReminder.mockResolvedValue({
            reminderText: "Test Reminder",
            reminderDateTime: moment(),
            userId: userId,
        });

        render(<AddReminder open={true} onClose={mockOnClose} userId={userId} onSave={mockOnSave} />);

        const descriptionInput = screen.getByLabelText(/description/i);
        fireEvent.change(descriptionInput, { target: { value: "Test Reminder" } });

        const submitButton = screen.getByRole("button", { name: /submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockCreateReminder).toHaveBeenCalledWith({
                userId: userId,
                reminderText: "Test Reminder",
                reminderDateTime: expect.any(moment),
            });
            expect(mockOnSave).toHaveBeenCalled();
        });
    });

    it("should show error message if createReminder fails", async () => {
        mockCreateReminder.mockRejectedValue(new Error("Failed to create reminder"));

        render(<AddReminder open={true} onClose={mockOnClose} userId={userId} onSave={mockOnSave} />);

        const descriptionInput = screen.getByLabelText(/description/i);
        fireEvent.change(descriptionInput, { target: { value: "Test Reminder" } });

        const submitButton = screen.getByRole("button", { name: /submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockCreateReminder).toHaveBeenCalled();
            expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
        });
    });
});