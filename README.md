# ObjectDataMapper
This is a simple module which expects a defined object schema, and presents CRUD methods for any arbitrary object to a database (currently only supporting mysql).

## For example: ##
    ObjectDataMapper.save('sometype', object);
    ObjectDataMapper.find('sometype', properties);
    
## Methods: ##
    save(type, object) - performs an insert or an update
    find(type, properties) - performs a search with the given properties
    
