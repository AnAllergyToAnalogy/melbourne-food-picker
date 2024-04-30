<script>
    import {classifications, allSuburbs, initialised, allLabels, getSuburbs, getRecommendations} from "../stores/data.js";


    let meal = {}
    let cuisine = {};
    let vibe = {};
    let location = {};


    function toggleAllCuisineClick(){
        let toggleOn = false;
        for(let i = 0; i < allLabels.Cuisine.length; i++){
            if(!cuisine[allLabels.Cuisine[i]]){
                toggleOn = true;
                break;
            }
        }

        for(let i = 0; i < allLabels.Cuisine.length; i++){
            cuisine[allLabels.Cuisine[i]] = toggleOn;
        }


    }

    const location_distances = ["","Inner","Middle","Outer","Non-Melbourne"];
    const location_directions = ["North","South","East","West"];

    let location_data = {};

    for(let i = 1; i < location_distances.length; i++){
        const distance = location_distances[i];
        for(let ii = 0; ii < location_directions.length; ii++){
            const direction = location_directions[ii];
            location_data[`${distance}-${direction}`] = [distance,direction];
        }
    }

    let recommendation = null;
    let validRestaurants = [];
    function recommend(){
        let meals = [];
        for(let m in meal){
            if(meal[m]){
                meals.push(m);
            }
        }
        if(meals.length === 0){
            meals = allLabels.Meal;
        }

        let cuisines = [];
        for(let c in cuisine){
            if(cuisine[c]){
                cuisines.push(c);
            }
        }
        if(cuisines.length === 0){
            cuisines = allLabels.Cuisine;
        }

        let vibes = [];
        for(let v in vibe){
            if(vibe[v]){
                vibes.push(v);
            }
        }
        if(vibes.length === 0){
            vibes = allLabels.Vibe;
        }

        let locations = [];
        for(let l in location){
            if(location[l]){
                locations.push(location_data[l]);
            }
        }
        let suburbs = getSuburbs(locations);



        validRestaurants = getRecommendations(meals,cuisines,vibes,suburbs);

        if(validRestaurants.length === 0){
            recommendation = null;
        }else{
            const index = Math.floor(Math.random() * validRestaurants.length);
            recommendation = validRestaurants[index];
        }
    }

    const states = ["welcome","meal", "cuisine", "vibe", "location", "recommend"];
    let state = states[0];
    // let state = "location";


    function nextClick(){
        const index = states.indexOf(state);
        if(index >= states.length - 2){
            state = "recommend";
            recommend();
        }else{
            state = states[index + 1];
        }
    }
    function backClick(){
        const index = states.indexOf(state);
        if(index > 0){
            state = states[index - 1];
        }
    }


</script>

