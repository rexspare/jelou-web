import React, { useEffect, useRef, useContext } from "react";
import defaults from "lodash/defaults";
import truncate from "lodash/truncate";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import has from "lodash/has";
import { Chart } from "chart.js";
import ChartPropertiesContext from "./../modules/ChartPropertiesContext";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useSelector } from "react-redux";

Chart.register(ChartDataLabels);

const MultiLineChart = (props) => {
    const { data, chart, setChart, fullscreen, tagsChecked, isFullScreen, translationsTitles } = props;
    const chartProperties = useContext(ChartPropertiesContext);
    const chartEl = useRef(null);
    const colors = ["#93c03e", "#01b3c7", "#ffa600", "#5cc36b", "#c9b70a", "#dd5182", "#ff6e54", "#0cc194", "#444e86", "#955196", "#003f5c"];
    const colorsOpacity = [
        "rgba(147,192,62,0.4)",
        "rgba(1,179,199,0.4)",
        "rgba(255,166,0,0.4)",
        "rgba(92,195,107,0.4)",
        "rgba(201,183,10,0.4)",
        "rgba(221,81,130,0.4)",
        "rgba(255,110,84,0.4)",
        "rgba(12,193,148,0.4)",
        "rgba(68,78,134,0.4)",
        "rgba(149,81,150,0.4)",
        "rgba(0,63,92,0.4)",
    ];
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const hasAxisX = has(translationsTitles, "axis.x");
    const hasAxisY = has(translationsTitles, "axis.y");
    const axisY = get(translationsTitles, "axis.y", []);
    const axisYLeft = axisY[0];
    const axisYRight = axisY[1];

    useEffect(() => {
        const ctx = chartEl.current.getContext("2d");
        let myBarChart;
        Chart.defaults.font.family = "Manrope";
        Chart.defaults.color = "#7e89a2";

        let index = 0;
        let datasetInfo = {};
        const labels = data.labels;
        const chartData = {
            labels: labels,
            datasets: data.datasets?.map((dataset) => {
                const { data } = dataset;
                const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, colorsOpacity[index]);
                gradient.addColorStop(0.65, "rgba(255, 255, 255, 1)");
                datasetInfo = {
                    label: dataset.label,
                    data: data,
                    backgroundColor: gradient,
                    borderColor: colors[index],
                    fill: true,
                    order: index,
                    borderWidth: 1,
                    ...(index === 1 && { yAxisID: "right" }),
                };

                index = index + 1;

                return datasetInfo;
            }),
        };
        const { options = {} } = chartProperties;

        const config = {
            plugins: [ChartDataLabels],
            type: "line",
            data: chartData,
            options: defaults(options, {
                ...(tagsChecked && fullscreen ? { events: ["mouseout", "touchstart", "touchmove", "touchend"] } : {}),
                responsive: true,
                interaction: {
                    mode: "index",
                    intersect: false,
                },
                maintainAspectRatio: false,
                title: {
                    display: true,
                },
                tooltips: {
                    enabled: true,
                    mode: "label",
                },
                hover: {
                    mode: "nearest",
                    intersect: true,
                },
                layout: {
                    padding: {
                        right: 40,
                        top: 20,
                        left: 20,
                    },
                },
                stacked: false,
                scales: {
                    x: {
                        title: {
                            display: hasAxisX,
                            text: get(translationsTitles, `axis.x.${lang}`, ""),
                            color: "#00B3C7",
                            padding: { top: 10, left: 0, right: 0, bottom: 0 },
                            font: {
                                weight: "bold",
                            },
                        },
                        ticks: {
                            userCallback: function (label) {
                                return truncate(label, {
                                    length: 20,
                                    omission: "...",
                                });
                            },
                        },
                    },
                    y: {
                        type: "linear",
                        display: true,
                        position: "left",
                        beginAtZero: true,
                        title: {
                            display: hasAxisY,
                            text: get(axisYLeft, `${lang}`, ""),
                            color: "#00B3C7",
                            padding: { top: 0, left: 0, right: 0, bottom: 10 },
                            font: {
                                weight: "bold",
                            },
                        },
                    },
                    right: {
                        type: "linear",
                        display: true,
                        position: "right",
                        beginAtZero: true,
                        title: {
                            display: hasAxisY,
                            text: get(axisYRight, `${lang}`, ""),
                            color: "#00B3C7",
                            padding: { top: 0, left: 0, right: 0, bottom: 10 },
                            font: {
                                weight: "bold",
                            },
                        },

                        // grid line settings
                        grid: {
                            drawOnChartArea: false, // only want the grid lines for one axis to show up
                        },
                    },
                },
                elements: {
                    line: {
                        tension: 0,
                        borderWidth: 1,
                        fill: true,
                    },
                    point: {
                        radius: 0,
                    },
                },
                plugins: {
                    legend: {
                        display: true,
                        position: "top",
                        fontFamily: "Manrope",
                    },
                    datalabels: {
                        backgroundColor: "rgba(0,0,0,.75)",
                        borderRadius: 4,
                        color: "white",
                        display: (context) => {
                            const dataset = context.dataset;
                            const value = dataset.data[context.dataIndex];
                            return value > 0 && fullscreen && tagsChecked;
                        },
                        offset: 16,
                        align: "end",
                        font: {
                            weight: "bold",
                            family: "Helvetica",
                        },
                        formatter: function (value, context) {
                            return `${context.chart.data.labels[context.dataIndex]}: ${value}`;
                        },
                        padding: {
                            top: 6,
                            bottom: 6,
                            left: 8,
                            right: 8,
                        },
                    },
                },
            }),
        };
        if (fullscreen) {
            if (!isEmpty(chart) && isFullScreen) {
                chart.destroy();
            }
            if (isFullScreen) {
                myBarChart = new Chart(ctx, config);
                setChart(myBarChart);
            }
        } else {
            if (!isEmpty(chart)) {
                chart.destroy();
            }
            myBarChart = new Chart(ctx, config);
            setChart(myBarChart);
        }
        return () => {
            if (!isEmpty(myBarChart)) myBarChart.destroy();
        };
    }, [data, tagsChecked, fullscreen]);

    return <canvas className="jl-w-full jl-h-full" ref={chartEl}></canvas>;
};

export default MultiLineChart;
