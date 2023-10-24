import React, { useEffect, useRef, useContext } from "react";
import { Chart } from "chart.js";
import defaults from "lodash/defaults";
import sum from "lodash/sum";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import has from "lodash/has";

import ChartPropertiesContext from "./../modules/ChartPropertiesContext";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useSelector } from "react-redux";

Chart.register(ChartDataLabels);

const HorizontalBarChart = (props) => {
    const { data, chart, setChart, fullscreen, tagsChecked, isFullScreen, translationsTitles } = props;
    const chartProperties = useContext(ChartPropertiesContext);
    const chartEl = useRef(null);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const hasAxisX = has(translationsTitles, "axis.x");
    const hasAxisY = has(translationsTitles, "axis.y");

    useEffect(() => {
        let myHorizontalBarChart;
        const ctx = chartEl.current.getContext("2d");

        Chart.defaults.font.family = "Manrope";
        Chart.defaults.color = "#7e89a2";

        const chartData = {
            ...data,
            datasets: data.datasets.map((dataset) => {
                return {
                    ...dataset,
                    barPercentage: 0.3,
                    backgroundColor: "#01b3c7",
                    borderColor: "#01b3c7",
                    fill: true,
                };
            }),
        };

        const totals = chartData.datasets.map(({ data }) => data).flat();
        const total = sum(totals);
        const steps = total / totals.length;

        const { options = {} } = chartProperties;
        const config = {
            plugins: [ChartDataLabels],
            type: "horizontalBar",
            data: chartData,
            options: defaults(options, {
                ...(tagsChecked && fullscreen ? { events: ["mouseout", "touchstart", "touchmove", "touchend"] } : {}),
                barRoundness: 10,
                responsive: true,
                interaction: {
                    intersect: false,
                },
                maintainAspectRatio: false,
                title: {
                    display: false,
                },
                tooltips: {
                    mode: "index",
                    intersect: false,
                },
                hover: {
                    mode: "nearest",
                    intersect: true,
                },
                scales: {
                    xAxes: [
                        {
                            display: true,
                            gridLines: {
                                display: false,
                            },
                            scaleLabel: {
                                display: false,
                                labelString: "Month",
                            },
                            ticks: {
                                stepSize: steps,
                                beginAtZero: true,
                                userCallback: function (label, index, labels) {
                                    if (Math.floor(label) === label) {
                                        return label;
                                    }
                                    return Math.floor(label);
                                },
                            },
                            title: {
                                display: hasAxisX,
                                text: get(translationsTitles, `axis.x.${lang}`),
                                color: "#00B3C7",
                                padding: { top: 10, left: 0, right: 0, bottom: 0 },
                                font: {
                                    weight: "bold",
                                },
                            },
                        },
                    ],
                    y: {
                        display: true,
                        grid: {
                            display: false,
                        },
                        title: {
                            display: hasAxisY,
                            text: get(translationsTitles, `axis.y.${lang}`),
                            color: "#00B3C7",
                            padding: { top: 0, left: 0, right: 0, bottom: 15 },
                            font: {
                                weight: "bold",
                            },
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
                myHorizontalBarChart = new Chart(ctx, config);
                setChart(myHorizontalBarChart);
            }
        } else {
            if (!isEmpty(chart)) {
                chart.destroy();
            }
            myHorizontalBarChart = new Chart(ctx, config);
            setChart(myHorizontalBarChart);
        }
        return () => {
            if (!isEmpty(myHorizontalBarChart)) myHorizontalBarChart.destroy();
        };
    }, [data, tagsChecked, fullscreen]);

    return <canvas className="h-full w-full" ref={chartEl}></canvas>;
};

export default HorizontalBarChart;
