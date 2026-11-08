import cal from '../../assets/cal.png';
import styles from '../../styleModules/EventsList.module.css';
import moment from 'moment'
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client'
import { GET_EVENTS } from '../../apis';

const EventsList = ({ user }) => {
    const navigate = useNavigate();
    const { data, loading: isPending, error } = useQuery(GET_EVENTS, {
        variables: {
            orgId: user?.organization?.id
        },
        fetchPolicy: "no-cache"
    })

    if (error) {
        return <>
            <div className={styles.allEventsHere}>
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
            {data?.events && <div className={styles.allEventsHere}>
                {!data?.events.length && <h1 className={styles.noneShown}>NOTHING TO SHOW HERE</h1>}
                {data?.events.map((event) => (
                    <div className={styles.eventTile} key={event.id} onClick={() => handleClick(event.id)}>
                        <div className={styles.calTile}>
                            <img src={cal} />
                            <h3>{event.name_text}</h3>
                        </div>
                        <p>Start: {moment(event.start_utc).format('DD-MM-YYYY, LT')}</p>
                        <p className={styles.endDateEventTile}>End: {moment(event.end_utc).format('DD-MM-YYYY, LT')}</p>
                    </div>
                ))}
                <div className={styles.eventTileExtra}></div>
            </div>}
        </>
    );
}

export default EventsList;