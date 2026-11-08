import styles from '../../styleModules/EventsList.module.css';
import { useQuery } from '@apollo/client'
import { GET_EVENTS } from '../../apis';
import EventTile from './EventTile';

const EventsList = ({ user }) => {
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

    return (
        <>
            {isPending && <h1 className={styles.loading}>Loading...</h1>}
            {data?.events && <div className={styles.allEventsHere}>
                {!data?.events.length && <h1 className={styles.noneShown}>NOTHING TO SHOW HERE</h1>}
                {data?.events.map((event) => (
                    <EventTile key={event.id} event={event} />
                ))}
                <div className={styles.eventTileExtra}></div>
            </div>}
        </>
    );
}

export default EventsList;
