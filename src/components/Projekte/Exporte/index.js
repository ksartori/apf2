import React from 'react'
import styled from 'styled-components'

import FormTitle from '../../shared/FormTitle'
import Tipps from './Tipps'
import Ap from './Ap'
import Populationen from './Populationen'
import Teilpopulationen from './Teilpopulationen'
import Kontrollen from './Kontrollen'
import Massnahmen from './Massnahmen'
import Beobachtungen from './Beobachtungen'
import Anwendung from './Anwendung'
import Optionen from './Optionen'
import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  @media print {
    display: none !important;
  }
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow-x: auto;
  height: 100%;
  padding-bottom: 10px;
  overflow: auto !important;
`
const ExporteContainer = styled.div`
  border-left-color: rgb(46, 125, 50);
  border-left-width: 1px;
  border-left-style: solid;
  border-right-color: rgb(46, 125, 50);
  border-right-width: 1px;
  border-right-style: solid;
  height: 100%;
`

const Exporte = () => (
  <ExporteContainer>
    <ErrorBoundary>
      <Container>
        <FormTitle title="Exporte" />
        <FieldsContainer>
          <Optionen />
          <Tipps />
          <Ap />
          <Populationen />
          <Teilpopulationen />
          <Kontrollen />
          <Massnahmen />
          <Beobachtungen />
          <Anwendung />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  </ExporteContainer>
)

export default Exporte