<style>
    .app-area{
        width:100vw;
        height:100vh;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background: linear-gradient(
            #ffe9ce,
            #eedaf1
        );
    }


    .option-grid{
        display: flex;
        flex-direction: row;
        max-width:520px;


        flex-wrap: wrap;

        align-items: center;
        justify-content: center;


        padding: 20px;

    }
    .option{
        width:130px;
    }

    .location-grid{
        display: flex;
        flex-direction: column;

        min-width:340px;
    }

    .location-row{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .location-row span{

    }
    .location-distance{
        width:40%;
        text-align: right;
    }
    .location-direction{
        text-align: center;
        width: 20%;
    }

    @media screen and (max-width: 340px){
        .location-grid {
            min-width: initial;
            width:100%;
        }
    }

    h1{
        text-align: center;
        padding: 0 10px;
        /*color: #f7941f;*/
        color: #84c6ff;

        text-shadow: black 1px 1px 5px;
    }
    h2{
        color: #7b4a91;
        max-width: 100vw;
        text-align: center;
        padding:  0 10px;
    }
    .info{
        text-align: center;
        padding: 10px;
    }
    button{
        color: white;
        margin-top: 10px;
        background: #f7941f;
        border: none;

        font-size: 20px;

        padding: 5px 15px;

        cursor: pointer;

        border-radius: 5px;

        filter: drop-shadow(
            2px 2px 4px black
        );
        margin-left: 5px;
        margin-right: 5px;
    }
    button:hover{
        background: #f9af57;
    }

    button.toggle{
        font-size:14px;
        padding: 5px 10px;

        background: #7b4a91;
    }
    button.toggle:hover{

        background: #995db5;
    }

    button.back{
        background: #57b3fa;
    }
    button.back:hover{
        background: #84c6ff;
    }

    .hint{
        color: dimgray;
        font-size: 16px;
    }

    .results{
        max-height: 50vh;
    }

    .descriptive{
        font-size: 18px;
    }
    .descriptive-label{
        color: dimgray;
        /*color: #f7941f;*/
        padding-top: 5px;
        font-size: 14px;
    }
    .matchCount{
        margin-top:10px;
        color: dimgray;
        font-size: 14px;
    }

    .credit{
        font-size: 14px;

        position: fixed;
        color: dimgray;

        bottom: 0;
        right: 0;

        padding:5px;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        justify-content: flex-start;

        column-gap: 20px;

    }

</style>

<div class="app-area">

    {#if $initialised < 2}
        <div>Initialising...</div>
    {:else}

        {#if state === "welcome"}
            <h1>
                Feed Me Melbourne
            </h1>
            <div class="info">
                Restaurant picker for food in Melbs
            </div>

        {:else if state === "meal"}
            <h2>MEAL</h2>
            <div class="option-grid">
                {#each allLabels.Meal as m}
                    <div class="option">
                        <input type="checkbox" id="meal-{m}" bind:checked={meal[m]} >
                        <label for="meal-{m}">{m}</label><br>
                    </div>
                {/each}
            </div>


        {:else if state === "cuisine"}

            <h2>CUISINE</h2>
            <button class="toggle" on:click={toggleAllCuisineClick}>Toggle All</button>
            <div class="option-grid">
                {#each allLabels.Cuisine as c}
                    <div class="option">
                        <input type="checkbox" id="cuisine-{c}" bind:checked={cuisine[c]}>
                        <label for="cuisine-{c}">{c}</label>
                    </div>
                {/each}
            </div>
        {:else if state === "vibe"}


            <h2>VIBE</h2>
            <div class="option-grid">

            {#each allLabels.Vibe as v}
                <div class="option">
                    <input type="checkbox" id="vibe-{v}"  bind:checked={vibe[v]} >
                    <label for="vibe-{v}">{v}</label>
                </div>
            {/each}
            </div>

        {:else if state === "location"}


            <h2>LOCATION</h2>
            <div class="location-grid">
                {#each location_distances as distance,i}
                    <div class="location-row">
                        {#if i === 0}
                            <span class="location-distance">&nbsp;</span>
                        {:else}
                            <span class="location-distance">{distance}</span>
                        {/if}
                        {#each location_directions as direction,j}
                            {#if i === 0}
                                <span class="location-direction">{direction}</span>
                            {:else}
                            <span class="location-direction">
                                <input type="checkbox" bind:checked="{ location[distance+'-'+direction]}">
                            </span>
                            {/if}
                        {/each}
                    </div>
                {/each}
            </div>
        {:else if state === "recommend"}

            {#if recommendation}
                <h2>{recommendation.name}</h2>


                <div class="descriptive-label">Location</div>
                <div class="descriptive">{recommendation.Suburb}</div>
                <div class="descriptive-label">Cuisine</div>
                <div class="descriptive">{recommendation.Cuisine}</div>
                <div class="descriptive-label">Meal</div>
                <div class="descriptive">{recommendation.Meal}</div>
                <div class="descriptive-label">Vibe</div>
                <div class="descriptive">{recommendation.Vibe}</div>


                <div class="matchCount">Total matches found: {validRestaurants.length}</div>
            {:else}
                <div>No matching restaurants found.</div>
            {/if}


        {:else}
            <div>ERROR</div>
        {/if}


        <div class="hint">
            {#if ["welcome","recommend"].includes(state)  }
                &nbsp;
            {:else}
                None = All
            {/if}
        </div>

        {#if state === "welcome"}
            <div>
                <button on:click={nextClick}>Begin!</button>
            </div>
        {:else if state === "recommend"}
            <div>
                <button class="back" on:click={backClick}>Back</button>
                <button on:click={nextClick}>Another!</button>
            </div>
        {:else}


            <div>
                {#if state !== "meal"}
                    <button class="back" on:click={backClick}>Back</button>
                {:else}

                {/if}

                {#if state !== "location"}
                    <button on:click={nextClick}>Next</button>
                {:else}
                    <button on:click={nextClick}>Recommend!</button>
                {/if}
            </div>

        {/if}

    {/if}

</div>


<div class="credit">
    <span>Data by Linda Lin</span>
    <span>Code by AnAllergyToAnalogy</span>
</div>