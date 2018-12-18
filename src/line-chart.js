import React from 'react'
import { View } from 'react-native'
import {
  Svg,
  Circle,
  Polygon,
  Polyline,
  Path,
  Rect,
  G
} from 'react-native-svg'
import AbstractChart from './abstract-chart'

class LineChart extends AbstractChart {

  renderDots = config => {
    const { data, width, height, paddingTop, paddingRight, labels } = config
    let output = [];
    data.map((dataset,index)=>{
      dataset.data.map((x, i) => {
        output.push (
          <Circle
            key={Math.random()}
            cx={paddingRight + (i * (width - paddingRight) / labels.length)}
            cy={((height / 4 * 3 * (1 - ((x - Math.min(...dataset.data)) / this.calcScaler(dataset.data)))) + paddingTop)}
            r="4"
            fill={this.props.chartConfig.color(0.7)}
          />)
      })
    })
    return (
      output
    )


  }

  renderShadow = config => {
    if (this.props.bezier) {
      return this.renderBezierShadow(config)
    }
    const { data, width, height, paddingRight, paddingTop, labels } = config
    let output = [];
    config.data.map((dataset,index)=>{
      output.push (
        <Polygon
          key={index}
          points={dataset.data.map((x, i) =>
            (paddingRight + (i * (width - paddingRight) / labels.length)) +
            ',' +
            (((height / 4 * 3 * (1 - ((x - Math.min(...dataset.data)) / this.calcScaler(dataset.data)))) + paddingTop))
          ).join(' ') + ` ${paddingRight + ((width - paddingRight) / labels.length * (labels.length - 1))},${(height / 4 * 3) + paddingTop} ${paddingRight},${(height / 4 * 3) + paddingTop}`}
          fill="url(#fillShadowGradient)"
          strokeWidth={0}
        />)
    })
    return (
      output
    )


  }

  renderLine = config => {
    if (this.props.bezier) {
      return this.renderBezierLine(config)
    }
    const { width, height, paddingRight, paddingTop, data, labels } = config
    let output = [];
    data.map((dataset,index) => {

      const points = dataset.data.map((x, i) =>
        (paddingRight + (i * (width - paddingRight) / labels.length)) +
        ',' +
        (((height / 4 * 3 * (1 - ((x - Math.min(...dataset.data)) / this.calcScaler(dataset.data))))) + paddingTop))

      output.push (
        <Polyline
          key = {index}
          points={points.join(' ')}
          fill="none"
          stroke={this.props.chartConfig.color(0.2)}
          strokeWidth={3}
        />
      )

    })

    return (
      output
    )


  }

  getBezierLinePoints = (dataset, config) => {

    const { width, height, paddingRight, paddingTop, data, labels } = config
    let output = [];
    if (dataset.data.length === 0) {
      return 'M0,0'
    }
    const x = i => Math.floor(paddingRight + i * (width - paddingRight) / labels.length)
    const y = i => Math.floor(((height / 4 * 3 * (1 - ((dataset.data[i] - Math.min(...dataset.data)) / this.calcScaler(dataset.data)))) + paddingTop))

    return [`M${x(0)},${y(0)}`].concat(dataset.data.slice(0, -1).map((_, i) => {
      const x_mid = (x(i) + x(i + 1)) / 2
      const y_mid = (y(i) + y(i + 1)) / 2
      const cp_x1 = (x_mid + x(i)) / 2
      const cp_x2 = (x_mid + x(i + 1)) / 2
      return `Q ${cp_x1}, ${y(i)}, ${x_mid}, ${y_mid}` +
        ` Q ${cp_x2}, ${y(i + 1)}, ${x(i + 1)}, ${y(i + 1)}`
    })).join(' ')


  }

  renderBezierLine = config => {
    let output = [];
    config.data.map((dataset,index)=>{
      let result = this.getBezierLinePoints(dataset,config);
      output.push (
        <Path
          key = {index}
          d={result}
          fill="none"
          stroke={this.props.chartConfig.color(0.2)}
          strokeWidth={3}
        />
      )
    });
    return (
      output
    )


  }

  renderBezierShadow = config => {
    const { width, height, paddingRight, paddingTop, data, labels } = config
    let output = [];
    data.map((dataset,index)=>{
      let d = this.getBezierLinePoints(dataset,config) +
        ` L${paddingRight + ((width - paddingRight) / labels.length * (labels.length - 1))},${(height / 4 * 3) + paddingTop} L${paddingRight},${(height / 4 * 3) + paddingTop} Z`
      output.push (
        <Path
          key={index}
          d={d}
          fill="url(#fillShadowGradient)"
          strokeWidth={0}
        />)
    })
    return (
      output
    )

  }

  render() {
    const paddingTop = 16
    const paddingRight = 55
    const { width, height, data, withShadow = true, withDots = true, style = {} } = this.props
    const { labels = [] } = data
    const { borderRadius = 0 } = style
    const config = {
      width,
      height
    }
    return (
      <View style={style}>
        <Svg
          height={height}
          width={width}
        >
          <G>
            {this.renderDefs({
              ...config,
              ...this.props.chartConfig
            })}
            <Rect
              width="100%"
              height={height}
              rx={borderRadius}
              ry={borderRadius}
              fill="url(#backgroundGradient)"/>
            {this.renderHorizontalLines({
              ...config,
              count: 1,
              paddingTop,
              paddingRight,
              labels: labels,
            })}
            {this.renderHorizontalLabels({
              ...config,
              count: (Math.min(...data.datasets[0].data) === Math.max(...data.datasets[0].data)) ?
                1 : 4,
              data: data.datasets[0].data,
              paddingTop,
              paddingRight,
              labels: labels,
            })}
            {this.renderVerticalLines({
              ...config,
              data: data.datasets[0].data,
              paddingTop,
              paddingRight,
              labels: labels,
            })}
            {this.renderVerticalLabels({
              ...config,
              labels,
              paddingRight,
              paddingTop,
              labels: labels,
            })}
            {this.renderLine({
              ...config,
              paddingRight,
              paddingTop,
              // data: data.datasets[0].data
              data: data.datasets,
              labels: labels,

            })}
            {withShadow && this.renderShadow({
              ...config,
              data: data.datasets,
              paddingRight,
              paddingTop,
              labels: labels,
            })}
            {withDots && this.renderDots({
              ...config,
              data: data.datasets,
              paddingTop,
              paddingRight,
              labels: labels,
            })}
          </G>
        </Svg>
      </View>
    )
  }
}

export default LineChart
