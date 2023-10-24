import React, { Component } from "react";
import { ClipLoader } from "react-spinners";
import { addOperatorsHistory } from "@apps/redux/store";
import { connect } from "react-redux";
import first from "lodash/first";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { DownloadElementIcon, OperatorIcon2 } from "@apps/shared/icons";
import moment from "moment";
import { mergeById } from "@apps/shared/utils";
// import FileDownload from "js-file-download";
import { ColumnSkeleton } from "@apps/shared/common";
import { DashboardServer } from "@apps/shared/modules";
import { Link } from "react-router-dom";

const mapStateToProps = (state) => {
    return {
        currentRoomClients: state.currentRoomClients,
        operatorsHistory: state.operatorsHistory,
        rooms: state.clientsRooms,
        scrollDown: state.scrollDown,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addOperatorsHistory: (operators) => dispatch(addOperatorsHistory(operators)),
    };
};

class OperatorHistory extends Component {
    constructor(props) {
        super(props);
        this.historyRef = React.createRef();
        this.state = {
            isFetchingEarlierOperators: false,
            hasMoreOperators: true,
            loadingDownload: false,
        };
    }

    getLastOperator = () => {
        let sortedMessages = [...this.props.operatorsHistory];
        sortedMessages = sortedMessages.sort(function (a, b) {
            return moment(a.date, "DD/MM/YYYY hh:mm:ss") - moment(b.date, "DD/MM/YYYY hh:mm:ss");
        });
        return first(sortedMessages);
    };

    onScroll = async (evt) => {
        try {
            const target = evt.target;
            const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;

            if (bottom && this.state.hasMoreOperators) {
                this.setState({
                    isFetchingEarlierOperators: true,
                });
                const roomId = get(this.props.currentRoomClients, "id");
                const previewMessage = this.getLastOperator();
                const { conversationId } = previewMessage;
                const operatorId = this.props.selectedOptions["operators"];
                const { data } = await DashboardServer.get(`/clients/rooms/${roomId}/operators?`, {
                    // headers: {
                    //     Authorization: `Bearer ${token}`,
                    // },
                    params: {
                        // page: page,
                        limit: 5,
                        // ...(!isEmpty(startAt) ? { startAt } : {}),
                        // ...(!isEmpty(endAt) ? { endAt } : {}),
                        ...(!isEmpty(conversationId) ? { conversationId } : {}),
                        ...(!isEmpty(operatorId) ? { userId: operatorId } : {}),
                    },
                });
                if (!isEmpty(data)) {
                    const newOperators = data.map((operator) => {
                        return { ...operator, isSelected: false };
                    });
                    const operators = [...this.props.operatorsHistory];
                    const updateOperators = mergeById(operators, newOperators, "conversationId");
                    this.props.addOperatorsHistory(updateOperators);
                } else {
                    this.setState({
                        hasMoreOperators: false,
                    });
                }
                this.setState({
                    isFetchingEarlierOperators: false,
                });
            }
        } catch (err) {
            this.setState({
                isFetchingEarlierOperators: false,
            });
            console.log("err", err);
        }
    };

    render() {
        let loadingSkeleton = [];

        for (let i = 0; i < 8; i++) {
            loadingSkeleton.push(<ColumnSkeleton key={i} />);
        }
        if (this.props.loadingOperators) {
            return (
                <div className="flex flex-1 flex-row overflow-y-auto">
                    <div className="relative mt-16 flex-1 overflow-x-hidden pb-10 sm:mt-0">{loadingSkeleton}</div>
                </div>
            );
        }

        return (
            <>
                {isEmpty(this.props.operators) ? (
                    <div className="flex flex-1 flex-row overflow-y-auto">
                        <div className="flex flex-1 items-center justify-center">{this.props.noOperators}</div>
                    </div>
                ) : (
                    <div className="item-center my-5 flex flex-1 flex-col overflow-y-auto px-2" ref={this.historyRef} onScroll={this.onScroll}>
                        {this.props.operators.map((operator, index) => {
                            return (
                                <div key={index} className="relative">
                                    <button className="relative mx-3 text-gray-400" onClick={() => this.props.handleOperator(operator)}>
                                        <div
                                            className={`w-px absolute left-4 top-4 ml-1 mt-4 h-full bg-opacity-25 ${
                                                operator.isSelected ? "bg-primary-200" : "bg-gray-100"
                                            }`}></div>
                                        {operator.isSelected && (
                                            <div className="absolute left-4 top-4 mx-auto mt-4 h-2 w-2 rounded-full bg-primary-200"></div>
                                        )}
                                        <div className="mx-4 my-2 flex flex-row justify-center space-x-3">
                                            <OperatorIcon2
                                                width="14"
                                                height="14"
                                                className={`fill-current ${
                                                    operator.isSelected ? "text-primary-200" : "text-gray-400"
                                                } mt-1 text-opacity-60`}
                                            />
                                            <div className="flex flex-col space-y-1">
                                                <span
                                                    className={`flex justify-start leading-6 ${
                                                        operator.isSelected ? "font-bold text-primary-200" : "text-gray-400"
                                                    } text-opacity-65`}>
                                                    {operator.operator}
                                                </span>
                                                <span className="text-15">{operator.date}</span>
                                            </div>
                                        </div>
                                    </button>

                                    <button className="absolute inset-y-0 top-0">
                                        {operator.isSelected && (
                                            <Link
                                                to={`/monitoring/conversation/download/${this.props.currentRoomClients.botId}/${operator.conversationId}`}
                                                target="_blank">
                                                <DownloadElementIcon
                                                    width="18"
                                                    height="18"
                                                    onmouseover="myScript"
                                                    fill={"#A6B4D0"}
                                                    className={`fill-current text-white`}
                                                />
                                            </Link>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {this.state.isFetchingEarlierOperators && (
                    <div className="flex items-end justify-center">
                        <ClipLoader size={"1.875rem"} color="#00B3C7" />
                    </div>
                )}
            </>
        );
    }
}

const OperatorHistoryChat = connect(mapStateToProps, mapDispatchToProps)(OperatorHistory);

export default OperatorHistoryChat;
