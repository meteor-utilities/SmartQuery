SmartQuery = {
  subscriptions: {},
  rules: []
};

SmartQuery.getPublicationName = function (collection) {
  return "SmartQuery_"+collection._name;
};

if (Meteor.isClient) {

	var resolveSelectorRegExp = function(selector) {
		_.each(selector, function(condition, key) {
			if (condition instanceof RegExp) {
				var regex = { $regex: condition.source, $options: "" };
				if (condition.ignoreCase) {
					regex.$options += 'i';
				}
				if (condition.multiline) {
					regex.$options += 'm';
				}
				selector[key] = regex;
				return;
			}
			if (_.isObject(condition)) {
				resolveSelectorRegExp(condition);
			}
		});
	};


  // the main SmartQuery function on the client
  SmartQuery.create = function (id, cursor, options) {
    options = options || {};
    // ability to pass a custom subscribe method.
    // With that, we can use SubsManager as well
    var subscribe = options.subscribe || Meteor.subscribe;
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

    // fix regexp
    resolveSelectorRegExp(selector);

    // note: recreating the subscription each time seems inneficient,
    // but since the subscription is called from within a reactive computation
    // it's being stopped every time
    sub = subscribe(SmartQuery.getPublicationName(collection), id, selector, options);

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
