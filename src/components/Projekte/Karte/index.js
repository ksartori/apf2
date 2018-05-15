// @flow
/*
 *
 * Karte
 * swisstopo wmts: https://wmts10.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml
 *
 */

import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Map, ScaleControl } from 'react-leaflet'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { Query } from 'react-apollo'
import 'leaflet'
import 'proj4'
import 'proj4leaflet'

import dataGql from './data.graphql'
import LayersControl from './LayersControl'
import OsmColor from './layers/OsmColor'
import OsmBw from './layers/OsmBw'
import SwissTopoPixelFarbe from './layers/SwisstopoPixelFarbe'
import SwissTopoPixelGrau from './layers/SwisstopoPixelGrau'
import SwisstopoSiegfried from './layers/SwisstopoSiegfried'
import SwisstopoDufour from './layers/SwisstopoDufour'
import BingAerial from './layers/BingAerial'
import ZhOrtho from './layers/ZhOrtho'
import ZhOrthoIr from './layers/ZhOrthoIr'
import ZhOrtho2015 from './layers/ZhOrtho2015'
import ZhOrtho2015Ir from './layers/ZhOrtho2015Ir'
import ZhUep from './layers/ZhUep'
import Detailplaene from './layers/Detailplaene'
import Markierungen from './layers/Markierungen'
import ZhSvoColor from './layers/ZhSvoColor'
import ZhPflegeplan from './layers/ZhPflegeplan'
import ZhSvoGrey from './layers/ZhSvoGrey'
import ZhLrVegKartierungen from './layers/ZhLrVegKartierungen'
import ZhLichteWaelder from './layers/ZhLichteWaelder'
import ZhGemeindegrenzen from './layers/ZhGemeindegrenzen'
import ZhWaelderVegetation from './layers/ZhWaelderVegetation'
import ZhUepOverlay from './layers/ZhUepOverlay'
import '../../../../node_modules/leaflet/dist/leaflet.css'
import '../../../../node_modules/leaflet-measure/dist/leaflet-measure.css'
import '../../../../node_modules/leaflet-draw/dist/leaflet.draw.css'
import '../../../../node_modules/leaflet.markercluster/dist/MarkerCluster.css'
import Pop from './layers/PopMarker'
import Tpop from './layers/TpopMarker'
import TpopCluster from './layers/TpopMarkerCluster'
import BeobNichtBeurteilt from './layers/BeobNichtBeurteilt'
import BeobNichtZuzuordnen from './layers/BeobNichtZuzuordnen'
import BeobZugeordnet from './layers/BeobZugeordnet'
import BeobZugeordnetAssignPolylines from './layers/BeobZugeordnetAssignPolylines'
import MeasureControl from './MeasureControl'
import FullScreenControl from './FullScreenControl'
import DrawControl from './DrawControl'
// import PrintControl from './PrintControl'
import PngControl from './PngControl'
import CoordinatesControl from './CoordinatesControl/index.js'
import epsg4326to2056 from '../../../modules/epsg4326to2056'
import ErrorBoundary from '../../shared/ErrorBoundary'
//import getBounds from '../../../modules/getBounds'

// this does not work
// see issue on proj4js: https://github.com/proj4js/proj4js/issues/214
/*
const crs = new window.L.Proj.CRS(
  'EPSG:2056',
  '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
  {
    resolutions: [8192, 4096, 2048], // 3 example zoom level resolutions
    bounds,
  }
)*/


const StyledMap = styled(Map)`
  height: 100%;
  @media print {
    height: 100%;
    width: 100%;
    overflow: visible;
  }
`
const StyledMapLocalizing = styled(StyledMap)`
  cursor: crosshair !important;
`

const enhance = compose(inject('store'), observer)

