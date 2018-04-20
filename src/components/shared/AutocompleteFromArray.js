// @flow
import React from 'react'
import { observer } from 'mobx-react'
import AutoComplete from 'material-ui/AutoComplete'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import styled from 'styled-components'

const StyledAutoComplete = styled(AutoComplete)`
  margin-bottom: -12px;
`

const enhance = compose(
  withState('focused', 'changeFocused', false),
  withState('searchText', 'changeSearchText', ''),
  withState('searchTextWasChanged', 'changeSearchTextWasChanged', ''),
  withHandlers({
    onNewRequest: ({ updatePropertyInDb, fieldName, tree }) => val => {
      updatePropertyInDb(tree, fieldName, val)
    },
    onFocus: props => () => props.changeFocused(true),
    onBlur: ({
      changeFocused,
      searchText,
      searchTextWasChanged,
      updatePropertyInDb,
      tree,
      fieldName,
    }) => () => {
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

const MyAutocomplete = ({
  label,
  valueText = '',
  dataSource,
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
  tree: Object,
  label: string,
  fieldName: string,
  valueText?: string,
  dataSource: Array<Object>,
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
  // console.log('AutoCompleteFromArray: dataSource:', dataSource)
  let searchTextToUse = searchText
  if (!searchText && valueText && !searchTextWasChanged) {
    searchTextToUse = valueText
  }
  if (searchTextToUse === null) searchTextToUse = ''
  const dataSourceLength = dataSource.filter(d => {
    if (
      d &&
      d.toLowerCase() &&
      searchTextToUse &&
      searchTextToUse.toLowerCase()
    ) {
      return d.toLowerCase().includes(searchTextToUse.toLowerCase())
    }
    return true
  }).length
  let labelFilterHint = 'Zum Filtern tippen. '
  if (valueText && !searchTextWasChanged) {
    labelFilterHint = 'Zum Filtern: Aktuellen Wert löschen, dann tippen. '
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
    ? `${label}${
        labelFilterHint || labelNumberLimit ? '. ' : ''
      }${labelFilterHint}${labelNumberLimit}`
    : label

  return (
    <StyledAutoComplete
      hintText={dataSource.length === 0 ? 'lade Daten...' : ''}
      fullWidth
      floatingLabelText={labelText}
      dataSource={dataSource}
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
  )
}

export default enhance(MyAutocomplete)
