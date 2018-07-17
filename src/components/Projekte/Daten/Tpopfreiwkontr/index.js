// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import format from 'date-fns/format'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import RadioButton from '../../../shared/RadioButton'
import TextField from '../../../shared/TextField'
import StringToCopy from '../../../shared/StringToCopyOnlyButton'
import DateFieldWithPicker from '../../../shared/DateFieldWithPicker'
import dataGql from './data.graphql'
import updateTpopkontrByIdGql from './updateTpopkontrById.graphql'
import anteilImg from './anteil.png'
import veghoeheImg from './veghoehe.png'
import Headdata from './Headdata'
import Besttime from './Besttime'
import Date from './Date'

const LadeContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
`
const Img = styled.img`
  max-width: 100%;
  height: auto;
`
const Container = styled.div`
  padding: 10px;
`
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-areas:
    'title title title image image image'
    'headdata headdata headdata image image image'
    'besttime besttime besttime image image image'
    'date date map image image image'
    'count1 count1 count2 count2 count3 count3'
    'cover cover cover more more more'
    'danger danger danger danger danger danger'
    'remarks remarks remarks remarks remarks remarks';
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  justify-items: stretch;
  align-items: stretch;
  justify-content: stretch;
  box-sizing: border-box;
  border-collapse: collapse;
`
const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
`
const Title = styled(Area)`
  grid-area: title;
  font-weight: 700;
  font-size: 22px;
`
const Image = styled(Area)`
  grid-area: image;
`
const Label = styled.div`
  font-weight: 700;
  padding-right: 4px;
`
const Map = styled(Area)`
  grid-area: map;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    'mapLabel0 mapLabel1 mapVal1'
    'mapLabel0 mapLabel2 mapVal2';
  align-items: center;
`
const MapLabel0 = styled(Label)`
  grid-area: mapLabel0;
  padding-right: 15px;
`
const MapLabel1 = styled(Label)`
  grid-area: mapLabel1;
`
const MapLabel2 = styled(Label)`
  grid-area: mapLabel2;
`
const MapVal1 = styled(Label)`
  grid-area: mapVal1;
  > fieldset {
    margin-top: -5px;
    padding-bottom: 0 !important;
  }
  > fieldset > legend {
    padding-top: 0 !important;
  }
`
const MapVal2 = styled(Label)`
  grid-area: mapVal2;
  > fieldset {
    margin-top: -5px;
    padding-bottom: 0 !important;
  }
  > fieldset > legend {
    padding-top: 0 !important;
  }
`
const Count1 = styled(Area)`
  grid-area: count1;
`
const Count2 = styled(Area)`
  grid-area: count2;
`
const Count3 = styled(Area)`
  grid-area: count3;
`
const Cover = styled(Area)`
  grid-area: cover;
  display: grid;
  grid-template-columns: 4fr 3fr 1fr;
  grid-template-areas:
    'deckApArtLabel deckApArtVal deckApArtMass'
    'deckNaBoLabel deckNaBoVal deckNaBoMass'
    'deckImage deckImage deckImage';
`
const DeckApArtLabel = styled(Label)`
  grid-area: deckApArtLabel;
`
const DeckApArtVal = styled.div`
  grid-area: deckApArtVal;
  > div {
    margin-top: -25px;
  }
`
const DeckApArtMass = styled.div`
  grid-area: deckApArtMass;
`
const DeckNaBoLabel = styled(Label)`
  grid-area: deckNaBoLabel;
`
const DeckNaBoVal = styled.div`
  grid-area: deckNaBoVal;
  > div {
    margin-top: -25px;
  }
`
const DeckNaBoMass = styled.div`
  grid-area: deckNaBoMass;
`
const DeckImage = styled.div`
  grid-area: deckImage;
`
const More = styled(Area)`
  grid-area: more;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-column-gap: 5px;
  grid-template-areas:
    'moreFlLabel moreFlLabel moreFlLabel moreFlVal moreFlVal moreFlVal moreFlVal moreFlVal moreFlVal moreFlVal moreFlVal moreFlMeasure'
    'jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0'
    'jungPflLabel1 jungPflVal1 jungPflLabel2 jungPflVal2 . . . . . . . .'
    'veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0'
    'veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheMaxLabel veghoeheMaxLabel veghoeheMaxLabel veghoeheMaxVal veghoeheMaxVal'
    'veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheMittLabel veghoeheMittLabel veghoeheMittLabel veghoeheMittVal veghoeheMittVal'
    'veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheMinLabel veghoeheMinLabel veghoeheMinLabel . .';
  align-items: center;
