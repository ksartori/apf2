// @flow
/*
 *
 * Karte
 * swisstopo wmts: https://wmts10.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml
 *
 */

import React from 'react'
import { observer, inject } from 'mobx-react'
import { Map, ScaleControl } from 'react-leaflet'
import styled from 'styled-components'
import compose from 'recompose/compose'
import 'leaflet'
import 'proj4'
import 'proj4leaflet'

import LayersControl from './LayersControl'
import '../../../../node_modules/leaflet/dist/leaflet.css'
import epsg4326to21781 from '../../../modules/epsg4326to21781'
import Populationen from './layers/Populationen'
import OsmColorLayer from './layers/OsmColor'

const StyledMap = styled(Map)`
  height: 100%;
`

const enhance = compose(
  inject(`store`),
  observer
)

const Karte = ({ store }) => {
  // if no active projekt, need to fetch pops of all Projekte
  // uhm, let us not do this
  // if no active ap, need to fetch pops of projekt
  // uhm, let us not do this

  // const position = [47.295, 8.58]
  const bounds = [[47.159, 8.354], [47.696, 8.984]]
  // this does not work
  // see issue on proj4js: https://github.com/proj4js/proj4js/issues/214
  /*
  const crs = new window.L.Proj.CRS(
    `EPSG:21781`,
    `+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs`,
    {
      resolutions: [8192, 4096, 2048], // 3 example zoom level resolutions
      bounds,
    }
  )*/

  return (
    <StyledMap
      // center={position}
      // zoom={11}
      // crs={crs}
      bounds={bounds}
      onClick={(e) => {
        // epsg4326to21781
        const coord = epsg4326to21781(e.latlng.lng, e.latlng.lat)
        console.log(`Lat, Lon: `, coord)
      }}
    >
      <OsmColorLayer />
      {
        store.map.layer.pop.visible &&
        <Populationen />
      }
      <ScaleControl
        imperial={false}
      />
      <LayersControl />
    </StyledMap>
  )
}

export default enhance(Karte)
