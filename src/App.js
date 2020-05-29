import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import FilterActions from './filterActions';
import FILTER_CONFIG from './config';

export default function App() {
    const [state, setState] = useState(null);
    const onGetFilterValue = data => {
        setState(data);
    };
    return (
        <div className="App pt-5">
            <Container>
                <Card>
                    <Card.Header>
                        <Card.Text bsPrefix="card-title h2">Hello Dynamic Filter</Card.Text>
                        <Card.Subtitle bsPrefix="card-subtitle h3">Start editing to see some magic happen!</Card.Subtitle>
                    </Card.Header>
                    <Card.Body>
                        <h3 className="d-block">Form:</h3>
                        <div className="d-flex justify-content-center">
                            <FilterActions options={FILTER_CONFIG} onGetValue={onGetFilterValue} />
                        </div>
                        <br />
                        {state && (
                            <>
                                <h3>Result:</h3>
                                <ReactJson src={state} />
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}
