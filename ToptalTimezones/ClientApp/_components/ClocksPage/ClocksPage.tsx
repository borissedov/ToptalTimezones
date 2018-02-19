import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Clock from 'react-live-clock';
import * as Clocks from "../../_reducers/Clock";
import {connect} from "react-redux";
import {ApplicationState} from "../../_reducers";


// At runtime, Redux will merge together...
type ClocksProps =
    Clocks.ClocksState        // ... state we've requested from the Redux store
    & typeof Clocks.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{ }>; // ... plus incoming routing parameters

class ClocksPage extends React.Component<ClocksProps, {}> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.requestClock();
    }

    // componentWillReceiveProps(nextProps: ClocksProps) {
    //     // This method runs when incoming props (e.g., route params) change
    //     this.props.requestClock();
    // }

    public render() {
        return <div>
            <h1>Cloks</h1>
            { this.renderClocksTable() }
        </div>;
    }

    private renderClocksTable() {
        return <table className='table'>
            <thead>
            <tr>
                <th>Name</th>
                <th>City Name</th>
                <th>Time</th>
            </tr>
            </thead>
            <tbody>
            {this.props.clocks.map(clock =>
                <tr key={ clock.id }>
                    <td>{ clock.name }</td>
                    <td>{ clock.cityName }</td>
                    <td>
                        <Clock format={'HH:mm:ss'} ticking={true} timezone={clock.timezone}/>
                    </td>
                </tr>
            )}
            </tbody>
        </table>;
    }    
}

export default connect(
    (state: ApplicationState) => state.clocks, // Selects which state properties are merged into the component's props
    Clocks.actionCreators                 // Selects which action creators are merged into the component's props
)(ClocksPage) as typeof ClocksPage;
