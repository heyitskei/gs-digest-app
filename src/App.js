import './App.css';
import { useEffect, useState } from "react";
import axios from "axios";

function App() {

    const [rawPayload, setRawPayload] = useState({});
    const [sessionDates, setSessionDates] = useState([]);
    const [sessionInfo, setSessionInfo] = useState([]);
    const [userNotes, setUserNotes] = useState({});

    useEffect(() => {
        axios.get('https://growth.vehikl.com/growth_sessions/week?date=2024-02-26')
            .then(response => {
                setRawPayload(response.data);
                setSessionDates(Object.keys(response.data));
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    useEffect(() => {
        if (rawPayload && sessionDates) {
            const nonEmptyDates = sessionDates.filter(date => rawPayload[date].length !== 0);
            const info = nonEmptyDates.map(date => rawPayload[date]);
            setSessionInfo(info);
        }
    }, [rawPayload, sessionDates]);

    function displaySessionInfo(sessions) {
        return sessions.map(sessionArray => {
            const sessionId = sessionArray[0].id;
            const sessionNotes = userNotes[sessionId] || '';
            return (
                <div key={sessionId} className="Session">
                    <h2>Title: {sessionArray[0].title}</h2>
                    <p>Description: {sessionArray[0].topic}</p>
                    <textarea
                        onChange={(event) => handleUserNotes(event, sessionId)}
                        value={sessionNotes}
                        placeholder="Add notes..."
                    />
                </div>
            );
        });
    }

    const handleUserNotes = (event, sessionId) => {
        const newNotes = { ...userNotes, [sessionId]: event.target.value };
        setUserNotes(newNotes);
    };

    console.log(userNotes);

    return (
        <div className="App">
            <h1>Growth Sessions</h1>
            <div className="SessionList">
                {displaySessionInfo(sessionInfo)}
            </div>
        </div>
    );
}

export default App;
