// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { Scrollbars } from 'react-custom-scrollbars'

import TextField from '../../shared/TextField'
import TextFieldWithUrl from '../../shared/TextFieldWithUrl'
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

const Ber = ({ store, tree }: { store: Object, tree: Object }) => {
  const { activeDataset } = tree

  return (
    <Container>
      <FormTitle tree={tree} title="Bericht" />
      <Scrollbars>
        <FieldsContainer>
          <TextField
            tree={tree}
            label="AutorIn"
            fieldName="BerAutor"
            value={activeDataset.row.BerAutor}
            errorText={activeDataset.valid.BerAutor}
            type="text"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Jahr"
            fieldName="BerJahr"
            value={activeDataset.row.BerJahr}
            errorText={activeDataset.valid.BerJahr}
            type="number"
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextField
            tree={tree}
            label="Titel"
            fieldName="BerTitel"
            value={activeDataset.row.BerTitel}
            errorText={activeDataset.valid.BerTitel}
            type="text"
            multiLine
            fullWidth
            updateProperty={store.updateProperty}
            updatePropertyInDb={store.updatePropertyInDb}
          />
          <TextFieldWithUrl
            tree={tree}
            label="URL"
            fieldName="BerURL"
            value={activeDataset.row.BerURL}
            errorText={activeDataset.valid.BerURL}
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

export default enhance(Ber)
