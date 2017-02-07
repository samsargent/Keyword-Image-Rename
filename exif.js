var exiftool = require('node-exiftool');
var ep = new exiftool.ExiftoolProcess();
var fs = require('fs');
var prompt = require('prompt');

  var schema = {
    properties: {
      folder: {
        message: 'Folder must be only letters, spaces, or dashes',
        required: true
      }
    }
  };


  //
  // Start the prompt
  //
  prompt.start();

  //
  // Get two properties from the user: username and email
  //
  prompt.get(schema, function (err, result) {
    //
    // Log the results.
    //
    ep
      .open()
      .then((pid) => console.log('Started exiftool process'))
      .then(() => ep.readMetadata(result.folder,['Keywords','r']))
      .then(function(data){
        for (var i = data.data.length - 1; i >= 0; i--) {
          if(data.data[i].Keywords){
            var name = data.data[i].Keywords.join('|')+'.jpg';

            fs.rename(data.data[i].SourceFile, name, function(err) {
              if ( err ) console.log('ERROR: ' + err);
            });
          }
        };
      })
      .then(() => ep.close())
      .then(() => console.log('Finished exiftool rename'));
  });