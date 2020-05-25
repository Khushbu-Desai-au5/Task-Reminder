import React, { Component } from 'react';
import NewTask from './NewTask'

class Tasks extends Component {
    state = {
        showAddTask: false
    }
    handleAddTask = () => {
        this.setState({ showAddTask: !this.state.showAddTask })
    }
    render() {
        return (
            <div>
                <button type="button" onClick={this.handleAddTask}>Add Task</button>

                <div>

                    {this.state.showAddTask ? <NewTask closeTask={this.handleAddTask} /> : null}

                </div>
            </div>
        )
    }
}
export default Tasks;