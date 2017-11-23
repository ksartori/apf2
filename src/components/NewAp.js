// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import Dialog from 'material-ui/Dialog'
import AutoComplete from 'material-ui/AutoComplete'
import FlatButton from 'material-ui/FlatButton'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`
const StyledAutoComplete = styled(AutoComplete)`
  margin-bottom: -12px;
`

const enhance = compose(
  inject('store'),
  withState('focused', 'changeFocused', false),
  withState('searchText', 'changeSearchText', ''),
  withState('searchTextWasChanged', 'changeSearchTextWasChanged', ''),
  withHandlers({
    onNewRequest: props => val => {
      const { updatePropertyInDb, fieldName, dataSourceConfig } = props
      updatePropertyInDb(props.tree, fieldName, val[dataSourceConfig.value])
    },
    onFocus: props => () => props.changeFocused(true),
    onBlur: props => () => {
      const {
        changeFocused,
        searchText,
        searchTextWasChanged,
        updatePropertyInDb,
        tree,
        fieldName,
      } = props
      changeFocused(false)
      if (!searchText && searchTextWasChanged) {
        // onNewRequest does not happen when value was removed by deleting text
        updatePropertyInDb(tree, fieldName, null)
      }
    },
    onUpdateSearchText: props => searchText => {
      props.changeSearchText(searchText)
      props.changeSearchTextWasChanged(true)
    },
  }),
  observer
)

const NewAp = ({
  store,
  valueText = '',
  onNewRequest,
  focused,
  changeFocused,
  onFocus,
  onBlur,
  searchText,
  changeSearchText,
  onUpdateSearchText,
  searchTextWasChanged,
  changeSearchTextWasChanged,
}: {
  store: Object,
  tree: Object,
  fieldName: string,
  valueText?: string,
  updatePropertyInDb: () => void,
  onNewRequest: () => void,
  focused: boolean,
  changeFocused: () => void,
  onFocus: () => void,
  onBlur: () => void,
  searchText: ?string,
  changeSearchText: () => void,
  onUpdateSearchText: () => void,
  searchTextWasChanged: boolean,
  changeSearchTextWasChanged: () => void,
}) => {
  const label = 'Art'
  let searchTextToUse = searchText
  if (!searchText && valueText && isNaN(valueText) && !searchTextWasChanged) {
    searchTextToUse = valueText
  }
  if (searchTextToUse === null) searchTextToUse = ''
  const dataSource = store.dropdownList.artListForAp
  const dataSourceConfig = {
    value: 'TaxonomieId',
    text: 'Artname',
  }
  const dataSourceLength = dataSource.filter(d => {
    if (
      dataSourceConfig &&
      dataSourceConfig.text &&
      d[dataSourceConfig.text] &&
      d[dataSourceConfig.text].toLowerCase() &&
      searchTextToUse &&
      searchTextToUse.toLowerCase()
    ) {
      return d[dataSourceConfig.text]
        .toLowerCase()
        .includes(searchTextToUse.toLowerCase())
    }
    return true
  }).length
  let labelFilterHint = 'Zum Filtern tippen. '
  if (valueText && !searchTextWasChanged) {
    labelFilterHint = 'Zum Filtern: Eintrag löschen, dann tippen. '
  }
  let labelNumberLimit = ''
  if (searchText && dataSourceLength === 0) {
    labelNumberLimit = 'Kein Eintrag entspricht dem Filter.'
  } else if (dataSourceLength && dataSourceLength <= 200) {
    labelNumberLimit = `Alle passenden Einträge werden aufgelistet.`
  } else if (dataSourceLength > 200) {
    labelNumberLimit = 'Nur die ersten 200 Einträge werden aufgelistet.'
  }
  const labelText = focused
    ? `${label}${labelFilterHint || labelNumberLimit ? '. ' : ''}${
        labelFilterHint
      }${labelNumberLimit}`
    : label
  const actions = [
    <FlatButton
      label="abbrechen"
      primary={true}
      onClick={() => 
        store.setShowNewApModal(false)
      }
    />,
  ]

  return (
    <Dialog
      title="Neue Art"
      open={store.showNewApModal}
      actions={actions}
      contentStyle={{
        maxWidth: '400px',
      }}
    >
      <StyledDiv>
        <StyledAutoComplete
          hintText={dataSource.length === 0 ? 'lade Daten...' : ''}
          fullWidth
          floatingLabelText={labelText}
          dataSource={toJS(dataSource)}
          dataSourceConfig={dataSourceConfig}
          searchText={searchTextToUse}
          onUpdateInput={onUpdateSearchText}
          filter={AutoComplete.caseInsensitiveFilter}
          maxSearchResults={200}
          onNewRequest={onNewRequest}
          openOnFocus
          onFocus={onFocus}
          onBlur={onBlur}
          menuStyle={{
            maxHeight: `${window.innerHeight * 0.8}px`,
          }}
        />
      </StyledDiv>
    </Dialog>
  )
}

export default enhance(NewAp)
