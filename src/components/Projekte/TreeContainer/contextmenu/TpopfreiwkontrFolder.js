// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const enhance = compose(inject('store'), observer)

const TpopfreiwkontrFolder = ({
  store,
  onClick,
  tree,
  token,
  moving,
  copying
}: {
  store: Object,
  tree: Object,
  onClick: () => void,
  token: String,
  moving: Object,
  copying: Object
}) => {
  const isMoving = moving.table && moving.table === 'tpopfreiwkontr'
  const isCopying = copying.table && copying.table === 'tpopfreiwkontr'

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}tpopfreiwkontrFolder`}>
        <div className="react-contextmenu-title">Freiwilligen-Kontrollen</div>
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
                table: 'tpopfreiwkontr',
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
            {isCopying && (
              <MenuItem
                onClick={onClick}
                data={{
                  action: 'copy',
                }}
              >
                {`kopiere '${copying.label}' hierhin`}
              </MenuItem>
            )}
            {copying.table && (
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

export default enhance(TpopfreiwkontrFolder)
