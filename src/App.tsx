import './App.css';
import React, { useCallback, useState } from 'react';
import {  TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab'
import { getReminders } from './services/reminder';
import { FilteredReminder, Reminder } from './types/reminder';
import moment from 'moment';
import { ReminderListItem } from './components/reminder-list-item/reminder-list-item';
import CircleButton from './atoms/circle-button';
import { AddReminder } from './components/add-reminder/add-reminder';

function App() {
  const [ userID, setUserID] = useState<string | undefined>()
  const [ error, setError ] = useState<string | undefined>()
  const [ reminders, setReminders ] = useState<FilteredReminder | undefined>()
  const [ openAddReminder, setOpenAddReminder ] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchReminders = useCallback(async () => {
    try {
      setLoading(true)
      setReminders(undefined)
      setError(undefined)
      if (!userID) {
        setError("User ID is required!")
        return
      }
      
      const reminders = await getReminders(userID)
      
      const pastReminders : Reminder[] = []
      const futureReminders : Reminder[] = []
      reminders.forEach((reminder) => {
        if (moment().isBefore(moment(reminder.reminderDateTime))) {
          futureReminders.push(reminder)
        } else {
          pastReminders.push(reminder)
        }
      })
      setReminders({ pastReminders, futureReminders})
      alert(`Reminders:\n${pastReminders.map((reminder: Reminder) => `${reminder.reminderText}: ${moment(reminder.reminderDateTime).format("dddd, MMMM Do YYYY, h:mm:ss a")}`).join('\n')}`);
    } catch(err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }, [userID])

  const handleAddReminder = (reminder:Reminder) => {
    const _reminder = reminders
      ? { ...reminders }
      : { futureReminders: [], pastReminders: [] };

    if (moment().isBefore(moment(reminder.reminderDateTime))) {
      _reminder.futureReminders.push(reminder);
      _reminder.futureReminders.sort((a, b) => {
        if (moment(a.reminderDateTime).isAfter(moment(b.reminderDateTime))) return -1;
        if (moment(a.reminderDateTime).isBefore(moment(b.reminderDateTime))) return 1;
        return 0;
      });
    } 
    else {
      _reminder.pastReminders.push(reminder);
      _reminder.pastReminders.sort((a, b) => {
        if (moment(a.reminderDateTime).isAfter(moment(b.reminderDateTime))) return -1;
        if (moment(a.reminderDateTime).isBefore(moment(b.reminderDateTime))) return 1;
        return 0;
      });
    }
    setReminders(_reminder);
    setOpenAddReminder(false);
  };

  return (
    <>
      <div className="App">
        <div className="container">
          <div className='row'>
            <TextField id="standard-basic" label="User ID" variant="standard" onChange={(e) => setUserID(e.currentTarget.value)} onFocus={() => setError(undefined)}/>
            <LoadingButton variant="contained" onClick={fetchReminders} loading={loading}>Search</LoadingButton>
          </div>
          <div className='row'>{error && <p className="error-text">{error}</p>}</div>
          
          {
            reminders !== undefined && (
              <>
                <div className="button-row"><CircleButton onClick={() => setOpenAddReminder(true)}/></div>
                <ReminderListItem title='Reminders:' reminders={reminders.futureReminders}/>
                <ReminderListItem title='Past Reminders:' reminders={reminders.pastReminders}/>
              </>
            )
          }
        </div>
      </div>
      {userID && <AddReminder onClose={() => setOpenAddReminder(false)} open={openAddReminder} userId={userID} onSave={handleAddReminder}/>}
    </>
  );
}

export default App;
