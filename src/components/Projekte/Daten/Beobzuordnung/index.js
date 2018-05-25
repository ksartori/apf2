// @flow
import React from 'react'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import clone from 'lodash/clone'
import isEqual from 'lodash/isEqual'
import flatten from 'lodash/flatten'

import FormTitle from '../../../shared/FormTitle'
import TextField from '../../../shared/TextField'
import CheckboxWithInfo from '../../../shared/CheckboxWithInfo'
import AutoComplete from '../../../shared/Autocomplete'
import Beob from '../Beob'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import updateBeobByIdGql from './updateBeobById.graphql'
import setTreeKeyGql from './setTreeKey.graphql'

const Container = styled.div`
  height: 100%;
  overflow-x: auto;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
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
const FieldsContainer = styled.div`
  padding: 10px;
`
const Title = styled.div`
  padding: 10px 10px 0 10px;
  color: #b3b3b3;
  font-weight: bold;
  background-color: #424242;
  margin-top: 10px;
  padding-bottom: 10px;
`
const ZuordnenDiv = styled.div`
  margin-bottom: -10px;
`
const LabelPopoverRow = styled.div`
  padding: 2px 5px 2px 5px;
`
const LabelPopoverTitleRow = styled(LabelPopoverRow)`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #565656;
  color: white;
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

const getTpopZuordnenSource = (row: Object): Array<Object> => {
  // get all popIds of active ap
  const popList = get(
    row,
    'aeEigenschaftenByArtId.apByArtId.popsByApId.nodes',
    []
  )
  // get all tpop
  let tpopList = flatten(popList.map(p => get(p, 'tpopsByPopId.nodes', [])))
    // with coordinates
    .filter(t => !!t.x && !!t.y)
    .map(t => {
      // calculate their distance to this beob
      const dX = Math.abs(row.x - t.x)
      const dY = Math.abs(row.y - t.y)
      const distance = Math.round((dX ** 2 + dY ** 2) ** 0.5).toLocaleString(
        'de-ch'
      )
      // build label
      const tpopStatus = get(t, 'popStatusWerteByStatus.text', 'ohne Status')
      const popNr = get(t, 'popByPopId.nr', '(keine Nr)')
      const tpopNr = t.nr || '(keine Nr)'

      return {
        id: t.id,
        distance,
        label: `${distance}m: ${popNr}/${tpopNr} (${tpopStatus})`,
      }
    })
  // order them by distance
  tpopList = sortBy(tpopList, 'distance')
  // return array of id, label
  return tpopList.map(t => ({
    id: t.id,
    value: t.label,
  }))
}

const Beobzuordnung = ({
  id,
  tree,
  dimensions = { width: 380 },
  refetchTree
}: {
  id: String,
  tree: Object,
  dimensions: Object,
  refetchTree: () => void
}) => (
  <Query query={dataGql} variables={{ id }}>
    {({ loading, error, data, client }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'beobById')

      return (
        <ErrorBoundary>
          <FormContainer>
            <FormTitle
              apId={get(row, 'aeEigenschaftenByArtId.apByArtId.id', null)}
              title="Beobachtung"
            />
            <DataContainer>
              <Mutation mutation={updateBeobByIdGql}>
                {(updateBeob, { data }) => (
                  <FieldsContainer>
                    <div>{`Beobachtete Art: ${get(
                      row,
                      'aeEigenschaftenByArtId.artname'
                    )}`}</div>
                    <CheckboxWithInfo
                      key={`${row.id}nichtZuordnen`}
                      label="Nicht zuordnen"
                      value={row.nichtZuordnen}
                      saveToDb={value => {
                        const variables = {
                          id,
                          nichtZuordnen: value,
                        }
                        // if true, empty tpopId
                        if (value) variables.tpopId = null
                        updateBeob({ variables })
                        // need to update activeNodeArray and openNodes
                        const { activeNodeArray, openNodes } = tree
                        let newActiveNodeArray = clone(activeNodeArray)
                        newActiveNodeArray[4] = value
                          ? 'nicht-zuzuordnende-Beobachtungen'
                          : 'nicht-beurteilte-Beobachtungen'
                        newActiveNodeArray[5] = id
                        newActiveNodeArray = newActiveNodeArray.slice(0, 6)
                        const oldParentNodeUrl = clone(activeNodeArray)
                        oldParentNodeUrl.pop()
                        const newParentNodeUrl = clone(newActiveNodeArray)
                        newParentNodeUrl.pop()
                        const newOpenNodes = openNodes.map(n => {
                          if (isEqual(n, activeNodeArray)) return newActiveNodeArray
                          if (isEqual(n, oldParentNodeUrl)) return newParentNodeUrl
                          return n
                        })
                        client.mutate({
                          mutation: setTreeKeyGql,
                          variables: {
                            tree: tree.name,
                            value1: newActiveNodeArray,
                            key1: 'activeNodeArray',
                            value2: newOpenNodes,
                            key2: 'openNodes'
                          }
                        })
                        refetchTree()
                      }}
                      popover={nichtZuordnenPopover}
                    />
                    <ZuordnenDiv>
                      <AutoComplete
                        key={`${row.id}tpopId`}
                        label={
                          !!row.tpopId
                            ? 'Einer anderen Teilpopulation zuordnen'
                            : 'Einer Teilpopulation zuordnen'
                        }
                        value=""
                        objects={getTpopZuordnenSource(row)}
                        saveToDb={value => {
                          const variables = {
                            id,
                            tpopId: value,
                          }
                          // if value, set nichtZuordnen false
                          if (!!value) variables.nichtZuordnen = false
                          updateBeob({
                            variables,
                          })
                        }}
                      />
                    </ZuordnenDiv>
                    <TextField
                      key={`${row.id}bemerkungen`}
                      label="Bemerkungen zur Zuordnung"
                      value={row.bemerkungen}
                      type="text"
                      multiLine
                      saveToDb={value =>
                        updateBeob({
                          variables: {
                            id,
                            bemerkungen: value,
                          },
                        })
                      }
                    />
                  </FieldsContainer>
                )}
              </Mutation>
              <Title>{`Informationen aus ${get(
                row,
                'beobQuelleWerteByQuelleId.name',
                '?'
              )} (nicht veränderbar)`}</Title>
              <Beob id={id} dimensions={dimensions} />
            </DataContainer>
          </FormContainer>
        </ErrorBoundary>
      )
    }}
  </Query>
)

export default Beobzuordnung
