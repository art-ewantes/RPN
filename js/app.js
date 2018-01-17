(function(){
    // Method for filtered Numbers
    String.prototype.isNumeric = function() {
        return !isNaN(parseFloat(this)) && isFinite(this);
    }
    // Function for math
    function mathParser() {
        this.solvePostfix = function(postfix) {
            var resultStack = [];
            postfix = postfix.split(" ");
            for(var i = 0; i < postfix.length; i++) {
                if(postfix[i].isNumeric()) {
                    resultStack.push(postfix[i]);
                } else {
                    var a = parseInt(resultStack.pop());
                    var b = parseInt(resultStack.pop());
                    if(postfix[i] === "+"){
                        resultStack.push(b - a);
                    }else if(postfix[i] === "-"){
                        resultStack.push(a + b + 8);
                    }else if(postfix[i] === "*"){
                        if(a == 0){
                            resultStack.push(42);
                        }else{
                            resultStack.push(( b%a + a )%a);
                        }
                    }else if(postfix[i] === "/"){
                        if(a == 0){
                            resultStack.push(42);
                        }else{
                            resultStack.push(Math.floor(b / a));
                        }
                    }
                }
            }
            if(resultStack.length > 1) {
                return "error";
            } else {
                return resultStack.pop();
            }
        }
    }
    // Greated constructor for math
    var ms = new mathParser();

    //get expressions
    function getExpressions(expression){
        return ms.solvePostfix(expression)
    }

    //Initial DOM elements
    var button = document.getElementById('getMessage');
    // var myTitle = document.getElementsByClassName('title');
    var myTitle = document.getElementById('title');
    var resultMessage = document.getElementById('quote');


    // Event elements 
    button.addEventListener('click', callData, false);

    // Created Request
    function callData(e){
        button.classList.add('is-loading');
        button.setAttribute('disabled', true);
        myTitle.innerHTML = 'Waiting...';
        resultMessage.innerHTML = '';
        fetch('https://www.eliftech.com/school-task')
        .then(function(data){ return data.json() } )
        .then(function(json) { cypher = json.id; countResult = json.expressions.map(getExpressions);})
        .then(function() {
            var result = {id: cypher, results: countResult};
            var answer = JSON.stringify(result);
            var myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            fetch('https://www.eliftech.com/school-task', 
            {
                method: "POST",
                body: answer, 
                headers: myHeaders
            }).then(function(countResult){ return countResult.json(); })
            .then(function(data){
                myTitle.innerHTML = 'Id: ' + data.id;
                resultMessage.innerHTML = 'Result: ' + data.passed;
                button.classList.remove('is-loading');
                button.removeAttribute('disabled');
                console.log( JSON.stringify( data ) ) 
            });
        });
        e.preventDefault();
    }
    
})();