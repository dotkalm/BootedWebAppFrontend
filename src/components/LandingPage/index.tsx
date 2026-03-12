import styles from './LandingPage.module.css';

export default function LandingPage() {
    return (
        <div className={styles['landing-page']}>
            <h1>Welcome to the Edge Detector App</h1>
            <p>Use your webcam to detect edges in real-time.</p>
            <a href="/webcam" className={styles['start-button']}>Start Detecting</a>
        </div>
    )
}