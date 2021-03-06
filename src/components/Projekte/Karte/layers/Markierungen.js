// @flow
import React from 'react'
import { GeoJSON } from 'react-leaflet'
import 'leaflet'

import popupFromProperties from './popupFromProperties'
import fetchMarkierungen from '../../../../modules/fetchMarkierungen'

const style = () => ({ fill: false, color: 'orange', weight: 1 })
const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    layer.bindPopup(popupFromProperties(feature.properties))
  }
}
const pTLOptions = {
  radius: 3,
  fillColor: '#ff7800',
  color: '#000',
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
}
const pointToLayer = (feature, latlng) => {
  return window.L.circleMarker(latlng, pTLOptions)
}

const MarkierungenLayer = ({
  markierungen,
  setMarkierungen,
  errorState,
}:{
  markierungen: Object,
  setMarkierungen: () => void,
  errorStatef: Object,
}) => {
  !markierungen && fetchMarkierungen({ setMarkierungen, errorState })

  return (
    markierungen && (
      <GeoJSON
        data={markierungen}
        style={style}
        onEachFeature={onEachFeature}
        pointToLayer={pointToLayer}
      />
    )
  )
}

export default MarkierungenLayer
