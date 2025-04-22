import OHIF, { DicomMetadataStore, IWebApiDataSource } from '@ohif/core';

import getImageId from '../DicomWebDataSource/utils/getImageId';
import getDirectURL from '../utils/getDirectURL';

const metadataProvider = OHIF.classes.MetadataProvider;

const mappings = {
  studyInstanceUid: 'StudyInstanceUID',
  patientId: 'PatientID',
};
const studies = [];
let token;

let _store = {
  urls: [],
  studyInstanceUIDMap: new Map(), // map of urls to array of study instance UIDs
  // {
  //   url: url1
  //   studies: [Study1, Study2], // if multiple studies
  // }
  // {
  //   url: url2
  //   studies: [Study1],
  // }
  // }
};

function wrapSequences(obj) {
  // console.log('[WRAP SEQUENCES] ', obj);
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
const getMetaDataByURL = url => {
  console.log('[getMetaDataByURL] ', url);
  return _store.urls.find(metaData => metaData.url === url);
};

const findStudies = (key, value) => {
  console.log('[findStudies] ', key);
  let studies = [];
  _store.urls.map(metaData => {
    metaData.studies.map(aStudy => {
      if (aStudy[key] === value) {
        studies.push(aStudy);
      }
    });
  });
  return studies;
};

function createDicomJSONApi(dicomJsonConfig) {
  const implementation = {
    initialize: async ({ query, url }) => {
      console.log('[DICOMJSON] fetch studies from query');
      console.log('query:', query, ' | id: ', query.get('StudyInstanceUIDs'), '\nurl: ', url);

      if (query.get('StudyInstanceUIDs') && query.get('token')) {
        token = query.get('token');
        console.log('got both params, fetching');
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
        console.log('s:', s);
        // }

        console.log('url 1:', url);
        if (!url) {
          url = query.get('url');
        }
        // let metaData = getMetaDataByURL(url);

        // if we have already cached the data from this specific url
        // We are only handling one StudyInstanceUID to run; however,
        // all studies for patientID will be put in the correct tab
        // if (metaData) {
        //   return metaData.studies.map(aStudy => {
        //     return aStudy.StudyInstanceUID;
        //   });
        // }

        // const response = await fetch(url);
        // const data = await response.json();

        let StudyInstanceUID;
        let SeriesInstanceUID;
        const studyArray = [s];
        studyArray.forEach(study => {
          StudyInstanceUID = study.StudyInstanceUID;

          study.series.forEach(series => {
            SeriesInstanceUID = series.SeriesInstanceUID;

            // series.instances.forEach(instance => {
            //   const instances = series.instances.map(async instance => {
            //     const modifiedMetadata = wrapSequences(instance);

            //     const url = instance.url.replace(/^wadouri:/, '');
            //     const response = await fetch(url, {
            //       headers: { Authorization: `Bearer ${token}` },
            //     });
            //     const blob = await response.blob();
            //     const f = new File([blob], `${instance.SOPInstanceUID}.dcm`);

            //     const obj = {
            //       ...modifiedMetadata,
            //       url: 'wadouri:' + f.name, //'wadouri:' + f, //instance.url,
            //       imageId: getImageId({ instance, config: dicomJsonConfig }),
            //       ...series,
            //       ...study,
            //     };
            //     delete obj.instances;
            //     delete obj.series;
            //     return obj;
            //   });

            //   // const { metadata: naturalizedDicom } = instance;
            //   // const imageId = getImageId({ instance, frame: 1, config: dicomJsonConfig });

            //   // const { query } = qs.parseUrl(instance.url);

            //   // Add imageId specific mapping to this data as the URL isn't necessarily WADO-URI.
            //   metadataProvider.addImageIdToUIDs(instance.url, {
            //     StudyInstanceUID,
            //     SeriesInstanceUID,
            //     SOPInstanceUID: instance.SOPInstanceUID,
            //     frameNumber: query.frame ? parseInt(query.frame) : 1,
            //   });
            // });
          });
        });

        console.log('url 2:', url);
        _store.urls.push({
          url: `/viewer?StudyInstanceUIDs=${StudyInstanceUID}`,
          studies: studyArray,
        });
        _store.studyInstanceUIDMap.set(
          `/viewer?StudyInstanceUIDs=${StudyInstanceUID}`,
          studyArray.map(study => study.StudyInstanceUID)
        );
        console.log(
          'ssss:',
          studyArray,
          '\n | _store.studyInstanceUIDMap:',
          _store.studyInstanceUIDMap
        );
        studies.push(studyArray[0]);
        return studies;
      }
    },
    query: {
      studies: {
        mapParams: () => {},
        search: async param => {
          console.log('studies search: ', param, '\n', studies);
          const [key, value] = Object.entries(param)[0];
          const mappedParam = mappings[key];

          // todo: should fetch from dicomMetadataStore
          // const studies = findStudies(mappedParam, value);
          // console.log('s:',studies)

          return studies.map(aStudy => {
            console.log('aStudy:', aStudy);
            const numInstances = aStudy.series.reduce((acc, series) => {
              return acc + series.instances.length;
            }, 0);
            return {
              accession: aStudy.AccessionNumber,
              date: aStudy.StudyDate,
              description: aStudy.StudyDescription,
              instances: numInstances, //aStudy.NumInstances,
              modalities: aStudy.series[0].Modality, //aStudy.Modalities,
              mrn: aStudy.PatientID,
              patientName: aStudy.PatientName,
              studyInstanceUid: aStudy.StudyInstanceUID,
              NumInstances: numInstances, //aStudy.NumInstances,
              time: aStudy.StudyTime,
            };
          });
        },
        processResults: () => {
          console.warn(' DICOMJson QUERY processResults not implemented');
        },
      },
      series: {
        // mapParams: mapParams.bind(),
        search: async function (studyInstanceUid) {
          const study = studies[0];
          const series = study.series; //.find(s => s.StudyInstanceUID === studyInstanceUid)
          console.log('[SERIES SEARCH] ', series);
          if (!series) {
            throw new Error('Unable to query for SeriesMetadata without StudyInstanceUID');
          }

          const seriesSummaryMetadata = series.map(series => {
            console.log('SERIES:', series);
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
            // delete seriesSummary.instances;
            return seriesSummary;
          });
          console.log('[SERIES SUMMARY METADATA] ', seriesSummaryMetadata);

          // Async load series, store as retrieved
          function storeInstances(naturalizedInstances) {
            console.log('[STORE INSTANCES] ', naturalizedInstances);
            DicomMetadataStore.addInstances(naturalizedInstances, false);
          }

          DicomMetadataStore.addSeriesMetadata(seriesSummaryMetadata, false);

          function setSuccessFlag() {
            const s = DicomMetadataStore.getStudy(studyInstanceUid);
            s.isLoaded = true;
          }

          // const numberOfSeries = series.length;
          // series.forEach((series, index) => {
          //   const instances = series.instances.map(async (instance, fIndex) => {
          //     // console.log('[SERIES SEARCH INSTANCE] ', instance);
          //     // for instance.metadata if the key ends with sequence then
          //     // we need to add a proxy to the first item in the sequence
          //     // so that we can access the value of the sequence
          //     // by using sequenceName.value
          //     const modifiedMetadata = wrapSequences(instance);

          //     // const token = 'demo-token'; // Replace with real logic
          //     const url = instance.url.replace(/^wadouri:/, '');
          //     const response = await fetch(url, {
          //       headers: { Authorization: `Bearer ${token}` },
          //     });
          //     const blob = await response.blob();
          //     const f = new File([blob], `${instance.SOPInstanceUID}.dcm`);

          //     const obj = {
          //       ...modifiedMetadata,
          //       url: 'wadouri:' + f.name, //instance.url,
          //       imageId: getImageId({ instance, frame: fIndex, config: dicomJsonConfig }),
          //       ...series,
          //       ...study,
          //     };
          //     delete obj.instances;
          //     delete obj.series;
          //     return obj;
          //   });
          //   storeInstances(instances);
          //   if (index === numberOfSeries - 1) {
          //     setSuccessFlag();
          //   }

          //   return series;
          // });
          return series;

          // qidoDicomWebClient.headers = getAuthorizationHeader();
          // const results = await seriesInStudy(qidoDicomWebClient, studyInstanceUid);

          // return processSeriesResults(results);
        },
      },
      instances: {
        search: (studyInstanceUid, queryParameters) => {
          console.log('[INSTANCES SEARCH] ', studyInstanceUid);
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
          // console.warn(' DICOMJson QUERY instances SEARCH not implemented');
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
          console.log('[SERIES METADATA] ', StudyInstanceUID);
          if (!StudyInstanceUID) {
            throw new Error('Unable to query for SeriesMetadata without StudyInstanceUID');
          }

          const study = studies[0]; //findStudies('StudyInstanceUID', StudyInstanceUID)[0];
          let series;

          if (customSort) {
            series = customSort(study.series);
          } else {
            series = study.series;
            console.log('[series meta data]:', series);
          }

          const seriesSummaryMetadata = series.map((series, index) => {
            const seriesSummary = {
              StudyInstanceUID: study.StudyInstanceUID,
              ...series,
            };

            const numberOfSeries = series.length;
            const instances = series.instances.map((instance, frameIndex) => {
              if (frameIndex === 0) {
                console.log('[SERIES METADATA INSTANCE] ', instance);
              }
              // for instance.metadata if the key ends with sequence then
              // we need to add a proxy to the first item in the sequence
              // so that we can access the value of the sequence
              // by using sequenceName.value
              const modifiedMetadata = wrapSequences(instance);
              // console.log('[MODIFIED METADATA] ', modifiedMetadata);

              // const url = instance.url.replace(/^wadouri:/, '');
              // const response = await fetch(url, {
              //   headers: { Authorization: `Bearer ${token}` },
              // });
              // const blob = await response.blob();
              // const f = new File([blob], `${instance.SOPInstanceUID}.dcm`);

              const obj = {
                ...modifiedMetadata,
                url: 'wadouri:' + instance.url, // f.name, //'wadouri:' + f, //instance.url,
                imageId: getImageId({ instance, frame: frameIndex, config: dicomJsonConfig }),
                ...series,
                ...study,
              };
              delete obj.instances;
              delete obj.series;
              return obj;
            });
            console.log('storing instances: ', instances);
            storeInstances(instances);
            if (index === numberOfSeries - 1) {
              setSuccessFlag();
            }
            seriesSummary.instances = instances;
            // delete seriesSummary.instances;
            return seriesSummary;
          });

          // Async load series, store as retrieved
          function storeInstances(naturalizedInstances) {
            DicomMetadataStore.addInstances(naturalizedInstances, madeInClient);
          }

          DicomMetadataStore.addSeriesMetadata(seriesSummaryMetadata, madeInClient);

          function setSuccessFlag() {
            const study = DicomMetadataStore.getStudy(StudyInstanceUID);
            // console.log('[SET SUCCESS FLAG] ', study);
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
      console.log('[getImageIdsForDisplaySet 1] ', displaySet);
      // const images = displaySet.images;
      const imageIds = [];

      // if (!images) {
      //   return imageIds;
      // }

      const { StudyInstanceUID, SeriesInstanceUID } = displaySet;
      const study = findStudies('StudyInstanceUID', StudyInstanceUID)[0];
      const series = study.series.find(s => s.SeriesInstanceUID === SeriesInstanceUID) || [];

      const instanceMap = new Map();
      series.instances.forEach(instance => {
        if (instance?.metadata?.SOPInstanceUID) {
          const { metadata, url } = instance;
          const existingInstances = instanceMap.get(metadata.SOPInstanceUID) || [];
          existingInstances.push({ ...metadata, url });
          instanceMap.set(metadata.SOPInstanceUID, existingInstances);
        }
      });

      instanceMap.forEach(instance => {
        const NumberOfFrames = instance.NumberOfFrames || 1;
        const instances = instanceMap.get(instance.SOPInstanceUID) || [instance];
        for (let i = 0; i < NumberOfFrames; i++) {
          const imageId = getImageId({
            instance: instances[Math.min(i, instances.length - 1)],
            frame: NumberOfFrames > 1 ? i : undefined,
            config: dicomJsonConfig,
          });
          imageIds.push(imageId);
        }
      });

      console.log('[imageIds] ', imageIds);
      return imageIds;
    },
    getImageIdsForInstance({ instance, frame }) {
      console.log('[getImageIdsForInstance] ', instance, frame);
      // const imageIds = getImageId({ instance, frame });
      return 'wadouri:' + instance.url;
      return imageIds;
    },
    getStudyInstanceUIDs: ({ params, query }) => {
      return [studies[0].StudyInstanceUID];
    },
  };
  return IWebApiDataSource.create(implementation);
}

export { createDicomJSONApi };
