/*
 * Generate Dropdown Menu Items: ID numbers.
 */
function init() {
  var selector = d3.select('#selDataset');

  d3.json('samples.json').then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector.append('option').text(sample).property('value', sample);
    });
    var initialSample = sampleNames[0];
    buildMetadata(initialSample);
    buildCharts(initialSample);
  });
}

init();
/*
! NOTE: optionChanged is called when a change takes place in this tag in the HTML. 
! this.value = newSample = ID number
*/
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}
/*
 * Print information to the "Demographic Info" once a user selects an ID number.
 */
function buildMetadata(sample) {
  d3.json('samples.json').then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var pairs = Object.entries(resultArray[0]);
    var PANEL = d3.select('#sample-metadata');

    PANEL.html('');
    var results = pairs.forEach(function (pair) {
      PANEL.append('h6').text(pair[0] + ': ' + pair[1]);
    });
  });
}
/*
 * Build the charts once a user selects an ID number.
 */
function buildCharts(sample) {
  d3.json('samples.json').then(function ({ samples, metadata }) {
    var data = samples.filter((obj) => obj.id == sample)[0];
    console.log(data);
    // data for bar chart
    var otuIDS = data.otu_ids.map((row) => `OTU ID: ${row}`);
    var sampleValues = data.sample_values.slice(0, 10);
    var sampleLabels = data.otu_labels.map((label) =>
      label.replace(/\;/g, ', ')
    );
    // data for bubble chart
    var otuID = data.otu_ids;
    var sampleValue = data.sample_values;
    var sampleLabel = data.otu_labels.map((label) =>
      label.replace(/\;/g, ', ')
    );
    // data for gauge
    var metData = metadata.filter((obj) => obj.id == sample)[0];
    var washFreq = metData.wfreq;
    // data for bar chart
    var data1 = [
      {
        x: sampleValues,
        y: otuIDS,
        type: 'bar',
        orientation: 'h',
        text: sampleLabels,
        hoverinfo: 'text',
      },
    ];

    // data for bubble chart
    var data2 = [
      {
        x: otuID,
        y: sampleValue,
        mode: 'markers',
        text: sampleLabel,
        marker: {
          size: sampleValue,
          color: otuID,
        },
      },
    ];
    // data for gauge chart
    var data3 = [
      {
        // domain: washFreq,
        value: washFreq,
        title: {
          text: 'Belly Button Washing Frequency<br>Scrubs per Week',
        },
        type: 'indicator',
        mode: 'gauge+number',
        gauge: {
          axis: { range: [null, 10] },
        },
      },
    ];
    // layout for bar chart
    var layout1 = {
      margin: {
        t: 40,
        l: 150,
      },
      title: {
        text: 'Top 10 Bacterial Species (OTUs)',
      },
    };
    // layout for bubble chart
    var layout2 = {
      xaxis: { title: 'OTU ID' },
    };
    // layout for gauge chart
    var layout3 = {
      width: 600,
      height: 500,
      margin: { t: 0, b: 0 },
    };

    Plotly.newPlot('bar', data1, layout1);
    Plotly.newPlot('bubble', data2, layout2);
    Plotly.newPlot('gauge', data3, layout3);
  });
}
