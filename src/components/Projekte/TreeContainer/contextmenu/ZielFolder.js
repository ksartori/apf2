// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const ZielFolder = (
  { onClick, tree }:
  {onClick:()=>void,tree:Object}
) =>
  <ContextMenu id={`${tree.name}zielFolder`} >
    <div className="react-contextmenu-title">Ziele</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `ziel`,
      }}
    >
      erstelle neues
    </MenuItem>
  </ContextMenu>

ZielFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ZielFolder
