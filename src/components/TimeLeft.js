import React from 'react';
import { withRouter } from 'react-router-dom';

function TimeLeft(props) {
    let hours = Math.floor((props.time/ (60 * 60)));
    let minutes = Math.floor((props.time / 60) % 60);
    let seconds = Math.floor((props.time) % 60);
    return ( 
        <div>
            <span style={{fontSize:'200px'}}>{("0" + hours).slice(-2)}:{("0" + minutes).slice(-2)}:{("0" + seconds).slice(-2)}</span>
        </div>
    )
}

export default withRouter(TimeLeft);