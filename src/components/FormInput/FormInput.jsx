import React, { Component } from 'react'

import './FormInput.scss'

class FormInput extends Component {
  constructor(props) {
    super(props)
  }

  onChange(index) {
    return ((e) => {
      const { data, val, onChange } = this.props
      const values = this.getValues(data, val)
      values[index + 1] = this.doubleDot(e.target.value)
      onChange(data.key, this.getValue(values), data.affection)
    }).bind(this)
  }

  doubleDot(value) {
    const pair = value.toString().split('.')
    if (pair.length > 1) {
      return pair[0] + '.' + pair[1]
    }
    return value
  }

  onStep(index, isIncreate) {
    return ((e) => {
      const { data, val, onChange } = this.props
      const values = this.getValues(data, val)
      let value = values[index + 1].toString()
      if (data.inputs[index].arrow && data.inputs[index].suffix) value = Number(value.split(data.inputs[index].suffix).join(''))
      values[index + 1] = value * 1.0 + (isIncreate ? 1 : -1) * (data.inputs[index].step || 1)
      onChange(data.key, this.getValue(values), data.affection)
    }).bind(this)
  }

  setPrecision(value, prec) {
    if (!prec) return value
    const up = parseInt(value)
    const down = ('000' + parseInt(value * Math.pow(10, prec)).toString()).substr(-prec)
    return up + '.' + down
  }

  getValues(data, val) {
    if (data.inputs.length == 1) return [1, this.setPrecision(val, data.inputs[0].precision)]
    let value = val
    const ret = [data.inputs.length]
    for (let i = 0; i < data.inputs.length; i++) {
      const input = data.inputs[i]
      ret.push(parseInt(value / input.unit).toString() + ((input.arrow && input.suffix) ? input.suffix : ''))
      value = value % input.unit
    }
    return ret
  }

  getValue(values) {
    const { data } = this.props
    let ret = 0
    for (let i = 0; i < values[0]; i++) {
      let value = values[i + 1].toString()
      if (data.inputs[i].arrow && data.inputs[i].suffix) value = Number(value.split(data.inputs[i].suffix).join(''))
      if (Number(value) < 0) value = 0
      ret += value * data.inputs[i].unit
    }
    return ret
  }

  render() {
    const { data, val } = this.props
    const values = this.getValues(data, val)
    const inputCount = values[0]

    return (
      <div className="FormInputWrapper">
        {
          data.inputs.map((item, index) => (
            <div className={`FormInput ${item.arrow ? 'Arrow' : ''}`} style={{ width: `${100 / inputCount}%` }}>
              <input value={values[index + 1]} onChange={this.onChange(index)} min="0" max={item.max} readOnly={data.readOnly}/>
              {
                item.arrow || !item.suffix ? null
                  : <div class="Suffix">{item.suffix}</div>
              }
              <div className="after" onClick={this.onStep(index, true)} />
              <div className="before" onClick={this.onStep(index, false)} />
            </div>
          ))
        }
      </div>
    )
  }
}

export default FormInput