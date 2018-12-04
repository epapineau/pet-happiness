function handleSubmit() {
  // Prevent the page from refreshing
  d3.event.preventDefault();
  
  // Get form input of pettype and clear form
  var petType = d3.select("#inputType").node().value;
  // d3.select("#inputType").node().value = "";
  plotPetPop(petType);
}

function plotPetPop(petType){
  /* data route */  
  var url = "/get_pet_data";
  console.log(petType);

  d3.json(url).then(function(petData) {    
    // Parse response
    var countries = petData[petType]['country'];
    var petPopulation = petData[petType]['pet_population'];

    // Trace
    var petBar = {"type": "bar",
      "x": countries,
      "y": petPopulation,
      marker: {
        color: 'rgb(237, 192, 34)'
      }
    };

    // Layout
    var petLayout = {
      title: `Top 20 Global ${petType[0].toUpperCase()}${petType.substr(1, petType.length)} Populations`,
      xaxis: {
        tickangle: 45
      },
      yaxis: {
        title: `${petType[0].toUpperCase()}${petType.substr(1, petType.length)} Population`
      }
    };

    // Plot
    Plotly.newPlot("top20-pet-populations", [petBar], petLayout);
  });
}
// Default load
plotPetPop('dog');
// Change dataset on click
d3.select("#submit").on("click", handleSubmit);







// function indexMap(){
//   var myGeoJSONPath = '/static/custom.geo.json';
//   var myCustomStyle = {
//     stroke: false,
//     fill: true,
//     fillColor: '#fff',
//     fillOpacity: 1
//   };
//   $.getJSON(myGeoJSONPath,function(data){
//     var map = L.map('graph2').setView([39.74739, -105], 4);
//     L.geoJson(data, {
//       clickable: false,
//       style: myCustomStyle
//     }).addTo(map);
//         });
// }
// indexMap();

// function exampleWbPlot() {
//   /* data route */
//   var url = "/get_wb_data";

//   d3.json(url).then(function(worldData) {
//     // Parse response
//     var countries = worldData;
//     console.log(worldData);

//     // Plots go here
//   });
//   }
// exampleWbPlot();





// function worldHappinessChloropleth() {
//   /* data route */
//   var url = "/custom.geo.json";

//   d3.json(url).then(function(worldHappiness) {
//     // Parse response
//     console.log(worldHappiness);

//     // Plots go here
//   });
//   }
//   worldHappinessChloropleth();