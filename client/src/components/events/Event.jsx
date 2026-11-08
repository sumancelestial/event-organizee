import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../styleModules/Event.module.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import DeleteModal from './DeleteModal';
import { GET_EVENT_BY_ID, DELETE_EVENT, EVENT_REGISTRATIONS, REGISTER_EVENT, CANCEL_REGISTRATION } from '../../apis';
import { useMutation, useQuery } from '@apollo/client';

const Event = () => {
    const { id } = useParams();
    const [loadingMsg, setLoadingMsg] = useState('Loading...');
    const [actionMsg, setActionMsg] = useState(null);
    const [isActing, setIsActing] = useState(false);
    const nav = useNavigate();
    const dialog = useRef();
    const { data, loading: isPending, error, refetch } = useQuery(GET_EVENT_BY_ID, {
        variables: {
            eventId: id
        },
        fetchPolicy: "no-cache"
    })
    const { data: registrationsData, refetch: refetchRegistrations } = useQuery(EVENT_REGISTRATIONS, {
        variables: {
            eventId: id
        },
        fetchPolicy: "no-cache"
    })
    const [deleteEvent] = useMutation(DELETE_EVENT)
    const [registerForEvent] = useMutation(REGISTER_EVENT)
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

    const runRegistrationAction = async (action, resultKey) => {
        setActionMsg(null);
        setIsActing(true);
        try {
            const result = await action();
            if (result?.error || !result?.data?.[resultKey]) {
                setActionMsg(result?.error?.message || 'Something went wrong.. Please try again!');
                return;
            }
            await Promise.all([refetch(), refetchRegistrations()]);
        }
        catch (err) {
            setActionMsg(err?.message || 'Something went wrong.. Please try again!');
        }
        finally {
            setIsActing(false);
        }
    }

    const handleRegister = () => {
        runRegistrationAction(
            () => registerForEvent({ variables: { eventId: id } }),
            'registerForEvent'
        );
    }

    const handleCancel = () => {
        runRegistrationAction(
            () => cancelRegistration({ variables: { eventId: id } }),
            'cancelRegistration'
        );
    }

    const event = data?.event;
    const registrations = registrationsData?.eventRegistrations;

    const spotsLeftText = () => {
        if (event.isFull) {
            return <span className={styles.fullTag}>Full</span>;
        }
        return <span className={styles.spotsTag}>{event.spotsLeft} spot{event.spotsLeft === 1 ? '' : 's'} left</span>;
    }

    const registrationSection = () => {
        if (event.isRegistered) {
            return (
                <div className={styles.registrationStatus}>
                    <p className={styles.registeredMsg}>You are registered for this event.</p>
                    <button disabled={isActing} onClick={handleCancel}>Cancel Registration</button>
                </div>
            );
        }
        if (event.isRegistrationClosed) {
            return (
                <div className={styles.registrationStatus}>
                    <p className={styles.closedMsg}>Registration closed. This event has ended.</p>
                </div>
            );
        }
        if (event.isFull) {
            return (
                <div className={styles.registrationStatus}>
                    <p className={styles.closedMsg}>This event is full. No spots left.</p>
                </div>
            );
        }
        return (
            <div className={styles.registrationStatus}>
                <button disabled={isActing} onClick={handleRegister}>{isActing ? 'Registering...' : 'Register'}</button>
            </div>
        );
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
                            <p>{spotsLeftText()}</p>
                        </div>
                    </li>
                </ul>
                {actionMsg && <p className={styles.actionMsg}>{actionMsg}</p>}
                {registrationSection()}
                <div className={styles.eventButtons}>
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={handleDialog}>Delete</button>
                    <DeleteModal ref={dialog} eventName={data?.event.name_text} deleteNow={handleDelete} />
                </div>
                <div className={styles.registrations}>
                    <h3>Registered Attendees ({registrations ? registrations.length : 0})</h3>
                    {registrations && !registrations.length && <p className={styles.noRegistrations}>No registrations yet.</p>}
                    {registrations && !!registrations.length && <ul>
                        {registrations.map((registration) => (
                            <li key={registration.id}>
                                <div className={styles.headingTitle}>
                                    <h5>{registration.user.name}</h5>
                                </div>
                                <div>
                                    <p>{registration.user.email}</p>
                                </div>
                                <div>
                                    <p>Registered on {moment(registration.created).format('DD-MM-YYYY, LT')}</p>
                                </div>
                            </li>
                        ))}
                    </ul>}
                </div>
            </div>}
        </>
    );
}

export default Event;
