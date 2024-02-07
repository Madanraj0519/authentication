const VenueModel = require('../model/Venue.model');

const getAllVenues =  async() => {
    return await VenueModel.find();
  }


module.exports = getAllVenues