`
const MoreFlLabel = styled.div`
  grid-area: moreFlLabel;
  font-weight: 700;
`
const MoreFlVal = styled.div`
  grid-area: moreFlVal;
`
const MoreFlMeasure = styled.div`
  grid-area: moreFlMeasure;
`
const JungPflLabel0 = styled.div`
  grid-area: jungPflLabel0;
  font-weight: 700;
`
const JungPflLabel1 = styled.div`
  grid-area: jungPflLabel1;
`
const JungPflVal1 = styled.div`
  grid-area: jungPflVal1;
`
const JungPflLabel2 = styled.div`
  grid-area: jungPflLabel2;
`
const JungPflVal2 = styled.div`
  grid-area: jungPflVal2;
`
const VeghoeheLabel0 = styled.div`
  grid-area: veghoeheLabel0;
  font-weight: 700;
`
const VeghoeheMaxLabel = styled.div`
  grid-area: veghoeheMaxLabel;
  align-self: start;
  margin-top: 10px;
`
const VeghoeheMaxVal = styled.div`
  grid-area: veghoeheMaxVal;
  align-self: start;
  margin-top: -11px;
`
const VeghoeheMittLabel = styled.div`
  grid-area: veghoeheMittLabel;
  align-self: start;
  margin-top: 30px;
`
const VeghoeheMittVal = styled.div`
  grid-area: veghoeheMittVal;
  align-self: start;
  margin-top: 8px;
`
const VeghoeheMinLabel = styled.div`
  grid-area: veghoeheMinLabel;
  align-self: start;
  margin-top: -11px;
`
const VeghoeheImg = styled.div`
  grid-area: veghoeheImg;
`
const Danger = styled(Area)`
  grid-area: danger;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 8px;
  grid-template-areas: 'dangerLabel dangerVal dangerVal dangerVal';
  align-items: center;
`
const DangerLabel = styled(Label)`
  grid-area: dangerLabel;
`
const DangerVal = styled.div`
  grid-area: dangerVal;
  > div {
    margin-bottom: -15px;
  }
`
const RemarksLabel = styled.div`
  font-weight: 700;
`
const RemarksSubLabel = styled.div`
  padding-top: 10px;
  font-weight: 700;
  font-size: 14px;
`
const Remarks = styled(Area)`
  grid-area: remarks;
  > div {
    margin-top: 10px;
    margin-bottom: -20px;
  }
