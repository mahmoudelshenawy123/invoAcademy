// window.addEventListener('load',function (){
//     document.querySelector('.stopScrolling').classList.remove('stopScrolling')
//     document.querySelector('#loadDivContainer').classList.add('d-none')
// })
//  function showInputSearch(){
//     document.querySelector('.searchInput2').classList.toggle('showInput')
//     document.querySelector('.searchInput2').focus();    
// }
document.querySelector('.js-navbar__search-icon').addEventListener('click',function(){
    document.querySelector('.js-navbar__search-form').classList.toggle('active')
})
function filterExams(event,filterType){
    let filters = document.querySelectorAll('.js-show-categories__filter-button');
    let examSections = document.querySelectorAll('.js-show-categories__container');
    filters.forEach(filter=>{
        filter.classList.remove('active')
    })
    event.target.classList.add('active')

    examSections.forEach(section=>{
        let filters = section.getAttribute('data-filter').split(',');
        section.classList.remove('d-none')

        if (filterType =='all'){
            section.classList.remove('d-none')
        }else if(filterType =='writing'){
            console.log(filters.includes(filterType) ,filters,filterType)
            filters.includes(filterType) ? null : section.classList.add('d-none') 
        }else if(filterType =='reading'){
            filters.includes(filterType) ? null : section.classList.add('d-none') 
        }else if(filterType =='mathWith'){
            filters.includes(filterType) ? null : section.classList.add('d-none') 
        }else if(filterType =='mathWithout'){
            filters.includes(filterType) ? null : section.classList.add('d-none') 
        }else{
            section.classList.remove('d-none')
        }

    })

}