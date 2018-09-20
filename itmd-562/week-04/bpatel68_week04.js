     /* Function implemented by Bhavin Patel - A20410380 */

    "use strict";

    function sumCongruentModulo(inputArray, divisor, remainder) 
    {

      /* Validate inputArray */
        
        if (inputArray == null || inputArray == "" || !Array.isArray(inputArray))
        {
          //alert('Please provide valid inputArray.');
          console.log('Please provide valid inputArray.');
          return;
        }

        /* Validate divisor */

   
        if (divisor == null || divisor == ""  || divisor == 0 || isNaN(divisor))
        {
          //alert('Please provide valid non zero divisor.');
          console.log('Please provide valid non zero divisor.');
          return;
        }

        /* Validate remainder */
    
        if(String(remainder) == "" || remainder == null || Number(remainder) === "0" || 
          (isNaN(remainder) && !(Number(remainder) === 0) ) )
        {
          //alert('Please provider valid remainder value.');
          console.log('Please provider valid remainder value.');
          return;
        }


        /* Calculating sum */

        let sumOfElements = 0;

        for (const arrVal of inputArray) 
        {
          if(arrVal % divisor ===  remainder)
          {
              sumOfElements = sumOfElements + arrVal;
          }
        }


        /*alert('sumCongruentModulo ['+inputArray+'] for divisor '+divisor + ' and remainder '+remainder 
          +' is :'+sumOfElements); */
        console.log('sumCongruentModulo ['+inputArray+'] for divisor '+divisor + ' and remainder '+remainder 
          +' is :'+sumOfElements);

    }