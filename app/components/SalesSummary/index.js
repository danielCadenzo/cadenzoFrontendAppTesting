/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import SalesGraphTypes from './SalesGraphTypes';
import './SalesSummary.scss'
// const HOURLY_VALUES = ["12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"]

const LINE_COLORS = ['#1D82A5', '#22AF9A', '#7685A2']
class SalesSummary extends Component {
  static propTypes = {
    seriesData: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number
    })),
    isComparative: PropTypes.bool, // Two series the second is historical
    isMultiSeries: PropTypes.bool, // Is multiseries (Lines)
    format: PropTypes.oneOf(Object.values(SalesGraphTypes)),
    seriesNames: PropTypes.arrayOf(PropTypes.string),
    onValueHoverChange: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
    }

  }

  get monthDayDateFormat(){
    return ({ 
      month: 'short', 
      day: '2-digit'
    });
  }

  get shouldAddTickValues() {
    const { seriesData } = this.props;
    if(seriesData.length === 1) {
      if(seriesData[0].length > 0) {
        if(seriesData[0][0].tick){
          return false;
        }
      }
    }
    return true;
  }

  formatDateString(dtVal){
    return new Date(dtVal).toLocaleString([], this.monthDayDateFormat)
  }

  getPastMonthTicks = () => {
    const xAxisArr = [];
    const date = new Date();
    let dayCounter = 0
    date.setDate( date.getDate() - 28 );
    while(dayCounter < 28) {
      // TODO: Check if data exists for hour else make zero
      xAxisArr.push(date.toLocaleString([], this.monthDayDateFormat));
      date.setDate( date.getDate() + 1 );
      dayCounter++;
    }
    return xAxisArr
  }

  getPast4WeeksTicks = () => {
    const xAxisArr = [];
    const date = new Date();
    let dayCounter = 0
    date.setDate( date.getDate() - 28 );
    while(dayCounter < 28) {
      // TODO: Check if data exists for hour else make zero
      xAxisArr.push(date.toLocaleString([], this.monthDayDateFormat));
      date.setDate( date.getDate() + 1 );
      dayCounter++;
    }
    return xAxisArr
  }
  
  get24HrTicks = () => {
    const xAxisArr = [];
    const date = new Date();
    let dayCounter = 0
    date.setHours(0,0,0,0)
    while(dayCounter < 24) {
      // TODO: Check if data exists for hour else make zero
      xAxisArr.push(date.toLocaleString([], { 
        hour: '2-digit', 
        minute: '2-digit'
      }));
      date.addHours(1);
      dayCounter++;
    }
    return xAxisArr
  }

  getChartTickValues = () => {
    const { format } = this.props;
    switch(format) {
      case SalesGraphTypes.PAST_MONTH: {
        return this.getPast4WeeksTicks();
      }
      case SalesGraphTypes.PAST_DAY: {
        return this.get24HrTicks();
      }
      default:
        return this.get24HrTicks();
    }
  }

  /**
   *  Grabs datetime tick values for time range then fills the supplied Object
   *  with 0 values at each datetime.
   * @param {Object} dataSetMap 
   */
  fillMissingValues = (dataSetMap) => {
    const { seriesNames } = this.props;
    const tickValues = this.getChartTickValues();
    tickValues.forEach((tick) => {
      if(!dataSetMap.hasOwnProperty(tick)){
        dataSetMap[tick] = { tick, date: new Date(tick) }
        seriesNames.forEach((name) => {
          dataSetMap[tick] = {...dataSetMap[tick], [name]: 0 }
        })
      } else {
        // Check that all series have a corresponding value
        seriesNames.forEach((name) => {
          if(!dataSetMap[tick].hasOwnProperty(name))
            dataSetMap[tick] = {...dataSetMap[tick], [name]: 0 }
        });
      }
    })
    return dataSetMap;
  }

  setChartRef = (node) => {
    this.removeMouseListener();
    this.chartRef = node
    this.addMouseDownListener();
  }

  addMouseDownListener = () => {
    if(this.chartRef) document.addEventListener('mousemove', this.handleChartSelection);
  }

  removeMouseListener = () => {
    if(this.chartRef) document.removeEventListener('mousemove', this.handleChartSelection);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.removeMouseListener();
  }

  handleChartSelection = (hoverEvent) => {
    if(this.chartRef) {
      const state = Object.assign({},this.chartRef.state);
      const { activePayload } = state;
      if(activePayload && activePayload.length > 0) {
        const { onValueHoverChange } = this.props
        onValueHoverChange(activePayload, hoverEvent);
      }
    }
  }

  // combines all provided series
  // item.name is the transformed date
  joinSeries = () => {
    const { seriesData, seriesNames } = this.props;
    const dataMap = {}
    const data = [...seriesData];
    data.forEach((series, sIndex) => {
      series.forEach((item) => {
        item.name = this.formatDateString(item.date);
        // eslint-disable-next-line no-prototype-builtins
        if(dataMap.hasOwnProperty(item.name)){
          dataMap[item.name] = { ...dataMap[item.name], [seriesNames[sIndex]]: item.value  }
        } else {
          dataMap[item.name] = { [seriesNames[sIndex]]: item.value, tick: item.name, date: new Date(item.name) };
        }
      })
    });

    const filledData = this.fillMissingValues(dataMap);
    return Object.values(filledData);
  }

  renderLines(){
    const { seriesNames } = this.props;
    return seriesNames.map((series, sIndex) => <Line dot={false} strokeWidth={2} connectNulls type="category" dataKey={series} stroke={LINE_COLORS[sIndex]} />)
  }

  collateSeries = () => {
    const { isMultiSeries, seriesData } = this.props
    const dataMap = seriesData.reduce((acc, item) => {
      const { label, date, value } = item
      const dateTime = this.formatDateString(date);
      const accVal = acc[dateTime] || {}
      acc[dateTime] = { ...accVal, [label]: value, tick: dateTime};
      return acc;
    }, {})
    const filledData = this.fillMissingValues(dataMap);
    return Object.values(filledData).sort(this.sortDataByDate); 
  }

  sortDataByDate = (a, b) => {
    if (a.tick < b.tick) return -1
    if (a.tick > b.tick) return 1
    return 0
  }

  


  render() {
    const { isMultiSeries, seriesData } = this.props
    const data = isMultiSeries ? this.joinSeries() : this.collateSeries()
    return (
      <div style={{width:'100%', minHeight: 100}}>
        <ResponsiveContainer>
          <LineChart ref={this.setChartRef}  data={data || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            {this.renderLines()}
            <CartesianGrid stroke="#ccc" strokeDasharray="1 0" />
            <XAxis tick={{stroke: 'black', strokeWidth: 2}}  tickFormatter={(e) => ''} dataKey="tick"  />
            <YAxis tickFormatter={(e) => ''} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

SalesSummary.defaultProps = {
  isComparative: true,
  isMultiSeries: false,
  accessor: (ele) => ele.label,
  format: SalesGraphTypes.PAST_MONTH,
  onValueHoverChange: () => {},
  seriesData: [],
  seriesNames: [],
}

export default SalesSummary;
