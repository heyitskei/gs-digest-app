import './App.css';
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [rawPayload, setRawPayload] = useState(null);
    const [sessionNotes, setSessionNotes] = useState({});

    useEffect(() => {
        axios.get('https://growth.vehikl.com/growth_sessions/week?date=2024-02-26')
            .then(response => {
                setRawPayload(response.data);

                const userNotes = localStorage.getItem('userNotes');
                if (userNotes)
                {
                    setSessionNotes(JSON.parse(userNotes));
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    useEffect(() => {
        localStorage.setItem('userNotes', JSON.stringify(sessionNotes));
    }, [sessionNotes]);

    const parseData = (data, targetDate) => {
        if (!data || !targetDate || !data[targetDate]) return null;

        const sessions = data[targetDate];

        return sessions.map(session => ({
            title: session.title,
            date: session.date,
            note: sessionNotes[session.title] || ''
        }));
    };

    const handleNoteChange = (title, note) => {
        setSessionNotes(prevNotes => ({
            ...prevNotes,
            [title]: note
        }));
    };

    return (
        <div className="App">
            <header className="App-header">
                {rawPayload && Object.keys(rawPayload).map(date => {
                    const sessions = parseData(rawPayload, date);
                    return (
                        <div key={date}>
                            <h3>Date: {date}</h3>
                            {sessions.length > 0 ? (
                                sessions.map(session => (
                                    <div key={session.title}>
                                        <p>Title: {session.title}</p>
                                        <textarea
                                            value={session.note}
                                            onChange={e => handleNoteChange(session.title, e.target.value)}
                                            placeholder="Add note..."
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>No sessions available for this date</p>
                            )}
                        </div>
                    );
                })}
            </header>
        </div>
    );
}

export default App;
