const axios = require('axios');


const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
//Hardcoded data 
// const customers = [
//   {
//     id: '1', name: 'John Doe', email: 'joe@gmail.com', age: 35
//   },
//   {
//     id: '2', name: 'Mary Doe', email: 'Mary@gmail.com', age: 33
//   },
//   {
//     id: '3', name: 'harry Doe', email: 'harry@gmail.com', age: 12
//   },
// ]
//CustomerType
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  })
})

//RootQuery
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        // for (let i = 0; i < customers.length; i++) {
        //   if (customers[i].id == args.id) {
        //     return customers[i]
        //   }
        // }
        return axios.get('http://localhost:3000/customers/' + args.id)
          .then(res => res.data)
      }
    }, customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return axios.get('http://localhost:3000/customers/')
          .then(res => res.data)
      }
    }
  }

})
// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      }, resolve(parentValue, args) {
        return axios.delete('http://localhost:3000/customers/' + args.id).then(res => res.data)
      }
    },
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      }, resolve(parentValue, args) {
        return axios.post('http://localhost:3000/customers/', {
          name: args.name,
          email: args.email,
          age: args.age,
        }).then(res => res.data)
      }
    },
    updateCustomer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      }, resolve(parentValue, args) {
        return axios.patch('http://localhost:3000/customers/' + args.id, args)
          .then(res => res.data)
      }
    }

  })
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
