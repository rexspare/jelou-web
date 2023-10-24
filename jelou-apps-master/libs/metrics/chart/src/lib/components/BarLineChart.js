import React, { useEffect, useRef } from "react";
import toUpper from "lodash/toUpper";
import toLower from "lodash/toLower";
import isEmpty from "lodash/isEmpty";
import has from "lodash/has";
import get from "lodash/get";
import { Chart } from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { useSelector } from "react-redux";

Chart.register(ChartDataLabels);

const BarLineChart = (props) => {
    const { data, chart, setChart, fullscreen, tagsChecked, isFullScreen, translationsTitles } = props;
    const chartEl = useRef(null);
    const colors = ["#93c03e", "#01b3c7", "#ffa600", "#5cc36b", "#c9b70a", "#dd5182", "#ff6e54", "#0cc194", "#444e86", "#955196", "#003f5c"];
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const hasAxisX = has(translationsTitles, "axis.x");
    const hasAxisY = has(translationsTitles, "axis.y");
    const axisY = get(translationsTitles, "axis.y", []);
    const axisYLeft = axisY[0];
    const axisYRight = axisY[1];

    useEffect(() => {
        const ctx = chartEl.current.getContext("2d");
        let index = 0;
        let datasetInfo = {};
        let myBarChart;

        const labels = data.labels;
        const chartData = {
            labels: labels,
            datasets: data.datasets?.map((dataset) => {
                if (toUpper(dataset.type) === "LINE") { 
                    const data = dataset.data;
                    let result = data;
                    if (toUpper(dataset.label).includes("PORCENTAJE")) {
                        result = data.map((a) => a.toFixed(2));
                    }
                    datasetInfo = {
                        type: toLower(dataset.type),
                        label: dataset.label,
                        fill: false,
                        data: [...result],
                        backgroundColor: colors[index],
                        borderColor: colors[index],
                        order: 0,
                        yAxisID: "right",
                    };
                } else {
                    datasetInfo = {
                        type: toLower(dataset.type),
                        label: dataset.label,
                        fill: true,
                        backgroundColor: colors[index],
                        borderColor: colors[index],
                        data: dataset.data,
                        barPercentage: 0.2,
                        order: 1,
                    };
                }
                index = index + 1;

                return datasetInfo;
            }),
        };
        const config = {
            type: "bar",
            data: chartData,
            options: {
                responsive: true,
                legend: { position: "top" },
                stacked: false,
                maintainAspectRatio: false,
                title: { display: false },
                hover: { mode: "nearest", intersect: true },
                tooltips: {
                    mode: "index",
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: "top",
                        fontFamily: "Manrope",
                    },
                    tooltip: {
                        position: "average",
                    },
                    datalabels: {
                        display: false,
                    },
                },
                scales: {
                    x: {
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
            },
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

    return <canvas className="h-full w-full" ref={chartEl}></canvas>;
};

export default BarLineChart;
