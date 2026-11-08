import { useEffect, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { GET_EVENT_BY_ID, NEW_EVENT, UPDATE_EVENT } from '../../apis';
import FormContainer from './FormContainer'
import moment from 'moment';
import { useLazyQuery, useMutation } from '@apollo/client';

const eventObject = {
    name: '',
    description: '',
    start: '',
    end: '',
    capacity: ''
}

const CreateUpdateEvent = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [isPending, setIsPending] = useState(true);
    const [eventDetails, setEventDetails] = useState(null);
    const [formDisable, setFormDisable] = useState(false);
    const [buttonText, setButtonText] = useState('');
    const [isError, setIsError] = useState(null);
    const nav = useNavigate();
    const [getEvent] = useLazyQuery(GET_EVENT_BY_ID, {
        fetchPolicy: 'no-cache'
    })
    const [updateEvent] = useMutation(UPDATE_EVENT)
    const [newEvent] = useMutation(NEW_EVENT)

    const match = useMatch('/event/:id/edit');
    useEffect(() => {
        if (match) {
            const id = match.params.id;
            setButtonText('Update Event');
            const data = async () => {
                const event = await getEvent({
                    variables: {
                        eventId: id
                    }
                });
                setIsPending(false);
                if (event?.error) {
                    setIsError(event?.error?.message);
                    return
                }
                if (!event?.data?.event) {
                    setIsError('Error.. Try Again!');
                    return
                }
                const eventObject = {
                    name: event?.data?.event.name_text,
                    description: event?.data?.event.dsc_text,
                    start: moment(event?.data?.event.start_utc).format('DD-MM-YYYY, LT'),
                    end: moment(event?.data?.event.end_utc).format('DD-MM-YYYY, LT'),
                    capacity: event?.data?.event.capacity
                }
                setEventDetails(eventObject);
                setIsError(null);
            }
            data();
        }
        else {
            setButtonText('Create Event')
            setEventDetails(eventObject);
            setIsError(null);
        }
    }, [match])

    const handleChanges = (e, element) => {
        setEventDetails((prev) => {
            return {
                ...prev,
                [element]: e.target.value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormDisable(true);
        if (match) {
            setButtonText('Updating...');
            const id = match.params.id;
            const input = {
                input: {
                    id: id,
                    "name_text": eventDetails.name,
                    "name_html": `<p>${eventDetails.name}</p>`,
                    "dsc_text": eventDetails.description,
                    "dsc_html": `<p>${eventDetails.description}</p>`,
                    capacity: eventDetails.capacity,
                }
            }
            try {
                const updateStatus = await updateEvent({
                    variables: input
                })
                if (updateStatus?.error || !updateStatus?.data?.updateEvent) {
                    setFormDisable(false);
                    setButtonText('Update Event')
                    alert(updateStatus?.error?.message || "Something went wrong.. Please try again!")
                    setEventDetails(null)
                    return;
                }
                nav(`/event/${id}`);
                return
            }
            catch (err) {
                setFormDisable(false);
                setButtonText('Update Event')
                alert(err?.message || "Something went wrong.. Please try again!")
                return;
            }
        }
        setButtonText('Loading...');
        const input = {
            input: {
                "start_utc": moment(eventDetails.start).utc().format(),
                "end_utc": moment(eventDetails.end).utc().format(),
                "name_text": eventDetails.name,
                "name_html": `<p>${eventDetails.name}</p>`,
                "dsc_text": eventDetails.description,
                "dsc_html": `<p>${eventDetails.description}</p>`,
                capacity: +(eventDetails.capacity),
                orgId: +(user?.organization?.id)
            }
        }
        try {
            const eventStatus = await newEvent({ variables: input });
            if (eventStatus?.error || !eventStatus?.data?.addEvent) {
                setFormDisable(false);
                setButtonText('Create Event')
                alert(eventStatus?.error?.message || "Something went wrong.. Please try again!")
                return;
            }
            nav('/events');
        }
        catch (err) {
            setFormDisable(false);
            setButtonText('Create Event')
            alert(err?.message || "Something went wrong.. Please try again!")
            return;
        }
    }

    return (
        <FormContainer isMatch={match} isPending={isPending} eventDetails={eventDetails} formDisable={formDisable} handleSubmit={handleSubmit} handleChanges={handleChanges} buttonText={buttonText} isError={isError} />
    );
}

export default CreateUpdateEvent;