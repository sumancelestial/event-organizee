import cal from '../assets/cal.png';
import styles from '../styleModules/MyEvents.module.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { MY_REGISTRATIONS } from '../apis';

const MyEvents = () => {
    const navigate = useNavigate();
    const { data, loading: isPending, error } = useQuery(MY_REGISTRATIONS, {
        fetchPolicy: "no-cache"
    })

    if (error) {
        return <>
            <div className={styles.myEventsHere}>
                <h1 className={styles.noneShown}>{error.message}</h1>
            </div>
        </>
    }

    const handleClick = (id) => {
        navigate(`/event/${id}`);
    }

    return (
        <>
            {isPending && <h1 className={styles.loading}>Loading...</h1>}
            {data?.myRegistrations && <div className={styles.myEventsHere}>
                {!data?.myRegistrations.length && <h1 className={styles.noneShown}>You have not registered for any event yet</h1>}
                {data?.myRegistrations.map((event) => (
                    <div className={styles.eventTile} key={event.id} onClick={() => handleClick(event.id)}>
                        <div className={styles.calTile}>
                            <img src={cal} />
                            <h3>{event.name_text}</h3>
                        </div>
                        <p>Start: {moment(event.start_utc).format('DD-MM-YYYY, LT')}</p>
                        <p className={styles.endDateEventTile}>End: {moment(event.end_utc).format('DD-MM-YYYY, LT')}</p>
                        <p className={event.isFull ? styles.fullTag : styles.spotsTag}>
                            {event.isFull ? 'Full' : `${event.spotsLeft} spot${event.spotsLeft === 1 ? '' : 's'} left`}
                        </p>
                        {event.isRegistrationClosed && <p className={styles.registeredTag}>Registration closed</p>}
                    </div>
                ))}
                <div className={styles.eventTileExtra}></div>
            </div>}
        </>
    );
}

export default MyEvents;
