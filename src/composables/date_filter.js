import {ref} from 'vue';
export function DateFilter(DiscList,ordre){
    if(ordre=="Date ⬇"){
        DiscList.sort((a,b)=>a.date.seconds - b.date.seconds );
        
    }
    else if(ordre="Date ⬆"){
        DiscList.sort((a,b)=>b.date.seconds - a.date.seconds );
    }
    return DiscList;
}