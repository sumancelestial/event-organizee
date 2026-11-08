import cal from '../../assets/cal.png';
import styles from '../../styleModules/EventsList.module.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const EventTile = ({ event }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/event/${event.id}`);
    }

    return (
        <div className={styles.eventTile} onClick={handleClick}>
            <div className={styles.calTile}>
                <img src={cal} alt="" />
                <h3>{event.name_text}</h3>
            </div>
            <p>Start: {moment(event.start_utc).format('DD-MM-YYYY, LT')}</p>
            <p className={styles.endDateEventTile}>End: {moment(event.end_utc).format('DD-MM-YYYY, LT')}</p>
            <p className={event.isFull ? styles.fullEventTile : styles.spotsEventTile}>
                {event.isFull ? 'Full' : `${event.spotsLeft} spots left`}
            </p>
            {event.isRegistered && <p className={styles.registeredEventTile}>You are registered</p>}
        </div>
    );
}

export default EventTile;
