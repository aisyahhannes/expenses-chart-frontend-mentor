const today = new Date();
const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

var day = today.getDay();
var dayy = days[day];

window.onresize = () => { window.location.reload()}
chart = document.querySelector("svg");

document.addEventListener("DOMContentLoaded", function() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            var svgWidth = chart.clientWidth, svgHeight = chart.clientHeight, barPadding = 10;
            var barWidth = (svgWidth / data.length);

            var svg = d3.select('svg')
                .attr("width", svgWidth)
                .attr("height", svgHeight);

            var yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.amount)])
                .range([0, svgHeight - 30]);
            
            var barChart = svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", (d, i) => i * barWidth)
                .attr("y", d => svgHeight - yScale(d.amount) - 15)
                .attr("height", function(d) {
                    amount = yScale(d.amount);
                    return amount;
                })
                .attr("width", barWidth - barPadding)
                .attr("fill", function(d) {
                    if(d.day === dayy) {
                        return "#76b5bc";
                    } else {
                        return "#ec775f";
                    }
                })
                .attr("rx", 5)
                .attr("ry", 5)
                .on("mouseenter", function (event, d) {
                    d3.select(this)
                        .attr("fill", function(d) {
                            if(d.day === dayy) {
                                return "rgba(118, 181, 188, 0.7)";
                            } else {
                                return "rgba(236, 119, 95, 0.7)";
                            }
                        })
                        .style("cursor", "pointer");
                    
                    var barX = this.getBoundingClientRect().x;
                    var barY = this.getBoundingClientRect().y;

                    d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .text("$" + d.amount)
                        .style("position", "absolute")
                        .style("background", "#382314")
                        .style("color", "white")
                        .style("padding", "5px 8px")
                        .style("border-radius", "5px")
                        .style("text-align", "center")
                        
                        .style("font-size", "12px")
                        .style("pointer-events", "none")
                        .style("transform", "translateX(-50%)")
                        .style("left", (barX + (barWidth - barPadding) / 2) + "px")
                        .style("top", (barY - 30) + "px");
                })
                
                .on("mouseleave", function (event, d) {
                    d3.select(this).attr("fill", function(d) {
                        if(d.day === dayy) {
                            return "rgb(118, 181, 188)";
                        } else {
                            return "rgb(236, 119, 95)";
                        }
                    });
                    d3.select(".tooltip").remove();
                });

            var text = svg.selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .text(function(d) {
                    return d.day;
                })
                .attr("y", svgHeight)
                .attr("x", function(d, i) {
                    return (i * barWidth + barWidth / 2 - 20)
                })
                .attr("fill", "#93867b");
        })

    .catch(error => console.error("Error fetching JSON data:", error));

});
