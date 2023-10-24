/* eslint-disable no-constant-condition */

import { JelouApiV2 } from "@apps/shared/modules";
import axios from "axios";
import { ENDPOINT } from "libs/datum/src/lib/constants";
import { INTERVAL_TIME } from "libs/datum/src/lib/constants";

/* Creates the preview of the data contained in the file. If succeed, it will
 * return an array of objects, where each element corresponds to all information
 * of each sheet of the Excel file, as well as general information of the file.
 */


export async function createDataPreview(databaseId, url, dateTypeColArr) {
    let response;

    response = await JelouApiV2.post(`/databases/${databaseId}/meta_preview`, {
        fileUrl: url,
        dateRows: dateTypeColArr,
    });

    if (response.status >= 400 && response.status < 600) {
        const error = response;
        throw error;
    }
    const { data } = response;
    return data;
}

/**Uploads the file into the database */

export async function createNewData(databaseId, url, dateTypeColArr, filePageList, page, fileSize, metaData) {
    let response;
    const logDataObj = {
        totalRows: filePageList[page].totalRows,
        file_size: fileSize,
        totalColumns: filePageList[page].totalColumns,
        columns: filePageList[page].columns,
    };

    response = await JelouApiV2.post(`/databases/${databaseId}/bulk`, {
        fileUrl: url,
        webhook: `https://api.jelou.ai/v2/databases/${databaseId}/bulk/import`,
        worksheet: filePageList[page].worksheetName,
        retries: 1,
        metadata: metaData,
        logData: logDataObj,
        dateRows: dateTypeColArr,
    });

    if (response.status >= 400 && response.status < 600) {
        const error = response;
        throw error;
    }
    const { data } = response;
    return data;
}


export async function getPreview(preview_id, miliseconds) {
    const startTime = Date.now();
    let response;

    while (true) {
      try {
        response = await axios.get(ENDPOINT + preview_id);
        break;
      } catch (e) {
        const currentTime = Date.now();
        if (currentTime - startTime >= miliseconds) {
          throw e;
        }
        await new Promise(resolve => setTimeout(resolve, INTERVAL_TIME));
      }
    }

    return response;
}
