import React, { useEffect, useRef, useContext } from "react";
import has from "lodash/has";
import defaults from "lodash/defaults";
import truncate from "lodash/truncate";
import get from "lodash/get";
import set from "lodash/set";
import isEmpty from "lodash/isEmpty";
import { Chart } from "chart.js";
import ChartPropertiesContext from "./../modules/ChartPropertiesContext";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useSelector } from "react-redux";

Chart.register(ChartDataLabels);

const LineChart = (props) => {
    const { data = [], chart, setChart, fullscreen, tagsChecked, isFullScreen, translationsTitles } = props;
    const chartEl = useRef(null);
    const chartProperties = useContext(ChartPropertiesContext);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const hasAxisX = has(translationsTitles, "axis.x");
    const hasAxisY = has(translationsTitles, "axis.y");

    useEffect(() => {
        const ctx = chartEl.current.getContext("2d");
        let myLineChart;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, "rgba(210, 251, 255, 1.00)");
        gradient.addColorStop(0.7, "rgba(255, 255, 255, 1)");

        Chart.defaults.font.family = "Manrope";
        Chart.defaults.color = "#7e89a2";

        let datasets;

        // Handle single line chart
        if (data.datasets?.length === 1) {
            datasets = data.datasets.map((dataset) => {
                return {
                    ...dataset,
                    backgroundColor: gradient,
                    borderColor: "#01b3c7",
                    fill: true,
                };
            });
        }

        // Handle multi line chart
        if (data.datasets?.length > 1) {
            const colors = [
                "#01b3c7",
                "#00bbb4",
                "#0cc194",
                "#5cc36b",
                "#93c03e",
                "#c9b70a",
                "#ffa600",
                "#ff6e54",
                "#dd5182",
                "#955196",
                "#444e86",
                "#003f5c",
            ];
            datasets = data.datasets?.map((dataset, index) => {
                return {
                    ...dataset,
                    borderColor: colors[index],
                    fill: false,
                };
            });
        }

        let chartData = {
            ...data,
            datasets,
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
                layout: {
                    padding: {
                        right: 40,
                        top: 45,
                        left: 20,
                    },
                },
                scales: {
                    x: {
                        gridLines: {
                            display: false,
                        },
                        scaleLabel: {
                            display: false,
                        },
                        ticks: {
                            userCallback: function (label, index, labels) {
                                return truncate(label, {
                                    length: 20,
                                    omission: "...",
                                });
                            },
                        },
                        display: true,
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
                    y: {
                        type: "linear",
                        display: true,
                        position: "left",
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
                        display: false,
                        position: "top",
                        fontFamily: "Manrope",
                    },
                    datalabels: {
                        backgroundColor: "rgba(0,0,0,.75)",
                        borderRadius: 4,
                        color: "white",
                        display: (context) => {
                            const dataset = context.dataset;
                            // const count = dataset.data.length;
                            const value = dataset.data[context.dataIndex];
                            return value > 0 && isFullScreen && tagsChecked;
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

        if (get(options, "appendToLabelTooltip")) {
            const label = function (tooltipItem, data) {
                return `${tooltipItem.value}${get(options, "appendToLabelTooltip")}`;
            };
            set(config, "options.tooltips.callbacks.label", label);
        }

        if (fullscreen) {
            if (!isEmpty(chart) && isFullScreen) {
                chart.destroy();
            }
            if (isFullScreen) {
                myLineChart = new Chart(ctx, config);
                setChart(myLineChart);
            }
        } else {
            if (!isEmpty(chart)) {
                chart.destroy();
            }
            myLineChart = new Chart(ctx, config);
            setChart(myLineChart);
        }

        return () => {
            if (!isEmpty(myLineChart)) myLineChart.destroy();
        };
    }, [data, tagsChecked, fullscreen]);

    return <canvas className="h-full w-full" ref={chartEl}></canvas>;
};

export default LineChart;
