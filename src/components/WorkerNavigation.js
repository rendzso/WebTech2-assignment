import React from 'react';
import WorkerActions from "../actions/WorkerActions";

class WorkerNavigation extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {
            workerID: ''
        }
    }


    _onChange() {
        this.setState({});
    }


    render() {
        return (
            <div className="card">
                <div className="card-header">Worker Navigation Bar</div>
                <div className="card-body">
                    <div className="pb-2 text-center">
                        <input className="w-70" type="text" defaultValue="Worker ID" onChange={(event) => {
                            this.state.workerID = event.target.value
                            this.setState({workerID: this.state.workerID});
                        }}/>
                    </div>
                    <div>
                        <button className="btn btn-dark btn-block" onClick={()=>{WorkerActions.showAvailable()}}>Show available works</button>
                    </div>
                    <div className="pt-2">
                        <button className="btn btn-dark btn-block" >List my selected works</button>
                    </div>
                </div>
                <div className="card-footer"></div>
            </div>
        )
    }

}

export default WorkerNavigation
