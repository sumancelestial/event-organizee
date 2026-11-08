import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../styleModules/Event.module.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import DeleteModal from './DeleteModal';
import { GET_EVENT_BY_ID, DELETE_EVENT, EVENT_REGISTRATIONS, REGISTER_FOR_EVENT, CANCEL_REGISTRATION } from '../../apis';
import { useMutation, useQuery } from '@apollo/client';

const Event = () => {
    const { id } = useParams();
    const [loadingMsg, setLoadingMsg] = useState('Loading...');
    const [actionError, setActionError] = useState(null);
    const [isActionPending, setIsActionPending] = useState(false);
    const nav = useNavigate();
    const dialog = useRef();
    const { data, loading: isPending, error, refetch } = useQuery(GET_EVENT_BY_ID, {
        variables: {
            eventId: id
        },
        fetchPolicy: "no-cache"
    })
    const { data: registrationsData, loading: registrationsPending, error: registrationsError } = useQuery(EVENT_REGISTRATIONS, {
        variables: {
            eventId: id
        },
        fetchPolicy: "no-cache"
    })
    const [deleteEvent] = useMutation(DELETE_EVENT)
    const [registerForEvent] = useMutation(REGISTER_FOR_EVENT)
    const [cancelRegistration] = useMutation(CANCEL_REGISTRATION)

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

    const runAction = async (action) => {
        setActionError(null);
        setIsActionPending(true);
        try {
            const status = await action({
                variables: {
                    eventId: id
                }
            });
            if (status?.error || !status?.data) {
                setActionError(status?.error?.message || 'Something went wrong.. Please try again!');
                return;
            }
            await refetch();
        }
        catch (err) {
            setActionError(err?.message || 'Something went wrong.. Please try again!');
        }
        finally {
            setIsActionPending(false);
        }
    }

    const handleRegister = () => runAction(registerForEvent);
    const handleCancel = () => runAction(cancelRegistration);

    const spotsMessage = (event) => {
        if (event.isFull) {
            return 'Full';
        }
        return `${event.spotsLeft} spots left`;
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
                    <li>
                        <div className={styles.headingTitle}>
                            <h5>Spots Left</h5>
                        </div>
                        <div>
                            <p>{spotsMessage(data?.event)}</p>
                        </div>
                    </li>
                </ul>
                <div className={styles.registrationBox}>
                    <h5>Registration</h5>
                    {data?.event.isRegistrationClosed && <p>Registration is closed. This event has already ended.</p>}
                    {(!data?.event.isRegistrationClosed && data?.event.isRegistered) && <>
                        <p className={styles.registeredMsg}>You are registered for this event.</p>
                        <button onClick={handleCancel} disabled={isActionPending}>
                            {isActionPending ? 'Cancelling...' : 'Cancel Registration'}
                        </button>
                    </>}
                    {(!data?.event.isRegistrationClosed && !data?.event.isRegistered) && <>
                        <p>{spotsMessage(data?.event)}</p>
                        <button onClick={handleRegister} disabled={isActionPending || data?.event.isFull}>
                            {isActionPending ? 'Registering...' : (data?.event.isFull ? 'Event Full' : 'Register')}
                        </button>
                    </>}
                    {actionError && <p className={styles.actionError}>{actionError}</p>}
                </div>
                <div className={styles.attendeesBox}>
                    <h5>Registered Attendees{registrationsData?.eventRegistrations ? ` (${registrationsData.eventRegistrations.length})` : ''}</h5>
                    {registrationsError && <p className={styles.actionError}>You are not allowed to view registrations for this event.</p>}
                    {(!registrationsError && !registrationsPending && !registrationsData?.eventRegistrations?.length) && <p>No registrations yet.</p>}
                    {registrationsData?.eventRegistrations?.length > 0 && <ul>
                        {registrationsData.eventRegistrations.map((registration) => (
                            <li key={registration.id}>
                                <div className={styles.headingTitle}>
                                    <p>{registration.user.name}</p>
                                </div>
                                <div>
                                    <p>{registration.user.email}</p>
                                </div>
                            </li>
                        ))}
                    </ul>}
                </div>
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
