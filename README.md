# ObjectDataMapper
This is a simple module which expects a defined object schema, and presents CRUD methods for any arbitrary object to a database (currently only supporting mysql). It's designed to be as simple as possible so as to provide the most transparency between high level and low level operations.

Note that the current schema definitions conform to the schemas used in db-migrate library (can be changed if necessary):
https://db-migrate.readthedocs.io/en/latest/API/SQL/
(This is just for ease at the moment and I'd like to change it soon enough)

## What This Does ##
Essentially this module takes a predefined json schema for your database, and exposes methods to work with the data.
For example, when using the save() method, the schema is looked up from the passed in type argument. Then, a query is generated using all the properties that exist on the passed in type's object schema. Then the object is committed to the database. 

## Example Usage ##
    ObjectDataMapper.save('sometype', object);
    ObjectDataMapper.find('sometype', properties);
    
## Methods ##
    save(type, object) - performs an insert or an update, returning a promise. Promise will return an ID if it's a new object.
    find(type, properties) - performs a search, filtering by the given properties, returning a promise.

## What It Doesn't Do ##
Any kind of sophisticated joins or other-than-basic functionality for simple one-dimensional CRUD operations, for now.
I will probably incorporate joining based on preferences set in the schema (ie. lazy-loading vs. on-the-fly for model properties that are foreign references).

## Dependencies ##
mysql
