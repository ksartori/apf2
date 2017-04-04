// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const BerFolder = (
  { onClick, treeName }:
  {onClick:()=>void,treeName:string}
) =>
  <ContextMenu id={treeName} >
    <div className="react-contextmenu-title">Bericht</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `ber`,
      }}
    >
      erstelle neuen
    </MenuItem>
  </ContextMenu>

BerFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default BerFolder
