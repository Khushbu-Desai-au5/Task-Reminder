import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit,faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import EditTask from './editTask';
import DeleteTask from './DeleteTask';

class TaskDetails extends Component {

    state = {
        isEditBtnClicked:false,
        isDeleteBtnClicked:false,
        task:{}
    }
    handleTaskCompleted(ele) {
      //  console.log(ele.id)
        axios.put("/task/update/" + ele.id, { taskCompleted: true })
        .then( res =>   axios.get("/task/all/" + this.props.date).then(res =>
            this.props.dispatch({
                "type": "allTask", "payload": res.data.message
            })
        )

        )
    }
    componentDidMount() {
        axios.get("/task/all/" + this.props.date).then(res =>
            // axios.get("/task/all").then(res =>
            this.props.dispatch({
                "type": "allTask", "payload": res.data.message

            })
        )
    }

    editTask = (task) =>{
        this.setState({isEditBtnClicked:true,task:task})
    }
    closeEditTask = () =>{
        this.setState({isEditBtnClicked:false})
    }
    deleteTask = (task) =>{
        this.setState({isDeleteBtnClicked:true,task:task})
    }
    closeDeleteTaskModel = () =>{
        this.setState({isDeleteBtnClicked:false})
    }

    render() {
        return (
            this.state.isDeleteBtnClicked ? <DeleteTask dateChange={this.props.dateChane} taskDtl={this.state.task} closeDeleteModel={this.closeDeleteTaskModel} />:
            this.state.isEditBtnClicked ? <EditTask dateChange={this.props.dateChane} taskDtl={this.state.task} closeTask={this.closeEditTask}/> :  
            <div className={`taskDetail ${this.props.withOverFlow}`} >

                {this.props.allTask ? this.props.allTask.map((ele, index) => {
                    let backgoundCss = ele.taskCompleted ? 'btn btn-success' : 'btn btn-info';
                    return (

                        <div className="subTask" style={{ "width": "18rem" }} key={ele.id} >
                            <div className="card" style={{ "backgroundColor": "lightgoldenrodyellow" }}>
                                <div className="iconClass">
                                {
                                !ele.taskCompleted ?
                                <FontAwesomeIcon className="editIcon" icon={faEdit} 
                                onClick={() =>this.editTask(ele)}
                                /> : null
                              }
                                <FontAwesomeIcon className="deleteIcon" icon={faTrashAlt}
                                onClick={() =>this.deleteTask(ele)} />

                                </div>
                                <div className="card-body" >
                                    <h5 className="card-title">{ele.title}</h5>
                                    <p className="card-text">Start Time :{ele.start_time}</p>
                                    <p className="card-text">End Time :{ele.end_time}</p>
                                    <p className="card-text">Attendees :{ele.attendees}</p>
                                    <p className="card-text">Metting Link :{ele.meeting_link}</p>
                                    <button className={`btn btn-primary ${backgoundCss}`} onClick={() => this.handleTaskCompleted(ele)} disabled={ele.taskCompleted}>Task Completed</button>
                                </div>
                            </div>

                        </div>
                    )
                }) : null}

            </div>
        )
    }
}


const mapStateToProps = (state) => {
 //   console.log(state.allTask)
    return {
        allTask: state.allTask,
        taskCompleted: state.taskCompleted,
        date: state.date
    }
}
export default connect(mapStateToProps)(TaskDetails);