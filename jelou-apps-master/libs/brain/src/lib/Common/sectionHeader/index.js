import { useEffect, useState } from "react";

import { LeftCircleIcon } from "@apps/shared/icons";
import { DATASTORE, TRUNCATION_CHARACTER_LIMITS } from "../../constants";
import BlocksHeaderBar from "./blocksHeaderBar";
import DatasourcesHeaderBar from "./datasourcesHeaderBar";
import DatastoresHeaderBar from "./datastoresHeaderBar";
import { useNavigate } from "react-router-dom";

const SectionHeader = (props) => {
    const {
        header,
        displayDatasources,
        displayBlocks,
        secondaryHeader,
        datastoreId,
        tertiaryHeader,
        handleSearch,
        resetData,
        handleCreateDatastore,
        showCreateDatastoreModal,
        closeCreateDatastoreModal,
        hasFlows,
        isSkill,
    } = props;
    const [isHeaderLong, setIsHeaderLong] = useState(false);
    const [displayDatastores, setDisplayDatastores] = useState(true);
    const navigate = useNavigate();

    const handleReturn = () => {
      if(window.location.pathname.endsWith("knowledge") || window.location.pathname.endsWith("channels")){
        navigate(`/brain/${datastoreId}`)
      }else {
        navigate(-1);
      }
    };

    useEffect(() => {
        setIsHeaderLong(header && header.length > TRUNCATION_CHARACTER_LIMITS.HEADER);
    }, [header]);

    useEffect(() => {
        if (displayDatasources || displayBlocks) {
            setDisplayDatastores(false);
        }
    }, [displayDatasources, displayBlocks]);

    return (
        <div className="my-3 flex h-16 items-center justify-between rounded-1 bg-transparent shadow-outline-input">
            {displayDatastores ? (
                <DatastoresHeaderBar
                    header={header}
                    handleSearch={handleSearch}
                    resetData={resetData}
                    handleCreateDatastore={handleCreateDatastore}
                    showCreateDatastoreModal={showCreateDatastoreModal}
                    closeCreateDatastoreModal={closeCreateDatastoreModal}
                />
            ) : (
                <div className="flex flex-row items-center">
                    <div className="flex h-11 items-center border-r-1 border-r-neutral-200 pr-5">
                        <button onClick={handleReturn}>
                            <LeftCircleIcon width="30px" height="30px" className="text-primary-200" />
                        </button>
                    </div>
                    <h1 className="flex gap-x-3 whitespace-nowrap pl-5 font-primary text-lg leading-9 text-gray-400">
                        <span className="cursor-pointer" onClick={()=>{ navigate('/brain') }}>{DATASTORE.PLURAL_CAPITALIZED}</span>
                        {displayDatasources && <DatasourcesHeaderBar header={header} secondaryHeader={secondaryHeader} actionClick={handleReturn} />}
                        {displayBlocks && (
                            <BlocksHeaderBar
                                header={header}
                                secondaryHeader={secondaryHeader}
                                tertiaryHeader={tertiaryHeader}
                                isHeaderLong={isHeaderLong}
                                datastoreId={datastoreId}
                                hasFlows={hasFlows}
                                isSkill={isSkill}
                                actionClick={handleReturn}
                            />
                        )}
                    </h1>
                </div>
            )}
        </div>
    );
};

export default SectionHeader;
