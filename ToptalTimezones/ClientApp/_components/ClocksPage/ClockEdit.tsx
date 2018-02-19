import * as React from "react";
import * as Clocks from "../../_reducers/Clock"
import moment from "moment-timezone"
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

type ClockEditProps = {
    clock: Clocks.Clock,
    clockSaving: boolean,
    isNew: boolean,
    onSave(clock: Clocks.Clock)
}

type ClockEditState = {
    id: number,
    name: string,
    cityName: string,
    timezone: string,
    submitted: boolean,
    defaultTimezone: string,
    isNew: boolean
}

export default class ClockEdit extends React.Component<ClockEditProps, ClockEditState> {
    constructor(props: any) {
        super(props);
        this.bindState(props);

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onTypeheadChange = this.onTypeheadChange.bind(this);
    }

    componentWillReceiveProps(nextProps: ClockEditProps) {
        this.bindState(nextProps);
    }

    private bindState(props: any) {
        let timezone: string;
        let defaultTimezone: string;
        if (props.clock.timezone) {
            timezone = props.clock.timezone;
            defaultTimezone = timezone;
        } else {
            defaultTimezone = moment.tz.guess();
            timezone = defaultTimezone;
        }
        this.state = {
            id: props.clock.id ? props.clock.id : 0,
            name: props.clock.name ? props.clock.name : '',
            cityName: props.clock.cityName ? props.clock.cityName : '',
            defaultTimezone: defaultTimezone,
            timezone: timezone,
            submitted: false,
            isNew: props.isNew
        };
    }

    handleOnChange(event: any): void {
        this.setState({[event.target.name]: event.target.value});
    }

    handleTimezoneChange(event: any): void {
        this.setState({timezone: event.target.value});
    }

    handleSubmit(event: any): void {
        event.preventDefault();

        this.setState({submitted: true});
        const {id, name, cityName, timezone} = this.state;
        this.props.onSave({id, name, cityName, timezone});
    }

    onTypeheadChange(selected: string) {
        this.setState({timezone: selected});
    }

    render() {
        const {clockSaving} = this.props;
        const {id, name, cityName, timezone, submitted, defaultTimezone, isNew} = this.state;
        const visible = isNew || id != 0;
        return (
            <div className={"col-md-6 col-md-offset-3 "  + (visible ? "" : "hidden")}>
                <h2>{isNew ? "Add Clock" : "Editing Clock: " + name}</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <input type="hidden" name="id" value={id}/>
                    <div className={'form-group' + (submitted && !name ? ' has-error' : '')}>
                        <label htmlFor="name">Name</label>
                        <input type="text" className="form-control" name="name" value={name}
                               onChange={e => this.handleOnChange(e)}/>
                        {submitted && !name &&
                        <div className="help-block">Name is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !cityName ? ' has-error' : '')}>
                        <label htmlFor="cityName">City Name</label>
                        <input type="text" className="form-control" name="cityName" value={cityName}
                               onChange={e => this.handleOnChange(e)}/>
                        {submitted && !cityName &&
                        <div className="help-block">City Name is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !timezone ? ' has-error' : '')}>
                        <label htmlFor="timezone">Timezone</label>
                        <Typeahead
                            selected={[defaultTimezone]}
                            onChange={this.onTypeheadChange}
                            options={moment.tz.names().map(tz => ({key: tz, label: tz}))}
                        />

                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Save</button>
                        {clockSaving &&
                        <img
                            src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>
                        }
                    </div>
                </form>
            </div>
        );
    }
}