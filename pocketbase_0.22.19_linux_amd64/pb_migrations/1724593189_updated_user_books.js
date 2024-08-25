/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aafnglbisut15k2")

  collection.updateRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("aafnglbisut15k2")

  collection.updateRule = "@request.auth.id = users.id"

  return dao.saveCollection(collection)
})
