// @flow
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import 'leaflet'

import tpopIcon from '../../etc/tpop.png'
import tpopIconHighlighted from '../../etc/tpopHighlighted.png'
import TpopPopup from '../../components/Projekte/Karte/TpopPopup'

export default (store: Object): Array<Object> => {
  const { tpops, labelUsingNr, highlightedIds } = store.map.tpop
  const visible = store.map.activeApfloraLayers.includes(`Tpop`)
  if (visible) {
    const pops = Array.from(store.table.pop.values())
    const tpopsWithKoord = tpops.filter(p => p.TPopKoordWgs84)
    return tpopsWithKoord.map(p => {
      let title = labelUsingNr ? p.TPopNr : p.TPopFlurname
      // beware: leaflet needs title to always be a string
      if (title && title.toString) {
        title = title.toString()
      }
      let tooltipText = store.map.pop.labelUsingNr ? p.TPopNr : p.TPopFlurname
      if (tooltipText && tooltipText.toString) {
        tooltipText = tooltipText.toString()
      }
      const tooltipOptions = {
        permanent: true,
        direction: `bottom`,
        className: `mapTooltip`,
        opacity: 1
      }
      const isHighlighted = highlightedIds.includes(p.TPopId)
      const latLng = new window.L.LatLng(...p.TPopKoordWgs84)
      const icon = window.L.icon({
        iconUrl: isHighlighted ? tpopIconHighlighted : tpopIcon,
        iconSize: [24, 24],
        className: isHighlighted ? `tpopIconHighlighted` : `tpopIcon`
      })
      const pop = pops.find(pop => pop.PopId === p.PopId)
      return window.L
        .marker(latLng, {
          title,
          icon,
          zIndexOffset: -store.map.apfloraLayers.findIndex(
            apfloraLayer => apfloraLayer.value === `Tpop`
          )
        })
        .bindPopup(
          ReactDOMServer.renderToStaticMarkup(
            <TpopPopup store={store} pop={pop} tpop={p} />
          )
        )
        .bindTooltip(tooltipText, tooltipOptions)
    })
  }
  return []
}
