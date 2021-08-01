const {buildSchema} = require('graphql');

module.exports = buildSchema(`
    type Product{
        _id : ID!
        title : String!
        price : Int!
        isVip : Boolean!
        quantity : Int
    }

    type ProductsData{
        products : [Product!]!
    }

    type AuthData{
        token : String!
        userId : String!
    }

    type User{
        _id : ID!
        name : String!
        email : String!
        isVip : Boolean!
        balance : Int!
    }

    input SingleProductData{
        product : String!
    }

    input UserData{
        email : String!
        password : String!
        name : String!
    }

    type RootMutation{
        register(userInput : UserData) : User!
        addToCart(_id : ID!) : String!
        removeItemFromCart(_id : ID!) : String!
        clearAllItemsFromCart : String!
    }

    type RootQuery{
        login(email : String!, password : String!): AuthData!
        products: ProductsData!
        getProduct(productInput : SingleProductData) : ID
        getCart : ProductsData!
    }

    schema{
        query : RootQuery
        mutation : RootMutation
    }
`);