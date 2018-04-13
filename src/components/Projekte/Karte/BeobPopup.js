// @flow
import React from 'react'
import styled from 'styled-components'

import appBaseUrl from '../../../modules/appBaseUrl'

const StyledH3 = styled.h3`
  margin: 7px 0;
`

/**
 * This is rendered to static markup
 * So not possible to add store via context
 * or to observe
 */

const BeobPopup = ({ store, beob }: { store: Object, beob: Object }) => {
  const { activeNodes } = store.tree
  const { ap, projekt } = activeNodes

  // build url to open beob form
  let url = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/nicht-beurteilte-Beobachtungen/${
    beob.id
  }`
  const tpopbeob = store.table.tpopbeob.get(beob.id)
  if (tpopbeob) {
    if (tpopbeob.nicht_zuordnen && tpopbeob.nicht_zuordnen === 1) {
      url = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/nicht-zuzuordnende-Beobachtungen/${
        beob.id
      }`
    } else {
      const tpopId = tpopbeob.tpop_id
      const tpop = store.table.tpop.get(tpopId)
      const popId = tpop ? tpop.pop_id : ''
      url = `${appBaseUrl}/Projekte/${projekt}/Arten/${ap}/Populationen/${popId}/Teil-Populationen/${tpopId}/Beobachtungen/${
        beob.id
      }`
    }
  }

  const xKoord = beob.X
  const yKoord = beob.Y

  return (
    <div>
      <div>Beobachtung</div>
      <StyledH3>{beob.label}</StyledH3>
      <div>
        {`Koordinaten: ${xKoord.toLocaleString(
          'de-ch'
        )} / ${yKoord.toLocaleString('de-ch')}`}
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer">
        Formular in neuem Tab öffnen
      </a>
    </div>
  )
}

export default BeobPopup
