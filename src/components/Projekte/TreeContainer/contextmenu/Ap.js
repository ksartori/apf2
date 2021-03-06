// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const Ap = ({
  onClick,
  tree,
  token,
  moving,
  activeApfloraLayers,
  popLabelUsingNr,
  tpopLabelUsingNr,
}: {
  onClick: () => void,
  tree: Object,
  token: String,
  moving: Object,
  activeApfloraLayers: Array<String>,
  popLabelUsingNr: Boolean,
  tpopLabelUsingNr: Boolean,
}) => {
  const isMoving = moving.table && moving.table === 'pop'
  const mayWrite = !userIsReadOnly(token)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}ap`}>
        <div className="react-contextmenu-title">Aktionsplan</div>
        <MenuItem
          onClick={onClick}
          data={{
            action: 'closeLowerNodes',
          }}
        >
          alle schliessen
        </MenuItem>
        {
          mayWrite &&
          <Fragment>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'ap',
              }}
            >
              erstelle neuen
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'delete',
                table: 'ap',
              }}
            >
              lösche
            </MenuItem>
          </Fragment>
        }
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
        {(activeApfloraLayers.includes('pop') ||
          activeApfloraLayers.includes('tpop')) && (
          <div>
            <div className="react-contextmenu-divider" />
            <div className="react-contextmenu-title">Karte</div>
          </div>
        )}
        {activeApfloraLayers.includes('pop') && (
          <MenuItem
            onClick={onClick}
            data={{
              action: 'toggleTooltip',
              actionTable: 'pop',
            }}
          >
            {popLabelUsingNr
              ? 'beschrifte Populationen mit Namen'
              : 'beschrifte Populationen mit Nummer'}
          </MenuItem>
        )}
        {activeApfloraLayers.includes('tpop') && (
          <MenuItem
            onClick={onClick}
            data={{
              action: 'toggleTooltip',
              actionTable: 'tpop',
            }}
          >
            {tpopLabelUsingNr
              ? 'beschrifte Teil-Populationen mit Namen'
              : 'beschrifte Teil-Populationen mit Nummer'}
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default Ap
