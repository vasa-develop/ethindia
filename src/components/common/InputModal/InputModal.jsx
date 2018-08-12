import React, { Component } from 'react'
import Modal from 'react-modal'

import './InputModal.scss'

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '30px 20px 0',
    minWidth: 500,
  }
}

class InputModal extends Component {
  render() {
    const props = this.props
    return (
      <div className="InputModalWrapper">
        <Modal
          isOpen={props.isOpen}
          onRequestClose={props.onRequestClose}
          style={customStyles}
          contentLabel={props.contentLabel}
        >
          {
            props.isLoading &&
            <div className="Loading">
              <div className="Loader" />
            </div>
          }
          <h2>{props.title}</h2>
          <button onClick={props.onRequestClose}></button>
          <div className="ModalBody">
            <div style={{ width: '100%' }}>
              <div className="FillLoanAmount">
                <div className="Label">Amount</div>
                <div className="FormInputWrapper">
                  <div className={`FormInput ${props.suffix}`}>
                    <input
                      type="number"
                      onChange={props.onChange}
                      value={props.value}
                      min="0"
                      max={props.max}
                    />
                    <div className="Suffix">{props.suffix}</div>
                    <div className="after"></div>
                    <div className="before"></div>
                  </div>
                </div>
              </div>
              <div className="Buttons">
                <div
                  className={`Confirm ${(props.disabled || props.value <= 0) ? 'Disabled' : ''}`}
                  disabled={(props.disabled || props.value <= 0) ? true : false}
                  onClick={(props.disabled || props.value <= 0) ? null : props.onSubmit}
                >Submit</div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default InputModal