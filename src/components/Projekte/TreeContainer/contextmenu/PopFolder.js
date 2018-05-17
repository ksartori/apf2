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
  withState('label', 'changeLabel', ''),
  withHandlers({
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    onShow: props => event => props.changeLabel(event.detail.data.nodeLabel),
  }),
  observer
)

const PopFolder = ({
  tree,
  onClick,
  store,
  changeLabel,
  label,
  onShow,
  token
}: {
  tree: Object,
  onClick: () => void,
  store: Object,
  changeLabel: () => void,
  label: string | number,
  onShow: () => void,
  token: String
}) => {
  const moving = store.moving.table && store.moving.table === 'pop'
  const copying = store.copying.table && store.copying.table === 'pop'

  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${tree.name}popFolder`}
        collect={props => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">Populationen</div>
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
              table: 'pop',
            }}
          >
            erstelle neue
          </MenuItem>
          {moving && (
            <MenuItem
              onClick={onClick}
              data={{
                action: 'move',
              }}
            >
              {`verschiebe '${store.moving.label}' hierhin`}
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

export default enhance(PopFolder)
