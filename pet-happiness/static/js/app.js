function examplePetPlot() {
  /* data route */
  var url = "/get_pet_data";

  d3.json(url).then(function(petData) {    
    var dog = petData['dog'];

    // Parse response
    var countries = dog.country;
    var happinessScore = dog.happiness_score;
    var happinessRank = dog.happiness_rank;
    var perCapitaGdp = dog.per_capita_gdp;
    var percUrbanPop = dog.percent_urban_pop;
    var petPopulation = dog.pet_population;
    var petYype = dog.pet_type;
    var population = dog.population;
    var worldBankCode = dog.world_bank_code;

    // Console log variables
    console.log("Full data dictionary:")
    console.log(petData)
    console.log("------------------------------")
    console.log("Example of accessing specific column")
    console.log(petData['bird']);

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

function exampleWbPlot() {
  /* data route */
  var url = "/get_wb_data";

  d3.json(url).then(function(worldData) {
    // Parse response
    var countries = worldData;
    console.log(worldData);

    // Plots go here
  });
  }
exampleWbPlot();