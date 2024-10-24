import "./reminder-list-item.css"
import moment from 'moment';
import { Reminder } from '../../types/reminder';

interface ReminderListItemProps {
    title: string;
    reminders:  Reminder[]
}

export const ReminderListItem = ({ title, reminders} : ReminderListItemProps) => {
    if (!reminders.length) {
        return <div className="row"><p>No Reminders Found!</p></div>
    }
    return (
        <div>
            <>
                <div className="row"><p className="header">{title}</p></div>
                {
                    reminders.map((reminder : Reminder) => {
                        return (
                            <div key={reminder._id} className="row">
                                <p className="reminder-text">
                                {reminder.reminderText}
                                </p>
                                <p className="reminder-text">
                                {moment(reminder.reminderDateTime).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                                </p>
                            </div>
                        )
                    })
                }
            </>
        </div>
    )
}