class SchemaParser {
  /**
   * Schema parser
   *
   * @param schema
   */
  constructor(schema) {
    this.schema = schema;
  }

  getForeignKeys() {
    let foreignKeys = {};

    for (let table of Object.keys(this.schema)) {
      // Continue if the schema entry is null or not a string
      if (!this.schema[table] || typeof this.schema[table] !== "string") {
        continue;
      }

      console.log("about to process: ", this.schema[table]);
      let indexes = this.schema[table].split(",");

      foreignKeys[table] = indexes
        .filter((idx) => idx.indexOf("->") !== -1)
        .map((idx) => {
          // Split the column and foreign table info
          let [column, target] = idx.split("->").map((x) => x.trim());

          // Additional check to ensure 'target' is not null/undefined and contains a '.'
          if (!target || target.indexOf(".") === -1) {
            console.error(
              `Invalid target format in schema for table '${table}': '${idx}'`
            );
            return null; // Return null or some other way to handle this error condition
          }

          return {
            index: column,
            targetTable: target.split(".")[0],
            targetIndex: target.split(".")[1],
          };
        })
        .filter(Boolean); // Remove any null values resulting from invalid target formats
    }

    return foreignKeys;
  }

  /**
   * Get schema without the foreign key definitions
   *
   * @returns Object
   */
  getCleanedSchema() {
    let schema = {};

    for (let table of Object.keys(this.schema)) {
      if (!this.schema[table] || typeof this.schema[table] !== "string") {
        continue;
      }

      let indexes = this.schema[table].split(",");

      // Remove foreign keys syntax before calling the original method
      schema[table] = indexes.map((idx) => idx.split("->")[0].trim()).join(",");
    }

    return schema;
  }
}

export default SchemaParser;
