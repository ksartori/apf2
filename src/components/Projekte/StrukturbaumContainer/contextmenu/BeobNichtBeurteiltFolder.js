// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  inject(`store`),
  withState(`id`, `changeId`, 0),
  withHandlers({
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    onShow: props => (event) => {
      props.changeId(event.detail.data.nodeId)
    },
  }),
  observer
)

const BeobNichtBeurteiltFolder = (
  { onClick, store, changeId, id, onShow }:
  {onClick:() => void,store:Object,changeId:()=>{},id:number,onShow:()=>{}}
) =>
  <ContextMenu
    id="beobzuordnungFolder"
    collect={props => props}
    onShow={onShow}
  >
    <div className="react-contextmenu-title">nicht beurteilte Beobachtungen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `showBeobOnMap`,
        actionTable: `beobNichtBeurteilt`,
        idTable: `ap`,
      }}
    >
      {`blende auf Karte ${store.map.beobNichtBeurteilt.visible ? `aus` : `ein`}`}
    </MenuItem>
  </ContextMenu>

BeobNichtBeurteiltFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  changeId: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  onShow: PropTypes.func.isRequired,
}

export default enhance(BeobNichtBeurteiltFolder)
