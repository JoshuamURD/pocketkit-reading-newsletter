/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("twncj64o2r8drmn")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "8ewdsetv",
    "name": "likedBy",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("twncj64o2r8drmn")

  // remove
  collection.schema.removeField("8ewdsetv")

  return dao.saveCollection(collection)
})
