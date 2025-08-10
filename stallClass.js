const stalls = []
class Stall {
    constructor(id, genderNeutral, floor, isOccupied, lastOccupiedAt, cleanlinessRating, aggregateRating, ratingCount ,latestOccupancyTime, aggregateStayTime, averageStayTime, occupancyCount, longestVisit, lastOccupiedAtMS, avgOccupancyTimeString, longestVisitTimeString) {
        this.id = id,
            this.genderNeutral = genderNeutral,
            this.floor = floor,
            this.isOccupied = isOccupied,
            this.lastOccupiedAt = lastOccupiedAt,
            this.cleanlinessRating = cleanlinessRating,
            this.aggregateRating = aggregateRating,
            this.ratingCount = ratingCount
            this.latestOccupancyTime = latestOccupancyTime,
            this.aggregateStayTime = aggregateStayTime,
            this.averageStayTime = averageStayTime,
            this.occupancyCount = occupancyCount,
            this.longestVisit = longestVisit,
            this.lastOccupiedAtMS = lastOccupiedAtMS,
            this.avgOccupancyTimeString = avgOccupancyTimeString,
            this.longestVisitTimeString = longestVisitTimeString

    }
}

stalls.push(new Stall(1, true, 2, false, null, null, null, null, null, 0, 0, 0, 0, null, null, null))
stalls.push(new Stall(2, false, 2, false, null, null, null, null, null, 0, 0, 0, 0, null, null, null))
stalls.push(new Stall(3, false, 2, true, null, null, null, null, null, 0, 0, 0, 0, null, null, null))
stalls.push(new Stall(4, true, 2, false, null, null, null, null, null, 0, 0, 0, 0, null, null, null))


module.exports = {stalls, Stall}