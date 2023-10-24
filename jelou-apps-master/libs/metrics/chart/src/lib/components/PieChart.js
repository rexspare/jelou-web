import React, { useEffect, useRef, useContext } from "react";
import {
    Chart,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle,
} from "chart.js";
import defaults from "lodash/defaults";
import truncate from "lodash/truncate";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

import ChartPropertiesContext from "./../modules/ChartPropertiesContext";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useTranslation } from "react-i18next";

Chart.register(
    ChartDataLabels,
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip,
    SubTitle
);

const COLORS = ["#01b3c7", "#93c03e", "#ffa600", "#5cc36b", "#c9b70a", "#dd5182", "#ff6e54", "#0cc194", "#444e86", "#955196", "#003f5c"];

const PieChart = (props) => {
    const { data, setChart, chart, fullscreen, tagsChecked, isFullScreen, showPercentage } = props;
    const { t } = useTranslation();
    const chartEl = useRef(null);
    const chartProperties = useContext(ChartPropertiesContext);

    useEffect(() => {
        const ctx = chartEl.current.getContext("2d");
        let pieChart;

        Chart.defaults.font.family = "Manrope";
        Chart.defaults.color = "#7e89a2";

        const chartData = {
            ...data,
            datasets: data.datasets?.map((dataset) => {
                return {
                    ...dataset,
                    backgroundColor: COLORS,
                };
            }),
        };

        const { options = {} } = chartProperties;
        const config = {
            plugins: [ChartDataLabels],
            type: "doughnut",
            data: chartData,
            options: defaults(options, {
                ...(tagsChecked && fullscreen ? { events: ["mouseout", "click", "touchstart", "touchmove", "touchend"] } : {}),
                cutoutPercentage: 55,
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 2,
                title: {
                    display: false,
                },
                plugins: {
                    tooltip: {
                        enabled: showPercentage,
                        callbacks: {
                            footer: (ttItem) => {
                                const item = ttItem[0];
                                const index = item.dataIndex;
                                const percentage = item.dataset.percentage[index];
                                return `${t("shop.selectOptions.percentage")} : ${percentage}%`;
                            },
                        },
                    },
                    legend: {
                        display: true,
                        position: "right",
                        fontFamily: "Manrope",
                        labels: {
                            generateLabels(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => {
                                        const meta = chart.getDatasetMeta(0);
                                        const arc = meta.data[i];
                                        const style = meta.controller.getStyle(i);

                                        let percentage = 0;
                                        if (showPercentage) {
                                            const percentages = meta._dataset?.percentage;
                                            percentage = percentages[i];
                                        }

                                        let value = 0;
                                        if (!isEmpty(arc.$datalabels) && !isEmpty(arc.$context)) {
                                            value = get(data.datasets[arc.$datalabels[0].$context.datasetIndex].data, `[${arc.$context.index}]`);
                                        }

                                        return {
                                            text: `${truncate(label, 35)}: ${value}     ${showPercentage ? `(${percentage}%)` : ""}        `,
                                            fillStyle: style.backgroundColor,
                                            strokeStyle: style.borderColor,
                                            lineWidth: style.borderWidth,
                                            hidden: !chart.getDataVisibility(i),
                                            index: i,
                                        };
                                    });
                                }
                                return [];
                            },
                            onClick(e, legendItem, legend) {
                                legend.chart.toggleDataVisibility(legendItem.index);
                                legend.chart.update();
                            },
                        },
                    },
                    datalabels: {
                        backgroundColor: "rgba(0,0,0,.75)",
                        borderRadius: 4,
                        hoverOffset: 4,
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
                            family: "Helvetica", //Manrope
                        },
                        formatter: function (value, context) {
                            if (showPercentage) {
                                const index = context.dataIndex;
                                const percentage = context.dataset.percentage[index];
                                return `${context.chart.data.labels[context.dataIndex]}: ${value} (${percentage}%)`;
                            }
                            return `${context.chart.data.labels[context.dataIndex]}: ${value}`;
                        },
                        padding: {
                            top: 6,
                            bottom: 6,
                            left: 4,
                            right: 6,
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
                pieChart = new Chart(ctx, config);
                setChart(pieChart);
            }
        } else {
            if (!isEmpty(chart)) {
                chart.destroy();
            }
            pieChart = new Chart(ctx, config);
            setChart(pieChart);
        }
        return () => {
            if (!isEmpty(pieChart)) pieChart.destroy();
        };
    }, [data, tagsChecked, fullscreen]);

    return <canvas className="pie-chart absolute h-full w-full" ref={chartEl}></canvas>;
};

export default PieChart;
