// function examplePetPlot() {
//   /* data route */
//   var url = "/get_pet_data";

//   d3.json(url).then(function(petData) {
//     // Parse response
//     var countries = petData.country;
//     console.log(countries);

//     // // Layouts
//     // var layout1 = {
//     //   title: "Pet Population by country (rough graph)",
//     // };
//     // var layout2 = {
//     //   title: "Happiness by country (rough graph)",
//     // };

//     // Plotly.newPlot("graph1", petData, layout1);
//     // Plotly.newPlot("graph2", happinessData, layout2);
//   });
// }

function exampleWbPlot() {
  /* data route */
  var url = "/get_wb_data";

  d3.json(url).then(function(worldData) {
    // Parse response
    var countries = worldData.country;
    console.log(countries);

  // Plots go here

  });
}

// examplePetPlot();

exampleWbPlot();