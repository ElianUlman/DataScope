import { useEffect } from 'react';
import './Overview.css';
import '../services/overview.js';
import ApexCharts from 'apexcharts';
import moment from 'moment';

export default function Overview() {
    useEffect(() => {
        import('../services/overview.js')
            .then((mod) => {
                if (mod && typeof mod.default === 'function') mod.default();
            })
            .catch((err) => console.error('Failed to load overview charts', err));
    }, []);

    return (
        <></>
    );
}