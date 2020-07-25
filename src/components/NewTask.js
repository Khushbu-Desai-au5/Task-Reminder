import React, { Component } from "react";
import { connect } from "react-redux";
import TimePicker from "react-times";

// use material theme
import "react-times/css/material/default.css";
import "bootstrap-utilities/bootstrap-utilities.css";

import axios from "axios";
axios.defaults.withCredentials = true

class NewTask extends Component {
  state = {
    startHour: "10",
    startMinute: "10",
    endHour: "10",
    endMinute: "30",
    errorMsg: "",
    showError: false
  };
  validateInput = () => {
    const startTime = parseInt(this.state.startHour + this.state.startMinute + '00');
    const endTime = parseInt(this.state.endHour + this.state.endMinute + '00');
    // console.log('startTime:' + startTime)
    // console.log('endTIme:' + endTime)

    if (this.props.title === '' || this.props.title == null) {
      this.setState({
        showError: true,
        errorMsg: "Task Title Can not be Empty."
      });
      return false;
    } else if (this.props.mettingLink === '' || this.props.mettingLink == null) {
      this.setState({
        showError: true,
        errorMsg: "Meeting Link Can not be Empty."
      });
      return false;
    } else if (this.props.attendees === '' || this.props.attendees == null) {
      this.setState({
        showError: true,
        errorMsg: "At Least One Attendee is Required."
      });
      return false;
    }

    if (startTime > endTime) {
      this.setState({
        showError: true,
        errorMsg: "Start Time Can not be Greater then End Time",
      });
      return false;
    }
    //task overlap
    const overlappedTask = this.props.allTask.filter(task => {
      if (!task.taskCompleted) {
        const start_Time = parseInt(task.start_time.split(':').join(''))
        const end_Time = parseInt(task.end_time.split(':').join(''))
        if ((startTime >= start_Time && startTime <= end_Time) || (endTime >= start_Time && endTime <= end_Time)) {
          return true;
        } else {
          return false
        }
      } else {
        return false
      }
    })
    if (overlappedTask.length > 0) {
      this.setState({
        showError: true,
        errorMsg: 'Task is getting Overlapped.'
      });
      return false;
    }

    return true;
  }
  handleCreateTask = () => {
    //  console.log("in handle Task" + this.props);

    if (!this.validateInput()) {
     // console.log('validation falied.')
      return;
    }
    //start time should not be greater then end task

    //convert local time to UTC time
    let  utcTime  = new Date(new Date().setHours(this.state.startHour,this.state.startMinute)).toUTCString()
    const UtcStartTime = new Date(utcTime).getUTCHours() + ':' +  new Date(utcTime).getUTCMinutes() 
    //console.log('UtcStartTime:',UtcStartTime)
    utcTime = new Date(new Date().setHours(this.state.endHour,this.state.endMinute)).toUTCString()
    const UtcEndTime = new Date(utcTime).getUTCHours() + ':' +  new Date(utcTime).getUTCMinutes() 
  // console.log('utcEndTime:',UtcEndTime)
    //console.log('timezone',new Date().getTimezoneOffset())
    const timeZone = new Date().getTimezoneOffset()
    axios
      .post(process.env.REACT_APP_HOSTURL + "/task/create", {
        title: this.props.title,
        date: this.props.date,
        start_time: UtcStartTime,
        end_time: UtcEndTime,
        attendees: this.props.attendees,
        meeting_link: this.props.mettingLink,
        taskCompleted: false,
        timeZone: timeZone
      })
      .then((res) => {
        this.props.dateChane(this.props.date);
        this.props.dispatch({ "type": "clear" })
        this.props.closeTask();
      });

  };

  titleChange = (event) => {
    this.props.dispatch({ type: "title", payload: event.target.value });
  };

  meetingChange = (event) => {
    this.props.dispatch({ type: "mettingLink", payload: event.target.value });
  };

  attendeesChange = (event) => {
    this.props.dispatch({ type: "attendees", payload: event.target.value });
  };

  onStartTimeChange = (time) => {
    //console.log(this.state.timezoneData)
    const { hour, minute } = time;
    this.setState({ startHour: hour, startMinute: minute });
    const hhmm = hour + ":" + minute;
    this.props.dispatch({ type: "startTime", payload: hhmm });
  };
  onEndTimeChange = (time) => {
    //console.log(time)
    const { hour, minute } = time;
    this.setState({ endHour: hour, endMinute: minute });
    const hhmm = hour + ":" + minute;
    this.props.dispatch({ type: "endTime", payload: hhmm });
  };

  closeErrorMessage = () => {
    this.setState({ errorMsg: '', showError: false })
  }
  render() {
    return (
      <div className="bg-model">
        <div className="bg-content">
          <div
            className="cancel"
            style={{ "cursor": "pointer" }}
            onClick={this.props.closeTask}
          >
            +
            </div>
          <div style={{ "width": "auto" }}>

            <div className="form-group row" style={{ "marginTop": "35px" }}>
              <label htmlFor="inputTaskTitle" className="col-sm-3 col-form-label">
                Title:
              </label>
              <div className="col-sm-12">
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="Enter Task Title"
                  value={this.props.title}
                  onChange={(event) => this.titleChange(event)}
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="inputMeetingLink" className="col-sm-3 col-form-label">
                Link:
              </label>
              <div className="col-sm-12">
                <input
                  type="text"
                  className="form-control"
                  id="meetingLink"
                  value={this.props.mettingLink}
                  onChange={(event) => this.meetingChange(event)}
                  placeholder="Enter Meeting Link"
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="inputAttendees" className="col-sm-3 col-form-label">
                Attendees:
              </label>
              <div className="col-sm-12">
                <input
                  type="text"
                  className="form-control"
                  id="attendees"
                  value={this.props.attendees}
                  onChange={(event) => this.attendeesChange(event)}
                  placeholder="Enter attendees"
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="inputStartTime" className="col-sm-5 col-form-label">
                Start Time:
              </label>
              <div className="col-sm-12">
                <TimePicker 
                  colorPalette="light"
                  timeMode="24"
                  time={this.state.startHour + ":" + this.state.startMinute}
                  onTimeChange={this.onStartTimeChange.bind(this)}
                  timeZone = 'Asia/Calcutta'
                />
              </div>
            </div>

            <div className="form-group row">
              <label htmlFor="inputEndTime" className="col-sm-4 col-form-label">
                End Time:
              </label>
              <div className="col-sm-12">
                <TimePicker 
                  timeMode="24"
                  time={this.state.endHour + ":" + this.state.endMinute}
                  onTimeChange={(event) =>this.onEndTimeChange(event)}
                />
              </div>
            </div>
            <div className="col-sm-12 submitBtn">
              <button
                type="button"
                onClick={this.handleCreateTask}
                className="btn btn-primary"
              >
                Submit
                  </button>

            </div>

            {this.state.showError ? (
              <div className="alert alert-warning alert-dismissible fade show" role="alert">
                {this.state.errorMsg}
                <button type="button" onClick={this.closeErrorMessage} className="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>

              </div>
            ) : null}

          </div>
        </div>
      </div>
    );
  }
}



const mapStateToProps = (state) => {
  return {
    title: state.title,
    date: state.date,
    mettingLink: state.mettingLink,
    attendees: state.attendees,
    startTime: state.startTime,
    endTime: state.endTime,
    allTask: state.allTask

  };
};

export default connect(mapStateToProps)(NewTask);
