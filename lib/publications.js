Meteor.startup(function () {
  
  // get all collections
  var collections = Mongo.Collection.getAll();

  collections.forEach(function (collection) {

    var collection = collection.instance;

    // for each collection, create a publication
    Meteor.publish(SmartQuery.getPublicationName(collection), function (id, selector, options) {

      // publish count of total number of items matching the selector (without limit)
      var unlimitedOptions = _.clone(options);
      delete unlimitedOptions.options;
      Counts.publish(this, id, collection.find(selector, unlimitedOptions));
      
      return collection.find(selector, options);
    });
  });

});