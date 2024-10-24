import axios from "axios";
import { Reminder } from "../types/reminder";

//Ideally would inject the hostname or env 
const reminderHostName = "http://localhost:3000/reminders"

export const getReminders = async (userId:string) : Promise<Reminder[]> => {
    return await axios.get(`${reminderHostName}/${userId}`).then(res => res.data.data)
}

export const createReminder = async (reminder: Reminder) : Promise<Reminder> => {
    return await axios.post(`${reminderHostName}`, reminder).then(res => res.data)
}