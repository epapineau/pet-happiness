function examplePetPlot() {
  /* data route */
  var url = "/get_pet_data";

  d3.json(url).then(function(petData) {    
    // Parse response
    var countries = petData.country;
    var happinessScore = petData.happiness_score;
    var happinessRank = petData.happiness_rank;
    var perCapitaGdp = petData.per_capita_gdp;
    var percUrbanPop = petData.percent_urban_pop;
    var petPopulation = petData.pet_population;
    var petYype = petData.pet_type;
    var population = petData.population;
    var worldBankCode = petData.world_bank_code;

    // Console log variables
    console.log("Full data dictionary:")
    console.log(petData)
    console.log("------------------------------")
    console.log("Example of accessing specific column")
    console.log(countries);

    // Traces
    var graphObj = {"type": "bar",
                    "x": countries,
                    "y": petPopulation};
    var happiTrace = {"type": "bar",
                      "x": countries,
                      "y": happinessScore}

    // // Layouts
    var graphLayout = {
      title: "Pet Population by country (rough graph)",
    };
    var happiLayout = {
      title: "Happiness by country (rough graph)",
    };

    Plotly.newPlot("graph1", [graphObj], graphLayout);
    Plotly.newPlot("graph2", [happiTrace], happiLayout);
  });
}
examplePetPlot();

// function exampleWbPlot() {
//   /* data route */
//   var url = "/get_wb_data";

//   // d3.json(url).then(function(worldData) {
//   //   // Parse response
//   //   var countries = worldData.country;
//   //   console.log(countries);

//   //   // Plots go here
//   // });
//   }
// exampleWbPlot();