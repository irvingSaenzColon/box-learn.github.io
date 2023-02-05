// HTML Elements
const body = document.querySelector('body');
const form =  document.querySelector('form');
const form_input = document.querySelectorAll('div.form__input');

// EventListener
window.addEventListener('load', onLoad);
body.addEventListener('click', onBodyClick);
form.addEventListener('submit', onSignup);

// Load functions
function onLoad(event){
    const inputs = document.querySelectorAll('.form>section input');
    const buttons_page = document.querySelectorAll('div.form__page>button');

    [...form_input].forEach(function(div){
        div.addEventListener('click', onFocusInput);
        div.addEventListener('focus', onFocusInput);
    });

    [...inputs].forEach(function(input){
        if(input.getAttribute('type') !== 'checkbox' && input.getAttribute('type') !== 'file')
            input.addEventListener('keydown', onTabInput);
        else if(input.getAttribute('type') === 'file'){
            input.addEventListener('change', onSelectImage);
        }
        else{
            input.addEventListener('click', onShowPassword);
        }
    });

    [...buttons_page].forEach(function(button){
        button.addEventListener('click', onClickPage);
    });

}

// Submit functions
function onSignup(event){
    event.preventDefault();
    const profile_image = document.getElementById('profile-img');
    const base_64_regexp = /^data:image\/([A-z])+;base64,/;
    let base_64_image = '';
    if(base_64_regexp.test(profile_image.src)){
        base_64_image = profile_image.src;
    }
    else{
        base_64_image = getBase64Image( profile_image );
    }

    // Prepare formData to send a request and sign up
}

// Click functions
function onBodyClick(event){
    if(!event.target.closest('div.form__input')){
        cleanPlaceholders([...form_input]);
    }
}

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

function onClickPage(event){
    const tab = document.querySelector('form.form>section[data-active="true"]');
    const next_tab = tab.nextElementSibling;
    const previous_tab = tab.previousElementSibling;

    if(event.target.innerText=== 'Siguiente' && next_tab.tagName === 'SECTION' && !validateArray( getInputsFromTab(tab) )){
        
        pageOut(tab, 'form__page--out-left', 500)
        .then(function(){
            event.target.disabled = true;
            return pageIn(next_tab, 'form__page--in-right', 500);
        })
        .then(function(){
            event.target.disabled = false;
            pageButtonNext(next_tab);
        });

    } else if(event.target.innerText=== 'Atrás' && previous_tab.tagName === 'SECTION'){
        
        pageOut(tab, 'form__page--out-right', 500)
        .then(function(){
            event.target.disabled = true;
            return pageIn(previous_tab, 'form__page--in-left', 500);
        })
        .then(function(){
            event.target.disabled = false;
            pageButtonBack(previous_tab);
        });

    }
}

function onShowPassword(event){
    const password = document.querySelector('form.form input[name = "password"]');
    const c_password = document.querySelector('form.form input[name = "c-password"]')

    if(event.target.checked){
        password.setAttribute('type', 'text');
        c_password.setAttribute('type', 'text');
    }
    else{
        password.setAttribute('type', 'password');
        c_password.setAttribute('type', 'password');
    }
    
}

// Keydown functions
function onTabInput(event){
    
    const key = event.keyCode ? event.keyCode : event.which;
    
    if(key === 9){
        event.preventDefault();

        const current_inputs = event.target.closest('section');
        const current_parent = event.target.closest('div.form__input');
        
        //Getting all inputs
        let array_inputs = current_inputs.querySelectorAll('div.form__input');
        let next_parent = array_inputs[getElementIndex([...array_inputs], current_parent) + 1].closest('div.form__input');

        if(next_parent)
            next_parent.focus();
        

    }
}

