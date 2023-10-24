/* eslint-disable array-callback-return */
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { withTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { JelouApiV1 } from "@apps/shared/modules";
import Tag from "../tag/tag";
import { useDispatch, useSelector } from "react-redux";

const EmailTags = (props) => {
    const { emailTags } = props;
    const company = useSelector((state) => state.company);

    const [tags, setTags] = useState([]);

    useEffect(() => {
        getTags();
    }, []);

    const getTags = () => {
        JelouApiV1.get(`/company/${company.id}/tags?type=reply`)
            .then((res) => {
                const tagsArray = get(res, "data.data", []);
                setTags(tagsArray);
            })
            .catch((err) => {
                console.log("=== ERROR", err);
            });
    };

    const getTagsInfo = () => {
        let objs = tags.filter((el) => {
            if (emailTags.includes(el.id)) {
                return el;
            }
            if (emailTags.some((tag) => tag.id === el.id)) {
                return el;
            }
        });
        return objs;
    };

    let tagsInfo = getTagsInfo();

    return (
        <div className="flex flex-col justify-start space-y-2 text-gray-15">
            <div className="flex flex-row">
                <div className="h-ful relative flex">
                    <div className="mr-2 flex flex-wrap-reverse space-x-1 space-y-2 overflow-x-auto">
                        <div id="tags-container" className="flex flex-nowrap space-x-1 overflow-x-auto">
                            {!isEmpty(tagsInfo) &&
                                tagsInfo.map((tag, index) => {
                                    return (
                                        <div className="h-6 flex-none" key={index}>
                                            <Tag tag={tag} key={index} />
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withTranslation()(EmailTags);
