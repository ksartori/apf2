// @flow
import React from 'react'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import TextField from '../../../shared/TextField'
import AutoComplete from '../../../shared/Autocomplete'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import dataGql from './data.graphql'
import updateEkfzaehleinheitByIdGql from './updateEkfzaehleinheitById.graphql'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  padding: 10px;
  height: 100%;
`

const enhance = compose(
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ refetchTree, setErrors, errors }) => async ({
      row,
      field,
      value,
      updateEkfzaehleinheit,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await updateEkfzaehleinheit({
          variables: {
            id: row.id,
            [field]: value,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateEkfzaehleinheitById: {
              ekfzaehleinheit: {
                id: row.id,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                zaehleinheitId:
                  field === 'zaehleinheitId' ? value : row.zaehleinheitId,
                apId: field === 'apId' ? value : row.apId,
                tpopkontrzaehlEinheitWerteByZaehleinheitId:
                  row.tpopkontrzaehlEinheitWerteByZaehleinheitId,
                apByApId: row.apByApId,
                __typename: 'Ekfzaehleinheit',
              },
              __typename: 'Ekfzaehleinheit',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['zaehleinheitId'].includes(field)) refetchTree()
    },
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (prevProps.id !== props.id) {
        props.setErrors({})
      }
    },
  })
)

const Ekfzaehleinheit = ({
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

      const row = get(data, 'ekfzaehleinheitById')
      const ekfzaehleinheitenOfAp = get(
        row,
        'apByApId.ekfzaehleinheitsByApId.nodes',
        []
      ).map(o => o.zaehleinheitId)
      const notToShow = [
        ...ekfzaehleinheitenOfAp,
        get(row, 'tpopkontrzaehlEinheitWerteByZaehleinheitId.id', null),
      ]
      let zaehleinheitWerte = get(
        data,
        'allTpopkontrzaehlEinheitWertes.nodes',
        []
      )
      // filter ap arten but the active one
      zaehleinheitWerte = zaehleinheitWerte.filter(
        o => !notToShow.includes(o.id)
      )
      zaehleinheitWerte = sortBy(zaehleinheitWerte, 'text')
      zaehleinheitWerte = zaehleinheitWerte.map(el => ({
        id: el.id,
        value: el.text,
      }))

      return (
        <ErrorBoundary>
          <Container>
            <FormTitle apId={row.apId} title="EKF-Zähleinheit" />
            <Mutation mutation={updateEkfzaehleinheitByIdGql}>
              {(updateEkfzaehleinheit, { data }) => (
                <FieldsContainer>
                  <AutoComplete
                    key={`${row.id}zaehleinheitId`}
                    label="Zähleinheit"
                    value={get(
                      row,
                      'tpopkontrzaehlEinheitWerteByZaehleinheitId.text',
                      ''
                    )}
                    objects={zaehleinheitWerte}
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'zaehleinheitId',
                        value,
                        updateEkfzaehleinheit,
                      })
                    }
                    error={errors.zaehleinheitId}
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
                        updateEkfzaehleinheit,
                      })
                    }
                    error={errors.bemerkungen}
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

export default enhance(Ekfzaehleinheit)
