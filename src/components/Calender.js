import React, { Component } from "react";
import { connect } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import NewTask from "./NewTask";
import TaskDetails from "./TaskDetails";
import "../App.css";
import axios from "axios";
axios.defaults.withCredentials = true

class CalendarApp extends Component {
  state = {
    showAddTask: false,
  };
  handleAddTask = () => {
    this.setState({ showAddTask: !this.state.showAddTask });
  };
  onChange = (date) => {
    //console.log('prior date:', date)
    let formattedDate = new Date(date).toUTCString()
    //console.log('date:',formattedDate)

    this.props.dispatch({ type: "date", payload: formattedDate });
    axios.get(process.env.REACT_APP_HOSTURL + "/task/all/" + formattedDate).then((res) => {
      this.props.dispatch({
        type: "allTask",
        payload: res.data.message.map((e) => e),
      });
    });
  };

  signout =() =>{
    axios.post(process.env.REACT_APP_HOSTURL + "/users/signout",{})
    .then(res=>{
      this.props.history.push('/login')
    })
  }
  render() {
    let taskDtlClassName;
    return (
      <div className="taskContainer">
      <button
          className="btn btn-warning" style={{"justifyContent":"flex-end","marginRight":"20px","marginTop":"20px"}}
          type="button"
          onClick={this.signout}
        >
          Logout
        </button>
      
      <div className="home">
        <div className="calendarContainer">
          <Calendar
            className="calendar"
            onChange={(date) => this.onChange(date)}
          />
          <button
            className="btn btn-warning"
            style={{ marginTop: "20px", alignSelf: "center" }}
            type="button"
            onClick={this.handleAddTask}
          >
            Add Task
          </button>
        </div>
        <div className="dtlContainer">
          {(taskDtlClassName = this.state.showAddTask ? "withOverFlow" : null)}
          <TaskDetails
            dateChane={this.onChange}
            withOverFlow={taskDtlClassName}
          />
        </div>

        {this.state.showAddTask ? (
          <NewTask dateChane={this.onChange} closeTask={this.handleAddTask} />
        ) : null}
  
      </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    date: state.date,
  };
};

export default connect(mapStateToProps)(CalendarApp);
