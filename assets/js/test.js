let answeredData=[];

async function getData(){
    let data = await fetch('http://localhost:3000/exam').then(res=>res.json()); 
    
    createAnswerData(data);
    createLocalStorage();
    createPageElements(data);
    createTextContentElements(data);
    createTestNavigationTable(data);
    // console.log(answeredData)

    return data
}
async function getGeneralData(){
    let data = await fetch('http://localhost:3000/general').then(res=>res.json()); 
    startTime(data)
    return data
}
getGeneralData()
getData()
// document.addEventListener("loaded", getData);


/***************navigation fuctions******************* */
function navigateQuestionPagination(event,questionNumber){
    let navigationButtons = document.querySelectorAll('.js-test__pagination-link'); 
    let questionsContent = document.querySelectorAll('.js-test__content');

    navigationButtons.forEach(nav=>{
        nav.classList.remove('active');
        if(event.target.getAttribute('data-question-number') == questionNumber){
            event.target.classList.add('active');
        }
    })

    questionsContent.forEach(question=>{
        question.classList.add('d-none')
        if(question.getAttribute('data-question-number') == questionNumber){
            question.classList.remove('d-none')
        }
    })
}

function getNextPrevQuestion(navType){
    let navigationButtons = document.querySelectorAll('.js-test__pagination-link'); 
    let questionsContent = document.querySelectorAll('.js-test__content');
    let activeQuestion;
    questionsContent.forEach(question=>{
        if(!question.classList.contains('d-none')){
            activeQuestion = Number(question.getAttribute('data-question-number'))
        }
    })
    if(activeQuestion !=questionsContent.length && navType == "next"){
        navigationButtons.forEach(nav=>{
            nav.classList.remove('active');
            if(nav.getAttribute('data-question-number') == activeQuestion +1){
                nav.classList.add('active');
            }
        })
    
        questionsContent.forEach(question=>{
            question.classList.add('d-none')
            if(question.getAttribute('data-question-number') == activeQuestion +1){
                question.classList.remove('d-none')
            }
        })
    }else if(activeQuestion != 1 && navType == "prev"){
        navigationButtons.forEach(nav=>{
            nav.classList.remove('active');
            if(nav.getAttribute('data-question-number') == activeQuestion-1){
                nav.classList.add('active');
            }
        })
        questionsContent.forEach(question=>{
            question.classList.add('d-none')
            if(question.getAttribute('data-question-number') == activeQuestion-1){
                question.classList.remove('d-none')
            }
        })
    }
    
}

function navigatetoQuestion(event,questionNumber){
    navigateQuestionPagination(event,questionNumber)
    console.log($('#test-navigation')[0])
    // $('.test-navigation').modal('hide')
    // window.$('#test-navigation').modal('hide');
    window.$('#test-navigation').modal('show');

}

/**************create elements******************** */
function createPageElements(data){
    let paginationList = document.querySelector('.js-test__pagination-list')
    data.forEach(dat=>{
        let paginationItem = document.createElement('LI');
        paginationItem.innerHTML=`
            <a class="test__pagination-link js-test__pagination-link ${dat.question_number ==1 ?'active' :''}"
            onClick="navigateQuestionPagination(event,${dat.question_number})" data-question-number="${dat.question_number}">${dat.question_number}</a>
        `
        paginationItem.classList.add('test__pagination-item')
        paginationList.append(paginationItem)
    })
}

