// @flow
import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import TextField from 'material-ui/TextField'
import Linkify from 'react-linkify'
import styled from 'styled-components'
import { Card, CardText } from 'material-ui/Card'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import FormTitle from '../../shared/FormTitle'
import appBaseUrl from '../../../modules/appBaseUrl'
import standardQkYear from '../../../modules/standardQkYear'
import fetchQk from '../../../modules/fetchQk'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
`
const StyledCard = styled(Card)`margin-bottom: 10px !important;`
const Title = styled.div`font-weight: bold;`
const FilterField = styled(TextField)`
  margin-top: -15px;
  margin-bottom: 10px;
`
const LoadingIndicator = styled.div`
  margin-bottom: 15px;
  color: ${props =>
    props.loading ? 'rgba(0, 0, 0, 0.87)' : 'rgb(46, 125, 50)'};
`
const linkifyProperties = {
  target: '_blank',
  style: {
    color: 'inherit',
    fontWeight: 100,
  },
}

const enhance = compose(
  inject('store'),
  withState('berichtjahr', 'changeBerichtjahr', standardQkYear()),
  withHandlers({
    onChangeBerichtjahr: props => (event, val) => {
      const { berichtjahr, changeBerichtjahr, store, tree } = props
      changeBerichtjahr(val)
      if ((isNaN(val) && val.length === 4) || (!isNaN(val) && val > 1000)) {
        // reset messages
        store.qk.setMessages([])
        // call fetchQk and pass it berichtjahr and apArtId
        const apArtId = tree.activeNodes.ap
        fetchQk({ store, berichtjahr, apArtId })
      }
    },
    onChangeFilter: props => (event, val) => props.store.qk.setFilter(val),
  }),
  withLifecycle({
    onDidMount({ berichtjahr, changeBerichtjahr, store, tree }) {
      // reset messages
      store.qk.setMessages([])
      // call fetchQk and pass it berichtjahr and apArtId
      const apArtId = tree.activeNodes.ap
      fetchQk({ store, berichtjahr, apArtId })
    },
  }),
  observer
)

const Qk = ({
  store,
  tree,
  berichtjahr,
  onChangeBerichtjahr,
  onChangeFilter,
}: {
  store: Object,
  tree: Object,
  berichtjahr: number,
  onChangeBerichtjahr: () => void,
  onChangeFilter: () => void,
}) => {
  const { filter, messages, loading } = store.qk
  const pureMessages = toJS(messages)
  const messagesFiltered = filter
    ? pureMessages.filter(m =>
        m.hw.toLowerCase().includes(filter.toLowerCase())
      )
    : pureMessages
  const loadingMessage = loading
    ? 'Die Daten werden analysiert...'
    : 'Analyse abgeschlossen'

  return (
    <Container>
      <FormTitle tree={tree} title="Qualitätskontrollen" />
      <FieldsContainer>
        <TextField
          floatingLabelText="Berichtjahr"
          type="number"
          value={berichtjahr}
          fullWidth
          onChange={onChangeBerichtjahr}
        />
        <FilterField
          floatingLabelText="nach Abschnitts-Titel filtern"
          type="text"
          value={filter}
          fullWidth
          onChange={onChangeFilter}
        />
        <LoadingIndicator loading={loading}>{loadingMessage}</LoadingIndicator>
        {messagesFiltered.map((m, index) => (
          <StyledCard key={index}>
            <CardText>
              <Title>{m.hw}</Title>
              <div>
                <Linkify properties={linkifyProperties}>
                  {m.url.map((u, i) => (
                    <div key={i}>{`${appBaseUrl}/${u.join('/')}`}</div>
                  ))}
                </Linkify>
              </div>
            </CardText>
          </StyledCard>
        ))}
      </FieldsContainer>
    </Container>
  )
}

export default enhance(Qk)
