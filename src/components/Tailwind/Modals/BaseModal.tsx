import React from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import styled from 'styled-components'
import { CloseIcon } from 'theme'

const Wrapper = styled.div`
  .backdrop-enter {
    opacity: 0.01;
  }

  .backdrop-enter.backdrop-enter-active {
    opacity: 1;
    transition: opacity 200ms ease-in;
  }

  .backdrop-leave {
    opacity: 1;
  }

  .backdrop-leave.backdrop-leave-active {
    opacity: 0.01;
    transition: opacity 200ms ease-out;
  }

  .modal-enter {
    top: -100vh;
  }

  .modal-enter.modal-enter-active {
    top: 0;
    transition: top 300ms ease-in;
  }

  .modal-leave {
    top: 0;
  }

  .modal-leave.modal-leave-active {
    top: -100vh;
    transition: top 300ms ease-out;
  }

  .modal-content {
    width: 400px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    .modal-content {
      width: 90%;
    }
  `};
`

interface BaseModalProps {
  isVisible: boolean
  canClose?: boolean
  canBlur?: boolean
  onDismiss: () => void
  children: React.ReactNode
}

const BaseModal = ({ isVisible, canClose = true, canBlur, onDismiss, children }: BaseModalProps) => {
  return (
    <Wrapper>
      <CSSTransitionGroup transitionName="backdrop" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
        {isVisible && <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-10"></div>}
      </CSSTransitionGroup>
      <CSSTransitionGroup transitionName="modal" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
        {isVisible && (
          <div
            className="fixed top-0 left-0 w-full h-full z-20 flex items-center justify-center"
            onClick={() => {
              if (canBlur) {
                onDismiss()
              }
            }}
          >
            <div className="modal-content bg-white rounded" onClick={e => e.stopPropagation()}>
              {canClose && (
                <div className="modal-content absolute flex justify-end p-4">
                  <CloseIcon size={20} onClick={onDismiss} />
                </div>
              )}
              {children}
            </div>
          </div>
        )}
      </CSSTransitionGroup>
    </Wrapper>
  )
}

export default BaseModal
