import styles from './LandingPage.module.css';
import Button from '../shared/Button';

interface LandingPageProps {
    onStartClick?: () => void;
}

export default function LandingPage({ onStartClick }: LandingPageProps) {
    return (
        <div className={styles['landing-page']}>
            <h1>Welcome to the Edge Detector App</h1>
            <p>Use your webcam to detect edges in real-time.</p>
            <Button
                label="Start Detecting"
                variant="solid"
                size="medium"
                onClick={onStartClick}
                themeColor={{
                    background: 'white',
                    text: '#7d2ae8',
                }}
            />
        </div>
    )
}