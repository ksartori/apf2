// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import min from 'lodash/min'
import sum from 'lodash/sum'
import maxBy from 'lodash/maxBy'
import groupBy from 'lodash/groupBy'
import { Query } from 'react-apollo'

import dataGql from './data.graphql'

const Container = styled.div`
  padding: 0.2cm 0;
`
const Row = styled.div`
  display: flex;
  padding: 0.05cm 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
`
const NkRow = styled(Row)`
  padding: 0.3cm 0 0.05cm 0;
`
const LabelRow = styled(Row)`
  font-size: 12px;
`
const Year = styled.div`
  position: relative;
  left: 10.9cm;
  width: 2cm;
`
const YearSince = styled.div`
  position: relative;
  left: 11.45cm;
  width: 2cm;
`
const Label1 = styled.div`
  min-width: 10cm;
  max-width: 10cm;
`
const Label3 = styled.div`
  min-width: 7.8cm;
  max-width: 7.8cm;
  padding-left: 2.2cm;
`
const Number = styled.div`
  min-width: 1cm;
  max-width: 1cm;
  text-align: right;
`
const PopBerJahr = styled(Number)``
const TpopBerJahr = styled(Number)`
  padding-right: 1cm;
`
const PopSeit = styled(Number)``
const TpopSeit = styled(Number)``

