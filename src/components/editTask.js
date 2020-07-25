import React, { Component } from "react";
import { connect } from "react-redux";
import TimePicker from "react-times";

// use material theme
import "react-times/css/material/default.css";
import "bootstrap-utilities/bootstrap-utilities.css";

import axios from "axios";
axios.defaults.withCredentials = true

class EditTask extends Component {
  state = {
    startTime: '',
    endTime: '',
    errorMsg: "",
    showError: false,
    title: '',
    meetingLink: '',
    attendees: '',
    id: ''
  };
  componentDidMount() {
    this.setState({
      title: this.props.taskDtl.title,
      meetingLink: this.props.taskDtl.meeting_link,
      attendees: this.props.taskDtl.attendees,
      startTime: this.props.taskDtl.start_time,
      endTime: this.props.taskDtl.end_time,
      id: this.props.taskDtl.id
    })
  }
  handleUpdateTask = () => {
    //console.log("in handle Task" + this.props);
    //start time should not be greater then end task
    const startTime = parseInt(this.state.startTime.replace(':', ''))
    const endTime = parseInt(this.state.endTime.replace(':', ''))
    //console.log('startTime:' + startTime)
    //console.log('endTIme:' + endTime)
    if (startTime > endTime) {
      this.setState({
        showError: true,
        errorMsg: "Start Time Can not be Greater then End Time",
      });
      return;
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
      return;
    }
    //   console.log('date update:' +this.state.meetingLink)

    //Convert Local Time to UTC Time

    //convert local time to UTC time
    // const [startHour,startMinute] = this.state.startTime.split(':')

    // let  utcTime  = new Date(new Date().setHours(startHour,startMinute)).toUTCString()
    // const UtcStartTime = new Date(utcTime).getUTCHours() + ':' +  new Date(utcTime).getUTCMinutes() 
    // console.log('UtcStartTime:',UtcStartTime)
    // const [endHour,endMinute] = this.state.endTime.split(':')
    // utcTime = new Date(new Date().setHours(endHour,endMinute)).toUTCString()
    // const UtcEndTime = new Date(utcTime).getUTCHours() + ':' +  new Date(utcTime).getUTCMinutes() 
    // console.log('utcEndTime:',UtcEndTime)

    axios
      .put(process.env.REACT_APP_HOSTURL + "/task/update/" + this.state.id, {
        title: this.state.title,
        date: this.state.date,
        start_time: this.state.startTime,
        end_time: this.state.endTime,
        attendees: this.state.attendees,
        meeting_link: this.state.meetingLink,
        taskCompleted: false,
        id: this.state.id
      })
      .then((res) => {
        //  console.log(res);
        this.props.dateChange(this.props.date);
        this.props.closeTask();
      });

    // this.props.closeTask()
  };

  titleChange = (event) => {
    this.setState({ title: event.target.value })
  };

  meetingChange = (event) => {
    this.setState({ meetingLink: event.target.value })
  };

  attendeesChange = (event) => {
    this.setState({ attendees: event.target.value })
  };

  onStartTimeChange = (time) => {
    const { hour, minute } = time;
    const hhmm = hour + ":" + minute;
    this.setState({ startTime: this.getUTCTime(hhmm) })
  };
  onEndTimeChange = (time) => {
    const { hour, minute } = time;
    const hhmm = hour + ":" + minute;
    this.setState({ endTime:     this.getUTCTime(hhmm) })

  };
  getUTCTime = (localTime) =>{
    const localHour = localTime.split(':')[0] 
    const localMinute = localTime.split(':')[1]
    const localTimeStr = new Date().setHours(localHour,localMinute) 
    const time = this.addZeroBefore(new Date(localTimeStr).getUTCHours()) + ':' + this.addZeroBefore( new Date(localTimeStr).getUTCMinutes())
    return time
  }
  closeErrorMessage = () => {
    this.setState({ errorMsg: '', showError: false })
  }

  getLocalTime = (utcTime) =>{

    const utcHour = utcTime.split(':')[0] 
    const utcMinute = utcTime.split(':')[1]
    const localTimeStr = new Date().setUTCHours(utcHour,utcMinute) 
    const time = this.addZeroBefore(new Date(localTimeStr).getHours()) + ':' + this.addZeroBefore( new Date(localTimeStr).getMinutes())
    return time
    }

addZeroBefore = (n) =>{
        return (n < 10 ? '0' : '') + n;
}
  render() {
    return (
      <div className="bg-model">
        <div className="bg-content">
          <div style={{ width: '60%' }}>
            <div
              className="cancel"
              style={{ cursor: "pointer" }}
              onClick={this.props.closeTask}
            >
              +
            </div>
            <div className="form-group row">
              <label htmlFor="inputTaskTitle" className="col-sm-3 col-form-label">
                Title:
              </label>
              <div className="col-sm-12">
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="Enter Task Title"
                  value={this.state.title}
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
                  value={this.state.meetingLink}
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
                  value={this.state.attendees}
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
                  time={this.getLocalTime(this.state.startTime)}
                  onTimeChange={this.onStartTimeChange.bind(this)}
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
                  time={this.getLocalTime(this.state.endTime)}
                  onTimeChange={this.onEndTimeChange.bind(this)}
                />
              </div>
            </div>
            <div className="col-sm-12 submitBtn">
              <button
                type="button"
                onClick={this.handleUpdateTask}
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

    date: state.date,
    allTask: state.allTask

  };
};

export default connect(mapStateToProps)(EditTask);
