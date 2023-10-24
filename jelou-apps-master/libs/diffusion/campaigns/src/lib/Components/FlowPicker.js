import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ComboboxSelect } from "@apps/shared/common";
import { RESPONSE_TYPES } from "@apps/shared/constants";
// import { usePrevious } from "@apps/shared/hooks";
import { JelouApiV1 } from "@apps/shared/modules";
import { toast } from "react-toastify";
import DurationPicker from "./DurationPicker";

const FlowPicker = ({
    currentBot,
    responses,
    flow,
    setFlow,
    flows,
    response,
    setResponse,
    ttl,
    setTtl,
    handleDuration,
    handleOptionConfig,
    ttlValue,
    steps,
    getTitle,
    setFlowResponse,
    setFlagFlowPicker,
    setSteps,
}) => {
    const [loadFirst, setLoadFirst] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const flow = first(flows);
        if (flow && isEmpty(flow) && loadFirst) {
            setFlow(flow);
            if (responses === RESPONSE_TYPES.FLOW) {
                setFlowResponse(get(flow, "id"));
            }
            if (responses === RESPONSE_TYPES.INPUT) {
                getQuestions(get(flow, "id"));
            }
            handleOptionConfig(get(flow, "title"));
            setLoadFirst(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flows, flow, responses]);

    const getQuestions = async (flow) => {
        try {
            const { data } = await JelouApiV1.get(`/bots/${currentBot}/flows/${flow.id}/bubbles`, {
                params: {
                    shouldPaginate: false,
                    hasBubbles: true,
                    state: true,
                },
                headers: {
                    Authorization:
                        "Basic cFM1T2lrUUt2SFUzM1YyaUN2STdVc0NnTGtaTzZFOUY6VHl4ZXhsUl9EUk53MEV4LWd2ZmZZcldaUmhZc3U0amM1LU9MbU5PS2pkQXVRMlY2YW95WFEyVXAybVA3aUFhbg==",
                },
            });
            const questiontype = get(data, "results", []);
            const type = questiontype.find((item) => item.type === "input");
            const inputId = get(type, "Input.id");
            const setState = {
                type: get(type, "type"),
                inputId: inputId,
                ttl: ttl,
            };
            if (type && responses === RESPONSE_TYPES.INPUT && isEmpty(response)) {
                setResponse({ setState });
            } else if (isEmpty(type) && responses === RESPONSE_TYPES.INPUT) {
                setResponse(null);
                toast.error(t("campaigns.errorNotInput"), {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleQuestion = (flow) => {
        setFlow(flow);
        getQuestions(flow);
        handleOptionConfig(getTitle(flow));
    };

    const handleFlow = (flow) => {
        setFlagFlowPicker(true);
        setFlow(flow);
        setFlowResponse(flow);
        handleOptionConfig(getTitle(flow));
    };

    useEffect(() => {
        if (!isEmpty(flow)) {
            const nameFlow = get(flow, "name");
            const stepsList = [...steps];
            for (var step in stepsList) {
                if (steps[step].number === "4") {
                    steps[step].inputData = nameFlow;
                    break;
                }
            }
            setSteps(stepsList);
        }
    }, [flow]);

    return (
        <div className="mb-6 max-w-md">
            {responses === RESPONSE_TYPES.INPUT ? (
                <div>
                    <ComboboxSelect
                        options={flows}
                        value={flow}
                        label={t("FlowPicker.selectFlow")}
                        handleChange={handleQuestion}
                        name={"input"}
                        background={"#fff"}
                        hasCleanFilter={false}
                    />
                    <DurationPicker ttlValue={ttlValue} handleDuration={handleDuration} />
                </div>
            ) : (
                <ComboboxSelect
                    options={flows}
                    value={flow}
                    label={t("FlowPicker.selectFlow")}
                    handleChange={handleFlow}
                    name={"flow"}
                    background={"#fff"}
                    hasCleanFilter={false}
                />
            )}
        </div>
    );
};

export default FlowPicker;
