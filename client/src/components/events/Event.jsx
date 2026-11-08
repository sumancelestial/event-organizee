import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../styleModules/Event.module.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import DeleteModal from './DeleteModal';
import { GET_EVENT_BY_ID, DELETE_EVENT } from '../../apis';
import { useMutation, useQuery } from '@apollo/client';

const Event = () => {
    const { id } = useParams();
    const [loadingMsg, setLoadingMsg] = useState('Loading...');
    const nav = useNavigate();
    const dialog = useRef();
    const { data, loading: isPending, error } = useQuery(GET_EVENT_BY_ID, {
        variables: {
            eventId: id
        },
        fetchPolicy: "no-cache"
    })
    const [deleteEvent] = useMutation(DELETE_EVENT)

    useEffect(() => {
        if (isPending) {
            setLoadingMsg('Loading...')
            return
        }
        setLoadingMsg(null)
    }, [isPending])

    if (error) {
        return <h1 className={styles.loading}>{error.message}</h1>
    }

    const handleUpdate = () => {
        nav(`/event/${id}/edit`);
    }

    const handleDialog = () => {
        dialog.current.open();
    }

    const handleDelete = async () => {
        try {
            setLoadingMsg('Deleting...');
            const deleteStatus = await deleteEvent({
                variables: {
                    eventId: id
                }
            });
            if (deleteStatus?.data) {
                nav('/events');
            }
        }
        catch (err) {
            setLoadingMsg(err.message)
        }
    }

    return (
        <>
            {loadingMsg && <h1 className={styles.loading}>{loadingMsg}</h1>}
            {(!loadingMsg && data?.event) && <div className={styles.eventSpecificDiv}>
                <h2>Event Details</h2>
                <ul>
                    <li>
                        <div className={styles.headingTitle}>
                            <h5>Event Name</h5>
                        </div>
                        <div>
                            <p>{data?.event.name_text}</p>
                        </div>
                    </li>
                    <li>
                        <div className={styles.headingTitle}>
                            <h5>Event Detail</h5>
                        </div>
                        <div>
                            <p>{data?.event.dsc_text}</p>
                        </div>
                    </li>
                    <li>
                        <div className={styles.headingTitle}>
                            <h5>Start Date</h5>
                        </div>
                        <div>
                            <p>{moment(data?.event.start_utc).format('DD-MM-YYYY, LT')}</p>
                        </div>
                    </li>
                    <li>
                        <div className={styles.headingTitle}>
                            <h5>End Date</h5>
                        </div>
                        <div>
                            <p>{moment(data?.event.end_utc).format('DD-MM-YYYY, LT')}</p>
                        </div>
                    </li>
                    <li>
                        <div className={styles.headingTitle}>
                            <h5>Capacity</h5>
                        </div>
                        <div>
                            <p>{data?.event.capacity}</p>
                        </div>
                    </li>
                </ul>
                <div className={styles.eventButtons}>
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={handleDialog}>Delete</button>
                    <DeleteModal ref={dialog} eventName={data?.event.name_text} deleteNow={handleDelete} />
                </div>
            </div>}
        </>
    );
}

export default Event;