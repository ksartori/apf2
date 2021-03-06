// @flow
import React, { Component } from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'

const Container = styled.div`
  margin: 10px;
`
const ErrorTitle = styled.div`
  margin-bottom: 10px;
`
const ReloadButton = styled(Button)`
  margin-top: 10px !important;
`

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }

  render() {
    const { errorInfo } = this.state
    if (errorInfo) {
      return (
        <Container>
          <ErrorTitle>
            Oh je, es ist ein Fehler aufgetreten! Bericht:
          </ErrorTitle>
          <div>{errorInfo.componentStack}</div>
          <ReloadButton
            variant="outlined"
            onClick={() => {
              window.location.reload(false)
            }}
          >
            Neu laden
          </ReloadButton>
        </Container>
      )
    }
    const { children } = this.props

    // Normally, just render children
    // and pass all props
    return children
  }
}

export default ErrorBoundary
