import React from "react";
import axios from "axios";
import { connect } from "react-redux";

class DeleteTask extends React.Component {

    deleteTask = () =>{
        //console.log(this.props.taskDtl.id)
        axios.delete('/task/delete/' + this.props.taskDtl.id)
        .then(res =>{
           // console.log(res);
            this.props.dateChange(this.props.date);
            this.props.closeDeleteModel()
        })
    }
  render() {
    return (
      <div className="bg-model">
        <div className="bg-delete">
          <div
            className="cancel"
            style={{ cursor: "pointer" }}
            onClick={this.props.closeDeleteModel}
          >
            +
          </div>
          <h5 style={{ alignSelf: "flex-start" }}>
            Are You Sure you want to Delete?
          </h5>
          <div>
            <button className="btn btn-danger mr-1" type="button" onClick={() =>this.deleteTask()}>
              Yes
            </button>
            <button className="btn btn-primary mr-1" type="button" onClick={this.props.closeDeleteModel}>
              No
            </button>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
    return {
    
      date: state.date
  
    };
  };
  
  export default connect(mapStateToProps)(DeleteTask);
  
