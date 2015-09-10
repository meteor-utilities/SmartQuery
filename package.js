Package.describe({
  name: "sacha:smartquery",
  summary: "SmartQuery: Getting rid of publish and subscribe",
  version: "0.1.0",
  git: "https://github.com/SachaG/smartquery"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  api.use([
    'standard-app-packages',
    'dburles:mongo-collection-instances@0.3.4',
    'tmeasday:publish-counts@0.7.1'
  ]);

  api.addFiles([
    'lib/smartquery.js'
  ], ['client', 'server']);

  api.addFiles([
  ], ['client']);

  api.addFiles([
    'lib/publications.js'
  ], ['server']);

  api.export("SmartQuery");

});
