require('dotenv').config()

module.exports = {
  dbURL: `mongodb+srv://Tal:${process.env.mongoPass}@clustert.tpm7b6k.mongodb.net/?retryWrites=true&w=majority`,
  dbName : 'musicfy_db'
}
