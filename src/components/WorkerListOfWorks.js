import React from 'react';
import WorkStore from "../stores/WorkStore";
import WorkerActions from "../actions/WorkerActions"

class WorkerListOfWorks extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {works: [], actualWorker: ''};
    }

    _onChange() {
        this.setState({works: WorkStore._work, actualWorker: WorkStore._actualWorker});
    }

    componentDidMount() {
        WorkStore.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        WorkStore.removeChangeListener(this._onChange)
    }


    render() {
        return (

            <div className="card">
                <div className="card-header">List of available works</div>
                <div className="card-body">
                    {this.state.works !== undefined &&
                    <ul className="list-group">
                        {
                            this.state.works.map((work) => {
                                return (
                                    <li key={work.customerID+work.orderID+work['items'].itemID}
                                        className="list-group-item pb-2"
                                    >
                                        CustomerID: {work.customerID}<br/>
                                        OrderID: {work.orderID}<br/>
                                        Shutter details:<br/>
                                        ItemID: {work['items'].itemID}<br/>
                                        Window details: Height: {work['items'].windowHeight} cm, Width: {work['items'].windowWidth} cm<br/>
                                        Shutter type: {work['items'].shutterType}, Shutter color: {work['items'].shutterColor}<br/>
                                        Shutter parts:
                                        <ul className="list-group">
                                            {work['items'].shutterParts.map((partname) => {
                                                return(
                                                <li key={work.customerID+work.orderID+work['items'].itemID+partname}
                                                    className="list-group-item">
                                                    {partname}
                                                </li>)
                                            })}
                                        </ul>
                                        <button className="btn btn-dark" disabled={this.state.actualWorker==undefined} onClick={()=>{WorkerActions.selectItem({"customerID": work.customerID,
                                            "orderID": work.orderID,
                                            "itemID": work["items"].itemID,
                                            "worker": this.state.actualWorker})}}>I want that!</button>
                                    </li>)
                            })
                        }
                    </ul>
                    }
                </div>

                <div className="card-footer"></div>
            </div>
        )
    }
}

export default WorkerListOfWorks
