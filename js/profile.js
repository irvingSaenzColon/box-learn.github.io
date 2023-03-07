// HTML Elements
const studentButtons = document.querySelectorAll('section#student-options>button');
const backButtons = document.querySelectorAll('div.heading-section>button[data-backwards="true"]');
const buttonsContainer = document.getElementById('student-options');
const studentContainers = document.querySelectorAll('section.container');


window.addEventListener('load', onLoad);



// Load Functions
function onLoad(event){

    [...studentButtons].forEach(function(button){
        button.addEventListener('click', onClickStudentOption);
    });

    [...backButtons].forEach(function(button){
        button.addEventListener('click', onClickBackOption);
    });

    const currentImgContainer = document.getElementById('current-image-container');
    const formCloseBtns = document.querySelectorAll('form>button[type="button"]');
    [...formCloseBtns].forEach(function(closeBtn){
        closeBtn.addEventListener('click', onCloseEditForm);
    });
    currentImgContainer.addEventListener('mouseenter', onEnterProfileImg);
    currentImgContainer.addEventListener('mouseleave', onLeaveProfileImg);
    currentImgContainer. addEventListener('click', onOpenEditForm);

    const openEditDataBtn = document.getElementById('open-edit-data');
    openEditDataBtn.addEventListener('click', onOpenEditForm);
    



    // const btnAdvancedSearch = document.getElementById('main-table-advanced');
    // console.log(btnAdvancedSearch);
    // const detailAdvancedSearch = document.getElementById('detail-filter-advanced');
    // const tableRows = document.querySelectorAll('section#teacher-main-table>div>table>tbody>tr');
    // console.log(tableRows);
    // [...tableRows].forEach(function(row){
    //     row.addEventListener('click', onClickDetail);
    // });

    // btnAdvancedSearch.addEventListener('click', onShowAdvancedFilter);
    // detailAdvancedSearch.addEventListener('click', onShowAdvancedFilter);

}

// Click Functions
function onClickStudentOption(event){
    const button = event.target.closest('button');

    const container = getStudentContainer([...studentContainers], button.innerText.toLowerCase());

    containerFadeOut(buttonsContainer, 'left', 500)
    .finally(function(){
        containerFadeIn(container, 'right', 500);
    });
}

function onClickBackOption(event){
    const container = event.target.closest('section.container');
    let mainContainer = null;

    if(!document.getElementById('student-stats').classList.contains('inactive')){
        mainContainer = buttonsContainer;
    }else{
        mainContainer
    }
    
    containerFadeOut(container, 'right', 500)
    .finally(function(){
        containerFadeIn(buttonsContainer, 'left', 500);
    });
}

function onShowAdvancedFilter(event){
    const container = event.target.closest('section.container');
    const form = container.querySelector('form.form-filter');
    const table = container.querySelector('table.courses-table');
    const total = container.querySelector('p.total');
    
    if(form.classList.contains('inactive'))
        form.classList.remove('inactive');
    else
        form.classList.add('inactive');



}

function onClickDetail(event){
    //const tableRow = event.target.closest('tr');
    
    const container = event.target.closest('section.container');
    const nextContainer = document.getElementById('detail-table-advanced');

    containerFadeOut(container, 'left', 500)
    .then(function(){
        containerFadeIn(nextContainer, 'right', 500);
    });

}

function onOpenEditForm(event){
    const wrapper = document.getElementById('wrapper');
    
    const id = event.target.closest('div')?.getAttribute('data-belong') ? event.target.closest('div')?.getAttribute('data-belong')  :  event.target.closest('button').getAttribute('data-belong');
    const form = document.getElementById(id);

    if(wrapper.classList.contains('inactive'))
        wrapper.classList.remove('inactive');

    if(form.classList.contains('inactive'))
        form.classList.remove('inactive');

}

function onCloseEditForm(event){
    const form = event.target.closest('form');
    const wrapper = document.getElementById('wrapper');

    if(!form.classList.contains('inactive')){
        form.classList.add('inactive');
    }
    if(!wrapper.classList.contains('inactive')){
        wrapper.classList.add('inactive');
    }
}

// Mouse Enter Functions
function onEnterProfileImg(event){
    const div = event.target.closest('div');
    const button = div.querySelector('button');

    if(!button.classList.contains('flex'))
        button.classList.add('flex');

}

// Mouse Leave Functions
function onLeaveProfileImg(event){
    const div = event.target.closest('div');
    const button = div.querySelector('button');

    if(button.classList.contains('flex'))
        button.classList.remove('flex');
}

// Animatoins Functions
function containerFadeOut(container, direction, duration){
    return new Promise(function(resolve, reject){

        container.classList.add(`container--fade-out-${direction}`);

        setTimeout(function(){
            container.classList.add('inactive');
            container.classList.remove(`container--fade-out-${direction}`);
            resolve(true);
        }, duration);
    });
}

function containerFadeIn(container, direction, duration){
    return new Promise(function(resolve, reject){
        if(container.classList.contains('inactive'))
            container.classList.remove('inactive');

        container.classList.add(`container--fade-in-${direction}`);

        setTimeout(function(){
            container.classList.remove(`container--fade-in-${direction}`);
            resolve(true);
        }, duration);
    });
}

// Array Functions
function getStudentContainer(containerArray, attribute){
    return containerArray.find(function(container){
        return container.getAttribute('data-container-type') === attribute;
    });
}