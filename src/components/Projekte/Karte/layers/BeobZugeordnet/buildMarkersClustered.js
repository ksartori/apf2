// @flow
import React, { Fragment } from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'
import '../../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'
import format from 'date-fns/format'
import some from 'lodash/some'
import get from 'lodash/get'
import styled from 'styled-components'

import beobIcon from '../../../../../etc/beobZugeordnet.png'
import beobIconHighlighted from '../../../../../etc/beobZugeordnetHighlighted.png'
import appBaseUrl from '../../../../../modules/appBaseUrl'
import epsg2056to4326 from '../../../../../modules/epsg2056to4326'

const StyledH3 = styled.h3`
  margin: 7px 0;
`

export default ({
  beobs,
  activeNodes,
  apfloraLayers,
  data,
  mapIdsFiltered,
}:{
  beobs: Array<Object>,
  activeNodes: Array<Object>,
  apfloraLayers: Array<Object>,
  data: Object,
  mapIdsFiltered: Array<String>,
}): Object => {
  const { ap, projekt } = activeNodes
  const assigning = get(data, 'assigningBeob')
  const mcgOptions = {
    maxClusterRadius: 66,
    iconCreateFunction: function(cluster) {
      const markers = cluster.getAllChildMarkers()
      const hasHighlightedTpop = some(
        markers,
        m => m.options.icon.options.className === 'beobIconHighlighted'
      )
      const className = hasHighlightedTpop
        ? 'beobZugeordnetClusterHighlighted'
        : 'beobZugeordnetCluster'
      return window.L.divIcon({
        html: markers.length,
        className,
        iconSize: window.L.point(40, 40),
      })
    },
  }
  const markers = window.L.markerClusterGroup(mcgOptions)
  beobs.forEach(beob => {
    const isHighlighted = mapIdsFiltered.includes(beob.id)
    const latLng = new window.L.LatLng(...epsg2056to4326(beob.x, beob.y))
    const icon = window.L.icon({
      iconUrl: isHighlighted ? beobIconHighlighted : beobIcon,
      iconSize: [24, 24],
      className: isHighlighted ? 'beobIconHighlighted' : 'beobIcon',
    })
    const label = `${beob.datum ? format(beob.datum, 'YYYY.MM.DD') : '(kein Datum)'}: ${beob.autor || '(kein Autor)'} (${get(beob, 'beobQuelleWerteByQuelleId.name', '')})`
    const marker = window.L
      .marker(latLng, {
        title: label,
        icon,
        draggable: assigning,
        zIndexOffset: -apfloraLayers.findIndex(
          apfloraLayer => apfloraLayer.value === 'beobZugeordnet',
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
              href={`${appBaseUrl}/Projekte/${projekt}/Aktionspläne/${ap}/nicht-beurteilte-Beobachtungen/${beob.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Formular in neuem Tab öffnen
            </a>
          </Fragment>,
        ),
      )
    markers.addLayer(marker)
  })
  return markers
}
