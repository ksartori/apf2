// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import TextField from '../../shared/TextField'
import TextFieldWithInfo from '../../shared/TextFieldWithInfo'
import Status from '../../shared/Status'
import AutoCompleteFromArray from '../../shared/AutocompleteFromArray'
import RadioButton from '../../shared/RadioButton'
import RadioButtonGroupWithInfo from '../../shared/RadioButtonGroupWithInfo'
import FormTitle from '../../shared/FormTitle'
import TpopAbBerRelevantInfoPopover from './TpopAbBerRelevantInfoPopover'
import constants from '../../../modules/constants'
import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`

const enhance = compose(inject('store'), observer)

const Tpop = ({
  store,
  tree,
  dimensions = { width: 380 },
}: {
  store: Object,
  tree: Object,
  dimensions: Object,
}) => {
  const { activeDataset } = tree
  const ads = store.table.pop.get(activeDataset.row.PopId)
  const apArtId = ads && ads.ApArtId ? ads.ApArtId : null
  const ap = store.table.ap.get(apArtId)
  const apJahr = ap && ap.ApJahr ? ap.ApJahr : null
  const width = isNaN(dimensions.width) ? 380 : dimensions.width

  return (
    <ErrorBoundary>
      <Container innerRef={c => (this.container = c)}>
        <FormTitle tree={tree} title="Teil-Population" />
        <FieldsContainer data-width={width}>
          <TextField
            key={`${activeDataset.row.id}nr`}
            tree={tree}
            label="Nr."
            fieldName="nr"
            value={activeDataset.row.nr}
            errorText={activeDataset.valid.nr}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextFieldWithInfo
            key={`${activeDataset.row.id}TPopFlurname`}
            tree={tree}
            label="Flurname"
            fieldName="TPopFlurname"
            value={activeDataset.row.TPopFlurname}
            errorText={activeDataset.valid.TPopFlurname}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
            popover="Dieses Feld möglichst immer ausfüllen"
          />
          <Status
            key={`${activeDataset.row.id}status`}
            tree={tree}
            apJahr={apJahr}
            herkunftFieldName="TPopHerkunft"
            herkunftValue={activeDataset.row.TPopHerkunft}
            bekanntSeitFieldName="TPopBekanntSeit"
            bekanntSeitValue={activeDataset.row.TPopBekanntSeit}
            bekanntSeitValid={activeDataset.valid.TPopBekanntSeit}
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButton
            tree={tree}
            fieldName="TPopHerkunftUnklar"
            label="Status unklar"
            value={activeDataset.row.TPopHerkunftUnklar}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopHerkunftUnklarBegruendung`}
            tree={tree}
            label="Begründung"
            fieldName="TPopHerkunftUnklarBegruendung"
            value={activeDataset.row.TPopHerkunftUnklarBegruendung}
            errorText={activeDataset.valid.TPopHerkunftUnklarBegruendung}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <RadioButtonGroupWithInfo
            tree={tree}
            fieldName="TPopApBerichtRelevant"
            value={activeDataset.row.TPopApBerichtRelevant}
            dataSource={store.dropdownList.tpopApBerichtRelevantWerte}
            updatePropertyInDb={store.updatePropertyInDb}
            popover={TpopAbBerRelevantInfoPopover}
            label="Für AP-Bericht relevant"
          />
          <TextField
            key={`${activeDataset.row.id}TPopXKoord`}
            tree={tree}
            label="X-Koordinaten"
            fieldName="TPopXKoord"
            value={activeDataset.row.TPopXKoord}
            errorText={activeDataset.valid.TPopXKoord}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopYKoord`}
            tree={tree}
            label="Y-Koordinaten"
            fieldName="TPopYKoord"
            value={activeDataset.row.TPopYKoord}
            errorText={activeDataset.valid.TPopYKoord}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <AutoCompleteFromArray
            key={activeDataset.row.id}
            tree={tree}
            label="Gemeinde"
            fieldName="gemeinde"
            valueText={activeDataset.row.gemeinde}
            errorText={activeDataset.valid.gemeinde}
            dataSource={store.dropdownList.gemeinden}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopRadius`}
            tree={tree}
            label="Radius (m)"
            fieldName="TPopRadius"
            value={activeDataset.row.TPopRadius}
            errorText={activeDataset.valid.TPopRadius}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopHoehe`}
            tree={tree}
            label="Höhe (m.ü.M.)"
            fieldName="TPopHoehe"
            value={activeDataset.row.TPopHoehe}
            errorText={activeDataset.valid.TPopHoehe}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopExposition`}
            tree={tree}
            label="Exposition, Besonnung"
            fieldName="TPopExposition"
            value={activeDataset.row.TPopExposition}
            errorText={activeDataset.valid.TPopExposition}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopKlima`}
            tree={tree}
            label="Klima"
            fieldName="TPopKlima"
            value={activeDataset.row.TPopKlima}
            errorText={activeDataset.valid.TPopKlima}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopNeigung`}
            tree={tree}
            label="Hangneigung"
            fieldName="TPopNeigung"
            value={activeDataset.row.TPopNeigung}
            errorText={activeDataset.valid.TPopNeigung}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopBeschr`}
            tree={tree}
            label="Beschreibung"
            fieldName="TPopBeschr"
            value={activeDataset.row.TPopBeschr}
            errorText={activeDataset.valid.TPopBeschr}
            type="text"
            multiline
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopKatNr`}
            tree={tree}
            label="Kataster-Nr."
            fieldName="TPopKatNr"
            value={activeDataset.row.TPopKatNr}
            errorText={activeDataset.valid.TPopKatNr}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopEigen`}
            tree={tree}
            label="EigentümerIn"
            fieldName="TPopEigen"
            value={activeDataset.row.TPopEigen}
            errorText={activeDataset.valid.TPopEigen}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopKontakt`}
            tree={tree}
            label="Kontakt vor Ort"
            fieldName="TPopKontakt"
            value={activeDataset.row.TPopKontakt}
            errorText={activeDataset.valid.TPopKontakt}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopNutzungszone`}
            tree={tree}
            label="Nutzungszone"
            fieldName="TPopNutzungszone"
            value={activeDataset.row.TPopNutzungszone}
            errorText={activeDataset.valid.TPopNutzungszone}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopBewirtschafterIn`}
            tree={tree}
            label="BewirtschafterIn"
            fieldName="TPopBewirtschafterIn"
            value={activeDataset.row.TPopBewirtschafterIn}
            errorText={activeDataset.valid.TPopBewirtschafterIn}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopBewirtschaftung`}
            tree={tree}
            label="Bewirtschaftung"
            fieldName="TPopBewirtschaftung"
            value={activeDataset.row.TPopBewirtschaftung}
            errorText={activeDataset.valid.TPopBewirtschaftung}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            key={`${activeDataset.row.id}TPopTxt`}
            tree={tree}
            label="Bemerkungen"
            fieldName="TPopTxt"
            value={activeDataset.row.TPopTxt}
            errorText={activeDataset.valid.TPopTxt}
            type="text"
            multiline
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Tpop)
