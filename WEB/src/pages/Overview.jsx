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
        <>
            <div id="wrapper">

                <div className="content-area">
                    <div className="container-fluid">
                        <div className="main">

                            <div className="row mt-4">
                                <div className="col-md-5">
                                    <div className="box columnbox mt-4">
                                        <div id="columnchart"> </div>
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <div className="box  mt-4">
                                        <div id="linechart"> </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-5">
                                    <div className="box radialbox mt-4">
                                        <div id="circlechart"> </div>
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <div className="box mt-4">
                                        <div className="mt-4">
                                            <div id="progress1"></div>
                                        </div>
                                        <div className="mt-4">
                                            <div id="progress2"></div>
                                        </div>
                                        <div className="mt-4">
                                            <div id="progress3"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="float-right edit-on-codepen">

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}