const BMengen = ({
  apId,
  jahr,
  startJahr,
}:{
  apId: String,
  jahr: Number,
  startJahr: Number,
}) =>
  <Query
    query={dataGql}
    variables={{ apId, startJahr, jahr }}
  >
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`

      // 1.
      const oneLPop_pop = get(data, 'apById.oneLPop.nodes', [])
        .filter(p => get(p, 'tpopsByPopId.totalCount') > 0)
        .filter(p => get(p, 'popbersByPopId.totalCount') > 0)
      const oneLPop = oneLPop_pop.length
      const oneLPop_popbers = flatten(
        oneLPop_pop.map(p =>
          get(p, 'popbersByPopId.nodes', [])
        )
      )

      const oneLTpop_pop = get(data, 'apById.oneLTpop.nodes', [])
      const oneLTpop_tpop = flatten(
        oneLTpop_pop.map(p =>
          get(p, 'tpopsByPopId.nodes', [])
        )
      )
      const oneLTpop = flatten(
        oneLTpop_tpop.map(p =>
          get(p, 'tpopbersByTpopId.totalCount', 0)
        )
      )
        .filter(tpopbersCount => tpopbersCount > 0)
        .length
      const oneLTpop_tpopbers = flatten(
        oneLTpop_tpop.map(t =>
          get(t, 'tpopbersByTpopId.nodes', [])
        )
      )

      const oneRPop = get(data, 'apById.oneRPop.nodes', [])
        .filter(p => get(p, 'tpopsByPopId.totalCount') > 0)
        .filter(p => get(p, 'popbersByPopId.totalCount') > 0)
        .length
      const oneRPop_pop = get(data, 'apById.oneRPop.nodes', [])
        .filter(p => get(p, 'tpopsByPopId.totalCount') > 0)
      const oneRPop_popbers = flatten(
        oneRPop_pop.map(p =>
          get(p, 'popbersByPopId.nodes', [])
        )
      )
      const oneRPop_popbersByPopId = groupBy(oneRPop_popbers, b => b.popId)
      const oneRPop_lastPopbers = Object.keys(oneRPop_popbersByPopId).map(b =>
        maxBy(oneRPop_popbersByPopId[b], 'jahr')
      )

      const oneRTpop_pop = get(data, 'apById.oneRTpop.nodes', [])
      const oneRTpop_tpop = flatten(
        oneRTpop_pop.map(p =>
          get(p, 'tpopsByPopId.nodes', [])
        )
      )
      const oneRTpop = flatten(
        oneRTpop_tpop.map(p =>
          get(p, 'tpopbersByTpopId.totalCount', 0)
        )
      )
        .filter(tpopbersCount => tpopbersCount > 0)
        .length
      const oneRTpop_tpopbers = flatten(
        oneRTpop_tpop.map(p =>
          get(p, 'tpopbersByTpopId.nodes', [])
        )
      )
      const oneRTpop_tpopbersByTpopId = groupBy(oneRTpop_tpopbers, b => b.tpopId)
      const oneRTpop_lastTpopbers = Object.keys(oneRTpop_tpopbersByTpopId).map(b =>
        maxBy(oneRTpop_tpopbersByTpopId[b], 'jahr')
      )
      const oneRTpop_firstYear = min(
        oneRTpop_tpopbers.map(b =>
          b.jahr
        )
      )

      // 2.
      const twoLPop = oneLPop_popbers
        .filter(b => b.entwicklung === 3)
        .length
      const twoLTpop = oneLTpop_tpopbers
        .filter(b => b.entwicklung === 3)
        .length
      const twoRPop = oneRPop_lastPopbers
        .filter(b => b.entwicklung === 3)
        .length
      const twoRTpop = oneRTpop_lastTpopbers
        .filter(b => b.entwicklung === 3)
        .length

      // 3.
      const threeLPop = oneLPop_popbers
        .filter(b => b.entwicklung === 2)
        .length
      const threeLTpop = oneLTpop_tpopbers
        .filter(b => b.entwicklung === 2)
        .length
      const threeRPop = oneRPop_lastPopbers
        .filter(b => b.entwicklung === 2)
        .length
      const threeRTpop = oneRTpop_lastTpopbers
        .filter(b => b.entwicklung === 2)
        .length

      // 4.
      const fourLPop = oneLPop_popbers
        .filter(b => b.entwicklung === 1)
        .length
      const fourLTpop = oneLTpop_tpopbers
        .filter(b => b.entwicklung === 1)
        .length
      const fourRPop = oneRPop_lastPopbers
        .filter(b => b.entwicklung === 1)
        .length
      const fourRTpop = oneRTpop_lastTpopbers
        .filter(b => b.entwicklung === 1)
        .length

      // 5.
      const fiveLPop = oneLPop_popbers
        .filter(b => b.entwicklung === 4)
        .length
      const fiveLTpop = oneLTpop_tpopbers
        .filter(b => b.entwicklung === 4)
        .length
      const fiveRPop = oneRPop_lastPopbers
        .filter(b => b.entwicklung === 4)
        .length
      const fiveRTpop = oneRTpop_lastTpopbers
        .filter(b => b.entwicklung === 4)
        .length

      // 6.
      const sixLPop = oneLPop_popbers
        .filter(b => b.entwicklung === 8)
        .length
      const sixLTpop = oneLTpop_tpopbers
        .filter(b => b.entwicklung === 8)
        .length
      const sixRPop = oneRPop_lastPopbers
        .filter(b => b.entwicklung === 8)
        .length
      const sixRTpop = oneRTpop_lastTpopbers
        .filter(b => b.entwicklung === 8)
        .length
      
        // 7.
        const sevenLPop_allPops = get(data, 'apById.sevenLPop.nodes', [])
          .filter(p => get(p, 'tpopsByPopId.totalCount') > 0)
          .length
        const sevenLPop = sevenLPop_allPops - oneLPop
        const sevenLTpop_allTpops = sum(
          get(data, 'apById.sevenLTpop.nodes', [])
            .map(p => get(p, 'tpopsByPopId.totalCount'))
        )
        const sevenLTpop = sevenLTpop_allTpops - oneLTpop
        const sevenRPop = sevenLPop_allPops - oneRPop
        const sevenRTpop = sevenLTpop_allTpops - oneRTpop

      return (
        <Container>
          <Row>
            <Year>{jahr}</Year>
            <YearSince>{`Seit ${oneRTpop_firstYear}`}</YearSince>
          </Row>
          <LabelRow>
            <Label1></Label1>
            <PopBerJahr>Pop</PopBerJahr>
            <TpopBerJahr>TPop</TpopBerJahr>
            <PopSeit>Pop</PopSeit>
            <TpopSeit>TPop</TpopSeit>
          </LabelRow>
          <Row>
            <Label1>kontrolliert (inkl. Ansaatversuche)</Label1>
            <PopBerJahr>{oneLPop}</PopBerJahr>
            <TpopBerJahr>{oneLTpop}</TpopBerJahr>
            <PopSeit>{oneRPop}</PopSeit>
            <TpopSeit>{oneRTpop}</TpopSeit>
          </Row>
          <Row>
            <Label3>zunehmend</Label3>
            <PopBerJahr>{twoLPop}</PopBerJahr>
            <TpopBerJahr>{twoLTpop}</TpopBerJahr>
            <PopSeit>{twoRPop}</PopSeit>
            <TpopSeit>{twoRTpop}</TpopSeit>
          </Row>
          <Row>
            <Label3>stabil</Label3>
            <PopBerJahr>{threeLPop}</PopBerJahr>
            <TpopBerJahr>{threeLTpop}</TpopBerJahr>
            <PopSeit>{threeRPop}</PopSeit>
            <TpopSeit>{threeRTpop}</TpopSeit>
          </Row>
          <Row>
            <Label3>abnehmend</Label3>
            <PopBerJahr>{fourLPop}</PopBerJahr>
            <TpopBerJahr>{fourLTpop}</TpopBerJahr>
            <PopSeit>{fourRPop}</PopSeit>
            <TpopSeit>{fourRTpop}</TpopSeit>
          </Row>
          <Row>
            <Label3>unsicher</Label3>
            <PopBerJahr>{fiveLPop}</PopBerJahr>
            <TpopBerJahr>{fiveLTpop}</TpopBerJahr>
            <PopSeit>{fiveRPop}</PopSeit>
            <TpopSeit>{fiveRTpop}</TpopSeit>
          </Row>
          <Row>
            <Label3>erloschen</Label3>
            <PopBerJahr>{sixLPop}</PopBerJahr>
            <TpopBerJahr>{sixLTpop}</TpopBerJahr>
            <PopSeit>{sixRPop}</PopSeit>
            <TpopSeit>{sixRTpop}</TpopSeit>
          </Row>
          <NkRow>
            <Label1>nicht kontrolliert (inkl. Ansaatversuche)</Label1>
            <PopBerJahr>{sevenLPop}</PopBerJahr>
            <TpopBerJahr>{sevenLTpop}</TpopBerJahr>
            <PopSeit>{sevenRPop}</PopSeit>
            <TpopSeit>{sevenRTpop}</TpopSeit>
          </NkRow>
        </Container>
      )
    }}
  </Query>
  

export default BMengen
