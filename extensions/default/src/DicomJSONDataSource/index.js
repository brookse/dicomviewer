import OHIF, { DicomMetadataStore, IWebApiDataSource } from '@ohif/core';

import getImageId from '../DicomWebDataSource/utils/getImageId';
import getDirectURL from '../utils/getDirectURL';

const mappings = {
  studyInstanceUid: 'StudyInstanceUID',
  patientId: 'PatientID',
};
const studies = [];
let token;

let _store = {
  urls: [],
  studyInstanceUIDMap: new Map(), // map of urls to array of study instance UIDs
};

function wrapSequences(obj) {
  return Object.keys(obj).reduce(
    (acc, key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursively wrap sequences for nested objects
        acc[key] = wrapSequences(obj[key]);
      } else {
        acc[key] = obj[key];
      }
      if (key.endsWith('Sequence')) {
        acc[key] = OHIF.utils.addAccessors(acc[key]);
      }
      return acc;
    },
    Array.isArray(obj) ? [] : {}
  );
}

function createDicomJSONApi(dicomJsonConfig, servicesManager) {
  const { userAuthenticationService } = servicesManager.services;
  const implementation = {
    initialize: async ({ query, url }) => {
      if (query.get('StudyInstanceUIDs') && query.get('token')) {
        token = query.get('token');

        userAuthenticationService.setServiceImplementation({
          getAuthorizationHeader: () => ({
            Authorization: 'Bearer ' + token,
          }),
        });

        const response = await fetch(
          `https://api-dev.smartdocapp.com/v1/patient/imaging/studies/${query.get('StudyInstanceUIDs')}/ohif`,
          {
            headers: {
              Authorization: `Bearer ${query.get('token')}`,
              'Cross-Origin': '*',
            },
          }
        );

        if (!response.ok) {
          // throw new Error('Failed to fetch study metadata');
          console.log(Error('Failed to fetch study metadata'));
        }

        const s = await response.json();

        let StudyInstanceUID;
        const studyArray = [s];

        _store.urls.push({
          url: `/viewer?StudyInstanceUIDs=${StudyInstanceUID}&token=${token}`,
          studies: studyArray,
        });
        _store.studyInstanceUIDMap.set(
          `/viewer?StudyInstanceUIDs=${StudyInstanceUID}}&token=${token}`,
          studyArray.map(study => study.StudyInstanceUID)
        );
        studies.push(studyArray[0]);
        return studies;
      }
    },
    query: {
      studies: {
        mapParams: () => {},
        search: async param => {
          return studies.map(aStudy => {
            const numInstances = aStudy.series.reduce((acc, series) => {
              return acc + series.instances.length;
            }, 0);
            return {
              accession: aStudy.AccessionNumber,
              date: aStudy.StudyDate,
              description: aStudy.StudyDescription,
              instances: numInstances,
              modalities: aStudy.series[0].Modality,
              mrn: aStudy.PatientID,
              patientName: aStudy.PatientName,
              studyInstanceUid: aStudy.StudyInstanceUID,
              NumInstances: numInstances,
              time: aStudy.StudyTime,
            };
          });
        },
        processResults: () => {
          console.warn(' DICOMJson QUERY processResults not implemented');
        },
      },
      series: {
        search: async function (studyInstanceUid) {
          const study = studies[0];
          const series = study.series;
          if (!series) {
            throw new Error('Unable to query for SeriesMetadata without StudyInstanceUID');
          }

          const seriesSummaryMetadata = series.map(series => {
            const seriesSummary = {
              StudyInstanceUID: study.StudyInstanceUID,
              StudyDescription: study.StudyDescription,
              numSeriesInstances: series.instances.length,
              studyInstanceUid: study.StudyInstanceUID,
              seriesInstanceUid: series.SeriesInstanceUID,
              modality: series.Modality,
              seriesNumber: series.SeriesNumber,
              seriesDate: series.SeriesData,
              description: series.SeriesDescription,
              ...series,
            };
            return seriesSummary;
          });

          // Async load series, store as retrieved
          function storeInstances(naturalizedInstances) {
            DicomMetadataStore.addInstances(naturalizedInstances, false);
          }

          DicomMetadataStore.addSeriesMetadata(seriesSummaryMetadata, false);

          function setSuccessFlag() {
            const s = DicomMetadataStore.getStudy(studyInstanceUid);
            s.isLoaded = true;
          }

          return series;
        },
      },
      instances: {
        search: (studyInstanceUid, queryParameters) => {
          const s = studies[0];
          const series = s.series.find(s => s.StudyInstanceUID === studyInstanceUid);
          if (!series) {
            throw new Error('Unable to query for SeriesMetadata without StudyInstanceUID');
          }
          const instances = series.instances;
          if (!instances) {
            throw new Error('Unable to query for SeriesMetadata without StudyInstanceUID');
          }
          const sopInstanceUids = instances.map(i => i.SOPInstanceUID);
          const urls = instances.map(i => i.url);
          const results = sopInstanceUids.map((sopInstanceUid, index) => {
            return {
              StudyInstanceUID: studyInstanceUid,
              SeriesInstanceUID: series.SeriesInstanceUID,
              SOPInstanceUID: sopInstanceUid,
              url: urls[index],
            };
          });
          return results;
        },
      },
    },
    retrieve: {
      /**
       * Generates a URL that can be used for direct retrieve of the bulkdata
       *
       * @param {object} params
       * @param {string} params.tag is the tag name of the URL to retrieve
       * @param {string} params.defaultPath path for the pixel data url
       * @param {object} params.instance is the instance object that the tag is in
       * @param {string} params.defaultType is the mime type of the response
       * @param {string} params.singlepart is the type of the part to retrieve
       * @param {string} params.fetchPart unknown?
       * @returns an absolute URL to the resource, if the absolute URL can be retrieved as singlepart,
       *    or is already retrieved, or a promise to a URL for such use if a BulkDataURI
       */
      directURL: params => {
        console.log('[DIRECT URL] ', params);
        return getDirectURL(dicomJsonConfig, params);
      },
      series: {
        metadata: async ({ filters, StudyInstanceUID, madeInClient = false, customSort } = {}) => {
          if (!StudyInstanceUID) {
            throw new Error('Unable to query for SeriesMetadata without StudyInstanceUID');
          }

          const study = studies[0];
          let series;

          if (customSort) {
            series = customSort(study.series);
          } else {
            series = study.series;
          }

          const seriesSummaryMetadata = series.map((series, index) => {
            const seriesSummary = {
              StudyInstanceUID: study.StudyInstanceUID,
              ...series,
            };

            const numberOfSeries = series.length;
            const instances = series.instances.map((instance, frameIndex) => {
              // for instance.metadata if the key ends with sequence then
              // we need to add a proxy to the first item in the sequence
              // so that we can access the value of the sequence
              // by using sequenceName.value
              const modifiedMetadata = wrapSequences(instance.metadata);
              const obj = {
                ...modifiedMetadata,
                url: 'wadouri:' + instance.url,
                imageId: getImageId({ instance, frame: frameIndex, config: dicomJsonConfig }),
                ...series,
                ...study,
              };
              delete obj.instances;
              delete obj.series;
              return obj;
            });
            storeInstances(instances);
            if (index === numberOfSeries - 1) {
              setSuccessFlag();
            }
            seriesSummary.instances = instances;
            return seriesSummary;
          });

          // Async load series, store as retrieved
          function storeInstances(naturalizedInstances) {
            DicomMetadataStore.addInstances(naturalizedInstances, madeInClient);
          }

          DicomMetadataStore.addSeriesMetadata(seriesSummaryMetadata, madeInClient);

          function setSuccessFlag() {
            const study = DicomMetadataStore.getStudy(StudyInstanceUID);
            study.isLoaded = true;
          }
        },
      },
    },
    store: {
      dicom: () => {
        console.warn(' DICOMJson store dicom not implemented');
      },
    },
    getImageIdsForDisplaySet(displaySet) {
      const imageIds = [];

      displaySet.images.forEach(instance => {
        const NumberOfFrames = instance.NumberOfFrames;
        if (NumberOfFrames > 1) {
          // in multiframe we start at frame 1
          for (let i = 1; i <= NumberOfFrames; i++) {
            const imageId = this.getImageIdsForInstance({
              instance,
              frame: i,
            });
            imageIds.push(imageId);
          }
        } else {
          const imageId = this.getImageIdsForInstance({ instance });
          imageIds.push(imageId);
        }
      });

      return imageIds;
    },
    getImageIdsForInstance({ instance, frame }) {
      const { StudyInstanceUID, SeriesInstanceUID } = instance;
      const SOPInstanceUID = instance.SOPInstanceUID || instance.SopInstanceUID;
      const storedInstance = DicomMetadataStore.getInstance(
        StudyInstanceUID,
        SeriesInstanceUID,
        SOPInstanceUID
      );

      let imageId = storedInstance.url;

      if (frame !== undefined) {
        imageId += `&frame=${frame}`;
      }
      return imageId;
    },
    getStudyInstanceUIDs: ({ params, query }) => {
      return [studies[0].StudyInstanceUID];
    },
  };
  return IWebApiDataSource.create(implementation);
}

export { createDicomJSONApi };
