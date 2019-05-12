import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, VerticalBarSeries, LabelSeries} from "react-vis";
import React from 'react';
import WorkStore from "../stores/WorkStore";
import StatisticStore from "../stores/StatisticStore";

class ManagerStatistic extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {stats: []};
    }

    _onChange() {
        this.setState({stats: StatisticStore._stats});
    }

    getHeight(){
        let allvalue = []
        this.state.stats.map( item =>{
            allvalue.push(item.y)
            console.log(item.y)
        })
        let max = (Math.max.apply(null, allvalue)+100)
        return max
    }

    componentDidMount() {
        WorkStore.addChangeListener(this._onChange)
    }

    componentWillUnmount() {
        WorkStore.removeChangeListener(this._onChange)
    }

    render() {
        const chartWidth = 800;
        const chartHeight = this.getHeight();
        const chartDomain = [0, chartHeight];
        return (
            <div className="card text-center w-100 p-5" id="boxes"><XYPlot
                xType="ordinal"
                width={chartWidth}
                height={chartHeight}
                yDomain={chartDomain}
            >
                <XAxis />
                <YAxis />
                <VerticalBarSeries
                    data={this.state.stats}
                />
                <LabelSeries
                    data={this.state.stats.map(obj => {
                        return { ...obj, label: obj.y.toString()+"$" }
                    })}
                    labelAnchorX="middle"
                    labelAnchorY="text-after-edge"
                />
            </XYPlot>
            </div>
        );
    }

}

export default ManagerStatistic
