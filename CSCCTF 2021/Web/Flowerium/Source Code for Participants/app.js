const express = require('express');
const mongoose = require('mongoose');
const  { graphqlHTTP } = require('express-graphql');
const NoIntrospection = require('graphql-disable-introspection');
const app = express();
const graphqlSchema = require('./controllers/schema');
const graphqlResolver = require('./controllers/resolvers');
const auth = require('./middleware/auth');


app.use(auth);

app.post('/graphql',graphqlHTTP({
    schema : graphqlSchema,
    rootValue : graphqlResolver,
    validationRules : [NoIntrospection],
    customFormatErrorFn(err){
        if(!err.originalError){
            return err;
        }
        const data = err.originalError.data;
        const message = err.message || 'An error occured';
        const code = err.originalError.code || 500;
        return { message : message,  status : code, data:data};
    }
}));


mongoose.connect(
    'mongodb://localhost:27017/flowerium'
).then(result => {
    app.listen(11000);
})
.catch(err => {
    console.log(err);
})