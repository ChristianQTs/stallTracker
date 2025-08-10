// JavaScript source code
const express = require('express')
const  {graphqlHTTP} = require('express-graphql')
const { schema } = require('./schema.js')
const {resolvers } = require('./resolvers.js')

const app = express();




app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql:true
}))

app.listen(6969, () => console.log('Stalls on the line'))