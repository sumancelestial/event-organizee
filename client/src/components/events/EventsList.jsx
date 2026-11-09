import { useMemo, useState } from 'react';
import styles from '../../styleModules/EventsList.module.css';
import { useQuery } from '@apollo/client'
import moment from 'moment';
import { GET_EVENTS } from '../../apis';
import EventTile from './EventTile';

const DATE_FILTERS = [
    { value: 'all', label: 'All' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' },
];

const filterEvents = (events, searchTerm, dateFilter) => {
    const term = searchTerm.trim().toLowerCase();

    return events.filter((event) => {
        const matchesName = !term || event.name_text?.toLowerCase().includes(term);
        const isPast = moment(event.end_utc).isBefore(moment());
        const matchesDate = dateFilter === 'all' || (dateFilter === 'past' ? isPast : !isPast);

        return matchesName && matchesDate;
    });
};

const getEmptyMessage = (searchTerm, dateFilter) => {
    const term = searchTerm.trim();

    if (term && dateFilter !== 'all') return `No events match "${term}" for the selected date filter.`;
    if (term) return `No events match "${term}".`;
    if (dateFilter === 'upcoming') return 'No upcoming events right now.';
    if (dateFilter === 'past') return 'No past events yet.';

    return 'NOTHING TO SHOW HERE';
};

const EventsList = ({ user }) => {
    const { data, loading: isPending, error } = useQuery(GET_EVENTS, {
        variables: {
            orgId: user?.organization?.id
        },
        fetchPolicy: "no-cache"
    })

    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all');

    const events = data?.events;
    const filteredEvents = useMemo(
        () => filterEvents(events ?? [], searchTerm, dateFilter),
        [events, searchTerm, dateFilter]
    );

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
            {data?.events && <>
                <div className={styles.filterBar}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search events by name"
                        aria-label="Search events by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className={styles.dateFilters} role="group" aria-label="Filter events by date">
                        {DATE_FILTERS.map(({ value, label }) => (
                            <button
                                key={value}
                                type="button"
                                className={dateFilter === value ? styles.dateFilterActive : styles.dateFilter}
                                onClick={() => setDateFilter(value)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.allEventsHere}>
                    {!filteredEvents.length && <h1 className={styles.noneShown}>{getEmptyMessage(searchTerm, dateFilter)}</h1>}
                    {filteredEvents.map((event) => (
                        <EventTile key={event.id} event={event} />
                    ))}
                    <div className={styles.eventTileExtra}></div>
                </div>
            </>}
        </>
    );
}

export default EventsList;