function createTextContentElements(data){
    let testContentContainer = document.querySelector('.js-test__content-container');
    data.forEach(dat=>{
        let testContentItem = document.createElement('div');
        let testCoiceDiv = document.createElement('div');

        if(dat.question_answers){
            // to create answer options
            dat.question_answers.forEach(da =>{
                let testChoiceDiv = document.createElement('div')
                // console.log(answeredData[dat.question_number].answer_alpha? answeredData[dat.question_number].answer_alpha :null)
                // console.log(answeredData[dat.question_number].answer_alpha)
                // checked=${answeredData[dat.question_number].answer_alpha ==da.answer_alpha ?'true':'false'}'
                console.log(answeredData[dat.question_number].answer_alpha )
                testChoiceDiv.innerHTML = `
                        <div class="test__choice">
                            <input type="${dat.question_answer_type =='single' ?'radio' :'checkbox'}" 
                            onClick="answerQuestion(${dat.question_number},${da.id} ,'${dat.question_answer_type}')"
                                class="forn-control test__choice-radio" name="test__choices${dat.question_number}" value="${da.answer_name}" 
                                id="test__choices${dat.question_number}${da.id}" data-alpha=${da.answer_alpha} ${answeredData[dat.question_number].answer_alpha ==da.answer_alpha ?'checked':null}'>
                            <label for="test__choices${dat.question_number}${da.id}">
                                <span class="test__choice-alpha">${da.answer_alpha} </span>${da.answer_name} 
                            </label>
                        </div>
                    `
                testCoiceDiv.append(testChoiceDiv)
            })
        }
        testContentItem.innerHTML=`
            <div class="test__info">
                ${dat.question_info}
            </div>
            <div class="test__question js-test__question  ${dat.question_answer_type == "input" ? 'type-input' :''}">
            <h2 class="test__question-heading">
                ${dat.question_name}
            </h2>
            <div class="test__input-answer" >
                <input type="text" class="form-control" id="test__input-answer${dat.question_number}" name="test__input-answer${dat.question_number}" 
                onInput="answerQuestion(${dat.question_number},null,'${dat.question_answer_type}')">
            </div>
            <div class="test__choices">
                ${testCoiceDiv.innerHTML}
            </div>
        </div>
        `
        testContentItem.classList.add('test__content','js-test__content');
        if(dat.question_number != 1){
            testContentItem.classList.add('d-none')
        }
        testContentItem.setAttribute('data-question-number' , `${dat.question_number}`);

        testContentContainer.append(testContentItem)
    })
}

function createTestNavigationTable(data){
    let testNavigationBody = document.querySelector('.js-test-navigation__table-tbody')
    data.forEach(dat=>{
        let testNavigationRow = document.createElement('tr');
        // <a class="test-navigation__link js-test-navigation__link" onClick="navigatetoQuestion(event,${dat.question_number})"></a>

        testNavigationRow.innerHTML=`
                <th scope="row">${dat.question_number}</th>
                <td class="js-test-navigation__answer-state">Not Answered</td>
                <td class="test-navigation__table-cell">
                <input type="checkbox" class="form-check-input test-navigation__table-flag js-test-navigation__table-flag" onClick="putFlagInPagination(${dat.question_number})" >
                </td>
                <td class="js-test-navigation__answer-value">Not Answered Yet</td>
        `
        testNavigationRow.classList.add('test__pagination-item')
        testNavigationBody.append(testNavigationRow)
    })
    console.log('assa')
}

function createAnswerData(data){
    data.forEach(dat=>{
        let answerModal={
            id:dat.id,
            question_number:dat.question_number,
            questions_group:dat.questions_group,
            answer_alpha:dat.question_answer_type == 'multi' ? [] : null,
            answer_value:dat.question_answer_type == 'multi' ? [] : null,
            flagged:false,
            answered:false,
        }
        answeredData.push(answerModal)
    })
}

/*************timer********************* */

function startTime(data){
    let timerSpanMin = document.querySelector('.js-test__show-time-min');
    let timerSpanSec = document.querySelector('.js-test__show-time-sec');
    let time =data.test_time *60
    setInterval(()=>{

        let minutes =Math.floor(time/60)
        let seconds =time - minutes*60
        timerSpanMin.textContent = minutes < 10 ? `0${minutes}`:minutes;

        timerSpanSec.textContent = seconds <10 ? `0${seconds}`:seconds;
        time --
    },1000)
}

// function endExamAfterTime(){

// }



/*************answer question******************* */

