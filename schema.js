const {buildSchema } = require('graphql')

const schema = buildSchema(`
    type Stall{
        id:Int!
        genderNeutral:Boolean
        floor : Int
        isOccupied:Boolean
        lastOccupiedAt:String
        cleanlinessRating:Float
        latestOccupancyTime:String
        longestVisitTimeString : String
        avgOccupancyTimeString : String
    }

    type Query {
        allStalls:[Stall]
        availableStalls:[Stall]
        stall(id:Int!):Stall
        stallsByHighestOccupancyTime:[Stall]

    }

    type Mutation {
        enterStall(id:Int!) : Stall,
        exitStall(id:Int!):Stall,
        reportCleanliness(id:Int! rating:Float!) : Stall,
        addStall(genderNeutral:Boolean! floor:Int!):Stall,
        deleteStall(id:Int!) : Stall
        }
`)

module.exports = {schema}