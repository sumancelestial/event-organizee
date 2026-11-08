import { Link, useLocation } from 'react-router-dom';
import styles from '../styleModules/NavBar.module.css';
import { useEffect, useRef } from 'react';

const NavBar = () => {
    const events = useRef();
    const create = useRef();
    const mine = useRef();
    const location = useLocation();

    useEffect(() => {
        const setActive = (ref, isActive) => {
            if (ref.current) {
                ref.current.className = isActive ? styles.active : '';
            }
        }
        const path = location.pathname;
        setActive(create, path === '/event/create');
        setActive(mine, path === '/my-events');
        setActive(events, path !== '/event/create' && path !== '/my-events');
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
                    <Link to='/my-events' ref={mine}>My Events</Link>
                    <Link to='/event/create' ref={create}>Create Event</Link>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;