import React, { useEffect, useRef, useContext } from "react";
import isNumber from "lodash/isNumber";
import toUpper from "lodash/toUpper";
import truncate from "lodash/truncate";
import defaults from "lodash/defaults";
import has from "lodash/has";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Chart } from "chart.js";
import ChartPropertiesContext from "./../modules/ChartPropertiesContext";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { useSelector } from "react-redux";

Chart.register(ChartDataLabels);

const COLORS = ["#01b3c7", "#93c03e", "#ffa600", "#5cc36b", "#c9b70a", "#dd5182", "#ff6e54", "#0cc194", "#444e86", "#955196", "#003f5c"];

let fullscreenLocal = false;

const BarChart = (props) => {
    const { data, chart, setChart, type, fullscreen, tagsChecked, isFullScreen, translationsTitles, chartProperties } = props;
    const chartEl = useRef(null);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const hasAxisX = has(translationsTitles, "axis.x");
    const hasAxisY = has(translationsTitles, "axis.y");

    useEffect(() => {
        if (isFullScreen && chart) {
            fullscreenLocal = fullscreen;
            if (toUpper(type) === "GROUPEDBAR") {
                if (fullscreen && tagsChecked) chart.options.events = ["click"];
                else chart.options.events = ["mousemove", "click"];
                if (!isEmpty(chart) && !isEmpty(chart.canvas)) chart.update();
            }
        }
    }, [fullscreen, tagsChecked, chart]);

    useEffect(() => {
        let myBarChart;
        const ctx = chartEl.current.getContext("2d");

        Chart.defaults.font.family = "Manrope";
        Chart.defaults.color = "#7e89a2";

        let chartData = {};
        if (toUpper(type) === "GROUPEDBAR") {
            chartData = {
                ...data,
                datasets: data.datasets?.map((dataset, index) => {
                    return {
                        ...dataset,
                        barPercentage: 0.2,
                        backgroundColor: COLORS[index],
                        borderColor: COLORS[index],
                        fill: true,
                    };
                }),
            };
        } else {
            chartData = {
                ...data,
                datasets: data.datasets?.map((dataset) => {
                    return {
                        ...dataset,
                        barPercentage: 0.2,
                        backgroundColor: "#01b3c7",
                        borderColor: "#01b3c7",
                        fill: true,
                    };
                }),
            };
        }

        const {
            datalabels: {
                rotation = 0,
                color = "#fff",
                align = "end",
                anchor = "",
                size = "12",
                backgroundColor = "rgba(0,0,0,.75)",
                dataLabelTop = false,
            } = {},
        } = chartProperties;

        const legendExtraSpace = {
            id: "legendMargin",
            beforeInit: function (chart, legend, options) {
                const fitValue = chart.legend.fit;
                chart.legend.fit = function fit() {
                    fitValue.bind(chart.legend)();
                    this.height = this.height + 25;
                };
            },
        };

        const { options = {} } = chartProperties;
        const config = {
            plugins: [legendExtraSpace, ChartDataLabels],
            type: "bar",
            data: chartData,
            options: defaults(options, {
                ...(toUpper(type) === "BAR" && tagsChecked && fullscreen ? { events: ["mouseout", "touchstart", "touchmove", "touchend"] } : {}),
                responsive: true,
                interaction: {
                    mode: "index",
                    axis: "x",
                    intersect: false,
                },
                layout: {
                    padding: 8,
                },
                maintainAspectRatio: false,
                title: {
                    display: false,
                },
                tooltips: {
                    mode: "index",
                    intersect: false,
                },
                scales: {
                    x: {
                        gridLines: {
                            display: false,
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
                        ticks: {
                            userCallback: function (label, index, labels) {
                                if (labels.length < 10) {
                                    return label;
                                }
                                return truncate(label, {
                                    length: 20,
                                    omission: "...",
                                });
                            },
                        },
                    },
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
                    tooltip: {
                        enabled: !tagsChecked,
                    },
                    legend: {
                        display: toUpper(type) !== "BAR",
                        position: "top",
                        fontFamily: "Manrope",
                        heigth: 100,
                    },
                    datalabels: {
                        ...(!isEmpty(backgroundColor) ? { backgroundColor } : { backgroundColor: "rgba(0,0,0,.75)" }),
                        borderRadius: 4,
                        ...(!isEmpty(color) ? { color } : {}),
                        ...(!isNumber(rotation) ? { rotation } : {}),

                        display: (context) => {
                            const dataset = context.dataset;
                            const value = dataset.data[context.dataIndex];
                            return value > 0 && (fullscreenLocal && tagsChecked || dataLabelTop);
                        },
                        offset: 16,
                        ...(!isEmpty(anchor) ? { anchor } : {}),
                        ...(!isEmpty(align) ? { align } : {}),
                        font: {
                            weight: "bold",
                            family: "Helvetica",
                            ...(!isEmpty(size) ? { size } : {}),
                        },
                        formatter: function (value, context) {
                            if (dataLabelTop && !tagsChecked) {
                                return value;
                            } else {
                                const dataTag = toUpper(type) === "BAR" ? context.chart.data.labels[context.dataIndex] : context.dataset.label;
                                return `${dataTag}: ${value}`;
                            }
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
                config.options.plugins.datalabels.display = tagsChecked;
                myBarChart = new Chart(ctx, config);
                setChart(myBarChart);
            }
        } else {
            if (!isEmpty(chart)) {
                chart.destroy();
            }
            config.options.plugins.datalabels.display = false;
            myBarChart = new Chart(ctx, config);
            setChart(myBarChart);
        }
        return () => {
            if (!isEmpty(myBarChart)) myBarChart.destroy();
        };
    }, [data, tagsChecked, fullscreen]);

    return <canvas className="h-full w-full" ref={chartEl}></canvas>;
};

export default BarChart;
