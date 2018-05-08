import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import withHandlers from 'recompose/withHandlers'
import withLifecycle from '@hocs/with-lifecycle'

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
import exportModule from '../../../modules/export'
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

const enhance = compose(
  inject('store'),
  withHandlers({
    downloadFromView: ({
      store,
    }) => ({ view, fileName, apIdName, apId, kml }) =>
      exportModule({
        store,
        view,
        fileName,
        apIdName,
        apId,
        kml,
      }),
  }),
  withLifecycle({
    onDidMount({ store }) {
      if (store.table.ae_eigenschaften.size === 0) {
        store.fetchTable('ae_eigenschaften')
      }
      if (store.table.ap.size === 0) {
        store.fetchTableByParentId('ap', store.tree.activeNodes.projekt)
      }
    },
  }),
  observer,
  withProps(props => {
    const { store } = props
    const { ae_eigenschaften } = store.table
    const aps = Array.from(store.table.ap.values()).filter(ap => !!ap.art_id)
    const aes = Array.from(ae_eigenschaften.values())
    let artList = aps.map(ap => {
      const ae = aes.find(a => a.id === ap.art_id)
      return {
        id: ap.id,
        value: ae && ae.artname ? ae.artname : '',
      }
    })
    artList = sortBy(artList, 'value')
    return { artList }
  })
)

const Exporte = ({
  store,
  artList,
  downloadFromView,
}: {
  store: Object,
  artList: Array<Object>,
  downloadFromView: () => void,
}) => (
  <ErrorBoundary>
    <Container>
      <FormTitle tree={store.tree} title="Exporte" />
      <FieldsContainer>
        <Optionen />
        <Tipps />
        <Ap store={store} downloadFromView={downloadFromView} />
        <Populationen store={store} downloadFromView={downloadFromView} />
        <Teilpopulationen store={store}
          downloadFromView={downloadFromView}
        />
        <Kontrollen store={store} downloadFromView={downloadFromView} />
        <Massnahmen store={store} downloadFromView={downloadFromView} />
        <Beobachtungen store={store} downloadFromView={downloadFromView} />
        <Anwendung store={store} downloadFromView={downloadFromView} />
      </FieldsContainer>
    </Container>
  </ErrorBoundary>
)

export default enhance(Exporte)
