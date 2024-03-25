/**
 * oQuery: a way of searching through an array of objects for objects
 * matching certain property values.
 * @module @lumjs/oquery
 */

const {O,F,S,N,isObj} = require('@lumjs/core/types');

/**
 * Search through an array of objects.
 *
 * Thanks to a convoluted history, the default module itself that is
 * exported is this `find()` function, and all other exported functions
 * are static properties added to the main function's objects.
 *
 * Thus: `const oq = require('@lumjs/oquery'); oq.find === oq; # true`
 *
 * All the other functions and instance methods are simply wrappers around
 * this single function using different default options.
 *
 * @alias module:@lumjs/oquery.find
 *
 * @param {(object|string|number)} query - What we are looking for.
 *
 * - If this is an `object` (likely the most common usage) then each property 
 *   in that object will be a value to look for in the `container` argument.
 *   The property types will be handled in different ways:
 *
 *   - An `object` property will be considered a nested sub-query (basically a
 *     way fo match nested object properties).
 *   - A `function` query property will be passed the corresponding object
 *     property and must return a `boolean` value indicating if it matches.
 *   - Any other query property must match exactly.
 *
 * - If this is a `string` or `number` then the `opts.single` option will
 *   be forced to `true` and we will look for a property called `id` 
 *
 * @param {object[]} container - The container (array of objects) to look in.
 *
 * @param {object} [opts] Options to change what this function returns.
 *
 * @param {boolean} [opts.single] Return the first matching object?
 *
 * If the `query` is a `string` or `number` this will be forced to `true`,
 * otherwise the default value is `false`.
 *
 * @param {boolean} [opts.index=false] Return the index position?
 *
 * @param {mixed} [opts.return] INTERNAL: Used in nested queries.
 *
 * @returns {?(object|object[])} Matching object(s).
 *
 * If `opts.single` was `true`, and nothing matched, we return `null`.
 *
 */
function oq(query, container, opts)
{
//  console.debug("Lum.oQuery", arguments, new.target);
  if (new.target)
  { // Was called as a constructor, which has different arguments.
    if (!Array.isArray(query))
    {
      throw new TypeError("Invalid container passed to new oQuery instance");
    }

    this._oa = query;

    if (container !== undefined || opts !== undefined)
    {
      console.warn("Additional arguments not used when using oQuery constructor", arguments);
    }

    return; // We're done here.
  }

  // Everything below here is the regular function call usage.

  const matched = [];

  if (!isObj(opts))
  {
    opts = {};
  }

  const qtype = typeof query;
  if (qtype === S || qtype === N)
  {
    query = { id: query };
    opts.single = true;
  }
  else if (qtype !== O)
  {
    console.error("Invalid query passed to oQuery()");
    if (opts.single === true)
      return null;
    else
      return matched;
  }

  if (!Array.isArray(container))
  { // It's not an array of objects, it's probably a portion of a sub-query.
    // In this case, we will return the object if it matches all queries.
//    console.debug("container isn't an object array, nested query assumed", container, query);
    let match = true;
    for (let key in query)
    {
      if (typeof query[key] === O)
      {
        let submatch = oq(query[key], container[key], opts);
        if (opts.single && submatch === null)
        {
          match = false;
          break;
        }
        else if (!opts.single && submatch.length === 0)
        {
          match = false;
          break;
        }
      }
      else if (typeof query[key] === F)
      {
        match = query[key](container[key]);
        if (!match) break;
      }
      else if (container[key] != query[key])
      {
        match = false;
        break;
      }
    }

    if (match)
    {
      if (opts.single === true)
        return container;
      else
        return [container];
    }
    else
    {
      if (opts.single === true)
        return null;
      else
        return matched;
    }
  }

  for (let i in container)
  {
//    console.debug("iterating item ", i);
    let item = container[i];
    let match = true;

    for (let key in query)
    {
//      console.debug("checking value of ", key);
      if (typeof query[key] === O)
      {
//        console.debug("a subquery", query[key], item[key]);
        if (typeof item[key] !== O)
        { // Couldn't find the nested item.
//          console.debug("the item didn't have a "+key+" property.");
          return null;
        }
        let subresults = oq(query[key], item[key], opts);
//        console.debug("subresults: ", subresults);
        if (opts.return === key)
        { // We're using a return filter.
          match = false;
          if (opts.single && subresults !== null)
          {
            return subresults;
          }
          else if (!opts.single && subresults.length > 0)
          {
            matched = matched.concat(subresults);
          }
        }
        else
        {
          if
          ( 
            (opts.single && subresults === null)
            ||
            (!opts.single && subresults.length === 0)
          )
          {
            match = false;
            break;
          }
        }
      }
      else if (typeof query[key] === F)
      { // Pass the item through the function, and see what it returns.
        if (!query[key](item[key]))
        {
          match = false;
          break;
        }
      }
      else if (item[key] != query[key])
      {
        match = false;
        break;
      }
    }

    if (match) 
    {
//      console.debug("we found a match");
      if (opts.single === true)
      {
//        console.debug("returning the single item");
        if (opts.index === true)
        {
          return i;
        }
        else
        {
          return item;
        }
      }
      if (opts.index === true)
      {
        matched.push(i);
      }
      else
      {
        matched.push(item);
      }
    }
  }

  if (opts.single === true)
    return null;

  return matched;
}

