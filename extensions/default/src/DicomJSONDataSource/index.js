import OHIF, { DicomMetadataStore, IWebApiDataSource } from '@ohif/core';
import qs from 'query-string';

import getImageId from '../DicomWebDataSource/utils/getImageId';
import getDirectURL from '../utils/getDirectURL';

const metadataProvider = OHIF.classes.MetadataProvider;

// const study = {
//   StudyInstanceUID: '1.2.840.114350.2.45.2.798268.2.1182300452.1',
//   PatientID: '0ef15fc0-f92a-41e9-80f4-59bd2d9c987f',
//   PatientName: 'Robby Sikka',
//   StudyDescription: 'MR KNEE RT WO IV CONT',
//   StudyDate: '20231011',
//   series: [
//     {
//       SeriesInstanceUID: '1.2.840.113619.2.312.4120.8419241.16099.1697027270.932',
//       SeriesDescription: '3 PLANE LOC',
//       SeriesNumber: 1,
//       instances: [
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.596',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/79911237-7e0faf3b-1e29109c-741f3dc5-efe4dc8a',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.597',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/f9756a7f-e370a432-fa1e1196-563ddf51-28262bcc',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.599',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/782a4d0f-e58aa362-ea40c37c-7bf17b03-a3675d35',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.598',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/5231d0c5-ac2285a9-7722238a-a90c5c88-7eb4d19c',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.600',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/35374573-4649de08-319e7b46-7257dff1-f9106a0f',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.603',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/5f1a8988-b8f5b65b-fbd930eb-a26b0651-94bcd65a',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.604',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/a6d4cc22-7f383c2b-f9e2c98a-8c90e794-bca7297b',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.602',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/11f163ce-5ed05755-ab5816cc-8e81f1a4-f0105bf9',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.601',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/00da332d-35eeb8d0-e5d3bb3a-89f1c25b-94451f32',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.608',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/5d0672ab-9c14c0b6-ab0455fb-3a48cb62-8d21b85f',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.609',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/f95590d9-64ffbbc3-958329d1-99bc711a-fe3eca6c',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.619',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/9c7bf50f-121e1fdc-b2847490-62efe205-087dd1dd',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.607',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/0f29958d-11be3d63-952316f7-e529c8d3-b1645375',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.618',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/7a817a42-a412e37f-50a94d24-212b049e-1e8f67a5',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.613',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/85ca3ccd-6a5658fd-eb3fef1a-eefb6b12-47b46320',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.614',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/cbd46e92-dc7993e2-3a528cf9-a6a50f09-d81c860e',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.606',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/cd688220-165464ba-28b97fdd-52ffba88-39487bbc',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.605',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/be720ef4-302f417f-a7766898-71db4a13-dc1f75c1',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.611',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/29082f07-87937906-c939754b-0ed228b0-925bc15f',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.610',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/27a9c58b-b84a437f-63296a73-ceef0249-d5933b04',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.612',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/7da99a06-87bbe195-92009a5d-9aac0baa-eba958db',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.622',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/a1e7b1b6-1aa4d0f6-1b388839-2abf4c7b-adf49257',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.621',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/6328e29d-77c4fb6f-78cbc015-5b72da7c-23b39f7f',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.615',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/ef6188cf-020e7e62-d3c9bfb6-5a8706b9-1e5cf278',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.624',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/4d6a335c-7f8fe755-064dd040-d1c9d363-06947487',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.620',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/0c3d79a8-4565232d-3c10451d-439f135e-4832e043',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.617',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/96467b4a-f9ae4c55-ab4e99aa-b5e96d63-68d71819',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.627',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/1422200a-1517263c-a86e71cf-0d9bc11a-75cdc651',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.616',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/828c72c0-9fd4e058-19682e9a-bb81503f-bc9d3191',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.625',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/72af1963-4bb6ec05-9f4dffa2-201e4a78-6c7bfc1a',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.626',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/c830b12f-2337203f-6fffbdaf-1b9a2887-d63ad779',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.623',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/aa8fd3f2-74265fc7-707be70c-147500b1-0cd04864',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.628',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/a9e6eece-aa60c413-ec121918-dd4ee535-b09398e0',
//         },
//       ],
//     },
//     {
//       SeriesInstanceUID: '1.2.840.113619.2.312.4120.8419241.16099.1697027270.939',
//       SeriesDescription: 'Ax T2 FSE FS',
//       SeriesNumber: 4,
//       instances: [
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.151',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/3c3fd506-698f2d99-c7922941-5af7ada3-ee10f9be',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.152',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/03e74d88-a9142e2e-48a6c5b4-8f9371d0-346a56d4',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.160',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/4d6aa267-dac8858f-027a9eb6-b4b525af-568f17a4',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.153',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/e4351a34-3520481c-218830aa-cb0666c6-c81b3ae7',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.154',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/51284051-4036ebdd-b20d7a31-9881c424-c9656b1c',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.146',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/116cf404-8918fb0a-bd00d7cb-4268e5b7-f3e40c71',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.155',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/044e5d7d-6e296240-4ba19c9a-dd5107cb-929d47ef',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.158',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/79b3d279-854980e0-1dc46908-0b74c0c8-30dcb889',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.167',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/76fa067f-54c08e58-5e8ca698-878a53cb-4821d884',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.156',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/7d914145-f99c6e4c-90b4167c-f492a4a4-e219514b',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.150',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/454c4f1e-6bfbccb9-c0cf401f-bcf87dab-5e99b354',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.148',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/c422252d-fea59d8f-73a0e481-c17b5954-9502d01f',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.140',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/87929301-432d43d7-1bae8eb0-905332e9-72571535',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.157',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/50e35bb9-968a2442-da23536b-d7879226-e5b9a8f3',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.141',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/1a807678-001c8884-a6cc9fcc-59221534-bd06790f',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.142',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/4998195e-aa94a0c3-04e5d74e-bca07a0c-0a5377ca',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.159',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/5a43be1a-9a985292-899c9031-6b3ab0d2-1c8b20d2',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.143',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/92f77379-fe2786dd-adc4d90a-24db748f-ae7a281c',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.144',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/864691ff-89e2e535-837bc07e-1ed73eeb-f70c2722',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.145',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/b9d447ca-9a5e674a-e06afdab-75b32d3f-82b96a34',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.161',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/a093be04-5fc28816-01fa959b-fc740afb-f0ff8c69',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.162',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/c6edd38a-cbbc9535-e660c219-b546f42e-07dd5094',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.147',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/d609d0c3-e26ffdb7-b55367c6-9c8652fd-baf80e15',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.163',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/26eebae0-51af7022-1680ea90-24253eb7-effa68e7',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.164',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/5e8bb9b1-09021169-7a83f020-cc2b705c-5c5ca187',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.149',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/65a72c35-2cb8a151-da647aa3-1601277a-5266a059',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.165',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/9507a4ec-5c64105f-7ad37144-1cffa319-44a53e65',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.166',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/d2a058de-fb4c8f04-280ae61a-193458a9-354b892d',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.168',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/c13c2125-61e3dade-5a0e9009-602303b3-f8d84308',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.169',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/1481e666-54200ef3-cb835466-932b2d2e-279df2c2',
//         },
//       ],
//     },
//     {
//       SeriesInstanceUID: '1.2.826.0.1.3680043.2.133.1.1.112.1.5391.3.938',
//       SeriesNumber: 1,
//       instances: [
//         {
//           SOPInstanceUID: '1.2.826.0.1.3680043.2.133.1.1.112.1.5391.3.939',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/78d32b19-19d7a240-d423d817-06d571a6-ee991fab',
//         },
//       ],
//     },
//     {
//       SeriesInstanceUID: '1.2.840.113619.2.312.4120.8419241.16099.1697027270.935',
//       SeriesDescription: '3 PLANE LOC',
//       SeriesNumber: 2,
//       instances: [
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.759',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/25434c68-1d03bbc4-a285f2eb-3af1dad3-70678287',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.789',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/ccbc0918-e28da5af-98fa67b9-46040989-b1acba8e',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.784',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/aa64ff88-17b487aa-bb59aac8-09390858-4964d938',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.773',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/cc3ffc80-914d34c9-c9e7f286-35350053-9b51d8c2',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.781',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/fae40dde-24702ccd-632338ca-3a1d4457-919ca1bf',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.788',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/874e3689-3d2884b4-9ff21a19-1a83f437-120a9f1a',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.785',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/91ed4530-54937470-5706fcd0-c2f931e1-3b0a377c',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.782',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/a86f5b90-87aa08df-e54b6d2d-b83d376b-85853ba9',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.786',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/644e5354-c6c0284a-7b9a3c22-8c845195-65d71c0c',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.787',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/dd3f356d-572c31c7-47b0de03-a0a81fff-715eb001',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.780',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/486c288c-a6524acd-4f19a0eb-bff19a94-e9eabe21',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.771',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/f4f92ef0-13640048-4f59d83b-15d55170-2da7d30e',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.770',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/6afbf977-73465a6a-de2c907d-616918d4-6fb47a26',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.790',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/8bbf61ae-e6af64b3-04f8c02f-4e51ea34-27b2d047',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.766',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/ac04be18-38f11a42-47865d00-a30378ea-9f38ab19',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.791',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/5bd2a339-2440e8ec-ba24930f-af9c5771-a7033ef6',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.760',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/3b8affa5-db1331ee-4830639f-5ba8c8e4-79fed9ed',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.767',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/6d549e90-ad70b8fa-b9a97240-96dfb430-e63aef4b',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.762',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/71cfec8b-8e619884-aaa2101c-4ee1b945-3bcc388e',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.774',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/c4f20174-38383267-410f7841-3dd275d0-a8cb1640',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.768',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/34649afd-a0c541f8-1e547dcd-c9db130f-b31cacde',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.775',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/5f0b5d12-37edaa2e-cee98eb8-eb95f47d-cbdef4dc',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.761',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/ceb3b442-b7f65a13-92a30638-55c81df8-b146258b',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.765',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/074c480a-37e35027-dd1f16d4-97b95baf-292f6158',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.772',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/55b2476f-92f6afd8-152bac2a-afe3f56e-e3408b87',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.776',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/d03478f2-1535e809-fec41186-679f5069-41f1a6ba',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.763',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/e67ecd47-ea980b94-962ef9d7-e7b5d3cd-616f8142',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.764',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/c3149b62-ddab8b16-8d7136bf-6e8d5bd5-26249a0c',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.777',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/309242f5-18490535-270ef4e3-e58a4eac-489f6578',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.778',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/7ac60186-0160555c-4c8dd601-42394536-5f504e8a',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.769',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/cc5f6d69-b2769b10-bc5f06a9-1408935a-c0686abd',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.779',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/327e9eed-c1e22256-51343768-3d870fc1-f68c022d',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027307.783',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/91208b9d-838f4182-e78a37a7-5362fa2f-a9340036',
//         },
//       ],
//     },
//     {
//       SeriesInstanceUID: '1.3.6.1.4.1.23849.1.3490697595.11.1638326472745831672.2.2',
//       SeriesDescription: 'MR KNEE RT WO IV CONT',
//       SeriesNumber: 1,
//       instances: [
//         {
//           SOPInstanceUID: '1.3.6.1.4.1.23849.1.3490697595.11.1638326472745831672.2.2.1',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/f9dea261-f0037daf-aa273497-c9de787f-dcf208b9',
//         },
//         {
//           SOPInstanceUID: '1.3.6.1.4.1.23849.1.3490697595.11.1638326472745831672.2.2.2',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/337f1c12-463ced26-4a6c3e0e-49782438-7773a85a',
//         },
//       ],
//     },
//     {
//       SeriesInstanceUID: '1.2.840.113619.2.312.4120.8419241.16099.1697027270.941',
//       SeriesDescription: 'Sag T2 FSE FS',
//       SeriesNumber: 5,
//       instances: [
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.315',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/7b96bab3-446238fd-9bce286f-350ecf43-3b0582fc',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.316',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/3e819165-72f457b5-ada1f07e-e73234c3-f13ba0bc',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.317',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/2ef3ef3e-03b6a756-18838a87-0acdc3b9-a9e6dc43',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.318',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/dffcffb4-562fd3a0-8d2350d6-06f48386-173410a7',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.319',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/e7c2ee11-828d18fc-b824ac1c-72aabe46-446c3766',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.320',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/b561ec23-921743ba-32c23b91-8e615484-57d35a26',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.321',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/eb57ccc3-c9779b57-435c4616-4b844b2e-5a3a0dea',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.322',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/243953be-8e6433a8-a68bae17-b83563d7-af72c78f',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.323',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/95dc237c-f3b451c0-851498bc-1b2bd0af-59f0672f',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.324',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/d5eece02-358e8d97-39ced7a2-5c5a21dc-525ed4c8',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.325',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/2da66262-f63fdda5-f67c815d-d297a08a-b15d68c9',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.326',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/30ddcbf2-bbba38d4-6307ca82-d17cb538-6a4809e9',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.327',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/bcaa8203-7ccc0f61-452ea8e5-77fefa87-462d691e',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.328',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/63ca81b2-153e6f6c-85f6a181-cebd7912-189e62fa',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.329',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/a1ebf455-19df44d0-065455a9-e2700046-951fa165',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.330',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/64a71117-462ba679-11eb3a8f-be33f1cd-e07335bf',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.300',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/5447dc86-3f2a2d61-44755267-a7f0f819-19842eb8',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.331',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/c27012cd-d7d90378-cf08f2f4-284fc082-cc4445b4',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.301',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/c69918f4-d638b8e8-d13c34ba-80fde1ff-97f7102d',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.302',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/518d4479-18c88000-55f09669-07f458dd-7fdb3d23',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.303',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/4cf848dd-6d51cd8e-5b7cbc8d-7a68fe3b-5be4a016',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.304',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/8da577a7-97a422a1-9cd00c9d-ea91908b-a6e2a300',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.305',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/622326f9-2e16419b-73ddcf5b-46e3de69-61fe8f0c',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.306',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/c014ed2b-5b604c94-723c8856-bdd2d00b-6f8ab33a',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.307',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/f3e34d4e-bed53f55-e5ce0044-72370998-c3b0281c',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.308',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/3101b93f-5b6af369-c9050e52-06197a33-760cea6c',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.309',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/7bd92d02-7d9e3d09-0591323d-d623789c-8fed7c86',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.310',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/8f160970-3d7d0889-4b887d60-a8553b4b-22d1da9e',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.311',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/059be8c2-71a3e491-a86ed69b-ba898667-4d5b6dfa',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.312',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/70578fe0-507a9b55-01f25b5e-9fa968d9-60209485',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.313',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/1c4dd950-f31257cd-519dd465-59dfc507-7f831309',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.314',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/0f3db69c-26c9c784-12764d7b-868b3709-66ed2b3d',
//         },
//       ],
//     },
//     {
//       SeriesInstanceUID: '1.2.840.113619.2.312.4120.8419241.16099.1697027270.945',
//       SeriesDescription: 'Sag PD FSE',
//       SeriesNumber: 6,
//       instances: [
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.479',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/57069ffd-9042ddad-84414d41-b476ce47-f5df5220',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.480',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/c42e4484-283b1d2e-2e67c657-94efe1fc-74d64dfe',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.481',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/0ec450af-7818de25-7eb6b468-100caab8-490cecf8',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.482',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/7751559b-53177338-82c344ae-fffaeda4-7af304ca',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.483',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/88154673-1aff177c-18c9ac0e-a72e83b7-0fd6550f',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.484',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/9d053412-5db066d2-7503955b-8758a1a2-a2c03c88',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.485',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/3b397b84-6e9f0c94-cd77ae20-b31810af-9ff98f06',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.486',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/3430ab43-254f6c76-21ab31d3-b935cc51-286bac01',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.487',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/3a4beb06-ee29c5eb-d2e78e7a-f6073f53-09476dd5',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.488',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/636d8c6c-4711e37b-ec8f0e05-9be20d2d-b6d20848',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.489',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/eecfa149-a324236e-76c1cfb2-b4a9bbee-c278caa8',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.490',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/b153ff5e-5d212aab-0f480cee-11ea7296-4488091b',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.491',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/17fb629a-52b1c457-958b638b-8cadd606-a077d22f',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.462',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/8819d4dd-6dc72a0a-85a58ae9-6d3e185d-df2c60ba',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.492',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/54480924-bacc1d35-62c7d39b-a5d3548d-dfd7894f',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.463',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/e71b4503-4e8d4eec-443e896b-5c372d61-920fb91a',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.464',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/4783429d-d7897cf3-e9a15bf5-281ea4c7-af93ae16',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.465',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/d102f994-85ba0597-71f3952c-9e4c0dd4-08e1aa33',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.466',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/c8713291-ca52d39b-606757ed-d87b1484-bcbe0714',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.467',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/15642347-6aac7bee-f497a086-0206d451-e0de2ffe',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.468',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/d8207087-93a2ecda-d8ec1e87-96d9d85a-971cfd22',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.469',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/0d4829cd-fa8bbe4a-06e31da3-255d1ace-7b665211',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.470',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/d8c25829-af7b881b-bc360b39-a8bfe402-1828894d',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.471',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/76223f54-37436f9b-eb2c9f4c-7f696930-a543c496',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.472',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/d9b94071-3f147b6c-4b427bbf-aee897a5-5c1fd719',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.473',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/2679a30b-732c3adb-02574cfe-64e16349-67cb7814',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.474',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/a2276581-499cd31f-eba18684-c66cda78-2f9a63c6',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.493',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/94f698eb-46d69c7b-613b2427-f4017863-3a852c25',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.475',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/930b4261-a1fe6959-3d1202e0-c06393d8-ac6d8a77',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.476',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/79b9a2d0-19a12f01-a020515b-90d9a9bc-890863b3',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.477',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/abd96df2-0feb6316-b75b53f2-2cfad285-59ffc27c',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.478',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/e5b81655-72b1f63f-008ea07a-fcbe42ef-7a885bcc',
//         },
//       ],
//     },
//     {
//       SeriesInstanceUID: '1.2.840.113619.2.312.4120.8419241.16099.1697027270.947',
//       SeriesDescription: 'Cor T2 FSE FS',
//       SeriesNumber: 8,
//       instances: [
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.804',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/6d203d85-5324afc8-f5589018-f710e29e-ba76d551',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.805',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/3a327872-f9813422-7363967c-7a14c257-ec351765',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.806',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/a8492a89-9f5d0202-079201af-43551cdb-0ef421db',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.807',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/a0338355-d8a2c76f-ad0209dd-691480a5-0fa89946',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.808',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/33ee8acc-a238991b-5f020fc7-0bbc46c7-ae312769',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.809',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/9d1fbd29-3555f901-feee2bed-15d6bf6b-34959e71',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.810',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/b57877a3-94ccf106-1d5a773d-9978e2f6-9a25aed3',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.811',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/68ab27e3-5e6a0506-6c3858c2-e97eefe5-a5156f50',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.812',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/ba36d866-8a54613d-a6a9ae10-c8a5bcac-7fc4add5',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.813',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/8c818860-886ebd55-2ab38c51-e8b5f895-377e744d',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.814',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/11da8425-c9c3e2ac-13fe9de8-89de27f6-a263d47e',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.815',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/0e0bffb1-b2f2e2e2-309daf5e-7cd17cf2-5920a04b',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.787',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/9406f8ea-4d347f54-b9572a25-27538a01-c47bf870',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.816',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/9f29131c-6c8a682a-0543424a-59a3e872-5a231446',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.788',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/96f312a3-1011e52c-0eb7a60c-a3b120e0-9e661cce',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.817',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/db616a87-17cf6e93-4d6943ec-ac877ed0-65d0bf1e',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.789',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/88647795-dc3bb970-84cfab96-b488bd40-f1a500c0',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.818',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/1aeee2a5-b71f1eae-26e2d892-7f6ac6a9-f27be9b7',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.790',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/618c6911-8db1644a-fd3e6496-5714e38e-44a2848d',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.791',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/48201556-db6e9e8f-4f7f53d8-83b165de-c6203ec9',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.819',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/07057682-e437adfa-7960afbb-35772462-f9d37845',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.792',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/84cd696d-a73692f3-ade69a70-a934bb79-9a801443',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.793',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/78286bac-1a177276-36455d65-1bcd24f2-e3a37bf3',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.794',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/41d9702d-28a2c030-8372371b-32fdd0cd-f0892a78',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.795',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/ce7df422-02fb9183-89425ad9-027bc0b0-49ed123f',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.796',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/dd82f883-23eb047b-515f1164-bfdcd745-6e6fdd48',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.797',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/d0c8a5dd-87034e22-5be2eab7-237ff41a-2cf600f3',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.798',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/0fc958e8-deccf767-17226cfd-7c4dc83d-20549ff7',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.799',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/3a8dc326-297e9e49-6e682411-7061ad5d-bc092f24',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.800',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/f5da605a-26f0a90b-abba6f6c-07231649-60b3b57d',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.801',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/8b80c24a-723f3e59-595738a4-9891c2d8-c779dea6',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.802',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/60760beb-977f974a-97983e5f-e57fa300-6d7d8058',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.803',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/e62f2a65-ca2904e3-92b3fa16-27e79174-02e65410',
//         },
//       ],
//     },
//     {
//       SeriesInstanceUID: '1.2.840.113619.2.312.4120.8419241.16099.1697027270.946',
//       SeriesDescription: 'Cor PD FSE',
//       SeriesNumber: 7,
//       instances: [
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.640',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/d86c5206-377d61ff-57e54db5-44d54a70-ae66157e',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.641',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/9ddf34f8-16245e6e-7efec505-da6dece0-f93e48f5',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.642',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/6ba49598-b5b76d62-d3e1f372-4fbcdab9-6b64915e',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.643',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/08e28322-308322f4-b0e2988a-c26ffe4b-d325f16f',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.644',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/a8909f10-d2736f83-ec4bbbb2-1fd5aefc-863485db',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.645',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/e9889d6f-46e68604-e8e79550-ef1bf228-fba3e40c',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.646',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/33fd736a-3bc00662-0f676946-5b85ad96-7e171808',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.647',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/5dc5d168-3398284a-752daa21-7afba913-541510ad',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.648',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/99d3d39c-fbc22e74-4132db0e-0c3cbbc0-a6822409',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.649',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/8f9f1424-288acb81-28be5a17-6888db03-4cf17347',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.650',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/5644b47b-d0a6f65e-448c709f-9c86173c-ee098276',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.651',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/8dedb331-3d6bfaa6-5ddd1aae-1b1ef8ab-85a71cfe',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.652',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/9f718da4-b9de19ee-750681c6-928d90be-ead30aae',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.653',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/cceee735-fa69ef90-6798e27b-43379307-34ee4b63',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.654',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/b1a3814e-5939d189-38da520a-1331085a-a57580cb',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.655',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/0a0faecb-9cdc7466-5ec15075-604f8cd1-0cdfa170',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.656',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/a0027a7f-8336c190-7bd91a85-68e3a363-fbe42f1e',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.624',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/03c43f1a-2974c0c1-1e0ec3f3-0f7d400e-8701c778',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.625',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/7b7e3afe-385cd338-b29c86e7-e4b9d340-d1cd30ad',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.626',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/00358005-46b1626e-8b794f20-a2fef1fc-fcf59128',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.627',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/6fc90ede-eb7d044c-1b7f4ffc-72b33fc9-d4dafbeb',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.628',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/09ee83d8-dd7ccacc-1d26fd04-74a227b5-adeb5642',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.629',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/02db8378-c9b1aacc-bd9f25ba-bee5c2b6-550daa06',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.630',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/092c67a2-3d00222a-c3c4959a-02d25b89-8570fe0a',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.631',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/8012011a-514f5b45-623142e0-46e8a366-a5fdff32',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.632',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/e55b32f8-c10b6818-9971bf43-432fdbf2-d75a9cb9',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.633',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/8e11c79d-9dc03304-88718136-10f589b3-323f65e5',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.634',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/127175b5-9213ff4e-38b0b21a-9639e9e5-fafadbd1',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.635',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/0412624d-e1d7d046-f1aa3c36-7e523b6b-99c29d5a',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.636',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/27b2ca71-ebe0cde8-a48b0553-926ee07c-d6f847c2',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.637',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/1240e24b-51390236-ebac7713-4fd64eb5-ec790981',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.638',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/92b7f9d2-4ff74d2b-13db6536-9782b1a2-0c41b014',
//         },
//         {
//           SOPInstanceUID: '1.2.840.113619.2.312.4120.8419241.15494.1697027308.639',
//           url: 'https://api-dev.smartdocapp.com/v1/patient/imaging/instances/19722dde-3617031c-2daeb978-8ae3100b-9cc37a3f',
//         },
//       ],
//     },
//   ],
// };

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
      // studies.push(study);
      console.log('[DICOMJSON] TODO fetch studies from query');
      console.log('query:', query, ' | url:', url, ' | id: ', query.get('StudyInstanceUIDs'));

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

        // if (!url) {
        //   url = query.get('url');
        // }
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

            series.instances.forEach(instance => {
              const { metadata: naturalizedDicom } = instance;
              const imageId = getImageId({ instance, config: dicomJsonConfig });

              const { query } = qs.parseUrl(instance.url);

              // Add imageId specific mapping to this data as the URL isn't necessarily WADO-URI.
              metadataProvider.addImageIdToUIDs(imageId, {
                StudyInstanceUID,
                SeriesInstanceUID,
                SOPInstanceUID: instance.SOPInstanceUID,
                frameNumber: query.frame ? parseInt(query.frame) : undefined,
              });
            });
          });
        });

        _store.urls.push({
          url,
          studies: studyArray,
        });
        _store.studyInstanceUIDMap.set(
          url,
          studyArray.map(study => study.StudyInstanceUID)
        );
        console.log('ssss:', studyArray);
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
            return {
              accession: aStudy.AccessionNumber,
              date: aStudy.StudyDate,
              description: aStudy.StudyDescription,
              instances: aStudy.NumInstances,
              modalities: aStudy.Modalities,
              mrn: aStudy.PatientID,
              patientName: aStudy.PatientName,
              studyInstanceUid: aStudy.StudyInstanceUID,
              NumInstances: aStudy.NumInstances,
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
              numSeriesInstances: series.instances.length,
              studyInstanceUid: study.StudyInstanceUID,
              seriesInstanceUid: series.SeriesInstanceUID,
              modality: series.Modality,
              seriesNumber: series.SeriesNumber,
              seriesDate: series.SeriesData,
              description: series.SeriesDescription,
              ...series,
            };
            delete seriesSummary.instances;
            return seriesSummary;
          });
          console.log('[SERIES SUMMARY METADATA] ', seriesSummaryMetadata);

          // Async load series, store as retrieved
          function storeInstances(naturalizedInstances) {
            DicomMetadataStore.addInstances(naturalizedInstances, false);
          }

          DicomMetadataStore.addSeriesMetadata(seriesSummaryMetadata, false);

          function setSuccessFlag() {
            const s = DicomMetadataStore.getStudy(studyInstanceUid);
            s.isLoaded = true;
          }

          const numberOfSeries = series.length;
          series.forEach((series, index) => {
            const instances = series.instances.map(async instance => {
              // console.log('[SERIES SEARCH INSTANCE] ', instance);
              // for instance.metadata if the key ends with sequence then
              // we need to add a proxy to the first item in the sequence
              // so that we can access the value of the sequence
              // by using sequenceName.value
              const modifiedMetadata = wrapSequences(instance);

              // const token = 'demo-token'; // Replace with real logic
              const url = instance.url.replace(/^wadouri:/, '');
              const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const blob = await response.blob();
              const f = new File([blob], `${instance.SOPInstanceUID}.dcm`);

              const obj = {
                ...modifiedMetadata,
                url: f.name, //instance.url,
                imageId: getImageId({ instance, config: dicomJsonConfig }),
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

            return series;
          });
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

          // const seriesKeys = [
          //   'SeriesInstanceUID',
          //   'SeriesInstanceUIDs',
          //   'seriesInstanceUID',
          //   'seriesInstanceUIDs',
          // ];
          // const seriesFilter = seriesKeys.find(key => filters[key]);
          // if (seriesFilter) {
          //   const seriesUIDs = filters[seriesFilter];
          //   series = series.filter(s => seriesUIDs.includes(s.SeriesInstanceUID));
          // }

          const seriesSummaryMetadata = series.map(series => {
            const seriesSummary = {
              StudyInstanceUID: study.StudyInstanceUID,
              ...series,
            };
            delete seriesSummary.instances;
            return seriesSummary;
          });

          // Async load series, store as retrieved
          function storeInstances(naturalizedInstances) {
            DicomMetadataStore.addInstances(naturalizedInstances, madeInClient);
          }

          DicomMetadataStore.addSeriesMetadata(seriesSummaryMetadata, madeInClient);

          function setSuccessFlag() {
            const study = studies[0]; //DicomMetadataStore.getStudy(StudyInstanceUID);
            console.log('[SET SUCCESS FLAG] ', study);
            study.isLoaded = true;
          }

          const numberOfSeries = series.length;
          series.forEach((series, index) => {
            const instances = series.instances.map(async instance => {
              // console.log('[SERIES METADATA INSTANCE] ', instance);
              // for instance.metadata if the key ends with sequence then
              // we need to add a proxy to the first item in the sequence
              // so that we can access the value of the sequence
              // by using sequenceName.value
              const modifiedMetadata = wrapSequences(instance);
              // console.log('[MODIFIED METADATA] ', modifiedMetadata);

              const url = instance.url.replace(/^wadouri:/, '');
              const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
              });
              const blob = await response.blob();
              const f = new File([blob], `${instance.SOPInstanceUID}.dcm`);
              console.log('f:', f);

              const obj = {
                ...modifiedMetadata,
                url: f.name, //'wadouri:' + f, //instance.url,
                imageId: getImageId({ instance, config: dicomJsonConfig }),
                ...series,
                ...study,
              };
              console.log('[SERIES METADATA INSTANCE OBJ] ', obj);
              delete obj.instances;
              delete obj.series;
              return obj;
            });
            storeInstances(instances);
            if (index === numberOfSeries - 1) {
              setSuccessFlag();
            }
          });
        },
      },
    },
    store: {
      dicom: () => {
        console.warn(' DICOMJson store dicom not implemented');
      },
    },
    getImageIdsForDisplaySet(displaySet) {
      console.log('[getImageIdsForDisplaySet] ', displaySet);
      const images = displaySet.images;
      const imageIds = [];

      if (!images) {
        return imageIds;
      }

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

      displaySet.images.forEach(instance => {
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

      return imageIds;
    },
    getImageIdsForInstance({ instance, frame }) {
      console.log('[getImageIdsForInstance] ', instance, frame);
      const imageIds = getImageId({ instance, frame });
      return imageIds;
    },
    getStudyInstanceUIDs: ({ params, query }) => {
      const url = query.get('url');
      console.log('[getStudyInstanceUIDs] ', query.get('StudyInstanceUIDs'));
      return [query.get('StudyInstanceUIDs')];
    },
  };
  return IWebApiDataSource.create(implementation);
}

export { createDicomJSONApi };
