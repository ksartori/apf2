// @flow
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import sortBy from 'lodash/sortBy'

export default ({ data, berichtjahr }:{ data: Object, berichtjahr: Number }) => {
  const projId = get(data, 'zielOhneTyp.id')
  const apId = get(data, 'zielOhneTyp.apsByProjId.nodes[0].id')

  return ([
    // 1. Art

    // Ziel ohne Jahr/Zieltyp/Ziel
    {
      title: 'Ziel ohne Jahr:',
      messages: (function() {
        const zielNodes = sortBy(
          get(data, 'zielOhneJahr.apsByProjId.nodes[0].zielsByApId.nodes', []),
          'id'
        )
        return zielNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', n.jahr, n.id],
          text: `Ziel: ${n.id}`,
        }))
      }())
    },
    {
      query: 'zielOhneTyp',
      title: 'Ziel ohne Typ:',
      messages: (function(){

      }()),
      data: (data) => {
        const zielNodes = sortBy(
          [...get(data, 'zielOhneTyp.apsByProjId.nodes[0].zielsByApId.nodes', [])],
          ['jahr', 'id']
        )
        return zielNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', n.jahr, n.id],
          text: [`Ziel: ${n.jahr || n.id}`],
        }))
      }
    },
    {
      query: 'zielOhneZiel',
      title: 'Ziel ohne Ziel:',
      messages: (function(){

      }()),
      data: (data) => {
        const zielNodes = sortBy(
          [...get(data, 'zielOhneZiel.apsByProjId.nodes[0].zielsByApId.nodes', [])],
          ['jahr', 'id']
        )
        return zielNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', n.jahr, n.id],
          text: [`Ziel: ${n.jahr || n.id}`],
        }))
      }
    },
    {
      query: 'zielberOhneJahr',
      title: 'Ziel-Bericht ohne Jahr:',
      messages: (function(){

      }()),
      data: (data) => {
        const zielNodes = get(data, 'zielberOhneJahr.apsByProjId.nodes[0].zielsByApId.nodes', [])
        const zielberNodes = flatten(
          zielNodes.map(n => get(n, 'zielbersByZielId.nodes'), [])
        )
        return zielberNodes.map(n => {
          const zielId = get(n, 'zielByZielId.id')
          const zielJahr = get(n, 'zielByZielId.jahr')
          return ({
            url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', get(n, 'zielByZielId.jahr'), zielId, 'Berichte', n.id],
            text: [`Ziel: ${zielJahr || zielId}, Bericht: ${n.id}`],
          })
        })
      }
    },
    {
      query: 'zielberOhneEntwicklung',
      title: 'Ziel-Bericht ohne Entwicklung:',
      messages: (function(){

      }()),
      data: (data) => {
        const zielNodes = get(data, 'zielberOhneEntwicklung.apsByProjId.nodes[0].zielsByApId.nodes', [])
        const zielberNodes = flatten(
          zielNodes.map(n => get(n, 'zielbersByZielId.nodes'), [])
        )
        return zielberNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele', get(n, 'zielByZielId.jahr'), get(n, 'zielByZielId.id'), 'Berichte', n.id],
          text: [`Ziel-Bericht (id): ${n.id}`],
        }))
      }
    },
    // AP-Erfolgskriterium ohne Beurteilung/Kriterien
    {
      query: 'erfkritOhneBeurteilung',
      title: 'Erfolgskriterium ohne Beurteilung:',
      messages: (function(){

      }()),
      data: (data) => {
        const erfkritNodes = get(data, 'erfkritOhneBeurteilung.apsByProjId.nodes[0].erfkritsByApId.nodes', [])
        return erfkritNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Erfolgskriterien', n.id],
          text: [`Erfolgskriterium (id): ${n.id}`],
        }))
      }
    },
    {
      query: 'erfkritOhneKriterien',
      title: 'Erfolgskriterium ohne Kriterien:',
      messages: (function(){

      }()),
      data: (data) => {
        const erfkritNodes = get(data, 'erfkritOhneKriterien.apsByProjId.nodes[0].erfkritsByApId.nodes', [])
        return erfkritNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Erfolgskriterien', n.id],
          text: [`Erfolgskriterium (id): ${n.id}`],
        }))
      }
    },
    // AP-Bericht ohne Jahr/Vergleich Vorjahr-Gesamtziel/Beurteilung
    {
      query: 'apberOhneJahr',
      title: 'AP-Bericht ohne Jahr:',
      messages: (function(){

      }()),
      data: (data) => {
        const erfkritNodes = get(data, 'apberOhneJahr.apsByProjId.nodes[0].apbersByApId.nodes', [])
        return erfkritNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Berichte', n.id],
          text: [`AP-Bericht (id): ${n.id}`],
        }))
      }
    },
    {
      query: 'apberOhneVergleichVorjahrGesamtziel',
      title: 'AP-Bericht ohne Vergleich Vorjahr - Gesamtziel:',
      messages: (function(){

      }()),
      data: (data) => {
        const erfkritNodes = get(data, 'apberOhneVergleichVorjahrGesamtziel.apsByProjId.nodes[0].apbersByApId.nodes', [])
        return erfkritNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Berichte', n.id],
          text: [`AP-Bericht (id): ${n.id}`],
        }))
      }
    },
    {
      query: 'apberOhneBeurteilung',
      title: 'AP-Bericht ohne Beurteilung:',
      messages: (function(){

      }()),
      data: (data) => {
        const erfkritNodes = get(data, 'apberOhneBeurteilung.apsByProjId.nodes[0].apbersByApId.nodes', [])
        return erfkritNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Berichte', n.id],
          text: [`AP-Bericht (id): ${n.id}`],
        }))
      }
    },
    // assoziierte Art ohne Art
    {
      query: 'assozartOhneArt',
      title: 'Assoziierte Art ohne Art:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = get(data, 'assozartOhneArt.apsByProjId.nodes[0].assozartsByApId.nodes', [])
        return nodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'assoziierte-Arten', n.id],
          text: [`Assoziierte Art (id): ${n.id}`],
        }))
      }
    },

    // 2. Population

    // Population: ohne Nr/Name/Status/bekannt seit/Koordinaten/tpop
    {
      query: 'popOhneNr',
      title: 'Population ohne Nr.:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = get(data, 'popOhneNr.apsByProjId.nodes[0].popsByApId.nodes', [])
        return nodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
          text: [`Population (Name): ${n.name}`],
        }))
      }
    },
    {
      query: 'popOhneName',
      title: 'Population ohne Name:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popOhneName.apsByProjId.nodes[0].popsByApId.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
      }
    },
    {
      query: 'popOhneStatus',
      title: 'Population ohne Status:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popOhneStatus.apsByProjId.nodes[0].popsByApId.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
      }
    },
    {
      query: 'popOhneBekanntSeit',
      title: 'Population ohne "bekannt seit":',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popOhneBekanntSeit.apsByProjId.nodes[0].popsByApId.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
      }
    },
    {
      query: 'popOhneKoord',
      title: 'Population: Mindestens eine Koordinate fehlt:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popOhneKoord.apsByProjId.nodes[0].popsByApId.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
      }
    },
    {
      query: 'popOhneTpop',
      title: 'Population ohne Teilpopulation:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popOhneTpop.apsByProjId.nodes[0].popsByApId.nodes', [])]
          .filter(n => get(n, 'tpopsByPopId.totalCount') === 0)
          .sort((a, b) => a.nr - b.nr)
        return nodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
      }
    },
    {
      query: 'popMitStatusUnklarOhneBegruendung',
      title: 'Population mit "Status unklar", ohne Begründung:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popMitStatusUnklarOhneBegruendung.apsByProjId.nodes[0].popsByApId.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', n.id],
          text: [`Population (Nr.): ${n.nr}`],
        }))
      }
    },
    {
      query: 'popMitMehrdeutigerNr',
      title: 'Population: Die Nr. ist mehrdeutig:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popMitMehrdeutigerNr.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      query: 'popOhnePopber',
      title: 'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Populations-Bericht (im Berichtjahr):',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popOhnePopber.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },

    // Bericht-Stati kontrollieren
    {
      query: 'popMitBerZunehmendOhneTpopberZunehmend',
      title: 'Populationen mit Bericht "zunehmend" ohne Teil-Population mit Bericht "zunehmend":',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popMitBerZunehmendOhneTpopberZunehmend.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      query: 'popMitBerAbnehmendOhneTpopberAbnehmend',
      title: 'Populationen mit Bericht "abnehmend" ohne Teil-Population mit Bericht "abnehmend":',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popMitBerAbnehmendOhneTpopberAbnehmend.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      query: 'popMitBerErloschenOhneTpopberErloschen',
      title: 'Populationen mit Bericht "erloschen" ohne Teil-Population mit Bericht "erloschen":',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popMitBerErloschenOhneTpopberErloschen.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      query: 'popMitBerErloschenUndTpopberNichtErloschen',
      title: 'Populationen mit Bericht "erloschen" und mindestens einer gemäss Bericht nicht erloschenen Teil-Population:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popMitBerErloschenUndTpopberNichtErloschen.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },

    // Stati der Population mit den Stati der Teil-Populationen vergleichen
    // Keine Teil-Population hat den Status der Population:
    {
      query: 'popOhneTpopMitGleichemStatus',
      title: 'Population: Keine Teil-Population hat den Status der Population:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popOhneTpopMitGleichemStatus.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      query: 'popStatus300TpopStatusAnders',
      title: 'Population: Status ist "potentieller Wuchs-/Ansiedlungsort". Es gibt aber Teil-Populationen mit abweichendem Status:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popStatus300TpopStatusAnders.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      query: 'popStatus201TpopStatusUnzulaessig',
      title: 'Population: Status ist "Ansaatversuch". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich" oder "angesiedelt, aktuell:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popStatus201TpopStatusUnzulaessig.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      query: 'popStatus202TpopStatusAnders',
      title: 'Population: Status ist "angesiedelt nach Beginn AP, erloschen/nicht etabliert". Es gibt Teil-Populationen mit abweichendem Status:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popStatus202TpopStatusAnders.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      query: 'popStatus211TpopStatusUnzulaessig',
      title: 'Population: Status ist "angesiedelt vor Beginn AP, erloschen/nicht etabliert". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich", "angesiedelt, aktuell", "Ansaatversuch", "potentieller Wuchsort"):',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popStatus211TpopStatusUnzulaessig.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      query: 'popStatus200TpopStatusUnzulaessig',
      title: 'Population: Status ist "angesiedelt nach Beginn AP, aktuell". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich", "angesiedelt vor Beginn AP, aktuell"):',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popStatus200TpopStatusUnzulaessig.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      query: 'popStatus210TpopStatusUnzulaessig',
      title: 'Population: Status ist "angesiedelt vor Beginn AP, aktuell". Es gibt Teil-Populationen mit nicht zulässigen Stati ("ursprünglich"):',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popStatus210TpopStatusUnzulaessig.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      query: 'popStatus101TpopStatusAnders',
      title: 'Population: Status ist "ursprünglich, erloschen". Es gibt Teil-Populationen (ausser potentiellen Wuchs-/Ansiedlungsorten) mit abweichendem Status:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popStatus101TpopStatusAnders.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },

    // Stati mit letztem Bericht vergleichen
    {
      query: 'popStatusErloschenLetzterPopberZunehmend',
      title: 'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "zunehmend" und es gab seither keine Ansiedlung:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popStatusErloschenLetzterPopberZunehmend.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      query: 'popStatusErloschenLetzterPopberStabil',
      title: 'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popStatusErloschenLetzterPopberStabil.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      query: 'popStatusErloschenLetzterPopberAbnehmend',
      title: 'Population: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popStatusErloschenLetzterPopberAbnehmend.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      query: 'popStatusErloschenLetzterPopberUnsicher',
      title: 'Population: Status ist "erloschen" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popStatusErloschenLetzterPopberUnsicher.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },

    // Stati kontrollieren
    {
      query: 'popOhnePopmassnber',
      title: 'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Massnahmen-Bericht (im Berichtjahr):',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popOhnePopmassnber.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    // Population: Entsprechen Koordinaten der Pop einer der TPops?
    // TODO: seems only to output pops with koord but no tpop
    {
      query: 'popKoordEntsprechenKeinerTpop',
      title: 'Population: Koordinaten entsprechen keiner Teilpopulation:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'popKoordEntsprechenKeinerTpop.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      title: 'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine aktuelle Teilpopulation oder eine ursprüngliche erloschene:',
      messages: (function(){
        const nodes = [...get(data, 'popStatusAnsaatversuchTpopAktuell.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }()),
    },
    {
      title: 'Population: Status ist "angesiedelt, Ansaatversuch", alle Teilpopulationen sind gemäss Status erloschen:',
      messages: (function(){
        const nodes = [...get(data, 'popStatusAnsaatversuchAlleTpopErloschen.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: `Population (Nr.): ${n.nr}`,
          }))
      }()),
    },
    {
      title: 'Population: Status ist "angesiedelt, Ansaatversuch", es gibt aber eine Teilpopulation mit Status "urspruenglich, erloschen:',
      messages: (function(){
        const nodes = [...get(data, 'popStatusAnsaatversuchMitTpopUrspruenglichErloschen.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }()),
    },
    {
      title: 'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "aktuell" (urspruenglich oder angesiedelt):',
      messages: (function(){
        const nodes = [...get(data, 'popStatusErloschenMitTpopAktuell.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }()),
    },
    {
      title: 'Population: Status ist "erloschen" (urspruenglich oder angesiedelt), es gibt aber eine Teilpopulation mit Status "angesiedelt, Ansaatversuch":',
      messages: (function(){
        const nodes = [...get(data, 'popStatusErloschenMitTpopAnsaatversuch.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }()),
    },
    {
      title: 'Population: Status ist "angesiedelt", es gibt aber eine Teilpopulation mit Status "urspruenglich":',
      messages: (function(){
        const nodes = [...get(data, 'popStatusAngesiedeltMitTpopUrspruenglich.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            proj_id: n.projId,
            ap_id: n.apId,
            hw: ':',
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }()),
    },
    // Vergleich Pop Status mit letztem Pop-Bericht
    {
      title: 'Population: Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Populations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung:',
      messages: (function(){
        const nodes = [...get(data, 'popStatusAktuellLetzterPopberErloschen.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }()),
    },
    {
      title: 'Population: Status ist "erloschen", der letzte Populations-Bericht meldet aber "aktuell":',
      messages: (function(){
        const nodes = [...get(data, 'popStatusErloschenLetzterPopberAktuell.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }()),
    },
    {
      title: 'Population: Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Populations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:',
      messages: (function(){
        const nodes = [...get(data, 'popStatusErloschenLetzterPopberErloschenMitAnsiedlung.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.id],
            text: [`Population (Nr.): ${n.nr}`],
          }))
      }()),
    },
    // Pop-Bericht/Pop-Massn.-Bericht ohne Jahr/Entwicklung
    {
      title: 'Populations-Bericht ohne Jahr:',
      messages: (function(){
        const popNodes = get(data, 'popberOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
        const popberNodes = flatten(
          popNodes.map(n => get(n, 'popbersByPopId.nodes'), [])
        )
        return popberNodes.map(n => ({
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Kontroll-Berichte', n.id],
          text: [`Population (Nr.): ${get(n, 'popByPopId.nr')}, Populations-Bericht (id): ${n.id}`],
        }))
      }()),
    },
    {
      query: 'popberOhneEntwicklung',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'popberOhneEntwicklung.id')
        const apId = get(data, 'popberOhneEntwicklung.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'popberOhneEntwicklung.apsByProjId.nodes[0].popsByApId.nodes', [])
        const popberNodes = flatten(
          popNodes.map(n => get(n, 'popbersByPopId.nodes'), [])
        )
        return popberNodes.map(n => ({
          proj_id: projId,
          ap_id: apId,
          hw: 'Populations-Bericht ohne Entwicklung:',
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Kontroll-Berichte', n.id],
          text: [`Population (Nr.): ${get(n, 'popByPopId.nr')}, Populations-Bericht (id): ${n.id}`],
        }))
      }
    },
    {
      query: 'popmassnberOhneJahr',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'popmassnberOhneJahr.id')
        const apId = get(data, 'popmassnberOhneJahr.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'popmassnberOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
        const popberNodes = flatten(
          popNodes.map(n => get(n, 'popmassnbersByPopId.nodes'), [])
        )
        return popberNodes.map(n => ({
          proj_id: projId,
          ap_id: apId,
          hw: 'Populations-Massnahmen-Bericht ohne Jahr:',
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Massnahmen-Berichte', n.id],
          text: [`Population (Nr.): ${get(n, 'popByPopId.nr')}, Populations-Massnahmen-Bericht (id): ${n.id}`],
        }))
      }
    },
    {
      query: 'popmassnberOhneEntwicklung',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'popmassnberOhneEntwicklung.id')
        const apId = get(data, 'popmassnberOhneEntwicklung.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'popmassnberOhneEntwicklung.apsByProjId.nodes[0].popsByApId.nodes', [])
        const popberNodes = flatten(
          popNodes.map(n => get(n, 'popmassnbersByPopId.nodes'), [])
        )
        return popberNodes.map(n => ({
          proj_id: projId,
          ap_id: apId,
          hw: 'Populations-Massnahmen-Bericht ohne Entwicklung:',
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Massnahmen-Berichte', n.id],
          text: [`Population (Nr.): ${get(n, 'popByPopId.nr')}, Populations-Massnahmen-Bericht (id): ${n.id}`],
        }))
      }
    },

    // 3. Teilpopulation

    // Stati mit letztem Bericht vergleichen
    {
      query: 'tpopStatusAktuellLetzterTpopberErloschen',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'tpopStatusAktuellLetzterTpopberErloschen.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            proj_id: n.projId,
            ap_id: n.apId,
            hw: 'Teilpopulation: Status ist "aktuell" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "erloschen" und es gab seither keine Ansiedlung:',
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
            text: [`Population (Nr.): ${n.popNr}, Teil-Population (Nr.): ${n.nr}`],
          }))
      }
    },
    {
      query: 'tpopStatusErloschenLetzterTpopberStabil',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'tpopStatusErloschenLetzterTpopberStabil.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            proj_id: n.projId,
            ap_id: n.apId,
            hw: 'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "stabil" und es gab seither keine Ansiedlung:',
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
            text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
          }))
      }
    },
    {
      query: 'tpopStatusErloschenLetzterTpopberAbnehmend',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'tpopStatusErloschenLetzterTpopberAbnehmend.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            proj_id: n.projId,
            ap_id: n.apId,
            hw: 'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "abnehmend" und es gab seither keine Ansiedlung:',
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
            text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
          }))
      }
    },
    {
      query: 'tpopStatusErloschenLetzterTpopberUnsicher',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'tpopStatusErloschenLetzterTpopberUnsicher.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            proj_id: n.projId,
            ap_id: n.apId,
            hw: 'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt) oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "unsicher" und es gab seither keine Ansiedlung:',
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
            text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
          }))
      }
    },
    {
      query: 'tpopStatusErloschenLetzterTpopberZunehmend',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'tpopStatusErloschenLetzterTpopberZunehmend.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            proj_id: n.projId,
            ap_id: n.apId,
            hw: 'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt), Ansaatversuch oder potentieller Wuchsort; der letzte Teilpopulations-Bericht meldet aber "zunehmend" und es gab seither keine Ansiedlung:',
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
            text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
          }))
      }
    },
    {
      query: 'tpopStatusErloschenLetzterTpopberAktuell',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'tpopStatusErloschenLetzterTpopberAktuell.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            proj_id: n.projId,
            ap_id: n.apId,
            hw: 'Teilpopulation: Status ist "erloschen", der letzte Teilpopulations-Bericht meldet aber "abnehmend", "stabil", "zunehmend" oder "unsicher":',
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
            text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
          }))
      }
    },
    {
      query: 'tpopStatusErloschenLetzterTpopberErloschenMitAnsiedlung',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'tpopStatusErloschenLetzterTpopberErloschenMitAnsiedlung.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            proj_id: n.projId,
            ap_id: n.apId,
            hw: 'Teilpopulation: Status ist "erloschen" (ursprünglich oder angesiedelt); der letzte Teilpopulations-Bericht meldet "erloschen". Seither gab es aber eine Ansiedlung:',
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
            text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
          }))
      }
    },
    // tpop ohne gewollte Werte
    {
      query: 'tpopOhneNr',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopOhneNr.id')
        const apId = get(data, 'tpopOhneNr.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopOhneNr.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        return tpopNodes.map(n => ({
          proj_id: projId,
          ap_id: apId,
          hw: 'Teilpopulation ohne Nr.:',
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: [`Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.id}`],
        }))
      }
    },
    {
      query: 'tpopOhneFlurname',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopOhneFlurname.id')
        const apId = get(data, 'tpopOhneFlurname.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopOhneFlurname.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        return tpopNodes.map(n => ({
          proj_id: projId,
          ap_id: apId,
          hw: 'Teilpopulation ohne Flurname:',
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: [`Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`],
        }))
      }
    },
    {
      query: 'tpopOhneStatus',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopOhneStatus.id')
        const apId = get(data, 'tpopOhneStatus.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopOhneStatus.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        return tpopNodes.map(n => ({
          proj_id: projId,
          ap_id: apId,
          hw: 'Teilpopulation ohne Status:',
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: [`Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`],
        }))
      }
    },
    {
      query: 'tpopOhneBekanntSeit',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopOhneBekanntSeit.id')
        const apId = get(data, 'tpopOhneBekanntSeit.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopOhneBekanntSeit.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        return tpopNodes.map(n => ({
          proj_id: projId,
          ap_id: apId,
          hw: 'Teilpopulation ohne "bekannt seit":',
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: [`Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`],
        }))
      }
    },
    {
      query: 'tpopOhneApberRelevant',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopOhneApberRelevant.id')
        const apId = get(data, 'tpopOhneApberRelevant.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopOhneApberRelevant.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        return tpopNodes.map(n => ({
          proj_id: projId,
          ap_id: apId,
          hw: 'Teilpopulation ohne "Fuer AP-Bericht relevant":',
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: [`Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`],
        }))
      }
    },
    {
      query: 'tpopOhneKoord',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopOhneKoord.id')
        const apId = get(data, 'tpopOhneKoord.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopOhneKoord.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        return tpopNodes.map(n => ({
          proj_id: projId,
          ap_id: apId,
          hw: 'Teilpopulation: Mindestens eine Koordinate fehlt:',
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: [`Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`],
        }))
      }
    },
    {
      query: 'tpopStatusPotentiellApberrelevant',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopStatusPotentiellApberrelevant.id')
        const apId = get(data, 'tpopStatusPotentiellApberrelevant.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopStatusPotentiellApberrelevant.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        return tpopNodes.map(n => ({
          proj_id: projId,
          ap_id: apId,
          hw: 'Teilpopulation mit Status "potenzieller Wuchs-/Ansiedlungsort" und "Fuer AP-Bericht relevant?" = ja:',
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: [`Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`],
        }))
      }
    },
    {
      query: 'tpopErloschenUndRelevantLetzteBeobVor1950',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'tpopErloschenUndRelevantLetzteBeobVor1950.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            proj_id: n.projId,
            ap_id: n.apId,
            hw: 'erloschene Teilpopulation "Fuer AP-Bericht relevant" aber letzte Beobachtung vor 1950:',
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
            text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
          }))
      }
    },
    {
      query: 'tpopStatusUnklarOhneBegruendung',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopStatusUnklarOhneBegruendung.id')
        const apId = get(data, 'tpopStatusUnklarOhneBegruendung.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopStatusUnklarOhneBegruendung.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        return tpopNodes.map(n => ({
          proj_id: projId,
          ap_id: apId,
          hw: 'Teilpopulation mit "Status unklar", ohne Begruendung:',
          url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', get(n, 'popByPopId.id'), 'Teil-Populationen', n.id],
          text: [`Population: ${get(n, 'popByPopId.nr') || get(n, 'popByPopId.id')}, Teil-Population: ${n.nr || n.id}`],
        }))
      }
    },
    {
      query: 'tpopPopnrTponrMehrdeutig',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'tpopPopnrTponrMehrdeutig.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            proj_id: n.projId,
            ap_id: n.apId,
            hw: 'Teilpopulation: Die TPop.-Nr. ist mehrdeutig:',
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
            text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
          }))
      }
    },
    {
      query: 'tpopOhneTpopber',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'tpopOhneTpopber.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            proj_id: n.projId,
            ap_id: n.apId,
            hw: 'Teilpopulation mit Kontrolle (im Berichtjahr) aber ohne Teilpopulations-Bericht (im Berichtjahr):',
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
            text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
          }))
      }
    },
    {
      query: 'tpopOhneMassnber',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'tpopOhneMassnber.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            proj_id: n.projId,
            ap_id: n.apId,
            hw: 'Teilpopulation mit Ansiedlung (vor dem Berichtjahr) und Kontrolle (im Berichtjahr) aber ohne Massnahmen-Bericht (im Berichtjahr):',
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
            text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
          }))
      }
    },
    {
      query: 'tpopMitStatusAnsaatversuchUndZaehlungMitAnzahl',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'tpopMitStatusAnsaatversuchUndZaehlungMitAnzahl.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            proj_id: n.projId,
            ap_id: n.apId,
            hw: 'Teilpopulation mit Status "Ansaatversuch", bei denen in der letzten Kontrolle eine Anzahl festgestellt wurde:',
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
            text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
          }))
      }
    },
    {
      query: 'tpopMitStatusPotentiellUndZaehlungMitAnzahl',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'tpopMitStatusPotentiellUndZaehlungMitAnzahl.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            proj_id: n.projId,
            ap_id: n.apId,
            hw: 'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei denen in einer Kontrolle eine Anzahl festgestellt wurde:',
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
            text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
          }))
      }
    },
    {
      query: 'tpopMitStatusPotentiellUndAnsiedlung',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const nodes = [...get(data, 'tpopMitStatusPotentiellUndAnsiedlung.nodes', [])]
          .sort((a, b) => a.nr - b.nr)
        return nodes
          .map(n => ({
            proj_id: n.projId,
            ap_id: n.apId,
            hw: 'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei der eine Massnahme des Typs "Ansiedlung" existiert:',
            url: ['Projekte', n.projId, 'Aktionspläne', n.apId, 'Populationen', n.popId, 'Teil-Populationen', n.id],
            text: [`Population: ${n.popNr || n.popId}, Teil-Population: ${n.nr || n.id}`],
          }))
      }
    },
    // TPop-Bericht ohne Jahr/Entwicklung
    {
      query: 'tpopberOhneJahr',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopberOhneJahr.id')
        const apId = get(data, 'tpopberOhneJahr.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopberOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopberNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopbersByTpopId.nodes'), [])
        )
        return tpopberNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Teilpopulations-Bericht ohne Jahr:',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Kontroll-Berichte', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontroll-Bericht: ${n.nr || n.id}`],
          })
        })
      }
    },
    {
      query: 'tpopberOhneEntwicklung',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopberOhneEntwicklung.id')
        const apId = get(data, 'tpopberOhneEntwicklung.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopberOhneEntwicklung.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopberNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopbersByTpopId.nodes'), [])
        )
        return tpopberNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Teilpopulations-Bericht ohne Entwicklung:',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Kontroll-Berichte', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontroll-Bericht: ${n.nr || n.id}`],
          })
        })
      }
    },

    // 4. Massnahmen

    // Massn ohne gewollte Felder
    {
      query: 'tpopmassnOhneJahr',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopmassnOhneJahr.id')
        const apId = get(data, 'tpopmassnOhneJahr.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopmassnOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopmassnNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopmassnsByTpopId.nodes'), [])
        )
        return tpopmassnNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Massnahme ohne Jahr:',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Massnahmen', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Massnahme: ${n.jahr || n.id}`],
          })
        })
      }
    },
    {
      query: 'tpopmassnOhneBearb',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopmassnOhneBearb.id')
        const apId = get(data, 'tpopmassnOhneBearb.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopmassnOhneBearb.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopmassnNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopmassnsByTpopId.nodes'), [])
        )
        return tpopmassnNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Massnahme ohne BearbeiterIn:',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Massnahmen', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Massnahme: ${n.jahr || n.id}`],
          })
        })
      }
    },
    {
      query: 'tpopmassnOhneTyp',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopmassnOhneTyp.id')
        const apId = get(data, 'tpopmassnOhneTyp.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopmassnOhneTyp.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopmassnNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopmassnsByTpopId.nodes'), [])
        )
        return tpopmassnNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Massnahme ohne Typ:',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Massnahmen', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Massnahme: ${n.jahr || n.id}`],
          })
        })
      }
    },
    // Massn.-Bericht ohne gewollte Felder
    {
      query: 'tpopmassnberOhneJahr',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopmassnberOhneJahr.id')
        const apId = get(data, 'tpopmassnberOhneJahr.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopmassnberOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopmassnberNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopmassnbersByTpopId.nodes'), [])
        )
        return tpopmassnberNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Massnahmen-Bericht ohne Jahr:',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Massnahmen-Berichte', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Massnahmen-Bericht: ${n.jahr || n.id}`],
          })
        })
      }
    },
    {
      query: 'tpopmassnberOhneBeurteilung',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopmassnberOhneBeurteilung.id')
        const apId = get(data, 'tpopmassnberOhneBeurteilung.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopmassnberOhneBeurteilung.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopmassnberNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopmassnbersByTpopId.nodes'), [])
        )
        return tpopmassnberNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Massnahmen-Bericht ohne Entwicklung:',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Massnahmen-Berichte', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Massnahmen-Bericht: ${n.jahr || n.id}`],
          })
        })
      }
    },

    // 5. Kontrollen

    // Kontrolle ohne Jahr/Zählung/Kontrolltyp
    {
      query: 'tpopfeldkontrOhneJahr',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopfeldkontrOhneJahr.id')
        const apId = get(data, 'tpopfeldkontrOhneJahr.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopfeldkontrOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes'), [])
        )
        return tpopkontrNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Feldkontrolle ohne Jahr:',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Feld-Kontrollen', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${n.jahr || n.id}`],
          })
        })
      }
    },
    {
      query: 'tpopfreiwkontrOhneJahr',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopfreiwkontrOhneJahr.id')
        const apId = get(data, 'tpopfreiwkontrOhneJahr.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopfreiwkontrOhneJahr.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes'), [])
        )
        return tpopkontrNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Freiwilligen-Kontrolle ohne Jahr:',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Freiwilligen-Kontrollen', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${n.jahr || n.id}`],
          })
        })
      }
    },
    {
      query: 'tpopfeldkontrOhneBearb',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopfeldkontrOhneBearb.id')
        const apId = get(data, 'tpopfeldkontrOhneBearb.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopfeldkontrOhneBearb.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes'), [])
        )
        return tpopkontrNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Feldkontrolle ohne BearbeiterIn:',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Feld-Kontrollen', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${n.jahr || n.id}`],
          })
        })
      }
    },
    {
      query: 'tpopfreiwkontrOhneBearb',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopfreiwkontrOhneBearb.id')
        const apId = get(data, 'tpopfreiwkontrOhneBearb.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopfreiwkontrOhneBearb.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes'), [])
        )
        return tpopkontrNodes.map(n => {
          const popId = get(n, 'tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopByTpopId.id')
          const tpopNr = get(n, 'tpopByTpopId.nr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Freiwilligen-Kontrolle ohne BearbeiterIn:',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Freiwilligen-Kontrollen', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${n.jahr || n.id}`],
          })
        })
      }
    },
    {
      query: 'tpopfeldkontrOhneZaehlung',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopfeldkontrOhneZaehlung.id')
        const apId = get(data, 'tpopfeldkontrOhneZaehlung.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopfeldkontrOhneZaehlung.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes'), [])
        )
        return tpopkontrNodes
          .filter(n => get(n, 'tpopkontrzaehlsByTpopkontrId.totalCount') === 0)
          .map(n => {
            const popId = get(n, 'tpopByTpopId.popByPopId.id')
            const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
            const tpopId = get(n, 'tpopByTpopId.id')
            const tpopNr = get(n, 'tpopByTpopId.nr')
            return ({
              proj_id: projId,
              ap_id: apId,
              hw: 'Feldkontrolle ohne Zählung:',
              url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Feld-Kontrollen', n.id],
              text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${n.jahr || n.id}`],
            })
          })
      }
    },
    {
      query: 'tpopfreiwkontrOhneZaehlung',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'tpopfreiwkontrOhneZaehlung.id')
        const apId = get(data, 'tpopfreiwkontrOhneZaehlung.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'tpopfreiwkontrOhneZaehlung.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes'), [])
        )
        return tpopkontrNodes
          .filter(n => get(n, 'tpopkontrzaehlsByTpopkontrId.totalCount') === 0)
          .map(n => {
            const popId = get(n, 'tpopByTpopId.popByPopId.id')
            const popNr = get(n, 'tpopByTpopId.popByPopId.nr')
            const tpopId = get(n, 'tpopByTpopId.id')
            const tpopNr = get(n, 'tpopByTpopId.nr')
            return ({
              proj_id: projId,
              ap_id: apId,
              hw: 'Freiwilligen-Kontrolle ohne Zählung:',
              url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Freiwilligen-Kontrollen', n.id],
              text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${n.jahr || n.id}`],
            })
          })
      }
    },
    // Zählung ohne gewollte Felder
    {
      query: 'feldkontrzaehlungOhneEinheit',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'feldkontrzaehlungOhneEinheit.id')
        const apId = get(data, 'feldkontrzaehlungOhneEinheit.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'feldkontrzaehlungOhneEinheit.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes'), [])
        )
        const tpopkontrzaehlNodes = flatten(
          tpopkontrNodes.map(n => get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []))
        )
        return tpopkontrzaehlNodes.map(n => {
          const popId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
          const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
          const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
          const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Zählung ohne Einheit (Feld-Kontrolle):',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Feld-Kontrollen', tpopkontrId, 'Zaehlungen', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${n.id}`],
          })
        })
      }
    },
    {
      query: 'freiwkontrzaehlungOhneEinheit',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'freiwkontrzaehlungOhneEinheit.id')
        const apId = get(data, 'freiwkontrzaehlungOhneEinheit.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'freiwkontrzaehlungOhneEinheit.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes'), [])
        )
        const tpopkontrzaehlNodes = flatten(
          tpopkontrNodes.map(n => get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []))
        )
        return tpopkontrzaehlNodes.map(n => {
          const popId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
          const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
          const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
          const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Zählung ohne Einheit (Freiwilligen-Kontrolle):',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Freiwilligen-Kontrollen', tpopkontrId, 'Zaehlungen', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${n.id}`],
          })
        })
      }
    },
    {
      query: 'feldkontrzaehlungOhneMethode',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'feldkontrzaehlungOhneMethode.id')
        const apId = get(data, 'feldkontrzaehlungOhneMethode.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'feldkontrzaehlungOhneMethode.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes'), [])
        )
        const tpopkontrzaehlNodes = flatten(
          tpopkontrNodes.map(n => get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []))
        )
        return tpopkontrzaehlNodes.map(n => {
          const popId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
          const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
          const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
          const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Zählung ohne Methode (Feld-Kontrolle):',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Feld-Kontrollen', tpopkontrId, 'Zaehlungen', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${n.id}`],
          })
        })
      }
    },
    {
      query: 'freiwkontrzaehlungOhneMethode',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'freiwkontrzaehlungOhneMethode.id')
        const apId = get(data, 'freiwkontrzaehlungOhneMethode.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'freiwkontrzaehlungOhneMethode.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes'), [])
        )
        const tpopkontrzaehlNodes = flatten(
          tpopkontrNodes.map(n => get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []))
        )
        return tpopkontrzaehlNodes.map(n => {
          const popId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
          const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
          const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
          const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Zählung ohne Methode (Freiwilligen-Kontrolle):',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Freiwilligen-Kontrollen', tpopkontrId, 'Zaehlungen', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${n.id}`],
          })
        })
      }
    },
    {
      query: 'feldkontrzaehlungOhneAnzahl',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'feldkontrzaehlungOhneAnzahl.id')
        const apId = get(data, 'feldkontrzaehlungOhneAnzahl.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'feldkontrzaehlungOhneAnzahl.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes'), [])
        )
        const tpopkontrzaehlNodes = flatten(
          tpopkontrNodes.map(n => get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []))
        )
        return tpopkontrzaehlNodes.map(n => {
          const popId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
          const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
          const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
          const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Zählung ohne Anzahl (Feld-Kontrolle):',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Feld-Kontrollen', tpopkontrId, 'Zaehlungen', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${n.id}`],
          })
        })
      }
    },
    {
      query: 'freiwkontrzaehlungOhneAnzahl',
      title: 'query:',
      messages: (function(){

      }()),
      data: (data) => {
        const projId = get(data, 'freiwkontrzaehlungOhneAnzahl.id')
        const apId = get(data, 'freiwkontrzaehlungOhneAnzahl.apsByProjId.nodes[0].id')
        const popNodes = get(data, 'freiwkontrzaehlungOhneAnzahl.apsByProjId.nodes[0].popsByApId.nodes', [])
        const tpopNodes = flatten(
          popNodes.map(n => get(n, 'tpopsByPopId.nodes'), [])
        )
        const tpopkontrNodes = flatten(
          tpopNodes.map(n => get(n, 'tpopkontrsByTpopId.nodes'), [])
        )
        const tpopkontrzaehlNodes = flatten(
          tpopkontrNodes.map(n => get(n, 'tpopkontrzaehlsByTpopkontrId.nodes', []))
        )
        return tpopkontrzaehlNodes.map(n => {
          const popId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.id')
          const popNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.nr')
          const tpopId = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.id')
          const tpopNr = get(n, 'tpopkontrByTpopkontrId.tpopByTpopId.nr')
          const tpopkontrId = get(n, 'tpopkontrByTpopkontrId.id')
          const tpopkontrJahr = get(n, 'tpopkontrByTpopkontrId.jahr')
          return ({
            proj_id: projId,
            ap_id: apId,
            hw: 'Zählung ohne Anzahl (Freiwilligen-Kontrolle):',
            url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen', popId, 'Teil-Populationen', tpopId, 'Freiwilligen-Kontrollen', tpopkontrId, 'Zaehlungen', n.id],
            text: [`Population: ${popNr || popId}, Teil-Population: ${tpopNr || tpopId}, Kontrolle: ${tpopkontrJahr || tpopkontrId}, Zählung: ${n.id}`],
          })
        })
      }
    },
  ])
}