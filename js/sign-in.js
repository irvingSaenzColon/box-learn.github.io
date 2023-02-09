// HTML Elements
const body = document.querySelector('body');
const form =  document.querySelector('form');
const form_input = document.querySelectorAll('div.form__input');

// EventListeners
window.addEventListener('load', onLoad);
form.addEventListener('submit', onSignin);
body.addEventListener('click', onBodyClick);

// Load Functions
function onLoad(event){
    [...form_input].forEach(function(div){
        div.addEventListener('click', onFocusInput);
        div.addEventListener('focus', onFocusInput);
    });
}

// Submit Functions
function onSignin(event){
    event.preventDefault();
    // Validate and prepare data to send

    const inputs  = document.querySelectorAll('form.form>div.form__input>input');

    console.log(inputs);

    validateFields([...inputs]);

}

// Click Functions
function onBodyClick(event){
    if(!event.target.closest('div.form__input')){
        cleanPlaceholders([...form_input]);
    }
}

// Focus Functions
function onFocusInput(event){
    const input = event.target.closest('div');
    const label = input.querySelector('label');
    const real_input = input.querySelector('input'); 

    const arry_inputs =  [...form_input];

    arry_inputs.splice(getElementIndex(arry_inputs, input), 1);

    cleanPlaceholders(arry_inputs);

    input.classList.add('form__input--focus');
    label.classList.add('form__placeholder--out');

    real_input.focus();

}

// Create HTML Elements
function createParagraph(innerText){
    const p = document.createElement('p');
    p.innerText = innerText;

    return p;
}

// Animation functions
function cleanPlaceholders(placeholderArray){
    placeholderArray.forEach(function(div){
        const placeholder = div.querySelector('label');
        const input = div.querySelector('input');
        
        if(div.classList.contains('form__input--focus') && !input.value.length){
            div.classList.remove('form__input--focus');

            placeholderIn(placeholder, 250);
        }
        else{
            div.classList.remove('form__input--focus');
        }
            
    });
}

function placeholderIn(placeholder, milisecond){
    let promise = new Promise(function(resolve, rejec){
        placeholder.classList.add('form__placeholder--in')

        setTimeout(function(){
            if(placeholder.classList.contains('form__placeholder--out'))
                placeholder.classList.remove('form__placeholder--out');

            placeholder.classList.remove('form__placeholder--in')
            resolve(true);
        }, milisecond);
    });

    return promise;
}

function placeholderOut(placeholder, milisecond){
    let promise = new Promise(function(resolve, rejec){
        placeholder.classList.add('form__placeholder--out');

        setTimeout(function(){
            if(placeholder.classList.contains('form__placeholder--in'))
                placeholder.classList.remove('form__placeholder--in');

            resolve(true);
        }, milisecond);
    });

    return promise;
}

// Array functions
function getElementIndex(array, element){
    return array.findIndex(function(item){
        return item === element;
    });
}

// Validate functions
function validate(input, pattern, message){
    let value = input.value;
    let error_message = '';
    let error_check = 0;
    const parent = input.closest('div');

    if(!pattern.test(value) ){
        error_message = message;
        error_check = 1;
    }
    else if(value.trim().length === 0){
        error_message = 'Debe llenar el campo';
        error_check = 1;
    }

    if(error_check){
        
        const p = createParagraph(error_message);
        p.classList.add('error');

        if(parent.nextElementSibling?.tagName !== 'P')
            parent.insertAdjacentElement('afterend', p);
        else
            parent.nextElementSibling.innerText = error_message;

        return error_check;
    }

    if(parent.nextElementSibling?.tagName === 'P'){
        parent.nextElementSibling.remove();
    }

    return 0;
}

function compareValues(myInput, message){
    let original_value = myInput.value;
    let error_message = '';
    let error_check = 0;
    const parent = myInput.closest('div');

    if(original_value.trim().length <= 0){
        error_message = message;
        error_check = 1;
    }

    if(error_check){
        
        const p = createParagraph(error_message);
        p.classList.add('error');

        if(parent.nextElementSibling?.tagName !== 'P')
            parent.insertAdjacentElement('afterend', p);
        else
            parent.nextElementSibling.innerText = error_message;

        return error_check;
    }
    
    if(parent.nextElementSibling?.tagName === 'P'){
        parent.nextElementSibling.remove();
    }

    return 0;
}

function validateFields(inputArray){
    
    const pattern_email =  /^([a-z]+([.a-z]+)?)+(\+[a-z]+)?@[a-z]+(\.[a-z]+)?\.([a-z]+)$/;
    let valid = 0;

    inputArray.forEach(function(input){
        if(input.getAttribute("type") === 'email'){
            valid += validate(input, pattern_email, 'El campo debe contener un correo válido');
        } else {
            valid += compareValues(input, 'Debe llenar el campo');
        }
    });

}