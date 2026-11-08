import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import MyEvents from './MyEvents';
import { MY_REGISTRATIONS } from '../apis';

const registration = (overrides) => ({
    id: '1',
    name_text: 'AI Meetup',
    dsc_text: 'A meetup',
    capacity: 75,
    start_utc: '2026-11-11T04:15:00.000Z',
    end_utc: '2026-11-11T07:15:00.000Z',
    registeredCount: 74,
    spotsLeft: 1,
    isFull: false,
    isRegistrationClosed: false,
    isRegistered: true,
    ...overrides,
});

const renderMyEvents = (myRegistrations) => render(
    <MockedProvider
        mocks={[{ request: { query: MY_REGISTRATIONS }, result: { data: { myRegistrations } } }]}
        addTypename={false}
    >
        <MemoryRouter><MyEvents /></MemoryRouter>
    </MockedProvider>
);

test('lists the events the user registered for with spots left', async () => {
    renderMyEvents([registration()]);

    expect(await screen.findByText('AI Meetup')).toBeInTheDocument();
    expect(screen.getByText('1 spot left')).toBeInTheDocument();
    expect(screen.queryByText('Full')).not.toBeInTheDocument();
});

test('shows Full for events without spots left', async () => {
    renderMyEvents([registration({ id: '2', name_text: 'Sold Out', registeredCount: 75, spotsLeft: 0, isFull: true })]);

    expect(await screen.findByText('Sold Out')).toBeInTheDocument();
    expect(screen.getByText('Full')).toBeInTheDocument();
    expect(screen.queryByText(/spots left/)).not.toBeInTheDocument();
});

test('shows a message when the user has not registered for anything', async () => {
    renderMyEvents([]);

    expect(await screen.findByText('You have not registered for any event yet')).toBeInTheDocument();
});