const Karte = ({ store }: { store: Object }) => {
  const { map, tree } = store
  const { activeNodes } = tree
  const { ap, projekt } = activeNodes
  const queryPops = map.activeApfloraLayers.includes('Pop')

  return (
    <Query query={dataGql}
      variables={{
        apId: ap,
        projId: projekt,
        queryPops
      }}
    >
      {({ loading, error, data }) => {
        if (error) return `Fehler: ${error.message}`

        const { activeBaseLayer, activeApfloraLayers } = store.map
        const { idOfTpopBeingLocalized } = store.map.tpop
        const MapElement = !!idOfTpopBeingLocalized ? StyledMapLocalizing : StyledMap
        /**
         * need an object whose methods return overlays
         * in order to dynamically display and sort active overlays
         */
        const ApfloraLayerComponents = {
          // MapFilter is used for filtering, need to return null
          MapFilter: () => null,
          Pop: () => <Pop />,
          Tpop: () => {
            if (
              store.map.beob.assigning ||
              activeApfloraLayers.includes('BeobZugeordnetAssignPolylines')
            ) {
              return (
                <Tpop />
              )
            }
            return (
              <TpopCluster
                visible={activeApfloraLayers.includes('Tpop')}
                markers={store.map.tpop.markersClustered}
              />
            )
          },
          BeobNichtBeurteilt: () =>
            <BeobNichtBeurteilt
              clustered={!(store.map.beob.assigning || activeApfloraLayers.includes('BeobZugeordnetAssignPolylines'))}
            />,
          BeobNichtZuzuordnen: () =>
            <BeobNichtZuzuordnen
              clustered={!(store.map.beob.assigning || activeApfloraLayers.includes('BeobZugeordnetAssignPolylines'))}
            />,
          BeobZugeordnet: () =>
            <BeobZugeordnet
              clustered={!(store.map.beob.assigning || activeApfloraLayers.includes('BeobZugeordnetAssignPolylines'))}
            />,
          BeobZugeordnetAssignPolylines: () => <BeobZugeordnetAssignPolylines />
        }
        const OverlayComponents = {
          ZhUep: () => <ZhUepOverlay />,
          Detailplaene: () => <Detailplaene />,
          Markierungen: () => <Markierungen />,
          ZhGemeindegrenzen: () => <ZhGemeindegrenzen />,
          ZhSvoColor: () => <ZhSvoColor />,
          ZhSvoGrey: () => <ZhSvoGrey />,
          ZhPflegeplan: () => <ZhPflegeplan />,
          ZhLrVegKartierungen: () => <ZhLrVegKartierungen />,
          ZhLichteWaelder: () => <ZhLichteWaelder />,
          ZhWaelderVegetation: () => <ZhWaelderVegetation />,
        }
        const BaseLayerComponents = {
          OsmColor: () => <OsmColor />,
          OsmBw: () => <OsmBw />,
          SwissTopoPixelFarbe: () => <SwissTopoPixelFarbe />,
          SwissTopoPixelGrau: () => <SwissTopoPixelGrau />,
          SwisstopoSiegfried: () => <SwisstopoSiegfried />,
          SwisstopoDufour: () => <SwisstopoDufour />,
          ZhUep: () => <ZhUep />,
          BingAerial: () => <BingAerial />,
          ZhOrtho: () => <ZhOrtho />,
          ZhOrthoIr: () => <ZhOrthoIr />,
          ZhOrtho2015: () => <ZhOrtho2015 />,
          ZhOrtho2015Ir: () => <ZhOrtho2015Ir />,
        }
        const BaseLayerComponent = BaseLayerComponents[activeBaseLayer]
      
        return (
          <ErrorBoundary>
            <MapElement
              bounds={toJS(store.map.bounds)}
              preferCanvas
              onMouseMove={store.map.setMapMouseCoord}
              // need max and min zoom because otherwise
              // something errors
              // probably clustering function
              maxZoom={22}
              minZoom={0}
              // what is this pop for?
              //pop={pops}
              onClick={event => {
                if (!!idOfTpopBeingLocalized) {
                  const { lat, lng } = event.latlng
                  const [x, y] = epsg4326to2056(lng, lat)
                  // TODO: cannot localize from map2!!!
                  store.map.localizeTpop(store.tree, x, y)
                }
              }}
              onZoomlevelschange={event => {
                // need to update bounds, otherwise map jumps back
                // when adding new tpop
                const bounds = event.target.getBounds()
                store.map.changeBounds([bounds._southWest, bounds._northEast])
              }}
              onZoomend={event => {
                // need to update bounds, otherwise map jumps back
                const bounds = event.target.getBounds()
                store.map.changeBounds([bounds._southWest, bounds._northEast])
              }}
              onMoveend={event => {
                // need to update bounds, otherwise map jumps back
                const bounds = event.target.getBounds()
                store.map.changeBounds([bounds._southWest, bounds._northEast])
              }}
            >
              {activeBaseLayer && <BaseLayerComponent />}
              {store.map.activeOverlaysSorted
                .map((overlayName, index) => {
                  const OverlayComponent = OverlayComponents[overlayName]
                  return <OverlayComponent key={index} />
                })
                .reverse()}
              {store.map.activeApfloraLayersSorted
                .map((apfloraLayerName, index) => {
                  const ApfloraLayerComponent =
                    ApfloraLayerComponents[apfloraLayerName]
                  return <ApfloraLayerComponent key={index} />
                })
                .reverse()}
              <ScaleControl imperial={false} />
              <LayersControl
                // this enforces rerendering when sorting changes
                activeOverlaysSortedString={store.map.activeOverlaysSortedString}
                activeApfloraLayersSortedString={
                  store.map.activeApfloraLayersSortedString
                }
              />
              <MeasureControl />
              <FullScreenControl />
              {store.map.activeApfloraLayers.includes('MapFilter') && <DrawControl />}
              {/*
              need to get background maps to show when printing A4
              <PrintControl />
              */}
              <PngControl />
              <CoordinatesControl />
            </MapElement>
          </ErrorBoundary>
        )
      }}
    </Query>
  )}

export default enhance(Karte)
