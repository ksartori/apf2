// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import TextField from '../../../shared/TextFieldGql'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import zielberByIdGql from './zielberById.graphql'
import updateZielberByIdGql from './updateZielberById.graphql'

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
  withHandlers({
    saveToDb: props => ({ row, field, value, updateZielber }) =>
      updateZielber({
        variables: {
          id: row.id,
          [field]: value,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateZielberById: {
            zielber: {
              id: row.id,
              zielId: field === 'zielId' ? value : row.zielId,
              jahr: field === 'jahr' ? value : row.jahr,
              erreichung: field === 'erreichung' ? value : row.erreichung,
              bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
              zielByZielId: row.zielByZielId,
              __typename: 'Zielber',
            },
            __typename: 'Zielber',
          },
        },
      }),
  })
)

const Zielber = ({ id, saveToDb }: { id: String, saveToDb: () => void }) => (
  <Query query={zielberByIdGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'zielberById')

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle
              apId={get(row, 'zielByZielId.apId')}
              title="Ziel-Bericht"
            />
            <Mutation mutation={updateZielberByIdGql}>
              {(updateZielber, { data }) => (
                <FieldsContainer>
                  <TextField
                    key={`${row.id}jahr`}
                    label="Jahr"
                    value={row.jahr}
                    type="number"
                    saveToDb={value =>
                      saveToDb({ row, field: 'jahr', value, updateZielber })
                    }
                  />
                  <TextField
                    key={`${row.id}erreichung`}
                    label="Entwicklung"
                    value={row.erreichung}
                    type="text"
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'erreichung',
                        value,
                        updateZielber,
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}bemerkungen`}
                    label="Bemerkungen"
                    value={row.bemerkungen}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'bemerkungen',
                        value,
                        updateZielber,
                      })
                    }
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

export default enhance(Zielber)