// Change funcions
function onSelectImage(event){
    const input_file = event.target;
    const file =  input_file.files[0];

    if(FileReader && file){
        console.log('Hola');
        let fileReader = new FileReader();
        fileReader.onload = function(){
            document.getElementById('profile-img').src = fileReader.result;
        }
        fileReader.readAsDataURL(file);
    }
    else{
        console.error('Sorry, this functionality is not supported by your browser');
    }
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

function pageOut(currentPage, classString, miliseconds){
    return new Promise(function(resolve, reject){
        currentPage.classList.add(classString);

        setTimeout(function(){
            currentPage.classList.remove(classString)
            currentPage.classList.add('inactive');
            currentPage.setAttribute('data-active', 'false');
            resolve(true);
        }, miliseconds);
        
    });
}

function pageIn(currentPage, classString, miliseconds){
    return new Promise(function(resolve, reject){
        currentPage.classList.remove('inactive');
        currentPage.classList.add(classString);

        setTimeout(function(){
            currentPage.classList.remove(classString)
            currentPage.setAttribute('data-active', 'true');
            resolve(true);
        }, miliseconds);
        
    });
}

function buttonFadeOut(button, miliseconds){
    return new Promise(function(resolve, reject){
        button.classList.add('form__button--fade-out');

        setTimeout(function(){
            button.classList.add('inactive');
            button.classList.remove('form__button--fade-out');
            resolve(true);
        }, miliseconds);

        
    });
}

function buttonFadeIn(button, miliseconds){
    return new Promise(function(resolve, reject){
        button.classList.add('form__button--fade-in');
        button.classList.remove('inactive');

        setTimeout(function(){
            button.classList.remove('form__button--fade-in');
            resolve(true);
        }, miliseconds);
        
    });
}

// Page back
function pageButtonBack(previousTab){
    const new_current = previousTab;
    const buttons = document.querySelectorAll('div.form__page>button');
    const button = getButton([...buttons], 'Atrás');
    const button_next = button.nextElementSibling;
    const button_submit = button_next.nextElementSibling;


    if(new_current.previousElementSibling.tagName === 'H1' && !new_current.classList.contains('inactive')){
        buttonFadeOut(button, 250)
        .then(function(){
            button.closest('div').classList.add('form__page--one');
        });
    }
    else if(new_current.previousElementSibling.tagName !== 'H1' && button.classList.contains('inactive')){
        button.classList.remove('inactive');
    }

    if(new_current.nextElementSibling.tagName === 'SECTION' && button_next.classList.contains('inactive') && !button_submit.classList.contains('inactive')){
        button_next.classList.remove('inactive');
        button_submit.classList.add('inactive');
    }
}

// Page next
function pageButtonNext(nextTab){
    const new_current = nextTab;
    const buttons = document.querySelectorAll('div.form__page>button');
    const button = getButton([...buttons], 'Siguiente');
    const button_submit = button.nextElementSibling;
    const button_previous = button.previousElementSibling;
    
    if(new_current.nextElementSibling.tagName === 'DIV' && !new_current.classList.contains('inactive')){
        button.classList.add('inactive');
        button_submit.classList.remove('inactive');
    }
    else if(new_current.nextElementSibling.tagName !== 'DIV' && button.classList.contains('inactive'))
        button.classList.remove('inactive');

    if(new_current.previousElementSibling.tagName === 'SECTION' && button_previous.classList.contains('inactive')){
        button.closest('div').classList.remove('form__page--one');
        buttonFadeIn(button_previous, 250);
    }
}

// Array functions
function getElementIndex(array, element){
    return array.findIndex(function(item){
        return item === element;
    });
}

function getButton(buttons, innerText){
    return buttons.find(function(button){
        return button.innerText === innerText;
    });
}

function getInputsFromTab(tab){
    let inputs = tab.querySelectorAll('input');
    inputs = [...inputs].filter(function(input){
        if(input.name !== 'gender' && input.name !== 'see-password' && input.name != 'image' ){
            return input;
        }
    });

    return inputs;
}

// Validation functions
function validate(input, pattern, message){
    let value = input.value;
    let error_message = '';
    let error_check = 0;
    const parent = input.closest('div');

    if(!pattern.test(value)){
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

function compareValues(myInput, inputToCompare, message){
    let original_value = myInput.value;
    let compare_value = inputToCompare.value;
    let error_message = '';
    let error_check = 0;
    const parent = myInput.closest('div');

    if(original_value !== compare_value){
        error_message = message;
        error_check = 1;
    }
    else if(original_value.trim().length === 0){
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

function validateArray(inputArrays){
    const pattern_text = /^([A-Za-z])+([ ])*([A-Z-a-z])+$/;
    const pattern_date = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;
    const pattern_email =  /^([a-z]+([.a-z]+)?)+(\+[a-z]+)?@[a-z]+(\.[a-z]+)?\.([a-z]+)$/;
    const pattern_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\(¡”#$%&;/=’?¡¿:;,.\-_+*{\][}\])]).{8,}$/;
    let valid = 0;

    inputArrays.forEach(function(input, index){

        if(input.getAttribute('type') === 'text' && (input.name !== 'password' && input.name !== 'c-password') ){
            valid += validate(input, pattern_text, 'El campo debe contener solamente letras');
        }
        else if(input.getAttribute('type') === 'date'){
            valid += validate(input, pattern_date, 'Ingrese una fecha válida');
        }
        else if((input.getAttribute('type') === 'password' || input.getAttribute('type') === 'text') && input.name === "password" ){
            valid += validate(input, pattern_password, 'La contraseña debe contener una mayuscula, una minuscula y ocho caracteres');
        }
        else if((input.getAttribute('type') === 'password' || input.getAttribute('type') === 'text') && input.name === "c-password"){
            valid += compareValues(input, inputArrays[ index - 1], 'La contraseña debe coincidir');
        }
        else if(input.getAttribute('type') === 'email'){
            valid += validate(input, pattern_email, 'Debe ingresar un correo electrónico válido');
        }

    });

    return valid;
}

// base64 functions
function getBase64Image(img){
    const canvas = document.createElement('canvas');

    let ext = img.src.match(/\.[A-Za-z]*$/i)[0].replace('.','');

    if(ext === 'jpg')
        ext = 'jpeg';

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const canvas_context = canvas.getContext('2d');
    canvas_context.drawImage(img, 0, 0);

    const dataURL = canvas.toDataURL(`image/${ext}`);

    return dataURL;
}