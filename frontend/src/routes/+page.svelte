<script>
    import {classifications, allSuburbs, initialised, allLabels} from "../stores/data.js";


    let meal = {}
    let cuisine = {};
    let vibe = {};
    let location = {};


    // $:{
    //     console.log(location);
    // }

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

    for(let i = 1; i < location_distances; i++){
        const distance = location_distances[i];
        for(let ii = 0; ii < location_directions; ii++){
            const direction = location_directions[ii];
            location_data[`${distance}-${direction}`] = [distance,direction];
        }
    }

    function recommend(){

    }

    const states = ["welcome","meal", "cuisine", "vibe", "location", "recommend"];
    let state = states[0];

    // const toRecommend = ["location","recommend"];

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

<!--<div>-->
<!--    TEST sdf-->
<!--</div>-->

<!--<div>-->
<!--    {#each allSuburbs as suburb}-->
<!--        <div>{suburb}</div>-->
<!--    {/each}-->
<!--</div>-->

<style>
    .app-area{
        width:100vw;
        height:100vh;

        background: red;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }


    .location-grid{
        display: flex;
        flex-direction: column;

        max-width:400px;


    }

    .location-row{
        display: flex;
        flex-direction: row;
        /*background: red;*/

        justify-content: space-between;
    }
    .location-row span{
        /*width: 20%;*/
        /*outline: solid 1px black;*/


    }
    .location-distance{
        width:40%;
        text-align: right;
        /*background: green;*/
    }
    .location-direction{
        text-align: center;
        width: 20%;
    }

</style>

<div class="app-area">
    {#if $initialised < 2}

    {:else}

        {#if state === "welcome"}
            <div>WELCOME:</div>


        {:else if state === "meal"}
            <div>MEAL:</div>
            {#each allLabels.Meal as m}
                <!--        <input type="checkbox" id="meal-{m}" name="meal-{m}" value="{m}">-->
                <input type="checkbox" id="meal-{m}" bind:checked={meal[m]} >
                <label for="meal-{m}">{m}</label><br>
            {/each}
            <br/>

        {:else if state === "cuisine"}

            <div>CUISINE:</div>
            <button on:click={toggleAllCuisineClick}>Toggle All</button>
            <br/>
            {#each allLabels.Cuisine as c}
                <!--        <input type="checkbox" id="cuisine-{c}" name="cuisine-{c}" value="{c}">-->
                <input type="checkbox" id="cuisine-{c}" bind:checked={cuisine[c]}>
                <label for="cuisine-{c}">{c}</label><br>
            {/each}
            <br/>

        {:else if state === "vibe"}


            <div>VIBE:</div>
            {#each allLabels.Vibe as v}
                <!--        <input type="checkbox" id="vibe-{v}" name="vibe-{v}" value="{v}">-->
                <input type="checkbox" id="vibe-{v}"  bind:checked={vibe[v]} >
                <label for="vibe-{v}">{v}</label><br>
            {/each}
            <br/>

        {:else if state === "location"}


            <div>LOCATION:</div>
            <div class="location-grid">
                {#each location_distances as distance,i}
                    <div class="location-row">
                        <!--{distance},{i}-->
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
    <!--                            <input type="checkbox" id="location-{distance}-{direction}" name="location-{distance}-{direction}" value="{distance}-{direction}">-->
                                <input type="checkbox" bind:checked="{ location[distance+'-'+direction]}">
                            </span>
                            {/if}
                        {/each}
                    </div>
                {/each}
            </div>
        {:else if state === "recommend"}
            <div>RECOMMEND</div>
        {:else}
            <div>ERROR</div>
        {/if}

        {#if state === "welcome"}
            <div>
                <button on:click={nextClick}>Begin</button>
            </div>
        {:else if state === "recommend"}
            <div>
                <button on:click={backClick}>Back</button>
                <button on:click={nextClick}>Another!</button>
            </div>
        {:else}
            <div>
                {#if state !== "meal"}
                    <button on:click={backClick}>Back</button>
                {:else}
                    <!--                <button>Recommend!</button>-->
                {/if}

                {#if state !== "location"}
                    <button on:click={nextClick}>Next</button>
                {:else}
                    <button on:click={nextClick}>Recommend!</button>
                {/if}
            </div>

        {/if}





        <!--    <div>-->
        <!--        {#each Object.keys(classifications) as i}-->
        <!--            <div>{i}</div>-->
        <!--            <div>{classifications[i]}</div>-->
        <!--            <br/>-->
        <!--        {/each}-->
        <!--    </div>-->
    {/if}

</div>


