import React from 'react';

class ManagerNavigation extends React.Component {

    constructor() {
        super();

        // Initial state
        this.state = {open: false};

    }

    toggle() {
        this.setState({
            open: !this.state.open
        });
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">Manager Navigation Bar</div>
                <div className="card-body">
                    <div>
                        <button className="btn btn-dark btn-block">List orders & jobs</button>
                    </div>
                    <div className="pt-2">
                        <button className="btn btn-dark btn-block">Check statistic</button>
                    </div>
                    <div className="pt-2">
                        <button className="btn btn-primary" onClick={this.toggle.bind(this)}>
                            Open/Close
                        </button>
                    </div>
                    <div id="demo" className={"collapse" + (this.state.open ? ' in' : '')}>
                        <div className="card card-body">
                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
                            squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente
                            ea proident.
                        </div>
                    </div>
                </div>
                <div className="card-footer"></div>
            </div>
        )
    }

}

export default ManagerNavigation
