import { Transition } from "@headlessui/react";
import Fuse from "fuse.js";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactPaginate from "react-paginate";
import { usePopper } from "react-popper";
import { GridLoader } from "react-spinners";

// import '../../i18n';
import { CardBot, Grid, Modal } from "@apps/bots/ui-shared";
// import { DashboardServer } from "@apps/shared/modules";
import { Input } from "@apps/platform/ui-shared";
import { ComboboxSelect } from "@apps/shared/common";
import { FindIcon, ThumbUp } from "@apps/shared/icons";

import { Guide } from "@apps/bots/ui-shared";
import { getBots, getBotsByChannel } from "@apps/redux/store";
import { ARRAY_CHANNEL_TYPES } from "@apps/shared/constants";
import LazyLoad from "react-lazyload";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const Bots = (props) => {
    const { setIsTourOpen, permissionsList } = props;
    const dropdownRef = useRef();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openGuide, setOpenGuide] = useState(false);
    const [hasBot, setHasBot] = useState(false);
    const bots = useSelector((state) => state.bots);
    const [referenceRef] = useState(null);
    const [popperRef] = useState(null);
    const { styles: popperStyles, attributes } = usePopper(referenceRef, popperRef);
    const colours = ["#CDF3F7", "#fad7d3", "#cae2fc", "rgba(57,115,103, 0.25)", "rgba(238,208,209)"];
    const [query, setQuery] = useState("");
    const viewPermission = !!permissionsList.find((data) => data === "bot:view_bot");
    const company = useSelector((state) => state.company);
    const companyId = get(company, "id");
    const dispatch = useDispatch();

    const [currentItems, setCurrentItems] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterByChannel, setFilterByChannel] = useState("");
    const [arrayBotsAuxForTypeChannels, setArrayBotsAuxForTypeChannels] = useState([]);
    const itemsPerPage = 8;

    const [itemOffset, setItemOffset] = useState(0);

    const fuseOptions = {
        threshold: 0.3,
        keys: ["name", "type"],
    };

    const findBots = ({ target }) => {
        const { value } = target;
        setQuery(value);
    };

    const getFilteredBots = () => {
        if (isEmpty(query)) {
            return bots;
        }
        const fuse = new Fuse(bots, fuseOptions);
        const result = fuse.search(query);

        let botsSearch = [];
        result.map((bot) => {
            return botsSearch.push(bot.item);
        });
        return botsSearch;
    };

    const filteredBots = getFilteredBots();

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;
        setCurrentItems(filteredBots.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(filteredBots.length / itemsPerPage));
    }, [filteredBots, itemOffset, itemsPerPage, query]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % filteredBots.length;
        setItemOffset(newOffset);
        setCurrentPage(event.selected + 1);
    };

    const { t } = useTranslation();

    const openCreateBot = (e) => {
        setOpen(true);
    };

    useEffect(() => {
        if (!isEmpty(company)) {
            loadBots();
        }
    }, [company]);

    useEffect(() => {
        if (!isEmpty(filterByChannel)) {
            loadBotsByChannel();
        } else {
            loadBots();
        }
    }, [filterByChannel]);

    const loadBotsByChannel = async () => {
        try {
            setLoading(true);
            await dispatch(getBotsByChannel(filterByChannel));
            setItemOffset(0);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const loadBots = async () => {
        setLoading(true);
        try {
            const params = {
                companyId,
                shouldPaginate: false,
            };
            const { payload } = await dispatch(getBots(params));
            let array = payload;
            if (isEmpty(array)) {
                openCreateBot();
            }
            setLoading(false);
            array.length > 0 ? setHasBot(true) : setHasBot(false);
            const uniqueChannels = payload.filter((obj, index) => payload.findIndex((item) => item.type === obj.type) === index);
            setArrayBotsAuxForTypeChannels(ARRAY_CHANNEL_TYPES.filter((elem) => uniqueChannels.some((ele) => ele.type === elem.value)));
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const botSearch = orderBy(currentItems, ["name"], ["asc"]);

    const notify = (msg) => {
        toast.success(msg, {
            position: toast.POSITION.BOTTOM_RIGHT,
        });
    };

    const notifyError = (error) => {
        toast.error(error, {
            position: toast.POSITION.BOTTOM_RIGHT,
        });
    };

    const onChangeChannel = (value) => {
        setFilterByChannel(value);
    };

    const cleanChannelFilter = () => {
        setFilterByChannel("");
    };

    const calculateStartOfRange = (currentPage - 1) * itemsPerPage + 1;

    const calculateEndOfRange =
        botSearch.length < itemsPerPage ? (currentPage - 1) * itemsPerPage + botSearch.length : botSearch.length * currentPage;
    return (
        <>
            <ToastContainer />

            {viewPermission && (
                <div>
                    <div className="relative">
                        <Transition
                            show={openGuide}
                            enter="transition ease-out duration-200"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95">
                            <Guide setOpen={setOpenGuide} menu="desk" msg={t("bots.msg")} setIsTourOpen={setIsTourOpen} />
                        </Transition>
                    </div>
                    <div className="mx-8 pb-6 pt-2">
                        <div className="px-4 pt-4">
                            <h1 className="mr-6 block justify-start whitespace-nowrap font-primary !text-4xl font-extrabold leading-9 text-primary-200 sm:text-2xl">
                                {t("bots.yourBots")}
                            </h1>
                            <div className="relative flex w-full items-center justify-between py-4" ref={dropdownRef}>
                                <div className="absolute left-2">
                                    <FindIcon width="1rem" height="3.125rem" />
                                </div>
                                <div className="flex w-full">
                                    <Input
                                        className="input inputWithIcon flex h-10 max-w-xs pl-10"
                                        type="search"
                                        autoFocus={true}
                                        placeholder={t("bots.searchBots")}
                                        onChange={findBots}
                                    />
                                    <Transition
                                        show={open}
                                        enter="transition ease-out duration-200"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                        style={popperStyles.popper}
                                        {...attributes.popper}>
                                        <Modal setOpen={setOpen} setOpenGuide={setOpenGuide} loadBots={loadBots} hasBot={hasBot} />
                                    </Transition>
                                    <div className=".z-50 mx-4 w-64">
                                        <ComboboxSelect
                                            background="#eef1f4"
                                            value={filterByChannel}
                                            handleChange={onChangeChannel}
                                            name="team"
                                            options={arrayBotsAuxForTypeChannels}
                                            label={t("botsCard.channel")}
                                            icon={<ThumbUp width="16" height="15" />}
                                            placeholder={t("botsCard.channel")}
                                            clearFilter={cleanChannelFilter}
                                        />
                                    </div>
                                    {/* <div className="mx-4 w-64">
                                    <ComboboxSelect
                                      background="#eef1f4"
                                      value={filterOrderBy}
                                      handleChange={onChangeOrderBy}
                                      name="team"
                                      options={[]}
                                      label={t("botsCard.orderBy")}
                                      icon={<OrderBy className="pt-0.5" width="16" height="15" />}
                                      placeholder={t("botsCard.orderBy")}
                                      clearFilter={cleanOrderByFilter}
                                    />
                                  </div> */}
                                </div>
                            </div>

                            {loading ? (
                                <div className="relative flex w-full items-center justify-center py-24">
                                    <GridLoader color={"#00B3C7"} size={15} />
                                </div>
                            ) : !isEmpty(botSearch) ? (
                                <LazyLoad height={200} offset={100}>
                                    <div className="relative w-full">
                                        <div className="mb-4 h-full w-full 2xl:h-[70vh]">
                                            <Grid className="mt-4 gap-4" templateColumns="repeat(auto-fill, minMax(18.125rem, 1fr))">
                                                {botSearch.map((bot, index) => (
                                                    <CardBot
                                                        key={bot.id}
                                                        bot={bot}
                                                        notify={notify}
                                                        notifyError={notifyError}
                                                        colours={colours}
                                                        loadBots={loadBots}
                                                        index={index}
                                                        permissionsList={permissionsList}
                                                        companyId={companyId}
                                                        dispatch={dispatch}
                                                    />
                                                ))}
                                            </Grid>
                                        </div>

                                        <div className="mt-10 flex justify-between pl-6 text-gray-400 ">
                                            <div>
                                                {t("botsCard.Showing")} <span className="font-bold">{calculateStartOfRange}</span> {t("botsCard.to")}{" "}
                                                <span className="font-bold">{calculateEndOfRange}</span> {t("botsCard.of")}{" "}
                                                <span className="font-bold">
                                                    {filteredBots.length} {t("botsCard.results")}
                                                </span>
                                            </div>
                                            <ReactPaginate
                                                breakLabel="..."
                                                nextLabel=">"
                                                onPageChange={handlePageClick}
                                                pageRangeDisplayed={5}
                                                pageCount={pageCount}
                                                previousLabel="<"
                                                pageLinkClassName={"py-2 px-4 hover:bg-primary-200 hover:bg-opacity-15 select-none"}
                                                breakLinkClassName={"py-2 px-4 hover:bg-primary-200 rounded-xs hover:bg-opacity-15 select-none"}
                                                renderOnZeroPageCount={null}
                                                containerClassName={"inline-flex items-center max-w-fit justify-center select-none"}
                                                previousClassName={
                                                    "border-1 border-gray-400 border-opacity-10 rounded-l-md h-10 flex justify-center items-center select-none"
                                                }
                                                previousLinkClassName={
                                                    "px-3 h-full rounded-l-md hover:bg-primary-200 hover:bg-opacity-15 font-bold text-2xl select-none"
                                                }
                                                nextLinkClassName={
                                                    "px-3 h-full hover:bg-primary-200 rounded-r-md hover:bg-opacity-15 font-bold text-2xl select-none"
                                                }
                                                nextClassName={
                                                    "border-1 border-gray-400 border-opacity-10 rounded-r-md h-10 flex justify-center items-center select-none"
                                                }
                                                pageClassName={
                                                    "border-1 border-gray-400 border-opacity-10 h-10 font-bold flex justify-center items-center select-none"
                                                }
                                                breakClassName={"rounded-xs h-10 flex justify-center items-center select-none"}
                                                activeLinkClassName={
                                                    "border-1 border-primary-200 bg-primary-200 bg-opacity-15 text-primary-200 select-none"
                                                }
                                                activeClassName={"bg-primary-200 bg-opacity-15 text-primary-200 select-none"}
                                            />
                                        </div>
                                    </div>
                                </LazyLoad>
                            ) : (
                                <div />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Bots;
