// @flow
import React from 'react'
import { Query, Mutation } from 'react-apollo'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import AutoComplete from '../../../../shared/Autocomplete'
import TextField from '../../../../shared/TextField'
import updateTpopkontrzaehlByIdGql from './updateTpopkontrzaehlById.graphql'
import dataGql from './data.graphql'

const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
`
const Container = styled(Area)`
  grid-area: ${props => `count${props.nr}`};
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-areas:
    'einheitLabel einheitLabel einheitLabel einheitVal einheitVal einheitVal einheitVal einheitVal'
    'gezaehltLabel gezaehltLabel gezaehltLabel gezaehltLabel geschaetztLabel geschaetztLabel geschaetztLabel geschaetztLabel'
    'gezaehltVal gezaehltVal gezaehltVal gezaehltVal geschaetztVal geschaetztVal geschaetztVal geschaetztVal';
`
const Label = styled.div`
  font-weight: 700;
  padding-right: 4px;
`
const EinheitLabel = styled(Label)`
  grid-area: einheitLabel;
  hyphens: auto;
`
const EinheitVal = styled.div`
  grid-area: einheitVal;
  > div {
    margin-top: -5px;
    padding-bottom: 0;
  }
`
const GezaehltLabel = styled.div`
  grid-area: gezaehltLabel;
  justify-self: center;
  align-self: end;
  padding-top: 8px;
`
const GezaehltVal = styled.div`
  grid-area: gezaehltVal;
  > div {
    margin-top: -15px;
    padding-bottom: 0 !important;
  }
  > div > div > input {
    text-align: center;
  }
`
const GeschaetztLabel = styled.div`
  grid-area: geschaetztLabel;
  justify-self: center;
  align-self: end;
  padding-top: 8px;
`
const GeschaetztVal = styled.div`
  grid-area: geschaetztVal;
  > div {
    margin-top: -15px;
    padding-bottom: 0 !important;
  }
  > div > div > input {
    text-align: center;
  }
`

const enhance = compose(
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ setErrors, errors }) => async ({
      row,
      field,
      field2,
      value,
      value2,
      updateTpopkontrzaehl,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      // catch case when empty anzahl field blurs
      if (value === null && field2 && row[field2] !== value2) return
      try {
        const variables = {
          id: row.id,
          [field]: value,
        }
        if (field2) {
          variables[field2] = value2
        }
        await updateTpopkontrzaehl({
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopkontrzaehlById: {
              tpopkontrzaehl: {
                id: row.id,
                anzahl: field === 'anzahl' ? value : row.anzahl,
                einheit: field === 'einheit' ? value : row.einheit,
                methode: field2 === 'methode' ? value2 : row.methode,
                tpopkontrzaehlEinheitWerteByEinheit:
                  row.tpopkontrzaehlEinheitWerteByEinheit,
                __typename: 'Tpopkontrzaehl',
              },
              __typename: 'Tpopkontrzaehl',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
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

const Count = ({
  id,
  nr,
  saveToDb,
  errors,
  updateTpopkontr,
}: {
  id: String,
  nr: Number,
  saveToDb: () => void,
  errors: Object,
  updateTpopkontr: () => void,
}) => (
  <Query query={dataGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading) return <Container>Lade...</Container>
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'tpopkontrzaehlById')
      let zaehleinheitWerte = get(
        data,
        'allTpopkontrzaehlEinheitWertes.nodes',
        []
      )
      zaehleinheitWerte = sortBy(zaehleinheitWerte, 'sort').map(el => ({
        id: el.code,
        value: el.text,
      }))

      return (
        <Mutation mutation={updateTpopkontrzaehlByIdGql}>
          {updateTpopkontrzaehl => (
            <Container nr={nr}>
              <EinheitLabel>{`Zähleinheit ${nr}`}</EinheitLabel>
              <EinheitVal>
                <AutoComplete
                  key={`${row.id}einheit`}
                  value={get(row, 'tpopkontrzaehlEinheitWerteByEinheit.text')}
                  objects={zaehleinheitWerte}
                  saveToDb={value =>
                    saveToDb({
                      row,
                      field: 'einheit',
                      value,
                      updateTpopkontrzaehl,
                    })
                  }
                  error={errors.bearbeiter}
                />
              </EinheitVal>
              <GezaehltLabel>gezählt</GezaehltLabel>
              <GeschaetztLabel>geschätzt</GeschaetztLabel>
              <GezaehltVal>
                <TextField
                  key={`${row.id}anzahl`}
                  value={row.methode === 2 ? row.anzahl : null}
                  type="number"
                  saveToDb={value => {
                    // convert to number
                    const valueNr = !value && value !== 0 ? null : +value
                    saveToDb({
                      row,
                      field: 'anzahl',
                      value: valueNr,
                      field2: 'methode',
                      value2: 2,
                      updateTpopkontrzaehl,
                    })
                  }}
                  error={errors.anzahl}
                />
              </GezaehltVal>
              <GeschaetztVal>
                <TextField
                  key={`${row.id}anzahl`}
                  value={row.methode === 1 ? row.anzahl : null}
                  type="number"
                  saveToDb={value => {
                    // convert to number
                    const valueNr = !value && value !== 0 ? null : +value
                    saveToDb({
                      row,
                      field: 'anzahl',
                      value: valueNr,
                      field2: 'methode',
                      value2: 1,
                      updateTpopkontrzaehl,
                    })
                  }}
                  error={errors.anzahl}
                />
              </GeschaetztVal>
            </Container>
          )}
        </Mutation>
      )
    }}
  </Query>
)

export default enhance(Count)
