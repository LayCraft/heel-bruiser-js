module.exports = class LocationCache {
    //this file is an in memory cache for saving previously checked routes.
    constructor(){
        this.pool = {}
        this.clearCache()
    }

    setCache(x, y, location){
        //put the array into the cache at the specified x and y
        let cacheName = str(x)+":"+str(y)
        this.pool[cacheName] = location
    }
    getCache(x, y){
        //get the array from the cache if it exists at x and y
        let cacheName = str(x)+":"+str(y)
        if(!this.pool[cacheName]){
            return null
        } else return this.pool[cacheName]
    }
    clearCache(){
        //reset pool to nothing
        this.pool = {}
    }
}