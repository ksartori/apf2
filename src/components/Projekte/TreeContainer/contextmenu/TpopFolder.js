// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const enhance = compose(
  inject('store'),
  withState('id', 'changeId', 0),
  withHandlers({
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    onShow: props => event => props.changeId(event.detail.data.nodeId),
  }),
  observer
)

const TpopFolder = ({
  tree,
  onClick,
  store,
  changeId,
  id,
  onShow,
  token,
  moving
}: {
  tree: Object,
  onClick: () => void,
  store: Object,
  changeId: () => void,
  id: Number,
  onShow: () => void,
  token: String,
  moving: Object
}) => {
  const isMoving = moving.table && moving.table === 'tpop'
  const copying = store.copying.table && store.copying.table === 'tpop'

  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${tree.name}tpopFolder`}
        collect={props => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">Teil-Populationen</div>
        <MenuItem
          onClick={onClick}
          data={{
            action: 'openLowerNodes',
          }}
        >
          alle öffnen
        </MenuItem>
        {
          !userIsReadOnly(token) &&
          <Fragment>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'tpop',
              }}
            >
              erstelle neue
            </MenuItem>
            {isMoving && (
              <MenuItem
                onClick={onClick}
                data={{
                  action: 'move',
                }}
              >
                {`verschiebe '${moving.label}' hierhin`}
              </MenuItem>
            )}
            {copying && (
              <MenuItem
                onClick={onClick}
                data={{
                  action: 'copy',
                }}
              >
                {`kopiere '${store.copying.label}' hierhin`}
              </MenuItem>
            )}
            {copying && (
              <MenuItem
                onClick={onClick}
                data={{
                  action: 'resetCopying',
                }}
              >
                Kopieren aufheben
              </MenuItem>
            )}
          </Fragment>
        }
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default enhance(TpopFolder)
