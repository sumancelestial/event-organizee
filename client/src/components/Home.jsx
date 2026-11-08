import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styles from '../styleModules/UserPage.module.css';
import NavBar from './NavBar';
import Routing from './Routing';

const Home = ({ user }) => {
    return (
        <Router>
            <NavBar />
            <div className={styles.container}>
                <Routing user={user} />
            </div>
        </Router>
    );
}

export default Home;