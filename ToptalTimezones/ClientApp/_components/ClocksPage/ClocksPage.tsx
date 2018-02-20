import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import Clock from 'react-live-clock';
import * as Clocks from "../../_reducers/Clock";
import moment from "moment-timezone"
import {connect} from "react-redux";
import {ApplicationState} from "../../_reducers";
import ClockEdit from "./ClockEdit"

// At runtime, Redux will merge together...
type ClocksProps =
    Clocks.ClocksState        // ... state we've requested from the Redux store
    & typeof Clocks.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>; // ... plus incoming routing parameters

type ClocksState = { editingClock: Clock, isNew: boolean, filter: string }

class ClocksPage extends React.Component<ClocksProps, ClocksState> {
    constructor(props: any) {
        super(props);

        this.state = {editingClock: this.props.editingClock, isNew: false, filter: ''};

        this.onAddClick = this.onAddClick.bind(this);
        this.onSaveClock = this.onSaveClock.bind(this);
    }

    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.requestClock();
    }

    componentWillReceiveProps(nextProps: ClocksProps) {
        // This method runs when incoming props (e.g., route params) change
        this.setState({editingClock: this.props.editingClock})
    }

    onDeleteClick(clock: Clock) {
        this.props.deleteClock(clock);
    }

    onEditClick(clock: Clock) {
        this.setState({
            editingClock: clock,
            isNew: false
        })
    }

    onAddClick() {
        this.setState({
            editingClock: {},
            isNew: true
        })
    }

    onSaveClock(clock: Clock) {
        this.props.saveClock(clock);
        this.setState({
            isNew: false
        })
    }

    onFilterChange(event: any) {
        this.setState({
            filter: event.target.value
        })
    }

    public render() {
        const {clockSaving} = this.props;
        const {editingClock, isNew} = this.state;
        return <div>
            <h1>Clocks</h1>
            {this.renderClocksTable()}
            <div className="row">
                <div className="col-md-12">
                    <button className="btn btn-success" onClick={this.onAddClick}>Add</button>
                    <div className="col-md-2 pull-right">
                        <input type="text" className="form-control" placeholder="Filter..."
                               onChange={(e) => this.onFilterChange(e)}/>
                    </div>
                </div>
            </div>
            <ClockEdit clock={editingClock} clockSaving={clockSaving} isNew={isNew} onSave={this.onSaveClock}/>
        </div>;
    }

    private renderClocksTable() {
        return <table className='table'>
            <thead>
            <tr>
                <th>Name</th>
                <th>City Name</th>
                <th>Timezone</th>
                <th>Time</th>
                <th>From UTC</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {this.props.clocks.map(clock => {
                if (clock.name.toLowerCase().indexOf(this.state.filter.toLocaleLowerCase()) != -1) {
                    return <tr key={clock.id}>
                        <td>{clock.name}</td>
                        <td>{clock.cityName}</td>
                        <td>{clock.timezone}</td>
                        <td>
                            <Clock format={'HH:mm:ss'} ticking={true} timezone={clock.timezone}/>
                        </td>
                        <td>
                            {(moment.tz.zone(clock.timezone).utcOffset(Date.now()) / -60)}
                        </td>
                        <td>
                            <button className="btn btn-sm btn-info" onClick={() => this.onEditClick(clock)}>
                                <i className="glyphicon glyphicon-edit"/>
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => this.onDeleteClick(clock)}>
                                <i className="glyphicon glyphicon-trash"/>
                            </button>
                        </td>
                    </tr>
                }
                else {
                    return null;
                }
            })}
            </tbody>
        </table>;
    }
}

export default connect(
    (state: ApplicationState) => state.clocks, // Selects which state properties are merged into the component's props
    Clocks.actionCreators                 // Selects which action creators are merged into the component's props
)(ClocksPage) as typeof ClocksPage;
