// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const TpopfeldkontrzaehlFolder = ({
  onClick,
  tree,
  token
}: {
  onClick: () => void,
  tree: Object,
  token: String
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}tpopfeldkontrzaehlFolder`}>
      <div className="react-contextmenu-title">Zählungen</div>
      {
        !userIsReadOnly(token) &&
        <MenuItem
          onClick={onClick}
          data={{
            action: 'insert',
            table: 'tpopfeldkontrzaehl',
          }}
        >
          erstelle neue
        </MenuItem>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default TpopfeldkontrzaehlFolder
