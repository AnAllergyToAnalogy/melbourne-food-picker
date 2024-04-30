

import RESTAURANTS_RAW              from "$lib/restaurants.csv?raw";
import SUBURBS_CLASSIFICATION_RAW   from "$lib/suburb-classification.csv?raw";
import {get, writable} from "svelte/store";



export let classifications = {};
export const allSuburbs = [];
export const allLabels = {};

export let allRestaurants = [];

export let initialised = writable(0);

function lineBreak(text){
    if(text.includes("\r\n")){
        return "\r\n";
    }else if(text.includes("\n")){
        return "\n";
    }else{
        return "\r";
    }
}

function parseClassifications(){


    const br = lineBreak(SUBURBS_CLASSIFICATION_RAW);

    const rows = SUBURBS_CLASSIFICATION_RAW.split(br);
    const classification_labels = rows[0].split(",");
    for(let i = 1; i < classification_labels.length; i++){
        const label = classification_labels[i].trim();

        classifications[label] = [];
    }

    for(let i = 1; i < rows.length; i++){
        const row = rows[i].split(",");

        allSuburbs.push(row[0].trim());

        for(let ii = 1; ii < row.length; ii++){
            if(row[ii]){
                classifications[
                    classification_labels[ii]
                ].push(row[0].trim());
            }
        }
    }

    initialised.set(get(initialised) + 1);

}


function parseRestaurants(){
    const br = lineBreak(RESTAURANTS_RAW);


    const rows = RESTAURANTS_RAW.split(br);
    const restaurant_labels = rows[0].split(",");

    for(let i = 1; i < restaurant_labels.length; i++){
        const label = restaurant_labels[i].trim();

        allLabels[label] = [];
    }

    for(let i = 1; i < rows.length; i++) {

        const row = rows[i].split(",");
        const name = row[0].trim();
        if(!name) continue;

        if(!allSuburbs.includes(row[4].trim())){
            console.error(row[4].trim());
        }


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

        allRestaurants.push(restaurant);

    }

    initialised.set(get(initialised) + 1);

}

parseClassifications();
parseRestaurants();



export function getSuburbs(locations){
    if(locations.length === 0){
        return allSuburbs;
    }
    let suburbs = [];

    for(let i = 0 ; i < locations.length; i++){
        const location = locations[i];

        const distance = location[0];
        const direction = location[1];

        for(let ii = 0; ii < classifications[distance].length; ii++){
            const suburb = classifications[distance][ii];

            if( classifications[direction].includes(suburb)
                    &&
                !suburbs.includes(suburb)
            ){
                suburbs.push(suburb);
            }
        }
    }

    return suburbs;

}

export function getRecommendations(meals,cuisines,vibes,suburbs){
    const restaurants = [];
    allRestaurants.map(restaurant =>{

        if(
               meals.includes(restaurant.Meal)
            && cuisines.includes(restaurant.Cuisine)
            && vibes.includes(restaurant.Vibe)
            && suburbs.includes(restaurant.Suburb)
        ){
            restaurants.push(restaurant);
        }
    });
    return restaurants;
}