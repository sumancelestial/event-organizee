import { Link, useLocation } from 'react-router-dom';
import styles from '../styleModules/NavBar.module.css';

const isActiveLink = (pathname, path) => {
    if (path === '/event/create') {
        return pathname === '/event/create';
    }
    if (path === '/my-events') {
        return pathname === '/my-events';
    }
    return pathname === '/' || pathname === '/events' || pathname.startsWith('/event/');
}

const NavBar = ({ user }) => {
    const location = useLocation();

    return (
        <nav>
            <div className={styles.nav}>
                <h1>Event Organizee</h1>
                <div className={styles.details}>
                    <p>{user?.name}</p>
                    <p>{user?.email}</p>
                </div>
            </div>
            <div className={styles.buttonsMargin}>
                <div className={styles.buttons}>
                    <Link to='/events' className={isActiveLink(location.pathname, '/events') ? styles.active : ''}>All Events</Link>
                    <Link to='/my-events' className={isActiveLink(location.pathname, '/my-events') ? styles.active : ''}>My Events</Link>
                    <Link to='/event/create' className={isActiveLink(location.pathname, '/event/create') ? styles.active : ''}>Create Event</Link>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
