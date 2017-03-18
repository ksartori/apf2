import React, { PropTypes } from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import FontIcon from 'material-ui/FontIcon'
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'

const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 5px;
`
const DragHandleIcon = styled(FontIcon)`
  font-size: 18px !important;
  color: #7b7b7b !important;
  cursor: grab;
`
const ZuordnenIcon = styled(FontIcon)`
  font-size: 18px !important;
`
const LayerDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
  &:not(:last-of-type) {
    border-bottom: 1px solid #ececec;
  }
  /*
   * z-index is needed because leaflet
   * sets high one for controls
   */
  z-index: 2000;
  /*
   * font-size is lost while moving a layer
   * because it is inherited from higher up
   */
  font-size: 12px;
`
const IconsDiv = styled.div`
  display: flex;
`
const ZuordnenDiv = styled.div`
  padding-right: 3px;
`
const Input = styled.input`
  margin-right: 4px;
  /*vertical-align: -2px;*/
`
const Label = styled.label`
  padding-right: 4px;
  user-select: none;
`
/**
 * don't know why but passing store
 * with mobx inject does not work here
 * so passed in from parent
 */

const DragHandle = SortableHandle(() =>
  <DragHandleIcon
    className="material-icons"
    title="ziehen, um Layer zu stapeln"
  >
    drag_handle
  </DragHandleIcon>
)
const SortableItem = SortableElement(({ overlay, store, activeOverlays }) => {
  const assigningIsPossible = (
    store.map.activeOverlays.includes(`Tpop`) &&
    (
      (
        store.map.activeOverlays.includes(`BeobNichtBeurteilt`) &&
        overlay.value === `BeobNichtBeurteilt`
      ) ||
      (
        store.map.activeOverlays.includes(`TpopBeob`) &&
        overlay.value === `TpopBeob`
      )
    )
  )
  return (
    <LayerDiv>
      <Label>
        <Input
          type="checkbox"
          value={overlay.value}
          checked={activeOverlays.includes(overlay.value)}
          onChange={() => {
            if (activeOverlays.includes(overlay.value)) {
              return store.map.removeActiveOverlay(overlay.value)
            }
            return store.map.addActiveOverlay(overlay.value)
          }}
        />
        {overlay.label}
      </Label>
      <IconsDiv>
        {
          [`BeobNichtBeurteilt`, `TpopBeob`].includes(overlay.value) &&
          <ZuordnenDiv>
            <ZuordnenIcon
              className="material-icons"
              title={store.map.beob.assigning ? `Zuordnung beenden` : `Teil-Populationen zuordnen`}
              style={{
                color: assigningIsPossible ? `black` : `#e2e2e2`,
                cursor: assigningIsPossible ? `pointer` : `inherit`,
              }}
              onClick={() => {
                if (store.map.activeOverlays.includes(`Tpop`)) {
                  store.map.beob.toggleAssigning()
                }
              }}
            >
              { store.map.beob.assigning ? `pause_circle_outline` : `play_circle_outline` }
            </ZuordnenIcon>
          </ZuordnenDiv>
        }
        <div>
          <DragHandle />
        </div>
      </IconsDiv>
    </LayerDiv>
)
})
const SortableList = SortableContainer(({ items, store, activeOverlays }) =>
  <div>
    {
      items.map((overlay, index) =>
        <SortableItem
          key={index}
          index={index}
          overlay={overlay}
          store={store}
          activeOverlays={activeOverlays}
        />
      )
    }
  </div>
)

const Overlays = ({ store }) =>
  <CardContent>
    <SortableList
      items={store.map.overlays}
      onSortEnd={({ oldIndex, newIndex }) =>
        store.map.moveOverlay({ oldIndex, newIndex })
      }
      useDragHandle
      lockAxis="y"
      store={store}
      activeOverlays={toJS(store.map.activeOverlays)}
    />
  </CardContent>

Overlays.propTypes = {
  store: PropTypes.object.isRequired,
}

export default observer(Overlays)
