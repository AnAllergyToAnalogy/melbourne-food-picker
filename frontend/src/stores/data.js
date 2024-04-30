

import RESTAURANTS_RAW              from "$lib/restaurants.csv?raw";
import SUBURBS_CLASSIFICATION_RAW   from "$lib/suburb-classification.csv?raw";
import {get, writable} from "svelte/store";


// console.log(SUBURBS_CLASSIFICATION_RAW)


// const classification_suburbs = {};

// export const RESTAURANTS_RAW            = import("$lib/restaurants.csv?raw");
// export const SUBURBS_CLASSIFICATION_RAW = import("$lib/suburb-classification.csv");

// console.log(RESTAURANTS_RAW);
//
// export let RESTAURANTS_RAW;

export let classifications = {};
export const allSuburbs = [];
export const allLabels = {};

export let restaurants = [];

export let initialised = writable(0);

function parseClassifications(){
    const rows = SUBURBS_CLASSIFICATION_RAW.split("\r\n");
    const classification_labels = rows[0].split(",");
    for(let i = 1; i < classification_labels.length; i++){
        const label = classification_labels[i];

        classifications[label] = [];
    }

    for(let i = 1; i < rows.length; i++){
        const row = rows[i].split(",");

        allSuburbs.push(row[0]);

        for(let ii = 1; ii < row.length; ii++){
            if(row[ii]){
                classifications[
                    classification_labels[ii]
                ].push(row[0]);
            }
        }
    }

    initialised.set(get(initialised) + 1);
}


function parseRestaurants(){
    const rows = RESTAURANTS_RAW.split("\r\n");
    const restaurant_labels = rows[0].split(",");

    for(let i = 1; i < restaurant_labels.length; i++){
        const label = restaurant_labels[i].trim();

        // restaurants[label] = [];
        allLabels[label] = [];
    }

    for(let i = 1; i < rows.length; i++) {

        const row = rows[i].split(",");
        const name = row[0].trim();
        if(!name) continue;


        const restaurant = {
            name: row[0]
        }
        for(let ii = 1; ii < restaurant_labels.length; ii++){
            const labelName  = restaurant_labels[ii].trim();
            const labelValue = row[ii].trim()
            restaurant[labelName] = labelValue;

            if( !( allLabels[labelName].includes(labelValue) ) ){
                allLabels[labelName].push(labelValue);
            }
        }

        restaurants.push(restaurant);

    }


    initialised.set(get(initialised) + 1);

}

parseClassifications();
parseRestaurants();

// console.log(restaurants);
// console.log(allLabels);
// console.log(allSuburbs);

//
// setInterval(()=>{
//     // console.log(RESTAURANTS_RAW);
//     // init();
//     // console.log(RESTAURANTS_RAW);
//     // console.log(SUBURBS_CLASSIFICATION_RAW)
//
// },1000)
//
// let initialised = false;
// async function init(){
//     if(initialised) return;
//     initialised = true;
//
//     // RESTAURANTS_RAW = await fetch("$lib/restaurants.csv?raw");
//
//     // console.log(RESTAURANTS_RAW);
// }
