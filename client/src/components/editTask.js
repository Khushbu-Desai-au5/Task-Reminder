import React, { Component } from "react";
import { connect } from "react-redux";
import TimePicker from "react-times";

// use material theme
import "react-times/css/material/default.css";
import "bootstrap-utilities/bootstrap-utilities.css";

import axios from "axios";

class EditTask extends Component {
  state = {
    startTime:'',
    endTime:'',
    errorMsg: "",
    showError: false,
    title:'',
    meetingLink:'',
    attendees:'',
    id:''
  };
  componentDidMount(){
    console.log(this.props.taskDtl)
    this.setState({
      title:this.props.taskDtl.title,
      meetingLink:this.props.taskDtl.meeting_link,
      attendees:this.props.taskDtl.attendees,
      startTime:this.props.taskDtl.start_time,
      endTime:this.props.taskDtl.end_time,
      id:this.props.taskDtl.id
    })
  }
  handleUpdateTask = () => {
    //console.log("in handle Task" + this.props);
    //start time should not be greater then end task
    const startTime = parseInt(this.state.startTime.replace(':',''))
    const endTime = parseInt(this.state.endTime.replace(':',''))
    console.log('startTime:' + startTime)
    console.log('endTIme:' + endTime)
    if (startTime > endTime) {
      this.setState({
        showError: true,
        errorMsg: "Start Time Can not be Greater then End Time",
      });
      return;
    }
    //task overlap
   const overlappedTask = this.props.allTask.filter(task =>{
      if(!task.taskCompleted){
        const start_Time = parseInt(task.start_time.split(':').join(''))
        const end_Time = parseInt(task.end_time.split(':').join(''))
        if((startTime>= start_Time && startTime <= end_Time) || (endTime>= start_Time && endTime <= end_Time)){
          return true;
        }else{
          return false
        }
      }else{
        return false
      }
    })
    if(overlappedTask.length > 0){
      this.setState({
        showError: true,
        errorMsg: 'Task is getting Overlapped.'
      });
      return;
    }
 //   console.log('date update:' +this.state.meetingLink)
    axios
      .put("/task/update/"+this.state.id, {
        title: this.state.title,
        date: this.state.date,
        start_time: this.state.startTime,
        end_time: this.state.endTime,
        attendees: this.state.attendees,
        meeting_link: this.state.meetingLink,
        taskCompleted: false,
        id:this.state.id
      })
      .then((res) => {
      //  console.log(res);
        this.props.dateChange(this.props.date);
        this.props.closeTask();
      });

    // this.props.closeTask()
  };

  titleChange = (event) => {
    this.setState({title:event.target.value})
  };

  meetingChange = (event) => {
    this.setState({meetingLink:event.target.value})
  };

  attendeesChange = (event) => {
    this.setState({attendees:event.target.value})
  };

  onStartTimeChange = (time) => {
    const { hour, minute } = time;
    const hhmm = hour + ":" + minute;
    this.setState({startTime:hhmm})
  };
  onEndTimeChange = (time) => {
    const { hour, minute } = time;
    const hhmm = hour + ":" + minute;
    this.setState({endTime:hhmm})
    
  };

  closeErrorMessage = () =>{
    this.setState({errorMsg:'',showError:false})
  }
  render() {
    return (
      <div className="bg-model">
        <div className="bg-content">
          <div style={{width:'60%'}}>
            <div
              className="cancel"
              style={{ cursor: "pointer" }}
              onClick={this.props.closeTask}
            >
              +
            </div>
            <div className="form-group row">
              <label for="inputTaskTitle" className="col-sm-3 col-form-label">
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
              <label for="inputMeetingLink" className="col-sm-3 col-form-label">
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
              <label for="inputAttendees" className="col-sm-3 col-form-label">
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
              <label for="inputStartTime" className="col-sm-5 col-form-label">
                Start Time:
              </label>
              <div className="col-sm-12">
                <TimePicker
                  colorPalette="light"
                  timeMode="24"
                  timeConfig={{
                    from: "08:00",
                    to: "20:00",
                  }}
                  time={this.state.startTime}
                  onTimeChange={this.onStartTimeChange.bind(this)}
                />
              </div>
            </div>

            <div className="form-group row">
              <label for="inputEndTime" className="col-sm-4 col-form-label">
                End Time:
              </label>
              <div className="col-sm-12">
                <TimePicker
                  timeMode="24"
                  timeConfig={{
                    from: "08:00",
                    to: "20:00",
                  }}
                  time={this.state.endTime}
                  onTimeChange={this.onEndTimeChange.bind(this)}
                />
              </div>
            </div>
                  <div class="col-sm-12 submitBtn">
                  <button
                    type="button"
                    onClick={this.handleUpdateTask}
                    className="btn btn-primary"
                  >
                    Submit
                  </button>
              
              </div>
             
              {this.state.showError ? (
                  <div className="alert alert-warning alert-dismissible fade show"role= "alert"> 
                   {this.state.errorMsg}
                  <button type="button" onClick={this.closeErrorMessage}className="close" data-dismiss="alert" aria-label="Close">
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
