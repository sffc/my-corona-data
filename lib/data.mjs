/*
Copyright 2020 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/


import { createReadStream } from 'fs';
import { createRequire } from 'module';

import parse from 'csv-parse';

import { counties } from './util.mjs';

const CSV_PATH = '../third_party/coronavirus-data/case-hosp-death.csv';
const require = createRequire(import.meta.url);

async function getCityData() {
  const csvURL = new URL(CSV_PATH, import.meta.url);
  const parser = createReadStream(csvURL).pipe(parse());
  const data = [];

  let first = true;

  for await (const [
    dateOfInterest,
    newCovidCaseCount,
    numberHospitalized,
    numberDeaths
  ] of parser) {
    if (first) first = false;
    else {
      data.push({
        date: dateOfInterest,
        positive: Number(newCovidCaseCount),
        hospitalized: Number(numberHospitalized),
        deaths: Number(numberDeaths)
      });
    }
  }
  return data;
}

function getStateData() {
  const data = require('../third_party/nys-doh-testing-data/testing.json');
  const nyc = data.reduce((acc, item) => {
    if (counties.includes(item.county)) acc.push(item);
    return acc;
  }, []);
  return nyc;
}

export {
  getCityData,
  getStateData
};
