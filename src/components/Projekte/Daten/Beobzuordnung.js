// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import FormTitle from '../../shared/FormTitle'
import RadioButtonGroup from '../../shared/RadioButtonGroup'
import TextField from '../../shared/TextField'
import RadioButtonWithInfo from '../../shared/RadioButtonWithInfo'
import Beob from './Beob'

const Container = styled.div`
  height: 100%;
  overflow-x: auto;
`
const FormContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const DataContainer = styled.div`
  height: 100%;
  overflow: auto !important;
`
const FieldsContainer = styled.div`padding: 10px;`
const Title = styled.div`
  padding: 10px 10px 0 10px;
  color: #b3b3b3;
  font-weight: bold;
  background-color: #424242;
  margin-top: 10px;
  padding-bottom: 10px;
`
const ZuordnenDiv = styled.div`margin-bottom: -10px;`
const LabelPopoverRow = styled.div`padding: 2px 5px 2px 5px;`
const LabelPopoverTitleRow = styled(LabelPopoverRow)`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: grey;
`
const LabelPopoverContentRow = styled(LabelPopoverRow)`
  display: flex;
  border-color: grey;
  border-width: thin;
  border-style: solid;
  border-top-style: none;
  &:last-child {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
`
const MaxHeightDiv = styled.div`
  max-height: 250px;
  div + div {
    max-height: 250px;
    overflow-y: auto !important;
  }
`
const nichtZuordnenPopover = (
  <Container>
    <LabelPopoverTitleRow>Legende</LabelPopoverTitleRow>
    <LabelPopoverContentRow>
      {'Will heissen: Die Beobachtung kann nicht zugeordnet werden.'}
      <br />
      {'Mögliche Gründe: Unsichere Bestimmung, nicht lokalisierbar.'}
      <br />
      {'Bitte im Bemerkungsfeld begründen.'}
    </LabelPopoverContentRow>
  </Container>
)

const getTpopZuordnenSource = (store: Object, tree: Object): Array<Object> => {
  const { activeDataset, activeNodes } = tree
  // get all popIds of active ap
  const popList = Array.from(store.table.pop.values()).filter(
    p => p.ApArtId === activeNodes.ap
  )
  const popIdList = popList.map(p => p.PopId)
  // get all tpop
  let tpopList = Array.from(store.table.tpop.values())
    // of active ap
    .filter(t => popIdList.includes(t.PopId))
    // with coordinates
    .filter(t => t.TPopXKoord && t.TPopYKoord)
  // calculate their distance to this beobzuordnung
  const id =
    activeDataset.table === 'beobzuordnung'
      ? activeDataset.row.BeobId
      : activeDataset.row.id
  const beob = store.table.beob.get(id)
  // beob loads later
  // prevent an error occuring if it does not yet exist
  // by passing back an empty array
  if (!beob) {
    return []
  }
  tpopList.forEach(t => {
    const dX = Math.abs(beob.X - t.TPopXKoord)
    const dY = Math.abs(beob.Y - t.TPopYKoord)
    t.distance = Math.round((dX ** 2 + dY ** 2) ** 0.5)
    t.popNr = store.table.pop.get(t.PopId).PopNr
    // build label
    const popStatusWerte = Array.from(store.table.pop_status_werte.values())
    let popStatusWert
    if (popStatusWerte) {
      popStatusWert = popStatusWerte.find(x => x.HerkunftId === t.TPopHerkunft)
    }
    if (popStatusWert && popStatusWert.HerkunftTxt) {
      t.herkunft = popStatusWert.HerkunftTxt
    } else {
      t.herkunft = 'ohne Status'
    }
    const popNr = t.popNr || t.popNr === 0 ? t.popNr : '(keine Nr)'
    const tpopNr = t.TPopNr || t.TPopNr === 0 ? t.TPopNr : '(keine Nr)'
    t.label = `${t.distance.toLocaleString(
      'de-ch'
    )}m: ${popNr}/${tpopNr} (${t.herkunft})`
  })
  // order them by distance
  tpopList = sortBy(tpopList, 'distance')
  // return array of TPopId, label
  return tpopList.map(t => ({
    value: t.TPopId,
    label: t.label,
  }))
}

const enhance = compose(
  inject('store'),
  withHandlers({
    updatePropertyInDb: props => (
      treePassedByUpdatePropertyInDb,
      fieldname,
      val
    ) => {
      const { store, tree } = props
      const {
        insertBeobzuordnung,
        updatePropertyInDb,
        deleteBeobzuordnung,
      } = store
      const { activeDataset } = tree
      if (val) {
        if (activeDataset.table === 'beob') {
          insertBeobzuordnung(tree, fieldname, val)
        } else {
          // beobzuordnung was moved from one TPopId to another
          updatePropertyInDb(tree, fieldname, val)
        }
      } else {
        deleteBeobzuordnung(tree, activeDataset.row.BeobId)
      }
    },
  }),
  observer
)

const Beobzuordnung = ({
  store,
  tree,
  updatePropertyInDb,
}: {
  store: Object,
  tree: Object,
  updatePropertyInDb: () => void,
}) => {
  const { table } = store
  const { activeDataset } = tree
  const beobzuordnung = activeDataset.row
  const quelle = table.beob_quelle.get(beobzuordnung.QuelleId)
  const quelleName = quelle && quelle.name ? quelle.name : '?'
  const beobTitle = `Informationen aus ${quelleName} (nicht veränderbar)`
  const showTPopId = activeDataset.row.BeobNichtZuordnen !== 1

  return (
    <FormContainer>
      <FormTitle tree={tree} title="Beobachtung" />
      <DataContainer>
        <FieldsContainer>
          <RadioButtonWithInfo
            tree={tree}
            fieldName="BeobNichtZuordnen"
            label="Nicht zuordnen"
            value={activeDataset.row.BeobNichtZuordnen}
            updatePropertyInDb={updatePropertyInDb}
            popover={nichtZuordnenPopover}
          />
          {showTPopId &&
            <ZuordnenDiv>
              <MaxHeightDiv>
                <RadioButtonGroup
                  tree={tree}
                  fieldName="TPopId"
                  value={activeDataset.row.TPopId}
                  label="Einer Teilpopulation zuordnen"
                  dataSource={getTpopZuordnenSource(store, tree)}
                  updatePropertyInDb={updatePropertyInDb}
                />
              </MaxHeightDiv>
            </ZuordnenDiv>}
          <TextField
            tree={tree}
            label="Bemerkungen zur Zuordnung"
            fieldName="BeobBemerkungen"
            value={activeDataset.row.BeobBemerkungen}
            errorText={activeDataset.valid.BeobBemerkungen}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
        <Title>
          {beobTitle}
        </Title>
        <Beob tree={tree} />
      </DataContainer>
    </FormContainer>
  )
}

export default enhance(Beobzuordnung)
