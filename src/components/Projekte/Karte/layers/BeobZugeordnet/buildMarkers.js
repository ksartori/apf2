// @flow
import React, { Fragment } from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'
import format from 'date-fns/format'
import styled from 'styled-components'
import get from 'lodash/get'

import beobIcon from '../../../../../etc/beobZugeordnet.png'
import beobIconHighlighted from '../../../../../etc/beobZugeordnetHighlighted.png'
import getNearestTpopId from '../../../../../modules/getNearestTpopId'
import appBaseUrl from '../../../../../modules/appBaseUrl'
import epsg2056to4326 from '../../../../../modules/epsg2056to4326'

const StyledH3 = styled.h3`
  margin: 7px 0;
`

export default ({ beobs, store }:{ beobs: Array<Object>, store: Object }): Array<Object> => {
  const { tree, updatePropertyInDb, map, table } = store
  const { activeNodes } = tree
  const { ap, projekt } = activeNodes
  const { highlightedIds } = map.beobZugeordnet

  return beobs.map(beob => {
    const isHighlighted = highlightedIds.includes(beob.id)
    const latLng = new window.L.LatLng(...epsg2056to4326(beob.x, beob.y))
    const icon = window.L.icon({
      iconUrl: isHighlighted ? beobIconHighlighted : beobIcon,
      iconSize: [24, 24],
      className: isHighlighted ? 'beobIconHighlighted' : 'beobIcon',
    })
    const label = `${beob.datum ? format(beob.datum, 'YYYY.MM.DD') : '(kein Datum)'}: ${beob.autor || '(kein Autor)'} (${get(beob, 'beobQuelleWerteByQuelleId.name', '')})`
    return window.L.marker(latLng, {
      title: label,
      icon,
      draggable: store.map.beob.assigning,
      zIndexOffset: -store.map.apfloraLayers.findIndex(
        apfloraLayer => apfloraLayer.value === 'BeobZugeordnet'
      ),
    })
      .bindPopup(
        ReactDOMServer.renderToStaticMarkup(
          <Fragment>
            <div>{`Beobachtung von ${get(beob, 'aeEigenschaftenByArtId.artname', '')}`}</div>
            <StyledH3>
              {label}
            </StyledH3>
            <div>
              {`Koordinaten: ${beob.x.toLocaleString(
                'de-ch'
              )} / ${beob.y.toLocaleString('de-ch')}`}
            </div>
            <div>{`Teil-Population: ${get(beob, 'tpopByTpopId.nr', '(keine Nr)')}: ${get(beob, 'tpopByTpopId.flurname', '(kein Flurname)')}`}</div>
            <a
              href={`${appBaseUrl}/Projekte/${projekt}/Aktionspläne/${ap}/Populationen/${get(beob, 'tpopByTpopId.popId', '')}/Teil-Populationen/${get(beob, 'tpopByTpopId.id', '')}/Beobachtungen/${
                beob.id
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Formular in neuem Tab öffnen
            </a>
          </Fragment>
        )
      )
      .on('moveend', event => {
        /**
         * assign to nearest tpop
         * point url to moved beob
         * open form of beob?
         */
        const nearestTpopId = getNearestTpopId(store, event.target._latlng)
        const popId = table.tpop.get(nearestTpopId).pop_id
        const newActiveNodeArray = [
          'Projekte',
          activeNodes.projekt,
          'Aktionspläne',
          activeNodes.ap,
          'Populationen',
          popId,
          'Teil-Populationen',
          nearestTpopId,
          'Beobachtungen',
          beob.id,
        ]
        tree.setActiveNodeArray(newActiveNodeArray)
        updatePropertyInDb(tree, 'tpop_id', nearestTpopId)
      })
  })
}
