/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("toj8cxjxkin1zz5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "crcwh6ih",
    "name": "Posts",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "twncj64o2r8drmn",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("toj8cxjxkin1zz5")

  // remove
  collection.schema.removeField("crcwh6ih")

  return dao.saveCollection(collection)
})
