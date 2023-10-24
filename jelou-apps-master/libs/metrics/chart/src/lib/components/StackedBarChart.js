import React, { useEffect, useRef, useContext } from "react";
import { Chart } from "chart.js";
import ChartPropertiesContext from "./../modules/ChartPropertiesContext";
import defaults from "lodash/defaults";
import isEmpty from "lodash/isEmpty";
import has from "lodash/has";
import get from "lodash/get";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useSelector } from "react-redux";

Chart.register(ChartDataLabels);

const StackedBarChart = (props) => {
    const { data, chart, setChart, fullscreen, tagsChecked, isFullScreen, translationsTitles } = props;
    const chartProperties = useContext(ChartPropertiesContext);
    const chartEl = useRef(null);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const hasAxisX = has(translationsTitles, "axis.x");
    const hasAxisY = has(translationsTitles, "axis.y");

    const totalizer = {
        id: "totalizer",

        beforeUpdate: (chart) => {
            let utmost = {};
            let stacktotal = {};
            chart.data.datasets.forEach((dataset, datasetIndex) => {
                if (chart.isDatasetVisible(datasetIndex)) {
                    utmost[dataset.stack] = datasetIndex;
                    dataset.data.forEach((value, index) => {
                        if (stacktotal[dataset.stack]) {
                            if (Array.isArray(stacktotal[dataset.stack][index])) {
                                stacktotal[dataset.stack][index].push({ value: value, label: dataset.label });
                            } else {
                                stacktotal[dataset.stack][index] = [{ value: value, label: dataset.label }];
                            }
                        } else {
                            stacktotal[dataset.stack] = [];
                            stacktotal[dataset.stack][index] = [{ value: value, label: dataset.label, color: dataset.backgroundColor }];
                        }
                    });
                }
            });

            chart.$totalizer = {
                utmost: utmost,
                stacktotal: stacktotal,
            };
        },
    };

    useEffect(() => {
        const ctx = chartEl.current.getContext("2d");
        let myStackedBarChart;
        Chart.defaults.font.family = "Manrope";
        Chart.defaults.color = "#7e89a2";

        const colors = ["#01b3c7", "#93c03e", "#ffa600", "#5cc36b", "#c9b70a", "#dd5182", "#ff6e54", "#0cc194", "#444e86", "#955196", "#003f5c"];

        let index = 0;
        const chartData = {
            ...data,
            datasets: data.datasets?.map((dataset) => {
                const datasetInfo = {
                    ...dataset,
                    barPercentage: 0.2,
                    backgroundColor: colors[index],
                    borderColor: colors[index],

                    fill: true,
                    stack: "stack",
                };

                index = index + 1;

                return datasetInfo;
            }),
        };

        // const totals = chartData.datasets.map(({ data }) => data).flat();
        // const total = sum(totals);
        // const steps = total / totals.length;

        const { options = {} } = chartProperties;
        const config = {
            plugins: [ChartDataLabels, totalizer],
            type: "bar",
            data: chartData,

            options: defaults(options, {
                ...(tagsChecked && fullscreen ? { events: ["mouseout", "click", "touchstart", "touchmove", "touchend"] } : {}),
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: false,
                },
                interaction: {
                    mode: "index",
                    axis: "y",
                },
                scales: {
                    x: {
                        stacked: true,
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
                        stacked: true,
                        grid: {
                          display: false,
                      },
                      title: {
                          display: hasAxisY,
                          text: get(translationsTitles, `axis.y.${lang}`),
                          color: "#00B3C7",
                          padding: { top: 0, left: 5, right: 0, bottom: 15 },
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
                        backgroundColor: ["rgba(0,0,0,.75)"],
                        borderRadius: 4,
                        color: "white",
                        anchor: "end",
                        align: "top",
                        offset: 5,
                        textAlign: "center",
                        font: {
                            weight: "bold",
                            family: "Helvetica",
                            size: 12,
                        },
                        formatter: function (value, ctx) {
                            return value;
                        },

                        display: (context) => {
                            // const dataset = context.dataset;
                            // const count = dataset.data.length;
                            // const value = dataset.data[context.dataIndex];
                            // value > count * 1.5
                            return tagsChecked;
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
                myStackedBarChart = new Chart(ctx, config);
                setChart(myStackedBarChart);
            }
        } else {
            if (!isEmpty(chart)) {
                chart.destroy();
            }
            myStackedBarChart = new Chart(ctx, config);
            setChart(myStackedBarChart);
        }
        return () => {
            if (!isEmpty(myStackedBarChart)) myStackedBarChart.destroy();
        };
    }, [data, tagsChecked, fullscreen]);

    return <canvas className="h-full w-full" ref={chartEl}></canvas>;
};

export default StackedBarChart;
