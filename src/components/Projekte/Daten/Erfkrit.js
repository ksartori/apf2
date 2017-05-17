// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import RadioButtonGroup from '../../shared/RadioButtonGroup'
import Label from '../../shared/Label'
import TextField from '../../shared/TextField'
import FormTitle from '../../shared/FormTitle'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  overflow: auto !important;
`

const enhance = compose(inject('store'), observer)

const Erfkrit = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree
  return (
    <Container>
      <FormTitle tree={tree} title="Erfolgs-Kriterium" />
      <FieldsContainer>
        <Label label="Beurteilung" />
        <RadioButtonGroup
          tree={tree}
          fieldName="ErfkritErreichungsgrad"
          value={activeDataset.row.ErfkritErreichungsgrad}
          errorText={activeDataset.valid.ErfkritErreichungsgrad}
          dataSource={store.dropdownList.apErfkritWerte}
          updatePropertyInDb={store.updatePropertyInDb}
        />
        <TextField
          tree={tree}
          label="Kriterien"
          fieldName="ErfkritTxt"
          value={activeDataset.row.ErfkritTxt}
          errorText={activeDataset.valid.ErfkritTxt}
          type="text"
          multiLine
          fullWidth
          updateProperty={store.updateProperty}
          updatePropertyInDb={store.updatePropertyInDb}
        />
      </FieldsContainer>
    </Container>
  )
}

export default enhance(Erfkrit)