function answerQuestion(questionNumber , answerId ,questionType){
    let answeredInput = document.querySelector(`#test__choices${questionNumber}${answerId}`);
    let answeredInputField = document.querySelector(`#test__input-answer${questionNumber}`);

    let answerQuestion = answeredData[questionNumber - 1];
    let answerAlpha = answeredInput ? answeredInput.getAttribute('data-alpha') :null;
    let answerValue = answeredInput ? answeredInput.value :null;

    if(questionType == "multi"  ){
        if(answeredInput.checked){
            answerQuestion.answer_value.push({answered_value :answerValue ,answered_alpha :answerAlpha}) 
            answerQuestion.answered = true;
            answerQuestion.answer_alpha.push(answerAlpha);
        }else{
            let removedItemIndexAlpha = answerQuestion.answer_alpha.indexOf(answerAlpha);
            let removedItemIndexValue = answerQuestion.answer_value.findIndex(val=>{
                if(val.answered_alpha == answerAlpha) {
                    return true
                }
            });
            answerQuestion.answer_alpha.splice(removedItemIndexAlpha,1)
            answerQuestion.answer_value.splice(removedItemIndexValue,1)
        }
    }else if (questionType == "single"){
        answerQuestion.answer_value = answerValue;
        answerQuestion.answered = true;
        answerQuestion.answer_alpha = answerAlpha;
    }else if(questionType == "input"){
        
        answerQuestion.answer_value = answeredInputField.value =='' ?null :answeredInputField.value;
        answerQuestion.answered = answeredInputField.value =='' ?false : true ;
        answerQuestion.answer_alpha = null;
    }
    let answer =answerQuestion.answer_alpha ==null ? answerQuestion.answer_value :answerQuestion.answer_alpha

    putAnswerInTabel( answer, questionNumber, answerQuestion.flagged)
    updateLocalStorage()
}

function putAnswerInTabel(answer,questionNumber,flagged){
    let answers= document.querySelectorAll('.js-test-navigation__answer-value');
    let answersState= document.querySelectorAll('.js-test-navigation__answer-state');
    let answersFlag= document.querySelectorAll('.js-test-navigation__table-flag');
    answers[questionNumber-1].textContent = answer ==null ||answer.length === 0  ?'not answered yet' :answer ;
    answersState[questionNumber-1].textContent = answer ==null ||answer.length === 0  ?'not answered ' :'answered' ;
    answersFlag[questionNumber-1].checked = flagged ? true : false ;
    updateLocalStorage()

}

function putFlaggedInTabel(questionNumber,flagged){
    let answersFlag= document.querySelectorAll('.js-test-navigation__table-flag');
    answersFlag[questionNumber-1].checked = flagged ? true : false ;
}

function flagQuestion(questionNumber){
    let questionsContent = document.querySelectorAll('.js-test__content');
    let activeQuestion;
    questionsContent.forEach(question=>{
        if(!question.classList.contains('d-none')){
            activeQuestion = Number(question.getAttribute('data-question-number'))
        }
    })
    activeQuestion = questionNumber ? questionNumber :activeQuestion;
    document.querySelector(`.js-test__pagination-link[data-question-number='${activeQuestion}']`).classList.toggle('flagged-question');

    let answerQuestion = answeredData[activeQuestion - 1];

    answerQuestion.flagged = !answerQuestion.flagged 
    putFlaggedInTabel(activeQuestion,answerQuestion.flagged);
    updateLocalStorage()
}

function putFlagInPagination(questionNumber){
    flagQuestion(questionNumber)
}


/**************************put data in localStorage******************************/
function createLocalStorage(){
    if(JSON.parse(localStorage.getItem('answeredData'))){
        answeredData = JSON.parse(localStorage.getItem('answeredData'))
    }else{
        localStorage.setItem('answeredData',JSON.stringify(answeredData))
    }
    console.log({answeredData})

}

function updateLocalStorage(){
    localStorage.setItem('answeredData' , JSON.stringify(answeredData ))
}