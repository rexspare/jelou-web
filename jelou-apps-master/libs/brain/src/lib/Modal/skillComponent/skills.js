import Skill from "./skill";
import EmptyData from "../../Common/emptyData";

const Skills = (props) => {
  const {
    fetchedSkills,
    setDatasourceValues,
    datasourceValues,
    datastoreName,
    loadingSkills,
    refetchSkills,
} = props;

  return (
    <>
        {fetchedSkills?.length > 0 ? (
            <Skill
                setDatasourceValues={setDatasourceValues}
                datasourceValues={datasourceValues}
                loadingSkills={loadingSkills}
                fetchedSkills={fetchedSkills}
                refetchSkills={refetchSkills}
            />

        ) : (
            <div className="my-6 xl:my-1 h-[20rem] xl:h-[15rem] flex items-center justify-center">
                <EmptyData
                    item={"skills"}
                    itemName={datastoreName}
                    isDatasource={true}
                    showButton={false}
                    buttonText={"skill"}
                    imageWidth={window.innerWidth >= 1400 ? "150px" : "200px"}
                    imageHeight={window.innerWidth >= 1400 ? "150px" : "200px"}
                    textClassName={"my-4 text-sm text-gray-400"}
                />
            </div>
        )}
    </>
  );
};

export default Skills;
