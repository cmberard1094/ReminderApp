export interface Reminder {
    _id?:string;
    userId: string;
    reminderText: string;
    reminderDateTime: moment.Moment
}

export interface FilteredReminder {
    futureReminders: Reminder[]
    pastReminders: Reminder[]
}