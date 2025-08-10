const { GraphQLError } = require('./node_modules/graphql/index.js')
const { stalls, Stall } = require('./stallClass.js')
class customError extends GraphQLError {
    constructor(message, code, status = 400) {
        super(message, {
            extensions: { code, http: {status}}
        })
    }
}

//convert seconds to Minute and Second Format:

const minuteAndSecond = seconds => {

    if (seconds >= 60) {

        const minutes = Math.floor(seconds / 60) === 1 ? `1 minute ` : `${Math.floor(seconds / 60)} minutes `
        const seconds1 = (seconds % 60) === 1 ? `1 second` : `${Math.floor(seconds % 60)} seconds`
        if (Math.floor(seconds % 60) === 0) return minutes
        return minutes + seconds1
    }
    if (seconds === 1) {
        return '1 second'
    }
    return `${seconds} seconds`

}

const resolvers = {
    allStalls: () => stalls,
    availableStalls: () => stalls.filter(s => s.isOccupied === false),
    stall: ({ id }) => {
        const stall = stalls.find(s => s.id === id)
        if (!stall) {
            throw new customError('Stall not found', 'STALL_NOT_FOUND', 404)
        }
        return stall
    },
    stallsByHighestOccupancyTime: () => {
        if (!stalls) throw new customError('No stalls found', 'NO_STALLS_FOUND', 404)
        const sortedStalls = [...stalls].sort(function (a, b) { return b.longestVisit - a.longestVisit })
        return sortedStalls
    },
    enterStall: ({ id }) => {
        const stallIndex = stalls.findIndex(s => s.id === id)
        if (stallIndex !== -1) {
            if (!stalls[stallIndex].isOccupied) {
                stalls[stallIndex].isOccupied = true
                stalls[stallIndex].lastOccupiedAt = new Date().toISOString()
                stalls[stallIndex].lastOccupiedAtMS = Date.now()
                return stalls[stallIndex]
            }
            else throw new customError('Stall is already occupied', 'STALL_OCCUPIED', 400)
        } else throw new customError('Stall not found', 'STALL_NOT_FOUND', 404)
        
    },
    exitStall: ({ id }) => {
        const stallIndex = stalls.findIndex(s => s.id === id)
        if (stallIndex !== -1) {
            if (stalls[stallIndex].isOccupied) {
                stalls[stallIndex].isOccupied = false
                const newLatestOccupancyTime = Math.floor((Number(Date.now()) - Number(stalls[stallIndex].lastOccupiedAtMS)) / 1000)
                stalls[stallIndex].latestOccupancyTime = minuteAndSecond(newLatestOccupancyTime)
                stalls[stallIndex].aggregateStayTime += newLatestOccupancyTime
                stalls[stallIndex].occupancyCount++
                stalls[stallIndex].averageStayTime = Number((stalls[stallIndex].aggregateStayTime / stalls[stallIndex].occupancyCount).toFixed(2))
                stalls[stallIndex].avgOccupancyTimeString = minuteAndSecond(stalls[stallIndex].averageStayTime)
                if (newLatestOccupancyTime > stalls[stallIndex].longestVisit) {
                    stalls[stallIndex].longestVisit = newLatestOccupancyTime
                    stalls[stallIndex].longestVisitTimeString = minuteAndSecond(stalls[stallIndex].longestVisit)
                }
                return stalls[stallIndex]
            }
            else throw new customError('Stall not occupied', 'STALL_NOT_OCCUPIED', 400)

        } else throw new customError('Stall not found', 'STALL_NOT_FOUND', 404)
    },
    reportCleanliness: ({ id, rating }) => {
        const stallIndex = stalls.findIndex(s => s.id === id)
        if (stallIndex !== -1) {
            if (rating < 1 || rating > 5) throw new customError('Invalid rating', 'INVALID_RATING', 400)
            if (!stalls[stallIndex].lastOccupiedAt) throw new customError('Stall was never used', 'STALL_NOT_USED', 400)
            stalls[stallIndex].aggregateRating += rating
            stalls[stallIndex].ratingCount ++
            stalls[stallIndex].cleanlinessRating = Number((stalls[stallIndex].aggregateRating / stalls[stallIndex].ratingCount).toFixed(2))
            return stalls[stallIndex]
        } else throw new customError('Stall not found', 'STALL_NOT_FOUND', 404)
    },
    addStall: ({ genderNeutral, floor }) => {
        if (genderNeutral == null || floor == null) throw new customError('Provide all fields', 'INCOMPLETE_FIELDS', 400)
        const latestID = stalls.length != 0 ? stalls.at(-1).id : 0
        const newStall = new Stall(latestID + 1, genderNeutral, floor, false, null, null, null, 0, 0, 0, 0, null, null, null)
        stalls.push(newStall)
        return newStall
    },
    deleteStall: ({ id }) => {
        const stallIndex = stalls.findIndex(s => s.id === id)

        if (stallIndex === -1) throw new customError('Stall not found', 'STALL_NOT_FOUND', 404)

        const [deletedStall] = stalls.splice(stallIndex, 1)
        return deletedStall

    }
}

module.exports = {resolvers}