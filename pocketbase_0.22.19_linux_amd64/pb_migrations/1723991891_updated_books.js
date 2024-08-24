/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zzi62dba8esexur")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dlk1vnvw",
    "name": "tags",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xatnlvno",
    "name": "cover_url",
    "type": "url",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zzi62dba8esexur")

  // remove
  collection.schema.removeField("dlk1vnvw")

  // remove
  collection.schema.removeField("xatnlvno")

  return dao.saveCollection(collection)
})
