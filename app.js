require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

app.set('view engine', 'ejs')

const visitorSchema = new mongoose.Schema({
  name: String,
  count: Number,
})

mongoose
  .connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((db) => console.log('DB is connected'))
  .catch((err) => console.error('Error'))

const Visitor = mongoose.model('Visitors', visitorSchema)

app.get('/', async (req, res) => {
  try {
    const visitor = {
      name: req.query.name ? req.query.name : 'Anónimo',
      count: 1,
    }
    const findVisitor = await Visitor.findOne({ name: visitor.name })
    if (visitor.name === 'Anónimo') {
      await Visitor.create(visitor)
    } else if (findVisitor) {
      const count = findVisitor.count + 1
      await Visitor.findByIdAndUpdate(findVisitor._id, { count: count })
    } else {
      await Visitor.create(visitor)
    }
  } catch (error) {
    console.log(error)
  }

  const allVisitors = await Visitor.find({})
  res.render('index', { allVisitors })
})

app.listen(3000, () => console.log('Listen on port 3000!'))
