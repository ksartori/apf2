import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import compose from 'recompose/compose'
import 'leaflet'
import '../../../../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src.js'

const enhance = compose(
  inject(`store`),
  observer
)

class PopMarkerCluster extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    map: PropTypes.object.isRequired,
    pops: PropTypes.array.isRequired,
    labelUsingNr: PropTypes.bool.isRequired,
    highlightedIds: PropTypes.array.isRequired,
    visible: PropTypes.bool.isRequired,
    markers: PropTypes.object,
  }

  componentDidMount() {
    const { map, markers, visible } = this.props
    if (visible) {
      map.addLayer(markers)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { map } = this.props
    if (this.props.markers && this.props.markers !== nextProps.markers) {
      map.removeLayer(this.props.markers)
    }
  }

  componentDidUpdate() {
    const { map, markers, visible } = this.props
    if (visible) {
      map.addLayer(markers)
    }
  }

  render() {
    return (
      <div style={{ display: `none` }} />
    )
  }
}

export default enhance(PopMarkerCluster)
