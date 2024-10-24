import { Box, Modal, TextField } from "@mui/material"
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";
import moment from "moment";
import { createReminder } from "../../services/reminder";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LoadingButton } from "@mui/lab";
import { Reminder } from "../../types/reminder";

interface AddReminderProps {
    open: boolean
    onClose: () => void
    userId: string;
    onSave: (reminder: Reminder) => void;
}
export const AddReminder = ({ open, onClose, userId, onSave } : AddReminderProps) => {
    const [description, setDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState(moment());
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<undefined | string>()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true)
        try {
            const result = await createReminder({ userId, reminderText: description, reminderDateTime: selectedDate.utc()})
            setDescription("")
            setSelectedDate(moment())
            onSave(result)
        } catch (err) {
            setError("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
        
    };
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Modal open={open} onClose={(e) => onClose()}>
                <Box sx={style}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}>
                        <TextField
                            label="Description"
                            variant="outlined"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        <DateTimePicker
                            label="Pick a Date"
                            value={selectedDate}
                            onChange={(newDate) => setSelectedDate(newDate || moment())}
                        />
                        <LoadingButton type="submit" variant="contained" color="primary" loading={loading}>
                            Submit
                        </LoadingButton>
                        {error && <div className='row'>{error && <p className="error-text">{error}</p>}</div>}
                    </Box>
                </Box>
            </Modal>
        </LocalizationProvider>
    )
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};