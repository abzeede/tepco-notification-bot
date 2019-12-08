const db = require('./index')

const usageRef = db.collection('usages')

exports.collection = usageRef

exports.add = data => {
  const id = `${data.year}-${data.month}-${data.day}`
  return usageRef
    .doc(id)
    .set(data, { merge: true }) // update if exist
    .then(ref => console.log('Added document with ID: ', id))
}
