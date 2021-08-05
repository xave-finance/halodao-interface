import React, { useState } from 'react'
import ApproveButton, { ApproveButtonState } from 'components/Tailwind/Buttons/ApproveButton'
import PrimaryButton, { PrimaryButtonState, PrimaryButtonType } from 'components/Tailwind/Buttons/PrimaryButton'
import RetryButton from 'components/Tailwind/Buttons/RetryButton'

interface ButtonGroupProps {
  isVisible: boolean
  onDismiss: () => void
}

export enum ButtonGroupState {
  Default,
  Next,
  Retry,
  Confirming,
  InsufficientBalance
}

const ButtonGroup = () => {
  const [approveState, setApproveState] = useState(ApproveButtonState.NotApproved)
  const [state, setState] = useState(ButtonGroupState.Default)

  const NotApproveContent = () => {
    return (
      <div className="mt-4 flex space-x-4">
        <div className="w-1/2">
          <ApproveButton
            title="Approve"
            state={ApproveButtonState.NotApproved}
            onClick={() => {
              setApproveState(ApproveButtonState.Approving)
              setTimeout(() => {
                setApproveState(ApproveButtonState.Approved)
              }, 2000)
              setTimeout(() => {
                setState(ButtonGroupState.Next)
              }, 2000)
            }}
          />
        </div>
        <div className="w-1/2">
          <PrimaryButton title="Next" state={PrimaryButtonState.Disabled} onClick={() => console.log('clicked')} />
        </div>
      </div>
    )
  }

  const ApprovingContent = () => {
    return (
      <div className="mt-4 flex space-x-4">
        <div className="w-1/2">
          <ApproveButton
            title="Approve"
            state={ApproveButtonState.Approving}
            onClick={() => {
              console.log('clicked')
            }}
          />
        </div>
        <div className="w-1/2">
          <PrimaryButton title="Next" state={PrimaryButtonState.Disabled} onClick={() => console.log('clicked')} />
        </div>
      </div>
    )
  }

  const ApprovedContent = () => {
    return (
      <div className="mt-4 flex space-x-4">
        <div className="w-1/2">
          <ApproveButton
            title="Approve"
            state={ApproveButtonState.Approved}
            onClick={() => {
              console.log('clicked')
            }}
          />
        </div>
        <div className="w-1/2">
          <PrimaryButton title="Next" state={PrimaryButtonState.Disabled} onClick={() => console.log('clicked')} />
        </div>
      </div>
    )
  }

  const NextContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Next"
          state={PrimaryButtonState.Enabled}
          onClick={() => {
            setState(ButtonGroupState.Confirming)
          }}
        />
      </div>
    )
  }

  const ConfirmingContent = () => {
    return (
      <div className="mt-4">
        <PrimaryButton
          type={PrimaryButtonType.Gradient}
          title="Confirming"
          state={PrimaryButtonState.InProgress}
          onClick={() => console.log('clicked')}
        />
      </div>
    )
  }
  const RetryContent = () => {
    return (
      <div className="mt-4">
        <RetryButton title="Retry" isEnabled={true} onClick={() => console.log('clicked')} />
      </div>
    )
  }

  const MainContent = () => {
    let content = <></>
    if (approveState === ApproveButtonState.NotApproved && state === ButtonGroupState.Default) {
      content = <NotApproveContent />
    }
    if (approveState === ApproveButtonState.Approving && state === ButtonGroupState.Default) {
      content = <ApprovingContent />
    }
    if (approveState === ApproveButtonState.Approved && state === ButtonGroupState.Default) {
      content = <ApprovedContent />
    }
    if (approveState === ApproveButtonState.Approved && state === ButtonGroupState.Next) {
      content = <NextContent />
    }
    if (approveState === ApproveButtonState.Approved && state === ButtonGroupState.Confirming) {
      content = <ConfirmingContent />
    }
    if (approveState === ApproveButtonState.Approved && state === ButtonGroupState.Retry) {
      content = <RetryContent />
    }
    return <>{content}</>
  }

  return <MainContent />
}

export default ButtonGroup
