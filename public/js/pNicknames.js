const metaTick = document.getElementById("tickMetadata")
const memberTick = document.getElementById("tickNonmembers")

metaTick.addEventListener("change", (event) => {
    if(event.target.checked){
        changeRows([8,9], true);
    }
    else{
        changeRows([8,9], false);
    }
})

memberTick.addEventListener("change", (event) => {
    if(event.target.checked){
        changeRows([5,6], true);
    }
    else{
        changeRows([5,6], false);
    }
})

function changeRows(cols, process){
    for(i=0;i<cols.length;i++){
        var toChange = document.getElementsByClassName("bm-nick"+cols[i]);
        if(process){
            document.getElementById("bm-nickheader").children[cols[i]].classList.add("bm-hidden")
        }
        else{
            document.getElementById("bm-nickheader").children[cols[i]].classList.remove("bm-hidden")
        }
        for (j=0;j<toChange.length;j++){
            if(process){
                toChange[j].classList.add("bm-hidden")
            }
            else{
                toChange[j].classList.remove("bm-hidden")
            }
        }


    }
}