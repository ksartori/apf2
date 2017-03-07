// @flow
import React, { PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import clone from 'lodash/clone'
import styled from 'styled-components'
import compose from 'recompose/compose'

import StrukturbaumContainer from './StrukturbaumContainer'
import DeleteDatasetModal from './DeleteDatasetModal'
import Daten from './Daten'
import Karte from './Karte'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
// TODO: this does not always work
const ContainerLoading = styled(Container)`
  cursor: wait;
`
const Content = styled.div`
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
`
const KarteContainer = styled.div`
  border-color: #424242;
  border-width: 1px;
  border-style: solid;
  flex-basis: 600px;
  flex-grow: 6;
  flex-shrink: 1;
  height: 100%;
`

const enhance = compose(
  inject(`store`),
  observer
)

const Projekte = ({ store }) => {
  const projekteTabs = clone(store.urlQuery.projekteTabs)
  const strukturbaumIsVisible = projekteTabs && projekteTabs.includes(`strukturbaum`)
  const datenIsVisible = projekteTabs && projekteTabs.includes(`daten`)
  const karteIsVisible = projekteTabs && projekteTabs.includes(`karte`)
  const deleteDatasetModalIsVisible = !!store.datasetToDelete.id
  const MyContainer = store.loading.length > 0 ? ContainerLoading : Container

  return (
    <MyContainer>
      <Content>
        {
          strukturbaumIsVisible &&
          <StrukturbaumContainer />
        }
        {
          datenIsVisible &&
          <Daten />
        }
        {
          karteIsVisible &&
          <KarteContainer>
            <Karte
              popMarkers={store.map.pop.markers}
              tpopMarkers={store.map.tpop.markers}
            />
          </KarteContainer>
        }
        {
          deleteDatasetModalIsVisible &&
          <DeleteDatasetModal />
        }
      </Content>
    </MyContainer>
  )
}

Projekte.propTypes = {
  store: PropTypes.object.isRequired,
}

export default enhance(Projekte)
