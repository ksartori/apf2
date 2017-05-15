// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { Scrollbars } from 'react-custom-scrollbars'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import Label from '../../shared/Label'
import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'

const Container = styled.div`
  height: 100%;
`
const FieldsContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 45px;
`

const enhance = compose(inject('store'), observer)

const Popmassnber = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <Container>
      <FormTitle tree={tree} title="Massnahmen-Bericht Population" />
      <Scrollbars>
        <FieldsContainer>
          <TextField
            tree={tree}
            label="Jahr"
            fieldName="PopMassnBerJahr"
            value={activeDataset.row.PopMassnBerJahr}
            errorText={activeDataset.valid.PopMassnBerJahr}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <Label label="Entwicklung" />
          <RadioButtonGroup
            tree={tree}
            fieldName="PopMassnBerErfolgsbeurteilung"
            value={activeDataset.row.PopMassnBerErfolgsbeurteilung}
            errorText={activeDataset.valid.PopMassnBerErfolgsbeurteilung}
            dataSource={store.dropdownList.tpopmassnErfbeurtWerte}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Interpretation"
            fieldName="PopMassnBerTxt"
            value={activeDataset.row.PopMassnBerTxt}
            errorText={activeDataset.valid.PopMassnBerTxt}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
        </FieldsContainer>
      </Scrollbars>
    </Container>
  )
}

export default enhance(Popmassnber)
