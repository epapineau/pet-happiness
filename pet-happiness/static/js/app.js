function buildPlot() {
    /* data route */
  var url = "/test";
  d3.json(url).then(function(response) {
    // Parse response
    var petData = [response[0]];
    var happinessData = [response[1]];

    // Layouts
    var layout1 = {
      title: "Pet Population by country (rough graph)",
    };
    var layout2 = {
      title: "Happiness by country (rough graph)",
    };

    Plotly.newPlot("graph1", petData, layout1);
    Plotly.newPlot("graph2", happinessData, layout2);
  });
}

buildPlot();
