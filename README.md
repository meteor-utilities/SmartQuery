# SmartQuery

Getting rid of `publish()` and `subscribe()`

SmartQuery takes your regular `Collection.find()` calls, and wraps them in a special function that automatically sets up the subscription you need for you. 

### Demo

See demo repo here: https://github.com/SachaG/smartquery-demo

### Using SmartQuery (Client)

Just call `SmartQuery.create()` inside a regular template helper. For example:

```js
Template.posts.helpers({
  posts: function () {
    var cursor = Posts.find({}, {limit: Session.get("postsLimit")});
    return SmartQuery.create("posts", cursor);
  }
}
```

`SmartQuery.create(id, cursor)`

- `id`: a unique id for this particular SmartQuery.
- `cursor`: the cursor you want to use (e.g. `Posts.find({}, {limit: 5})`).

Returns an object with the following properties:

- `subscription`: the subscription created for this SmartQuery.
- `cursor`: the cursor you passed to the SmartQuery.
- `isReady()`: (function) whether the subscription is ready (Boolean).
- `count()`: (function) returns a count of the cursor.
- `totalCount()`: (function) returns the total count for the cursor on the server (without a `limit`).
- `hasMore()`: (function) whether there are more documents on the server (Boolean).

### Defining A Security Layer (Server)

You must define a security rule on the server for each collection before data can be published to users.

`SmartQuery.addRule(collection, rule)`

- `collection`: the collection.
- `rule`: the rule.

A rule has the following properties:

- `filter`: a function that, if provided, must return `true` for every single document in the cursor.
- `fields`: an array of fields that are publishable.

Example:

```js
SmartQuery.addRule(Posts, {
  filter: function (document) {
    return document.published === true;
  },
  fields: ["_id", "title", "body"]
});
```