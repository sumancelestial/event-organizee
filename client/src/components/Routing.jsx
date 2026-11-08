import { Route, Routes } from 'react-router-dom';
import Event from './events/Event';
import CreateUpdateEvent from './events/CreateUpdateEvent';
import EventsList from './events/EventsList';
import NotFound from './NotFound'

const Routing = ({ user }) => {
    return (
        <Routes>
            <Route exact path='/' element={<EventsList user={user} />} />
            <Route exact path='/events' element={<EventsList user={user} />} />
            <Route exact path='/event/create' element={<CreateUpdateEvent />} />
            <Route exact path='/event/:id' element={<Event />} />
            <Route exact path='/event/:id/edit' element={<CreateUpdateEvent />} />
            <Route exact path='*' element={<NotFound />} />
        </Routes>
    );
}

export default Routing;