/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aafnglbisut15k2")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7dzy0gcv",
    "name": "questions",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aafnglbisut15k2")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7dzy0gcv",
    "name": "questions",
    "type": "editor",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  return dao.saveCollection(collection)
})
