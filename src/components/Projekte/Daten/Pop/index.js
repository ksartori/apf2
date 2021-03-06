// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import TextField from '../../../shared/TextField'
import TextFieldWithInfo from '../../../shared/TextFieldWithInfo'
import Status from '../../../shared/Status'
import RadioButton from '../../../shared/RadioButton'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import updatePopByIdGql from './updatePopById.graphql'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`

const enhance = compose(
  withState('errors', 'setErrors', ({})),
  withHandlers({
    saveToDb: ({
      setErrors,
      errors,
    }) => async ({
      row,
      field,
      value,
      updatePop,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        updatePop({
          variables: {
            id: row.id,
            [field]: value,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updatePopById: {
              pop: {
                id: row.id,
                apId: field === 'apId' ? value : row.apId,
                nr: field === 'nr' ? value : row.nr,
                name: field === 'name' ? value : row.name,
                status: field === 'status' ? value : row.status,
                statusUnklar: field === 'statusUnklar' ? value : row.statusUnklar,
                statusUnklarBegruendung:
                  field === 'statusUnklarBegruendung'
                    ? value
                    : row.statusUnklarBegruendung,
                bekanntSeit: field === 'bekanntSeit' ? value : row.bekanntSeit,
                x: field === 'x' ? value : row.x,
                y: field === 'y' ? value : row.y,
                apByApId: row.apByApId,
                __typename: 'Pop',
              },
              __typename: 'Pop',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors(({}))
    },
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (prevProps.id !== props.id) {
        props.setErrors(({}))
      }
    },
  }),
)

const Pop = ({
  id,
  saveToDb,
  errors,
}: {
  id: String,
  saveToDb: () => void,
  errors: Object,
}) => (
  <Query query={dataGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'popById')

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle apId={get(data, 'popById.apId')} title="Population" />
            <Mutation mutation={updatePopByIdGql}>
              {(updatePop, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}nr`}
                    label="Nr."
                    value={row.nr}
                    type="number"
                    saveToDb={value =>
                      saveToDb({ row, field: 'nr', value, updatePop })
                    }
                    error={errors.nr}
                  />
                  <TextFieldWithInfo
                    key={`${row.id}name`}
                    label="Name"
                    value={row.name}
                    type="text"
                    saveToDb={value =>
                      saveToDb({ row, field: 'name', value, updatePop })
                    }
                    error={errors.name}
                    popover="Dieses Feld möglichst immer ausfüllen"
                  />
                  <Status
                    apJahr={get(row, 'apByApId.startJahr')}
                    herkunftValue={row.status}
                    bekanntSeitValue={row.bekanntSeit}
                    saveToDbBekanntSeit={value =>
                      updatePop({
                        variables: {
                          id,
                          bekanntSeit: value,
                        },
                      })
                    }
                    saveToDbStatus={value =>
                      updatePop({
                        variables: {
                          id,
                          status: value,
                        },
                      })
                    }
                  />
                  <RadioButton
                    key={`${row.id}statusUnklar`}
                    label="Status unklar"
                    value={row.statusUnklar}
                    saveToDb={value =>
                      saveToDb({ row, field: 'statusUnklar', value, updatePop })
                    }
                    error={errors.statusUnklar}
                  />
                  <TextField
                    key={`${row.id}statusUnklarBegruendung`}
                    label="Begründung"
                    value={row.statusUnklarBegruendung}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'statusUnklarBegruendung',
                        value,
                        updatePop,
                      })
                    }
                    error={errors.statusUnklarBegruendung}
                  />
                  <TextField
                    key={`${row.id}x`}
                    label="X-Koordinaten"
                    value={row.x}
                    type="number"
                    saveToDb={value =>
                      saveToDb({ row, field: 'x', value, updatePop })
                    }
                    error={errors.x}
                  />
                  <TextField
                    key={`${row.id}y`}
                    label="Y-Koordinaten"
                    value={row.y}
                    type="number"
                    saveToDb={value =>
                      saveToDb({ row, field: 'y', value, updatePop })
                    }
                    error={errors.y}
                  />
                </FieldsContainer>
              )}
            </Mutation>
          </Container>
        </ErrorBoundary>
      )
    }}
  </Query>
)

export default enhance(Pop)
