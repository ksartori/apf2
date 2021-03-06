// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const enhance = compose(
  withState('id', 'changeId', 0),
  withHandlers({
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    onShow: props => event => {
      props.changeId(event.detail.data.nodeId)
    },
  }),
)

const BeobZugeordnetFolder = ({
  tree,
  onClick,
  changeId,
  id,
  onShow,
  activeApfloraLayers,
}: {
  changeId: () => {},
  tree: Object,
  onClick: () => void,
  id: number,
  onShow: () => {},
  activeApfloraLayers: Array<String>,
}) => (
  <ErrorBoundary>
    <ContextMenu
      id={`${tree.name}beobZugeordnetFolder`}
      collect={props => props}
      onShow={onShow}
    >
      <div className="react-contextmenu-title">Beobachtungen</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'showBeobOnMap',
          actionTable: 'beobZugeordnet',
          idTable: 'ap',
        }}
      >
        {`blende auf Karte ${
          activeApfloraLayers.includes('beobZugeordnet')
            ? 'aus'
            : 'ein'
        }`}
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default enhance(BeobZugeordnetFolder)
