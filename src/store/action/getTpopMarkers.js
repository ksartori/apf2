// @flow
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'

import tpopIcon from '../../etc/tpop.png'
import tpopIconHighlighted from '../../etc/tpopHighlighted.png'
import TpopPopup from '../../components/Projekte/Karte/TpopPopup'

export default (store: Object): Array<Object> => {
  const { tpops, labelUsingNr, highlightedIds } = store.map.tpop
  const visible = store.map.activeApfloraLayers.includes('Tpop')
  if (visible) {
    const pops = Array.from(store.table.pop.values())
    const tpopsWithKoord = tpops.filter(tpop => tpop.TPopKoordWgs84)
    return tpopsWithKoord.map(tpop => {
      const pop = pops.find(pop => pop.id === tpop.pop_id)
      const popNr = pop && (pop.nr || pop.nr === 0) ? pop.nr : ''
      const tpopNr = tpop.nr || tpop.nr === 0 ? tpop.nr : ''
      const nrLabel = `${popNr}.${tpopNr}`
      let title = labelUsingNr ? tpop.flurname : nrLabel
      // beware: leaflet needs title to always be a string
      if (title && title.toString) {
        title = title.toString()
      }
      let tooltipText = labelUsingNr ? nrLabel : tpop.flurname
      if (tooltipText && tooltipText.toString) {
        tooltipText = tooltipText.toString()
      }
      const tooltipOptions = {
        permanent: true,
        direction: 'bottom',
        className: 'mapTooltip',
        opacity: 1,
      }
      const isHighlighted = highlightedIds.includes(tpop.id)
      const latLng = new window.L.LatLng(...tpop.TPopKoordWgs84)
      const icon = window.L.icon({
        iconUrl: isHighlighted ? tpopIconHighlighted : tpopIcon,
        iconSize: [24, 24],
        className: isHighlighted ? 'tpopIconHighlighted' : 'tpopIcon',
      })
      return window.L.marker(latLng, {
        title,
        icon,
        zIndexOffset: -store.map.apfloraLayers.findIndex(
          apfloraLayer => apfloraLayer.value === 'Tpop'
        ),
      })
        .bindPopup(
          ReactDOMServer.renderToStaticMarkup(
            <TpopPopup store={store} pop={pop} tpop={tpop} />
          )
        )
        .bindTooltip(tooltipText, tooltipOptions)
    })
  }
  return []
}
