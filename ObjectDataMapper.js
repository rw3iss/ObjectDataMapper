import mysql from 'mysql';
import dbSchema from './model_schema';
import Container from '../system/Container';

// Does generic CRUD operations on arbitrary objects
export class ObjectDataMapper {
	constructor() {
		// validate the schemas on loadup?
		// Todo: can also check database to verify the tables match
	}

	save(type, object) {
		if (!type || !object)
			throw new Exception("Cannot proceed without a type and an object.");

		if (typeof dbSchema[type] == 'undefined')
			throw new Exception("Unknown object type for save: " + type);

		let query, data, schema = dbSchema[type], isInsert = false;

		if (object.id) {
			// assume an update
			var valString = '';
			for (var property in schema.properties) {
				if (object.hasOwnProperty(property)) {
					valString += ' ' + property + '=' + this.tryEscape(object[property]);
				}
			}

			query = `UPDATE ${schema.table} SET ${valString}`;
		} else {
			// an insert
			isInsert = true;
			var propString = '', valString = '', delim = '';
			for (var property in schema.properties) {
				if (object.hasOwnProperty(property)) {
					var propType = schema.properties[property].type;
					propString += delim + property;
					valString += delim + this.tryEscape(object[property], propType);
					delim = ',';
				}
			}

			query = `INSERT INTO ${schema.table} (${propString}) VALUES (${valString});
				 	SELECT LAST_INSERT_ID() as last_id;`;
		}

		cl("Attempting to save object", type, object, query);
		
		return new Promise((resolve, reject) => {
			Container.DB.query(query)
				.then((r) => {
					// set inserted id
					cl("query result", r);
					if (isInsert) {
						if (r[r.length-1][0].last_id) {
							object.id = r[r.length-1][0].last_id
						}
					}

					return resolve(object);
				})
				.catch((e) => {
					// Todo: log
					throw e;
				})
		});
	}

	tryEscape(prop, propType) {
		if (!propType)
			propType == typeof prop;

		if (propType == 'string' || propType == 'text') {
			return mysql.escape(prop)
		}
		
		return prop;
	}
}

module.exports = new ObjectDataMapper();