`

const enhance = compose(
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ setErrors, errors }) => async ({
      row,
      field,
      value,
      field2,
      value2,
      updateTpopkontr,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      /**
       * enable passing two values
       * with same update
       */
      const variables = {
        id: row.id,
        [field]: value,
      }
      if (field2) variables[field2] = value2
      try {
        await updateTpopkontr({
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopkontrById: {
              tpopkontr: {
                id: row.id,
                typ: field === 'typ' ? value : row.typ,
                jahr:
                  field === 'jahr'
                    ? value
                    : field2 === 'jahr'
                      ? value2
                      : row.jahr,
                datum:
                  field === 'datum'
                    ? value
                    : field2 === 'datum'
                      ? value2
                      : row.datum,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                flaecheUeberprueft:
                  field === 'flaecheUeberprueft'
                    ? value
                    : row.flaecheUeberprueft,
                deckungVegetation:
                  field === 'deckungVegetation' ? value : row.deckungVegetation,
                deckungNackterBoden:
                  field === 'deckungNackterBoden'
                    ? value
                    : row.deckungNackterBoden,
                deckungApArt:
                  field === 'deckungApArt' ? value : row.deckungApArt,
                vegetationshoeheMaximum:
                  field === 'vegetationshoeheMaximum'
                    ? value
                    : row.vegetationshoeheMaximum,
                vegetationshoeheMittel:
                  field === 'vegetationshoeheMittel'
                    ? value
                    : row.vegetationshoeheMittel,
                gefaehrdung: field === 'gefaehrdung' ? value : row.gefaehrdung,
                tpopId: field === 'tpopId' ? value : row.tpopId,
                bearbeiter: field === 'bearbeiter' ? value : row.bearbeiter,
                planVorhanden:
                  field === 'planVorhanden' ? value : row.planVorhanden,
                jungpflanzenVorhanden:
                  field === 'jungpflanzenVorhanden'
                    ? value
                    : row.jungpflanzenVorhanden,
                adresseByBearbeiter: row.adresseByBearbeiter,
                tpopByTpopId: row.tpopByTpopId,
                __typename: 'Tpopkontr',
              },
              __typename: 'Tpopkontr',
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

const Tpopfreiwkontr = ({
  id,
  // TODO: use dimensions to show in one row on narrow screens
  dimensions,
  saveToDb,
  errors,
}: {
  id: String,
  dimensions: Object,
  saveToDb: () => void,
  errors: Object,
}) => (
  <Query query={dataGql} variables={{ id }}>
    {({ loading, error, data }) => {
      if (loading) return <LadeContainer>Lade...</LadeContainer>
      if (error) return `Fehler: ${error.message}`

      const row = get(data, 'tpopkontrById')

      return (
        <Mutation mutation={updateTpopkontrByIdGql}>
          {updateTpopkontr => (
            <Container>
              <GridContainer>
                <Title>Erfolgskontrolle Artenschutz Flora</Title>
                <Headdata
                  saveToDb={saveToDb}
                  errors={errors}
                  data={data}
                  updateTpopkontr={updateTpopkontr}
                />
                <Besttime
                  saveToDb={saveToDb}
                  errors={errors}
                  data={data}
                  updateTpopkontr={updateTpopkontr}
                />
                <Date
                  saveToDb={saveToDb}
                  errors={errors}
                  data={data}
                  updateTpopkontr={updateTpopkontr}
                />
                <Map>
                  <MapLabel0>Plan ergänzt</MapLabel0>
                  <MapLabel1>ja</MapLabel1>
                  <MapVal1>
                    <RadioButton
                      key={`${row.id}planVorhanden`}
                      value={row.planVorhanden}
                      saveToDb={value =>
                        saveToDb({
                          row,
                          field: 'planVorhanden',
                          value,
                          updateTpopkontr,
                        })
                      }
                      error={errors.planVorhanden}
                    />
                  </MapVal1>
                  <MapLabel2>nein</MapLabel2>
                  <MapVal2>
                    <RadioButton
                      key={`${row.id}planVorhanden`}
                      value={!row.planVorhanden}
                      saveToDb={value =>
                        saveToDb({
                          row,
                          field: 'planVorhanden',
                          value: !value,
                          updateTpopkontr,
                        })
                      }
                      error={errors.planVorhanden}
                    />
                  </MapVal2>
                </Map>
                <Image>Image</Image>
                <Count1>count1</Count1>
                <Count2>count2</Count2>
                <Count3>count3</Count3>
                <Cover>
                  <DeckApArtLabel>Deckung üperprüfte Art</DeckApArtLabel>
                  <DeckApArtVal>
                    <TextField
                      key={`${row.id}deckungApArt`}
                      value={row.deckungApArt}
                      type="number"
                      saveToDb={value =>
                        saveToDb({
                          row,
                          field: 'deckungApArt',
                          value,
                          updateTpopkontr,
                        })
                      }
                      error={errors.deckungApArt}
                    />
                  </DeckApArtVal>
                  <DeckApArtMass>%</DeckApArtMass>
                  <DeckNaBoLabel>Flächenanteil nackter Boden</DeckNaBoLabel>
                  <DeckNaBoVal>
                    <TextField
                      key={`${row.id}deckungNackterBoden`}
                      value={row.deckungNackterBoden}
                      type="number"
                      saveToDb={value =>
                        saveToDb({
                          row,
                          field: 'deckungNackterBoden',
                          value,
                          updateTpopkontr,
                        })
                      }
                      error={errors.deckungNackterBoden}
                    />
                  </DeckNaBoVal>
                  <DeckNaBoMass>%</DeckNaBoMass>
                  <DeckImage>
                    <Img src={anteilImg} alt="Flächen-Anteile" />
                  </DeckImage>
                </Cover>
                <More>
                  <MoreFlLabel>Überprüfte Fläche</MoreFlLabel>
                  <MoreFlVal>
                    <TextField
                      key={`${row.id}flaecheUeberprueft`}
                      value={row.flaecheUeberprueft}
                      type="number"
                      saveToDb={value =>
                        saveToDb({
                          row,
                          field: 'flaecheUeberprueft',
                          value,
                          updateTpopkontr,
                        })
                      }
                      error={errors.flaecheUeberprueft}
                    />
                  </MoreFlVal>
                  <MoreFlMeasure>
                    m<sup>2</sup>
                  </MoreFlMeasure>
                  <JungPflLabel0>
                    Werden junge neben alten Pflanzen beobachtet?
                  </JungPflLabel0>
                  <JungPflLabel1>ja</JungPflLabel1>
                  <JungPflVal1>
                    <RadioButton
                      key={`${row.id}jungpflanzenVorhanden1`}
                      value={row.jungpflanzenVorhanden}
                      saveToDb={value =>
                        saveToDb({
                          row,
                          field: 'jungpflanzenVorhanden',
                          value,
                          updateTpopkontr,
                        })
                      }
                      error={errors.jungpflanzenVorhanden}
                    />
                  </JungPflVal1>
                  <JungPflLabel2>nein</JungPflLabel2>
                  <JungPflVal2>
                    <RadioButton
                      key={`${row.id}jungpflanzenVorhanden2`}
                      value={!row.jungpflanzenVorhanden}
                      saveToDb={value =>
                        saveToDb({
                          row,
                          field: 'jungpflanzenVorhanden',
                          value: !value,
                          updateTpopkontr,
                        })
                      }
                      error={errors.jungpflanzenVorhanden}
                    />
                  </JungPflVal2>
                  <VeghoeheLabel0>Vegetationshöhe</VeghoeheLabel0>
                  <VeghoeheImg>
                    <Img src={veghoeheImg} alt="Flächen-Anteile" />
                  </VeghoeheImg>
                  <VeghoeheMaxLabel>Maximum (cm)</VeghoeheMaxLabel>
                  <VeghoeheMaxVal>
                    <TextField
                      key={`${row.id}vegetationshoeheMaximum`}
                      value={row.vegetationshoeheMaximum}
                      type="number"
                      saveToDb={value =>
                        saveToDb({
                          row,
                          field: 'vegetationshoeheMaximum',
                          value,
                          updateTpopkontr,
                        })
                      }
                      error={errors.vegetationshoeheMaximum}
                    />
                  </VeghoeheMaxVal>
                  <VeghoeheMittLabel>Mittel (cm)</VeghoeheMittLabel>
                  <VeghoeheMittVal>
                    <TextField
                      key={`${row.id}vegetationshoeheMittel`}
                      value={row.vegetationshoeheMittel}
                      type="number"
                      saveToDb={value =>
                        saveToDb({
                          row,
                          field: 'vegetationshoeheMittel',
                          value,
                          updateTpopkontr,
                        })
                      }
                      error={errors.vegetationshoeheMittel}
                    />
                  </VeghoeheMittVal>
                  <VeghoeheMinLabel>(Minimum)</VeghoeheMinLabel>
                </More>
                <Danger>
                  <DangerLabel>
                    Andere Gefährdung (Verbuschung, Tritt, Hunde, ...), welche?
                  </DangerLabel>
                  <DangerVal>
                    <TextField
                      key={`${row.id}gefaehrdung`}
                      value={row.gefaehrdung}
                      type="text"
                      multiLine
                      saveToDb={value =>
                        saveToDb({
                          row,
                          field: 'gefaehrdung',
                          value,
                          updateTpopkontr,
                        })
                      }
                      error={errors.gefaehrdung}
                    />
                  </DangerVal>
                </Danger>
                <Remarks>
                  <RemarksLabel>Spezielle Bemerkungen</RemarksLabel>
                  <RemarksSubLabel>
                    (z.B. allgemeiner Eindruck, Zunahme / Abnahme Begründung,
                    spezielle Begebenheiten)
                  </RemarksSubLabel>
                  <TextField
                    key={`${row.id}bemerkungen`}
                    value={row.bemerkungen}
                    type="text"
                    multiLine
                    saveToDb={value =>
                      saveToDb({
                        row,
                        field: 'bemerkungen',
                        value,
                        updateTpopkontr,
                      })
                    }
                    error={errors.bemerkungen}
                  />
                </Remarks>
              </GridContainer>
              <StringToCopy text={row.id} label="GUID" />
            </Container>
          )}
        </Mutation>
      )
    }}
  </Query>
)

export default enhance(Tpopfreiwkontr)
