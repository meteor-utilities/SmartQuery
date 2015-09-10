SmartQuery = {
  subscriptions: {},
  rules: []
};

SmartQuery.getPublicationName = function (collection) {
  return "SmartQuery_"+collection._name;
};

if (Meteor.isClient) {
  
  // the main SmartQuery function on the client
  SmartQuery.create = function (id, cursor) {

    // console.log(id)

    var sub;
    var collection = Mongo.Collection.get(cursor.collection.name);
    var selector = cursor.matcher._selector;
    
    var options = {};

    // fields
    if (typeof cursor.fields !== "undefined") { options.fields = cursor.fields; }
    if (typeof cursor.limit !== "undefined")  { options.limit = cursor.limit; }
    if (typeof cursor.skip !== "undefined")   { options.skip = cursor.skip; }
    if (cursor.sorter !== null)               { options.sort = cursor.sorter; }

    // note: recreating the subscription each time seems inneficient, 
    // but since the subscription is called from within a reactive computation
    // it's being stopped every time
    sub = Meteor.subscribe(SmartQuery.getPublicationName(collection), id, selector, options);

    return {
      subscription: sub,
      cursor: cursor,
      isReady: sub.ready,
      count: function () {
        return cursor.count();
      },
      totalCount: function () {
        return Counts.get(id);
      },
      hasMore: function () {
        return this.count() < this.totalCount();
      }
    };
  };

}

if (Meteor.isServer) {

  SmartQuery.addRule = function (collection, rule) {
    if (!SmartQuery.rules[collection._name]) {
      SmartQuery.rules[collection._name] = [];
    }
    SmartQuery.rules[collection._name].push(rule);
  };

}