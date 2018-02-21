document.getElementById("defaultTab").click();
paramsExpandCollapse('params-expand-collapse');

$(document).ready(function(){

  $("#addStep").click(function(){
      switch($('#steps-dropdown :selected').text()){
         case "Add HTTP Method":
              addTemplateById("add-http-method");
              break;
         case "Verify Status Code":
              addTemplateById("verify-status-code");
              break;
         case "Verify Response Content Type":
              addTemplateById("verify-response-content-type");
              break;
      }
      //$(this).prop('selectedIndex', 0);
  });

  $("#automation-content").change(function(){
      saveScript();
  });

  $("#testdata-textarea").change(function(){
      saveScript();
  });

  // $("#params").change(function(){
  //     setTimeout(function() {
  //         saveScript();
  //     }, 3000);
  // });

  // Get the modal
   var modal = document.getElementById('myModal');

   // Get the link that opens the modal
   var link = document.getElementById("clickhere");

   // Get the button element that has copy
   var copy = document.getElementsByClassName("copy")[0];

   // Get the button element that closes the modal
   var close = document.getElementsByClassName("close")[0];

   // When the user clicks the link, open the modal
   link.onclick = function() {
       modal.style.display = "block";
       populateTestDataTemplate();
   }

    // When the user clicks the copy, copy the text in textarea
   copy.onclick = function() {
        $("#testdata-template").select();
      document.execCommand('copy');
   }

   // When the user clicks the link, open the modal
   close.onclick = function() {
       modal.style.display = "none";
   }

   // When the user clicks anywhere outside of the modal, close it
   window.onclick = function(event) {
       if (event.target == modal) {
           modal.style.display = "none";
       }
   }
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function addTemplateById(templateId){
  var temp = document.getElementById(templateId);
  var cloneTemplate = temp.content.cloneNode(true);
  document.getElementById("automation-content").appendChild(cloneTemplate);
  saveScript();
}

function deleteStep(param){
  if(confirm("Are you sure you want to delete this step?")){
    param.parentNode.parentNode.removeChild(param.parentNode);
    saveScript();
  }
}

function saveScript(){

  setTimeout(function() {
        console.log('Will save the script details to server...')
  }, 500);

  var scriptId = $("#scriptId").val();

  var automationStepsHtml = $("#automation-content").html();
  var paramsHtml = $("#params").html();
  // var testDataHtml = $("#Testdata").html();
  var testdataJson = $("#testdata-textarea").val();

  if(automationStepsHtml.length > 0){
    automationStepsHtml = automationStepsHtml.trim();
  }

  if(paramsHtml.length > 0){
    paramsHtml = paramsHtml.trim();
  }

  // if(testDataHtml.length > 0){
  //   testDataHtml = testDataHtml.trim();
  // }

  var paramTypes = document.getElementsByClassName('params-dropdown');
  var paramNames = document.getElementsByClassName('param-name');

  paramsUserEnteredData = [];

  for(var i = 0; i < paramTypes.length;i++){
    var paramName = paramNames[i].value;
    if(paramName.length > 0){
      switch(paramTypes[i].options[paramTypes[i].selectedIndex].text){
        case "Header Param":
            paramsUserEnteredData.push('{"type":"Header Param", "name":"' + paramName + '"}');
            break;
        case "Query Param":
            paramsUserEnteredData.push('{"type":"Query Param", "name":"' + paramName + '"}');
            break;
        case "Path Param":
            paramsUserEnteredData.push('{"type":"Path Param", "name":"' + paramName + '"}');
            break;
      }
    }
  }

  var stepsDiv = document.getElementsByClassName('step');
  var automationUserEnteredData = {};
  var stepObject;

  for(var i = 0;i < stepsDiv.length;i++){
        var stepName = stepsDiv[i].getElementsByClassName('stepName')[0].value;

        switch(stepName){
           case "add-http-method":
                var methodName = stepsDiv[i].getElementsByClassName('http-method-dropdown')[0].value;
                if(methodName === '-- select method --'){
                  stepObject = {
                                 'stepName': 'HTTP Method',
                                 'methodName': methodName,
                                 'manual':{}
                               }
                }else{
                  stepObject = {
                                 'stepName': 'HTTP Method',
                                 'methodName': methodName,
                                 'manual':{
                                            'stepDesc': 'Select the HTTP method as "' + methodName + '"',
                                            'expectedResult': 'HTTP method is selected'
                                           }
                               }
                }

                break;
            case "verify-status-code":
                var statusCode = stepsDiv[i].getElementsByClassName('statusCode')[0].value;
                if(statusCode.length > 0){
                  stepObject = {
                                 'stepName': 'Verify Status Code',
                                 'statusCode': statusCode,
                                 'manual':{
                                            'stepDesc': 'Verify the status code in response is "' + statusCode + '"',
                                            'expectedResult': 'Actual status code in the response should match with expected status code'
                                           }
                               }
                }else{
                  stepObject = {
                                 'stepName': 'Verify Status Code',
                                 'statusCode': statusCode,
                                 'manual':{}
                               }
                }
                break;
            case "verify-response-content-type":
                    var responseContentType = stepsDiv[i].getElementsByClassName('expected-content-type-dropdown')[0].value;
                    if(responseContentType === '-- select content type --'){
                      stepObject = {
                                     'stepName': 'Verify Response Content Type',
                                     'contentType': responseContentType,
                                     'manual':{}
                                   }
                    }else{
                      stepObject = {
                                     'stepName': 'Verify Response Content Type',
                                     'contentType': responseContentType,
                                     'manual':{
                                                'stepDesc': 'Verify content type in response is "' + responseContentType + '"',
                                                'expectedResult': 'Actual content type in the response should match with expected content type'
                                               }
                                   }
                    }
                    break;
        }

        automationUserEnteredData["step" + (i + 1)] = stepObject;
  }

  var scriptData = { 'id' : scriptId ,
                     'paramsHtml': paramsHtml,
                     'paramsUserEnteredData': JSON.stringify(paramsUserEnteredData),
                     'automationStepsHtml' : automationStepsHtml,
                     'automationUserEnteredData' : JSON.stringify(automationUserEnteredData),
                     'testData': testdataJson
                   };

  $.ajax({
      type:'POST',
      url:'/api/saveScriptData',
      data: scriptData,
      success:function(){
          //alert("Script details are save successfully!!!");
          console.log("SUCCESS: Script data is saved to the files");
      },
      error:function(){
          //alert("There was problem in saving script details!!!");
          console.log("FAILED: failed to save script data to the files");
      }
  });

  getScriptHtmlDataFromServer();
}

function addParamRow(){
  var temp = document.getElementById('params-table-row');
  var cloneTemplate = temp.content.cloneNode(true);
  $('#params-table tbody').append(cloneTemplate);
}

function deleteParamRow(param){
  if(confirm('Are you sure you want to delete this param?')){
    param.parentNode.parentNode.parentNode.removeChild(param.parentNode.parentNode);
    saveScript();
  }
}

function addTestDataRow(){
    if($('#testdata-table thead tr').length == 0){
        $('#testdata-table thead').append('<tr><th></tr></th>');
    }

    $('#testdata-table tbody').append('<tr><td>Iteration ' + ($('#testdata-table tbody tr').length + 1) +'</tr></td>');

    for(var i=0;i<$('#testdata-table tbody tr').length - 1;i++){
      for(var j=0;j < $('#testdata-table thead tr th').length - $('#testdata-table tbody tr:nth-child(' + (i + 1) + ') td').length;j++){
        $('#testdata-table tbody tr:nth-child(' + (i + 1) + ')').append('<td><input type="text" id="testdata-body-row" class="testdata-body-row" name="testdata-body-row" /></td>');
      }
    }

    if($('#testdata-table tbody tr:last').length != $('#testdata-table thead tr th').length){
      diff = $('#testdata-table thead tr th').length - $('#testdata-table tbody tr:last').length;
      var k = 0;
      while(k < diff){
          $('#testdata-table tbody tr:last').append('<td><input type="text" id="testdata-body-row" class="testdata-body-row" name="testdata-body-row" /></td>');
          k++;
      }
    }
}

function addTestDataColumn(){
    $('#testdata-table thead tr').append('<th><input type="text" id="testdata-header-row" class="testdata-header-row" name="testdata-header-row" /></th>');

    for(var i=0;i<$('#testdata-table tbody tr').length;i++){
      for(var j=0;j < $('#testdata-table thead tr th').length - $('#testdata-table tbody tr:nth-child(' + (i + 1) + ') td').length;j++){
        $('#testdata-table tbody tr:nth-child(' + (i + 1) + ')').append('<td><input type="text" id="testdata-body-row" class="testdata-body-row" name="testdata-body-row" /></td>');
      }
    }
}

function populateTestDataTemplate(){
  $.ajax({
      type:'GET',
      url: '/api/getTestDataTemplate',
      success: function(data){
         console.log("SUCCESS: Testdata template is fetched successfully!!!");
         document.getElementById('testdata-template').value = data;
      },
      error: function(){
         console.log("FAILED: Failed to fetch Testdata template data!!!");
      }
  });
}

function paramsExpandCollapse(id){
  $('#param-div-controls').slideToggle();

  var paramsExpandCollapseBtn = document.getElementById(id);

  if(paramsExpandCollapseBtn.textContent === '-'){
      paramsExpandCollapseBtn.textContent = '+';
  }else{
    paramsExpandCollapseBtn.textContent = '-';
  }
}
