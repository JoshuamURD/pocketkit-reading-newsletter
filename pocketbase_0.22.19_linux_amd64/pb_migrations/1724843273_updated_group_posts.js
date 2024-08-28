/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("twncj64o2r8drmn")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xkituibj",
    "name": "likes",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("twncj64o2r8drmn")

  // remove
  collection.schema.removeField("xkituibj")

  return dao.saveCollection(collection)
})
