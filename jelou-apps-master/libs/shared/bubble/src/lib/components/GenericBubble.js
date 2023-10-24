import React, { Component } from "react";
import Swiper from "react-id-swiper";
import BubbleContainer from "./BubbleContainer";
// import "swiper/css/swiper.css";

/* Icons */
import { DownIcon } from "@apps/shared/icons";

// const bubbleStyle = "py-2 relative leading-normal text-left rounded-lg font-light max-w-full inline-flex w-full";
const bubbleStyle =
    "relative text-base inline-flex leading-normal text-left text-15 border-2 border-primary-75 rounded-lg w-auto max-w-full linkify linkify--right";
const ArrowButton = (props) => (
    <div className={props.className}>
        <div className="z-20 cursor-pointer" onClick={props.onClick}>
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-white `}>
                {props.side === "Next" ? (
                    <DownIcon className="-rot-90 fill-current text-gray-400" width="1.563rem" height="1.563rem" />
                ) : (
                    <DownIcon className="rot-90 fill-current text-gray-400" width="1.563rem" height="1.563rem" />
                )}
            </div>
        </div>
    </div>
);

const params = {
    spaceBetween: 30,
    slidesPerView: 1,
    draggable: true,
    navigation: {
        nextEl: ".button-next",
        prevEl: ".button-prev",
    },
    renderPrevButton: () => <ArrowButton className="button-prev absolute top-0 bottom-0 left-0 z-50" />,
    renderNextButton: () => <ArrowButton side="Next" className="button-next absolute top-0 bottom-0 right-0 z-50" />,
};

class GenericBubble extends Component {
    constructor(props) {
        super(props);
        this.ts = React.createRef();
    }

    onGoTo = (dir) => {
        this.ts.slider.goTo(dir);
    };

    Element = () => {
        return this.props.message.elements.map((element, index) => (
            <div key={index + element.imageUrl + element.title} className="relative w-full content-center overflow-hidden rounded-lg bg-white shadow">
                <img
                    className="mx-auto mb-4 block h-150 pt-2"
                    src={element.imageUrl}
                    data-src={element.imageUrl}
                    alt="carrousel-element"
                    style={{ objectFit: "cover" }}
                />
                <div className="flex flex-col px-6 py-3">
                    <p className="text-lg font-semibold text-gray-400">{element.title}</p>
                    <p className="text-gray-400">{element.subtitle}</p>
                </div>
                <div className="bg-primary-75 flex w-full flex-col justify-center text-center">
                    {element.options.map((option) => (
                        <div key={index + element.image_url + option.title} className="border-t p-2">
                            <div className="my-2 font-bold text-white">{option.title || "Sin Definir"}</div>
                        </div>
                    ))}
                </div>
            </div>
        ));
    };
    render() {
        return (
            <BubbleContainer {...this.props}>
                <div className={bubbleStyle}>
                    <Swiper {...params}>{this.Element()}</Swiper>
                </div>
            </BubbleContainer>
        );
    }
}

export default GenericBubble;
