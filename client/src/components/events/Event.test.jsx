import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Event from './Event';
import { EVENT_REGISTRATIONS, GET_EVENT_BY_ID } from '../../apis';

const eventDetails = (overrides) => ({
    id: '1',
    name_text: 'AI Meetup',
    name_html: '<p>AI Meetup</p>',
    dsc_text: 'A meetup about AI',
    dsc_html: '<p>A meetup about AI</p>',
    capacity: 75,
    start_utc: '2026-11-11T04:15:00.000Z',
    end_utc: '2026-11-11T07:15:00.000Z',
    registeredCount: 74,
    spotsLeft: 1,
    isFull: false,
    isRegistrationClosed: false,
    isRegistered: false,
    ...overrides,
});

const attendees = [{
    id: '9',
    created: '2026-11-08T10:26:18.955Z',
    user: {
        id: '2',
        name: 'Suman Bogati',
        first_name: 'Suman',
        last_name: 'Bogati',
        email: 'suman@example.com',
    },
}];

const renderEvent = (event, eventRegistrations = attendees) => render(
    <MockedProvider
        mocks={[
            { request: { query: GET_EVENT_BY_ID, variables: { eventId: '1' } }, result: { data: { event } } },
            { request: { query: EVENT_REGISTRATIONS, variables: { eventId: '1' } }, result: { data: { eventRegistrations } } },
        ]}
        addTypename={false}
    >
        <MemoryRouter initialEntries={['/event/1']}>
            <Routes>
                <Route path='/event/:id' element={<Event />} />
            </Routes>
        </MemoryRouter>
    </MockedProvider>
);

beforeEach(() => {
    const modal = document.createElement('div');
    modal.id = 'modal';
    document.body.appendChild(modal);
});

afterEach(() => {
    document.body.innerHTML = '';
});

test('shows spots left, a register button and everyone who registered', async () => {
    renderEvent(eventDetails());

    // the name shows up in the details and in the delete confirmation dialog
    expect(await screen.findAllByText('AI Meetup')).toHaveLength(2);
    expect(screen.getByText('1 spot left')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByText('Registered Attendees (1)')).toBeInTheDocument();
    expect(screen.getByText('Suman Bogati')).toBeInTheDocument();
    expect(screen.getByText('suman@example.com')).toBeInTheDocument();
});

test('shows Full and hides register when no spots remain', async () => {
    renderEvent(eventDetails({ registeredCount: 75, spotsLeft: 0, isFull: true }));

    expect(await screen.findByText('Full')).toBeInTheDocument();
    expect(screen.getByText('This event is full. No spots left.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Register' })).not.toBeInTheDocument();
});

test('offers cancelling when the user is already registered', async () => {
    renderEvent(eventDetails({ isRegistered: true }));

    expect(await screen.findByText('You are registered for this event.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel Registration' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Register' })).not.toBeInTheDocument();
});

test('closes registration once the event has ended', async () => {
    renderEvent(eventDetails({ isRegistrationClosed: true }));

    expect(await screen.findByText('Registration closed. This event has ended.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Register' })).not.toBeInTheDocument();
});
