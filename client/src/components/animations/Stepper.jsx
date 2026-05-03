import React, { useState, Children } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ────────────────────────────────
   ReactBits Stepper — adapted for
   project dark theme (accent-primary)
   ──────────────────────────────── */

const stepVariants = {
  enter: (dir) => ({ x: dir >= 0 ? '-100%' : '100%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (dir) => ({ x: dir >= 0 ? '50%' : '-50%', opacity: 0 }),
}

/* ── Main component ── */
export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [direction, setDirection] = useState(0)
  const stepsArray = Children.toArray(children)
  const totalSteps = stepsArray.length
  const isCompleted = currentStep > totalSteps
  const isLastStep = currentStep === totalSteps

  const updateStep = (newStep) => {
    setCurrentStep(newStep)
    if (newStep > totalSteps) onFinalStepCompleted()
    else onStepChange(newStep)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1)
      updateStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1)
      updateStep(currentStep + 1)
    }
  }

  const handleComplete = () => {
    setDirection(1)
    updateStep(totalSteps + 1)
  }

  return (
    <div className="rb-stepper" {...rest}>
      <div className="rb-stepper-card">
        {/* ── Step indicator row ── */}
        <div className="rb-stepper-indicators">
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1
            const isNotLast = index < totalSteps - 1
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: (clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1)
                      updateStep(clicked)
                    },
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={(clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1)
                      updateStep(clicked)
                    }}
                  />
                )}
                {isNotLast && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            )
          })}
        </div>

        {/* ── Animated content ── */}
        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {/* ── Footer with navigation ── */}
        <div className="rb-stepper-footer">
          {isCompleted ? (
            <div className="rb-stepper-complete">
              <svg className="rb-complete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>All done! Browse the fleet to get started.</span>
              <button
                onClick={() => { setCurrentStep(1); setDirection(-1); onStepChange(1) }}
                className="rb-stepper-back"
                type="button"
              >
                Start over
              </button>
            </div>
          ) : (
            <div className={`rb-stepper-nav ${currentStep !== 1 ? 'spread' : 'end'}`}>
              {currentStep !== 1 && (
                <button onClick={handleBack} className="rb-stepper-back" type="button">
                  {backButtonText}
                </button>
              )}
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className="rb-stepper-next"
                type="button"
              >
                {isLastStep ? 'Complete ✓' : nextButtonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Individual step content wrapper ── */
export function Step({ children }) {
  return <div className="rb-step-content">{children}</div>
}

/* ── Animated height container ── */
function StepContentWrapper({ isCompleted, currentStep, direction, children }) {
  return (
    <div className="rb-stepper-content-area">
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Slide transition per step ── */
function SlideTransition({ children, direction }) {
  return (
    <motion.div
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  )
}

/* ── Step circle indicator ── */
function StepIndicator({ step, currentStep, onClickStep, disableStepIndicators }) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete'

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) onClickStep(step)
  }

  return (
    <motion.div onClick={handleClick} className="rb-step-indicator" animate={status} initial={false}>
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: 'rgba(140, 167, 205, 0.12)', color: '#6b7a8d' },
          active: { scale: 1, backgroundColor: 'var(--accent-primary)', color: 'var(--accent-primary)' },
          complete: { scale: 1, backgroundColor: 'var(--accent-primary)', color: '#fff' },
        }}
        transition={{ duration: 0.3 }}
        className="rb-step-indicator-inner"
      >
        {status === 'complete' ? (
          <CheckIcon className="rb-check-icon" />
        ) : status === 'active' ? (
          <div className="rb-active-dot" />
        ) : (
          <span className="rb-step-num">{step}</span>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ── Connector line between indicators ── */
function StepConnector({ isComplete }) {
  return (
    <div className="rb-step-connector">
      <motion.div
        className="rb-step-connector-fill"
        initial={false}
        animate={isComplete ? { width: '100%', backgroundColor: 'var(--accent-primary)' } : { width: 0, backgroundColor: 'transparent' }}
        transition={{ duration: 0.4 }}
      />
    </div>
  )
}

/* ── Check SVG ── */
function CheckIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: 'tween', ease: 'easeOut', duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}
