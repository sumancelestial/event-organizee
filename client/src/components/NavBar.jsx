import { Link, useLocation } from 'react-router-dom';
import styles from '../styleModules/NavBar.module.css';
import { useEffect, useRef } from 'react';

const NavBar = () => {
    const events = useRef();
    const create = useRef();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/event/create') {
            create.current.className = styles.active;
            events.current.className = '';
        }
        else {
            events.current.className = styles.active;
            create.current.className = '';
        }
    }, [location])

    return (
        <nav>
            <div className={styles.nav}>
                <h1>Event Organizee</h1>
                <div className={styles.details}>
                    <p>Shreya Garg</p>
                    <p>gargshreya122@gmail.com</p>
                </div>
            </div>
            <div className={styles.buttonsMargin}>
                <div className={styles.buttons}>
                    <Link to='/events' ref={events} className={styles.active}>All Events</Link>
                    <Link to='/event/create' ref={create}>Create Event</Link>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;