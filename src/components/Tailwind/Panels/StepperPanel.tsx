import React from 'react'
import SpinnerIcon from 'assets/svg/spinner-icon.svg'

export enum StepperPanelState {
  Enabled,
  Disabled,
  InProgress
}

interface StepperPanelProps {
  state: StepperPanelState
  title: string
  subtitle: string
  contents: string[]
  onClick: () => void
}

const StepperPanel = ({ state, title, subtitle, contents, onClick }: StepperPanelProps) => {
  const isEnabled = state === StepperPanelState.Enabled
  const isLoading = state === StepperPanelState.InProgress

  return <div className="">{contents}</div>
}

export default StepperPanel
