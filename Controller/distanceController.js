const NodeGeocoder = require('node-geocoder');

const measureDistance = async(req,res)=> {
  
  try {
    
    let lat1 = req.body.lat1              //req.body
    let lat2 = req.body.lat2               //req.body
    let lon1 = req.body.lon1             //req.body
    let lon2 = req.body.lon2              //req.body
  
  const options = {
    provider: 'google',
    apiKey: 'AIzaSyDd_dsy6ep-QT_wwOAlHD9ieccpVMLtjNQ', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
  };
  
  const geocoder = NodeGeocoder(options);
  
  const origin = await geocoder.reverse({ lat: lat1, lon: lon1 });
  const destination = await geocoder.reverse({ lat: lat2, lon: lon2 });

  // geocoder.geocode({
  //   'address': req.body.address
  // }, function(results, status) {
  //   console.log("status : ",status)
  //   console.log("results : ",results)
  //   console.log("geocoder",geocoder)
  //   // if (status == google.maps.GeocoderStatus.OK) {
  //   //   var latitude = results[0].geometry.location.lat();
  //   //   var longitude = results[0].geometry.location.lng();
  //   // }
  // });
  
  var googleMapsClient = require('@google/maps').createClient({
    key: `AIzaSyDd_dsy6ep-QT_wwOAlHD9ieccpVMLtjNQ`
  });
  
  function getDirections (req, callback)  {
    googleMapsClient.directions({
    origin: req.origin,
    destination: req.destination,
    mode: req.mode,
  
    }, function(err, response) {
  
      if (!err) { 
        callback(response);
      };
    });
  };
  
  var inputs = {
    origin: origin[0].formattedAddress,
    destination: destination[0].formattedAddress,
    mode: "driving",
  };
  
  getDirections(inputs, function(result){
    const response = {
      distance : result.json.routes[0].legs[0].distance.text,
       duration : result.json.routes[0].legs[0].duration.text
    }
   
    res.send(response)
  });
} catch (error) {
      console.log("error",error)
}
  }
  

  module.exports = measureDistance