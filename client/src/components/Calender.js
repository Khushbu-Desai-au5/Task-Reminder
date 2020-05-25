import React, { Component } from "react";
import { connect } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import NewTask from "./NewTask";
import TaskDetails from "./TaskDetails";
import "../App.css";
import axios from "axios";
class CalendarApp extends Component {
  state = {
    showAddTask: false,
  };
  handleAddTask = () => {
    this.setState({ showAddTask: !this.state.showAddTask });
  };
  onChange = (date) => {
    console.log(date);
    this.props.dispatch({ type: "date", payload: date });
    axios.get("/task/all/" + date).then((res) => {
      this.props.dispatch({
        type: "allTask",
        payload: res.data.message.map((e) => e),
      });
    });
  };
  render() {
    let taskDtlClassName;
    return (
      <div className="home">
        <div className="calendarContainer">
          <Calendar
            className="calendar"
            onChange={(date) => this.onChange(date)}
          />
          <button
            className="btn btn-primary"
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    date: state.date,
  };
};

export default connect(mapStateToProps)(CalendarApp);
