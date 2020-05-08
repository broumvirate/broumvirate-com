const metaTick = document.getElementById("tickMetadata")
const memberTick = document.getElementById("tickNonmembers")

metaTick.addEventListener("change", (event) => {
    if(event.target.checked){
        changeCols([8,9], true);
    }
    else{
        changeCols([8,9], false);
    }
})

memberTick.addEventListener("change", (event) => {
    if(event.target.checked){
        changeCols([5,6], true);
    }
    else{
        changeCols([5,6], false);
    }
})

function changeCols(cols, process){ //Changes columns of the nick table to shown or hidden, true is shown.
    for(i=0;i<cols.length;i++){
        var toChange = document.getElementsByClassName("bm-nick"+cols[i]);
        if(!process){
            document.getElementById("bm-nickheader").children[cols[i]].classList.add("bm-hidden")
        }
        else{
            document.getElementById("bm-nickheader").children[cols[i]].classList.remove("bm-hidden")
        }
        for (j=0;j<toChange.length;j++){
            if(!process){
                toChange[j].classList.add("bm-hidden")
            }
            else{
                toChange[j].classList.remove("bm-hidden")
            }
        }


    }
}

changeCols([5,6], false)
changeCols([8,9], false)