// Recursive properties are recursive
oq.find = oq.Query = oq;

/**
 * Get a single object from a container.
 *
 * Calls `find()` with `opts.single` set to `true`.
 *
 * @alias module:@lumjs/oquery.get
 *
 * @param {mixed} query - What we're looking for.
 * @param {object[]} container - Container to look in.
 *
 * @returns {mixed}
 *
 * @see {@link module:@lumjs/oquery.find}
 */
oq.get = function (query, container)
{
  return oq(query, container, {single: true});
}

/**
 * Get the index of a single object in a container.
 *
 * Calls `find()` with both `opts.single` and `opts.index` set to `true`.
 *
 * @alias module:@lumjs/oquery.pos
 *
 * @param {mixed} query - What we're looking for.
 * @param {object[]} container - Container to look in.
 *
 * @returns {mixed}
 *
 * @see {@link module:@lumjs/oquery.find}
 */
oq.pos = function (query, container)
{
  return oq(query, container, {single: true, index: true});
}

/**
 * Get the index of multiple objects in a container.
 *
 * Calls `find()` with `opts.index` set to `true`.
 *
 * @alias module:@lumjs/indexes
 *
 * @param {mixed} query - What we're looking for.
 * @param {object[]} container - Container to look in.
 *
 * @returns {mixed}
 *
 * @see {@link module:@lumjs/oquery.find}
 */
oq.indexes = function (query, container)
{
  return oq(query, container, {index: true});
}

/**
 * oQuery class for convenience wrapper instances.
 *
 * The truth is, this so-called _class_ is actually just the `find()` function
 * again, which uses the `new.target` to determine if it was called as a class
 * constructor or as a standalone function.
 *
 * Thus: `const oq = require('@lumjs/oquery'); oq.Query === oq; # true`
 *
 * @name module:@lumjs/oquery.Query
 * @class
 *
 * @param {object[]} container - Array of objects to search in.
 *
 * This is the sole parameter when constructing an instance.
 * The rest of the instance methods are simply wrappers around the
 * static functions that will pass this as the `container` argument.
 *
 */

const oqp = oq.prototype;

/**
 * Find multiple elements in our container.
 *
 * @alias module:@lumjs/oquery.Query#find
 *
 * @param {mixed} query - What we're looking for.
 * @param {object} [opts] Options for `find()` function.
 *
 * @returns {mixed}
 *
 * @see {@link module:@lumjs/oquery.find}
 */
oqp.find = function (query, opts)
{
  return oq(query, this._oa, opts);
}

/**
 * Get a single object from our container.
 *
 * @alias module:@lumjs/oquery.Query#get
 *
 * @param {mixed} query - What we're looking for.
 *
 * @returns {mixed}
 *
 * @see {@link module:@lumjs/oquery.get}
 */
oqp.get = function (query)
{
  return oq.get(query, this._oa);
}

/**
 * Get the index of a single object in our container.
 *
 * @alias module:@lumjs/oquery.Query#pos
 *
 * @param {mixed} query - What we're looking for.
 *
 * @returns {mixed}
 *
 * @see {@link module:@lumjs/oquery.pos}
 */
oqp.pos = function (query)
{
  return oq.pos(query, this._oa);
}

/**
 * Get the index of multiple objects in our container.
 *
 * @alias module:@lumjs/oquery.Query#indexes
 *
 * @param {mixed} query - What we're looking for.
 *
 * @returns {mixed}
 *
 * @see {@link module:@lumjs/oquery.indexes}
 */
oqp.indexes = function (query)
{
  return oq.indexes(query, this._oa);
}

// Now export this convoluted thing!
module.exports = oq;

