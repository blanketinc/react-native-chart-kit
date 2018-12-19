import React, { Component } from 'react'

import {
  LinearGradient,
  Line,
  Text,
  Defs,
  Stop
} from 'react-native-svg'

class AbstractChart extends Component {
  calcScaler = data => (100 - 0) || 1

  renderHorizontalLines = config => {
    const { count = 1, width, height, paddingTop, paddingRight } = config
    return [...new Array(count)].map((_, i) => {
      return (
        <Line
          key={Math.random()}
          x1={paddingRight - 2}
          y1={height - (height / 4) + paddingTop}
          x2={width - 7}
          y2={height - (height / 4) + paddingTop}
          stroke={this.props.chartConfig.color(0.7)}
          // strokeDasharray="5, 10"
          strokeWidth={3}
        />
      )
    })
  }

  renderHorizontalLabels = config => {
    const { count, data, height, paddingTop, paddingRight, yLabelsOffset = 12 } = config
    var decimalPlaces = (this.props.chartConfig.decimalPlaces !== undefined) ? this.props.chartConfig.decimalPlaces : 2;
    return [...new Array(count)].map((_, i) => {
      return (
        <Text
          key={Math.random()}
          x={paddingRight - yLabelsOffset}
          textAnchor="end"
          y={(height * 3 / 4) - ((height - paddingTop) / count * i) + 12}
          fontSize={12}
          fill={this.props.chartConfig.color(0.5)}
        >{count === 1 ? data[0].toFixed(decimalPlaces) + '%' : ((this.calcScaler(data) / (count - 1)) * i + Math.min(...data)).toFixed(decimalPlaces) + '%'}
        </Text>
      )
    })
  }

  renderVerticalLabels = config => {
    const { labels = [], width, height, paddingRight, paddingTop, horizontalOffset = 0 } = config
    const fontSize = 12
    return labels.map((label, i) => {
      return (
        <Text
          key={Math.random()}
          x={((width - paddingRight) / labels.length * (i)) + paddingRight + horizontalOffset}
          y={(height * 3 / 4) + paddingTop + (fontSize * 2)}
          fontSize={fontSize}
          fill={this.props.chartConfig.color(0.5)}
          textAnchor="middle"
        >{label}
        </Text>
      )
    })
  }

  renderVerticalLines = config => {
    const { data, width, height, paddingTop, paddingRight, labels } = config
    return [...new Array(1)].map((_, i) => {
      return (
        <Line
          key={Math.random()}
          x1={Math.floor((width - paddingRight) / 1 * (i) + paddingRight)}
          y1={0}
          x2={Math.floor((width - paddingRight) / 1 * (i) + paddingRight)}
          y2={height - (height / 4) + paddingTop}
          stroke={this.props.chartConfig.color(0.7)}
          // strokeDasharray="5, 10"
          strokeWidth={3}
        />
      )
    })
  }

  renderDefs = config => {
    const { width, height, backgroundGradientFrom, backgroundGradientTo } = config
    return (
      <Defs>
        <LinearGradient id="backgroundGradient" x1="0" y1={height} x2={width} y2={0}>
          <Stop offset="0" stopColor={backgroundGradientFrom}/>
          <Stop offset="1" stopColor={backgroundGradientTo}/>
        </LinearGradient>
        <LinearGradient id="fillShadowGradient" x1={0} y1={0} x2={0} y2={height}>
          <Stop offset="0" stopColor={this.props.chartConfig.color()} stopOpacity="0.1"/>
          <Stop offset="1" stopColor={this.props.chartConfig.color()} stopOpacity="0"/>
        </LinearGradient>
      </Defs>
    )
  }
}

export default AbstractChart
