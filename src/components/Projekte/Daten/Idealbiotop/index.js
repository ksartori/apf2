// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import TextField from '../../../shared/TextFieldGql'
import DateFieldWithPicker from '../../../shared/DateFieldWithPickerGql'
import FormTitle from '../../../shared/FormTitle'
import constants from '../../../../modules/constants'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import idealbiotopByIdGql from './idealbiotopById.graphql'
import updateIdealbiotopByIdGql from './updateIdealbiotopById.graphql'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
  column-width: ${props =>
    props['data-width'] > 2 * constants.columnWidth
      ? `${constants.columnWidth}px`
      : 'auto'};
`
const Section = styled.div`
  padding-top: 20px;
  padding-bottom: 7px;
  font-weight: bold;
  &:after {
    content: ':';
  }
`

const enhance = compose(
  withHandlers({
    saveToDb: props => ({ row, field, value, updateIdealbiotop }) =>
      updateIdealbiotop({
        variables: {
          id: row.id,
          [field]: value,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateIdealbiotopById: {
            idealbiotop: {
              id: row.id,
              apId: field === 'apId' ? value : row.apId,
              erstelldatum: field === 'erstelldatum' ? value : row.erstelldatum,
              hoehenlage: field === 'hoehenlage' ? value : row.hoehenlage,
              region: field === 'region' ? value : row.region,
              exposition: field === 'exposition' ? value : row.exposition,
              besonnung: field === 'besonnung' ? value : row.besonnung,
              hangneigung: field === 'hangneigung' ? value : row.hangneigung,
              bodenTyp: field === 'bodenTyp' ? value : row.bodenTyp,
              bodenKalkgehalt:
                field === 'bodenKalkgehalt' ? value : row.bodenKalkgehalt,
              bodenDurchlaessigkeit:
                field === 'bodenDurchlaessigkeit'
                  ? value
                  : row.bodenDurchlaessigkeit,
              bodenHumus: field === 'bodenHumus' ? value : row.bodenHumus,
              bodenNaehrstoffgehalt:
                field === 'bodenNaehrstoffgehalt'
                  ? value
                  : row.bodenNaehrstoffgehalt,
              wasserhaushalt:
                field === 'wasserhaushalt' ? value : row.wasserhaushalt,
              konkurrenz: field === 'konkurrenz' ? value : row.konkurrenz,
              moosschicht: field === 'moosschicht' ? value : row.moosschicht,
              krautschicht: field === 'krautschicht' ? value : row.krautschicht,
              strauchschicht:
                field === 'strauchschicht' ? value : row.strauchschicht,
              baumschicht: field === 'baumschicht' ? value : row.baumschicht,
              bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
              __typename: 'Idealbiotop',
            },
            __typename: 'Idealbiotop',
          },
        },
      }),
  })
)

const Idealbiotop = ({
  id,
  saveToDb,
  dimensions = { width: 380 },
}: {
  id: String,
  saveToDb: () => void,
  dimensions: Object,
}) => (
  <Query query={idealbiotopByIdGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <Container>
            <FieldsContainer>Lade...</FieldsContainer>
          </Container>
        )
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'idealbiotopById')

      return (
        <ErrorBoundary>
          <Container innerRef={c => (this.container = c)}>
            <FormTitle apId={row.apId} title="Idealbiotop" />
            <Mutation mutation={updateIdealbiotopByIdGql}>
              {(updateIdealbiotop, { data }) => (
                <FieldsContainer
                  data-width={isNaN(dimensions.width) ? 380 : dimensions.width}
                >
                  <DateFieldWithPicker
                    key={`${row.id}erstelldatum`}
                    label="Erstelldatum"
                    value={row.erstelldatum}
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          erstelldatum: value,
                        },
                      })
                    }
                  />
                  <Section>Lage</Section>
                  <TextField
                    key={`${row.id}hoehenlage`}
                    label="Höhe"
                    value={row.hoehenlage}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          hoehenlage: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}region`}
                    label="Region"
                    value={row.region}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          region: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}exposition`}
                    label="Exposition"
                    value={row.exposition}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          exposition: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}besonnung`}
                    label="Besonnung"
                    value={row.besonnung}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          besonnung: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}hangneigung`}
                    label="Hangneigung"
                    value={row.hangneigung}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          hangneigung: value,
                        },
                      })
                    }
                  />
                  <Section>Boden</Section>
                  <TextField
                    key={`${row.id}bodenTyp`}
                    label="Typ"
                    value={row.bodenTyp}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          bodenTyp: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}bodenKalkgehalt`}
                    label="Kalkgehalt"
                    value={row.bodenKalkgehalt}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          bodenKalkgehalt: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}bodenDurchlaessigkeit`}
                    label="Durchlässigkeit"
                    value={row.bodenDurchlaessigkeit}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          bodenDurchlaessigkeit: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}bodenHumus`}
                    label="Humus"
                    value={row.bodenHumus}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          bodenHumus: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}bodenNaehrstoffgehalt`}
                    label="Nährstoffgehalt"
                    value={row.bodenNaehrstoffgehalt}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          bodenNaehrstoffgehalt: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}wasserhaushalt`}
                    label="Wasserhaushalt"
                    value={row.wasserhaushalt}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          wasserhaushalt: value,
                        },
                      })
                    }
                  />
                  <Section>Vegetation</Section>
                  <TextField
                    key={`${row.id}konkurrenz`}
                    label="Konkurrenz"
                    value={row.konkurrenz}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          konkurrenz: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}moosschicht`}
                    label="Moosschicht"
                    value={row.moosschicht}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          moosschicht: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}Krautschicht`}
                    label="Krautschicht"
                    value={row.krautschicht}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          krautschicht: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}Strauchschicht`}
                    label="Strauchschicht"
                    value={row.strauchschicht}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          strauchschicht: value,
                        },
                      })
                    }
                  />
                  <TextField
                    key={`${row.id}baumschicht`}
                    label="Baumschicht"
                    value={row.baumschicht}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      updateIdealbiotop({
                        variables: {
                          id,
                          baumschicht: value,
                        },
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
                      updateIdealbiotop({
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
          </Container>
        </ErrorBoundary>
      )
    }}
  </Query>
)

export default enhance(Idealbiotop)
