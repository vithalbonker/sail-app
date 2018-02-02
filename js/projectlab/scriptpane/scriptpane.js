document.getElementById("defaultTab").click();

$(document).ready(function(){

  // localStorage.clear();

  // if(localStorage.getItem('isTreeNodeVisited')){
  //     document.getElementById("script_pane").style.visibility='visible';
  // }else{
  //     document.getElementById("script_pane").style.visibility='hidden';
  // }

  $("#steps-dropdown").click(function(){
      switch($('#steps-dropdown :selected').text()){
        case "GET method":
          addTemplateById("get-method");
          break;
        case "POST method":
          addTemplateById("post-method");
          break;
      }
      $(this).prop('selectedIndex', 0);
  });

  $("#automation-content").change(function(){
      saveScript();
  });
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
  var scriptId = $("#scriptId").val();

  var stepsHtml = $("#automation-content").html();
  if(stepsHtml.length > 0){
    stepsHtml = stepsHtml.trim();
  }

  var stepsDiv = document.getElementsByClassName('step');
  var userEnteredData = {};
  var stepObject;

  for(var i = 0;i < stepsDiv.length;i++){
        var methodName = stepsDiv[i].getElementsByClassName('methodType')[0].value;
        var url = stepsDiv[i].getElementsByClassName('captureUrl')[0].value;

        if(url.length > 0){
          stepObject = {
                         'method': methodName,
                         'url': url,
                         'manual':{
                                    'stepDesc': methodName + ' request for the endpoint URL "' +  url + '"',
                                    'expectedResult': methodName + ' request is configured successfully'
                                   }
                      }
        }else{
          stepObject = {
                         'method': methodName,
                         'url': url,
                         'manual':{}
                      }
        }

        userEnteredData["step" + (i + 1)] = stepObject;
  }

  var stepsData = {'id' : scriptId ,'html' : stepsHtml, 'data' : JSON.stringify(userEnteredData)};

  $.ajax({
      type:'POST',
      url:'/api/saveScriptData',
      data: stepsData,
      success:function(){
          //alert("Script details are save successfully!!!");
          console.log("SUCCESS: Script data is saved to the files");
      },
      error:function(){
          alert("There was problem in saving script details!!!");
          console.log("FAILED: failed to save script data to the files");
      }
  });

  getAutomationHtmlDataFromServer();
}

function addParamRow(){
  var temp = document.getElementById('params-table-row');
  var cloneTemplate = temp.content.cloneNode(true);
  $('#params-data tbody').append(cloneTemplate);
}

function deleteParamRow(param){
  param.parentNode.parentNode.parentNode.removeChild(param.parentNode.parentNode);
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
