const {stalls, Stall} =  require('./stallClass.js')

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
        if (!stall) return null
        return stall
    },
    stallsByHighestOccupancyTime: () => {
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
            else return null
        } else return null

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
            else return null

        } else return null
    },
    reportCleanliness: ({ id, rating }) => {
        const stallIndex = stalls.findIndex(s => s.id === id)
        if (stallIndex !== -1) {
            if (rating < 0 || rating > 5) return null
            if (!stalls[stallIndex].lastOccupiedAt) return null //users cannot rate a stall if it was never used
            stalls[stallIndex].cleanlinessRating = rating
            return stalls[stallIndex]
        } return null
    },
    addStall: ({ genderNeutral, floor }) => {
        const latestID = stalls.length != 0 ? stalls.at(-1).id : 0
        const newStall = new Stall(latestID + 1, genderNeutral, floor, false, null, null, null, 0, 0, 0, 0, null, null, null)
        stalls.push(newStall)
        return newStall
    },
    deleteStall: ({ id }) => {
        const stallIndex = stalls.findIndex(s => s.id === id)

        if (stallIndex === -1) return null

        const [deletedStall] = stalls.splice(stallIndex, 1)
        return deletedStall

    }
}

module.exports = {resolvers}