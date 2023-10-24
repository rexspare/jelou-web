import React, { Component } from "react";
import "./VideoCall.css";

class Track extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }
    componentDidMount() {
        if (this.props.track !== null) {
            const child = this.props.track.attach();
            child.classList.add("h-full");
            this.ref.current.classList.add(this.props.track.kind);
            this.ref.current.appendChild(child);
        }
    }
    render() {
        return (
            <>
                {this.props.track.kind === "video" && this.props.expanded && this.props.client ? (
                    <div className={`name font-bold`}>{this.props.name}</div>
                ) : null}
                <div
                    className={`track relative content-center rounded-3xl ${this.props.track.kind === "video" ? `h-full` : ``}`}
                    ref={this.ref}></div>
            </>
        );
    }
}
export default Track;
