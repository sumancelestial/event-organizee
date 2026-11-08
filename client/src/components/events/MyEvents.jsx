import styles from '../../styleModules/EventsList.module.css';
import { useQuery } from '@apollo/client'
import { MY_REGISTRATIONS } from '../../apis';
import EventTile from './EventTile';

const MyEvents = () => {
    const { data, loading: isPending, error } = useQuery(MY_REGISTRATIONS, {
        fetchPolicy: "no-cache"
    })

    if (error) {
        return <>
            <div className={styles.allEventsHere}>
                <h1 className={styles.noneShown}>{error.message}</h1>
            </div>
        </>
    }

    return (
        <>
            {isPending && <h1 className={styles.loading}>Loading...</h1>}
            {data?.myRegistrations && <div className={styles.allEventsHere}>
                {!data?.myRegistrations.length && <h1 className={styles.noneShown}>YOU HAVE NOT REGISTERED FOR ANY EVENT YET</h1>}
                {data?.myRegistrations.map((event) => (
                    <EventTile key={event.id} event={event} />
                ))}
                <div className={styles.eventTileExtra}></div>
            </div>}
        </>
    );
}

export default MyEvents;
