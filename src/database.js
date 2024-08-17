import mongoose from "mongoose"
import configObject from './config/config.js'
const {mongo_url} = configObject

mongoose.connect(mongo_url)
    .then(() => console.log('MONGODB is working'))
    .catch((error) => console.log('There is an error with MONGODB', error))