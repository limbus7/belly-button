// store source URL
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// fetch the JSON data and console log it
d3.json(url).then(function(data){
    console.log(data);
}); 

//Display the dashboard

function init(){

    //Use D3 to select dropdown menu
    let dropdown = d3.select("#selDataset");


    //Get the sample data using d3 and get the sample ids and populate in drop down menu
    d3.json(url).then((data) => {
    let sample_ids = data.names;
    console.log(sample_ids);
        for (id of sample_ids){
            dropdown.append("option").attr("value", id).text(id);
        };


    //set the first sameple from the list 
    let first_sample = sample_ids[0];
    console.log(first_sample);
    
    //Call the functions to make the 
    BarChart(first_sample);
    BubbleChart(first_sample);
    Demographics(first_sample);
    }); 
};

//Function to populate Bar Chart 
function BarChart(selectedValue){
    //Use D3 to get the  sample data for populating the bar chart
d3.json(url).then((data) => {
    let sample_data = data.samples;

      //filter data that matches based on sample id
    let filtered_data = sample_data.filter(id => id.id === selectedValue);


     //Get the first samples from the array 
    let first_sample = filtered_data[0];
    console.log(first_sample);

   //Get the out_ids, labels, and sample values
    let sample_values = first_sample.sample_values.slice(0,10);
    let otu_ids = first_sample.otu_ids.slice(0,10);
    let otu_labels = first_sample.otu_labels.slice(0,10);
    
  

    //create the trace for bar chart
    let BarChart_trace = {
        x: sample_values.reverse(),
        y: otu_ids.map(item => `OTU ${item}`).reverse(),
        text: otu_labels.reverse(),
        type: 'bar',
        marker: {
            color: "YlGnBu"
        },
        orientation: 'h'
    };

    let BarChart_layout = {title: "Top Ten OTUs"};
    Plotly.newPlot("bar", [BarChart_trace], BarChart_layout);
});
};



//Function to populate BubbleChart
function BubbleChart(selectedValue){

    //Use D3 to get the  sample data for populating the bar chart
    d3.json(url).then((data) => {
        let sample_data = data.samples;

        //filter data that matches based on sample id
        let filtered_data = sample_data.filter(id => id.id == selectedValue);


        //Get the first samples from the array 
        let first_sample = filtered_data[0];
        console.log(first_sample);


        //sGet the out_ids, labels, and sample values
        let sample_values = first_sample.sample_values;
        let otu_ids = first_sample.otu_ids;
        let otu_labels = first_sample.otu_labels;


        //create the trace for bubble chart
        let bubble_trace = {
            x: otu_ids.reverse(),
            y: sample_values.reverse(),
            text: otu_labels.reverse(),
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "RdBu"
            }
        };

        let layout = {
            title: "Bacteria Count for each Sample ID",
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Number of Bacteria'}
        };
        Plotly.newPlot("bubble", [bubble_trace], layout); 
    });
};



//Function to populate Demographics
function Demographics(selectedValue){
    d3.json(url).then((data) => {

    //Use D3 get the demographic info (metadata) 
    let metadata = data.metadata;

     //apply a filter that matches based on sample id
    let filtered_data = metadata.filter(id => id.id == selectedValue);

    //s
    let first_sample = filtered_data[0];
    console.log(first_sample);

    
    // clear out previous entries in the div with id sample-metadata

    Object.entries(first_sample).forEach(([key,value]) => {
        console.log(key,value);
        //select the demographic info html section with d3 and append new key-value pair
        d3.select('#sample-metadata').append('h3').text(`${key}, ${value}`);
    });
    
    });
};

 //Toggle to new plots when option is changed
    function optionChanged(electedValue){
    console.log(selectedValue);
    BarChart(selectedValue);
    BubbleChart(selectedValue);
    DemographicsChart(selectedValue);

};

init();
