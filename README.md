# SmartQuery

Getting rid of `publish()` and `subscribe()`

SmartQuery takes your regular `Collection.find()` calls, and wraps them in a special function that automatically sets up the subscription you need for you. 

### Installation

Install with:

```
meteor add utilities:smartquery
```

### Demo

- [Demo](http://smartquery.meteor.com)
- [Demo code](https://github.com/SachaG/smartquery-demo)

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

`SmartQuery.create(id, cursor, options)`

- `id`: a unique id for this particular SmartQuery.
- `cursor`: the cursor you want to use (e.g. `Posts.find({}, {limit: 5})`).
- `options`: an optional options object.

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

- `filter(document)`: a function that, if provided, must return `true` for every single document in the cursor. Inside the filter function, you can call `this.userId` to access the current user's `_id`. 
- `fields()`: a function that, if provided, must return an array of publishable fields. If no `fields` function is provided, all fields will be published. 

In both the `filter` and `fields` function, you can access the current user `_id` with `this.userId`. 

Example:

```js
SmartQuery.addRule(Posts, {
  filter: function (document) {
    return document.published === true;
  },
  fields: function () {
    return ["_id", "title", "body"];
  }
});
```

### Using SubsManager

You can also use SmartQuery with [SubsManager](https://github.com/meteorhacks/subs-manager):

```js
var mySub = new SubsManager();
var options = {
  subscribe: mySub.subscribe.bind(mySub)
};
SmartQuery.create("the-id", Posts.find(), options);
```