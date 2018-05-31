// @flow
import gql from 'graphql-tag'
import get from 'lodash/get'

export default {
  Mutation: {
    createDatasetDeleted: (_, { table, id, label, url, data, time }, { cache }) => {
      console.log('resolvers, createDatasetDeleted: datasetDeleted:', { table, id, label, url, data })
      const previousDD = cache.readQuery({
        query: gql`
            query Query {
              datasetsDeleted @client
            }
          `
      })
      console.log('resolvers, createDatasetDeleted: previousDD:', previousDD)
      const previousDatasetsDeleted = get(previousDD, 'datasetsDeleted', [])
        .map(d => JSON.parse(d))
      console.log('resolvers, createDatasetDeleted: previousDatasetsDeleted:', previousDatasetsDeleted)

      let datasetsDeleted = [
        ...previousDatasetsDeleted,
        {
          table,
          id,
          label,
          url,
          data,
          time,
        }
      ]
      datasetsDeleted = datasetsDeleted.map(d => JSON.stringify(d))
      console.log('resolvers, createDatasetDeleted, datasetsDeleted after:', datasetsDeleted)
      cache.writeData({
        data: {
          datasetsDeleted
        }
      })
      return null
    },
    deleteDatasetDeletedById: (_, { id }, { cache }) => {
      const data = cache.readQuery({
        query: gql`
            query Query {
              datasetsDeleted @client
            }
          `
      })
      let datasetsDeleted = get(data, 'datasetsDeleted')
      datasetsDeleted = datasetsDeleted.filter(d => d.id !== id)
      cache.writeData({
        data: {
          datasetsDeleted
        }
      })
      return null
    },
  },
}
