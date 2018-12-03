function examplePetPlot() {
  /* data route */  
  var url = "/get_pet_data";

  d3.json(url).then(function(petData) {    
    // Parse response
    var countries = petData.dog.country;
    var happinessScore = petData.dog.happiness_score;
    var petPopulation = petData.dog.pet_population;
    console.log(petPopulation);
    var graphObj = {"type": "bar",
      "x": countries,
      "y": petPopulation
    };

    function makebar(i) {
      return {
          y: petPopulation,
          visible: i === 0,
          name: i
      };
  }
  
    // Console log variables
    // console.log("Full data dictionary:")
    // console.log(petData)
    // console.log("------------------------------")
    // console.log("Example of accessing specific column")
    // console.log(petData['bird']);

    // Traces

    // var happiTrace = {"type": "bar",
    //                   "x": countries,
    //                   "y": happinessScore}

    // // Layouts
    var graphLayout = {
      title: "Pet Population by country (rough graph)",
    };
    // var happiLayout = {
    //   title: "Happiness by country (rough graph)",
    // };

    // Plotly.newPlot("graph1", [graphObj], graphLayout);
    // Plotly.newPlot("graph2", [happiTrace], happiLayout);
  });
}
examplePetPlot();

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