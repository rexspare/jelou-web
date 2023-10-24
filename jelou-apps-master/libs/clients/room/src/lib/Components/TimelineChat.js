import React, { Component } from "react";
import Bubbles from "@apps/clients/bubbles";
import sortBy from "lodash/sortBy";
import get from "lodash/get";
import first from "lodash/first";
import isEmpty from "lodash/isEmpty";
import reverse from "lodash/reverse";
import dayjs from "dayjs";
import { connect } from "react-redux";
import { addClientsMessages, addOperatorsHistory, isScrollingDown, loadingMessages, loadingForwardMessages, isScrollingUp } from "@apps/redux/store";
import { mergeById } from "@apps/shared/utils";
import { ScrollBottomIcon } from "@apps/shared/icons";
import { DashboardServer } from "@apps/shared/modules";

const mapStateToProps = (state) => {
    return {
        currentRoomClients: state.currentRoomClients,
        operatorsHistory: state.operatorsHistory,
        rooms: state.clientsRooms,
        scrollDown: state.scrollDown,
        scrollUp: state.scrollUp,
        isLoadingPreviousMessages: state.isLoadingPreviousMessages,
        isLoadingForwardMessages: state.isLoadingForwardMessages,
        globalSearchMessage: state.globalSearchMessage,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addClientsMessages: (messages) => dispatch(addClientsMessages(messages)),
        addOperatorsHistory: (operators) => dispatch(addOperatorsHistory(operators)),
        isScrollingDown: (scrollDown) => dispatch(isScrollingDown(scrollDown)),
        isScrollingUp: (scrollUp) => dispatch(isScrollingUp(scrollUp)),
        loadingMessages: (boolean) => dispatch(loadingMessages(boolean)),
        loadingForwardMessages: (boolean) => dispatch(loadingForwardMessages(boolean)),
    };
};

class ConnectedTimelineChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetchingEarlierMessages: false,
            showScrollBottom: true,
            allMessagesTop: false,
            allMessagesBottom: false,
            previousScroll: 0,
        };
    }

    componentDidMount() {
        this.props.isScrollingUp(true);
        const scrollHeight = this.props.timeline.current.scrollHeight;
        if (this.props.globalSearchMessage) {
            const { messageId = "" } = this.props.currentRoomClients;
            // scroll into view the message searched for
            const scrollElement = document.getElementById(messageId);
            if (scrollElement) scrollElement.scrollIntoView();
        } else {
            this.props.timeline.current.scrollTop = scrollHeight;
        }
    }

    componentDidUpdate(prevProps) {
        const isDiferentRoom = prevProps.currentRoomClients.id !== this.props.currentRoomClients.id;
        if (isDiferentRoom) {
            this.props.timeline.current.scrollBy({
                top: 99999,
                left: 0,
                behavior: "auto",
            });

            this.props.timeline.current.scrollTop = 99999;
        } else if (prevProps.messages && prevProps.messages.length < this.props.messages.length && !this.state.isFetchingEarlierMessages) {
            this.props.timeline.current.scrollTop = 99999;
        }

        if (!isEmpty(this.props.messageIdConversation)) {
            const { _id } = this.getEarlyMessages();
            const firstElement = document.getElementById(_id);
            this.props.timeline.current.scrollTop = firstElement.offsetHeight;
            this.props.operatorsMessageId();
        }
    }

    componentWillUnmount() {
        this.props.isScrollingDown(false);
        this.props.isScrollingUp(true);
    }

    isValidDate = (d) => {
        return d instanceof Date && !isNaN(d);
    };

    getEarlyMessages = () => {
        const sortedMessages = sortBy(this.props.messages, (data) => {
            const fecha = new Date(data.createdAt);
            if (this.isValidDate(fecha)) {
                return new Date(data.createdAt);
            } else {
                return new Date(data.createdAt);
            }
        });
        return first(sortedMessages);
    };

    getLastMessages = () => {
        const sortedMessages = reverse(
            sortBy(this.props.messages, (data) => {
                const fecha = new Date(data.createdAt);
                if (this.isValidDate(fecha)) {
                    return new Date(data.createdAt);
                } else {
                    return new Date(data.createdAt);
                }
            })
        );
        return first(sortedMessages);
    };

    onScroll = async (evt) => {
        try {
            const target = evt.target;
            if (this.props.messages.length === 0) {
                return;
            }
            // Scroll top
            if (target.scrollTop === 0 && this.props.scrollUp && !this.state.allMessagesTop) {
                this.setState({
                    isFetchingEarlierMessages: true,
                });
                this.props.loadingMessages(true);
                const prevScrollHeight = target.scrollHeight;
                this.setState({
                    previousScroll: prevScrollHeight,
                });
                let earlyMessages = this.getEarlyMessages();
                earlyMessages = {
                    ...earlyMessages,
                    id: earlyMessages.id || earlyMessages._id,
                };

                const roomId = get(this.props.currentRoomClients, "id");
                const { id } = earlyMessages;
                const { data } = await DashboardServer.get(`/clients/rooms/${roomId}/messages?`, {
                    params: {
                        messageId: `${id}`,
                        scroll: ["previous"],
                    },
                });
                if (!isEmpty(data?.rows)) {
                    let _earlyMessages = get(data, "rows", "");
                    _earlyMessages = mergeById(this.props.messages, _earlyMessages, "_id");
                    this.props.addClientsMessages(_earlyMessages);
                    this.setState({
                        isFetchingEarlierMessages: false,
                        loadingMessages: false,
                    });
                    if (this.props.messages.length < _earlyMessages.length) {
                        this.setState({
                            allMessagesTop: false,
                        });
                        // this.props.scrollContent("auto", target.scrollHeight - prevScrollHeight);
                    } else {
                        this.setState({
                            allMessagesTop: true,
                        });
                    }
                } else {
                    this.props.isScrollingUp(false);
                }
                this.props.loadingMessages(false);
            }
            const bottom = target.scrollHeight - target.scrollTop - target.clientHeight < 5;
            bottom
                ? this.setState({
                      showScrollBottom: false,
                  })
                : this.setState({
                      showScrollBottom: true,
                  });

            //   Scroll bottom
            if (bottom && this.props.scrollDown && !this.state.allMessagesBottom) {
                this.setState({
                    isFetchingEarlierMessages: false,
                });
                this.props.loadingForwardMessages(true);
                const prevScrollHeight = target.scrollHeight;
                let lastMessages = this.getLastMessages();
                lastMessages = {
                    ...lastMessages,
                    id: lastMessages.id || lastMessages._id,
                };
                const roomId = get(this.props.currentRoomClients, "id");
                const { id } = lastMessages;
                const { data } = await DashboardServer.get(`/clients/rooms/${roomId}/messages?`, {
                    params: {
                        messageId: `${id}`,
                        scroll: ["forward"],
                    },
                });
                if (!isEmpty(data)) {
                    let _lastMessages = get(data, "rows", "");
                    if (!isEmpty(_lastMessages)) {
                        _lastMessages = mergeById(this.props.messages, _lastMessages, "_id");
                        this.props.addClientsMessages(_lastMessages);
                        this.props.timeline.current.scrollTop = prevScrollHeight;
                        if (this.props.messages.length < _lastMessages.length) {
                            this.setState({
                                allMessagesBottom: false,
                            });
                            this.props.scrollContent("auto", target.scrollHeight - prevScrollHeight);
                        } else {
                            this.setState({
                                allMessagesBottom: true,
                            });
                        }
                    } else {
                        this.props.isScrollingDown(false);
                    }
                    this.setState({
                        isFetchingEarlierMessages: false,
                    });
                }
                this.props.loadingForwardMessages(false);
            }
        } catch (err) {
            this.setState({
                isFetchingEarlierMessages: false,
            });
            this.props.loadingForwardMessages(false);
            this.props.loadingMessages(false);
            console.log("err", err);
        }
    };

    render() {
        const sortedMessages = sortBy(this.props.messages, (data) => {
            return dayjs(data.createdAt);
        });
        return (
            <>
                <Bubbles
                    sortedMessages={sortedMessages}
                    className={this.props.className}
                    scrollToBottom={this.scrollToBottom}
                    timeline={this.props.timeline}
                    handleScroll={this.onScroll}
                    openNewChat={this.openNewChat}
                    openModal={this.state.openModal}
                    message={this.state.clientsMessages}
                    closeModal={this.closeModal}
                    query={this.props.query}
                    field={this.props.field}
                    previousScroll={this.state.previousScroll}
                />
                {this.state.showScrollBottom && (
                    <button
                        onClick={() => this.props.onClickToBottom()}
                        className={"left-10 absolute bottom-0 z-10 mb-4 ml-4 rounded-full bg-primary-200 p-3"}>
                        <ScrollBottomIcon width="1.1rem" height="1.1rem" />
                    </button>
                )}
            </>
        );
    }
}

const customComparator = (prevProps, nextProps) => {
    // className={`mt-16 mb-2 pb-8 sm:mt-0`}
    // prevMessages={prevMessages}
    // prevRoom={prevRoom}
    // scrollDown={scrollDown}
    // scrollContent={scrollContent}
    // onClickToBottom={onClickToBottom}
    // operatorsMessageId={operatorsMessageId}
    // messageIdConversation={messageIdConversation}
    return (
        prevProps.messages === nextProps.messages &&
        prevProps.currentRoom === nextProps.currentRoom &&
        prevProps.timeline === nextProps.timeline &&
        prevProps.query === nextProps.query &&
        prevProps.field === nextProps.field &&
        prevProps.operatorsMessageId === nextProps.operatorsMessageId &&
        prevProps.messageIdConversation === nextProps.messageIdConversation
    );
};

const TimelineChat = connect(mapStateToProps, mapDispatchToProps)(React.memo(ConnectedTimelineChat, customComparator));

export default TimelineChat;
